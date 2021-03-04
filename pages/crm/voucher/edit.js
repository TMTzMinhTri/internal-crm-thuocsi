import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  doWithLoggedInUser,
  renderWithLoggedInUser,
} from "@thuocsi/nextjs-components/lib/login";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { useRouter } from "next/router";
import AppCRM from "../../_layout";
import React, { useState } from "react";
import {
  MyCard,
  MyCardActions,
  MyCardContent,
  MyCardHeader,
} from "@thuocsi/nextjs-components/my-card/my-card";
import { Button, ButtonGroup } from "@material-ui/core";
import { useForm } from "react-hook-form";
import VoucherCodeBody from "../../../components/component/promotion/voucher-code-body";
import Link from "@material-ui/core/Link";
import { getVoucherClient } from "../../../client/voucher";
import { getPromoClient } from "../../../client/promo";
import { getCustomerClient } from "../../../client/customer";
import { createVoucherCode } from "./new";
import { compareTime, formatUTCTime } from "../../../components/component/util";

const useStyles = makeStyles((theme) => ({
  root: {
    " .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  ".MuiInputBase-input": {
    fontWeight: "bold",
  },
}));

export async function getServerSideProps(ctx) {
  return await doWithLoggedInUser(ctx, (ctx) => {
    return loadVoucherCode(ctx);
  });
}

export async function loadVoucherCode(ctx) {
  let returnObject = { props: {} };
  let voucherId = ctx.query.voucherId;
  let voucherResponse = await getVoucherClient(ctx, {}).getVoucherById(
    parseInt(voucherId)
  );
  if (voucherResponse && voucherResponse.status === "OK") {
    returnObject.props.voucher = voucherResponse.data[0];
    let promotionResponse = await getPromoClient(ctx, {}).getPromotionByID(
      parseInt(voucherResponse.data[0].promotionId)
    );
    if (promotionResponse && promotionResponse.status === "OK") {
      returnObject.props.promotion = promotionResponse.data;
    } else {
      returnObject.props.promotion = [];
    }
    let listCustomerResponse = await getCustomerClient(
      ctx,
      {}
    ).getCustomerByIDs(voucherResponse.data[0].appliedCustomers);
    if (listCustomerResponse && listCustomerResponse.status === "OK") {
      returnObject.props.customers = listCustomerResponse.data;
    } else {
      returnObject.props.customers = [];
    }
  }
  let promotionDefaultResponse = await getPromoClient(ctx, {}).getPromotion(
    "",
    5,
    0,
    false,
      "ACTIVE"
  );
  if (promotionDefaultResponse && promotionDefaultResponse.status === "OK") {
    returnObject.props.listPromotionDefault = promotionDefaultResponse.data;
  }

  let listCustomerDefaultReponse = await getCustomerClient(ctx, {}).getCustomer(
    0,
    5,
    ""
  );
  if (
    listCustomerDefaultReponse &&
    listCustomerDefaultReponse.status === "OK"
  ) {
    returnObject.props.listCustomerDefault = listCustomerDefaultReponse.data;
  }

  return returnObject;
}

export default function NewPage(props) {
  return renderWithLoggedInUser(props, render);
}

export async function updateVoucher(
  voucherId,
  promotionId,
  startTime,
  endTime,
  publicTime,
  type,
  maxUsage,
  maxUsagePerCustomer,
  appliedCustomers,
  promotionName,
  status
) {
  let data = {
    voucherId,
    promotionId,
    type,
    maxUsage,
    maxUsagePerCustomer,
    promotionName,
    status,
  };
  if (appliedCustomers && appliedCustomers.length > 0) {
    data.appliedCustomers = appliedCustomers;
  }
  if (startTime) {
    data.startTime = new Date(startTime).toISOString();
  }
  if (endTime) {
    data.endTime = new Date(endTime).toISOString();
  }
  if (publicTime) {
    data.publicTime = new Date(publicTime).toISOString();
  }
  return getVoucherClient().updateVoucher(data);
}

function render(props) {
  const classes = useStyles();
  const toast = useToast();
  const router = useRouter();
  let voucher = props.voucher;

  let startTime = "";
  let endTime = "";
  let publicTime = "";

  let compareTimeFlag = false;

  if (voucher.startTime) {
    startTime = formatUTCTime(voucher.startTime);
  }
  if (voucher.endTime) {
    endTime = formatUTCTime(voucher.endTime);
  }
  if (voucher.publicTime) {
    publicTime = formatUTCTime(voucher.publicTime);
    compareTimeFlag = compareTime(new Date(), new Date(publicTime)) === 1;
  }

  const {
    register,
    getValues,
    handleSubmit,
    setError,
    setValue,
    reset,
    errors,
    control,
  } = useForm({
    defaultValues: {
      ...voucher,
      status: props.voucher.status === "ACTIVE" ? true : false,
      startTime: startTime,
      endTime: endTime,
      publicTime: publicTime,
      promotionId: props.promotion.map((item) => {
        return { label: item.promotionName, value: item.promotionId };
      })[0],
    },
    mode: "onChange",
  });
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [listPromotionSearch, setListPromotionSearch] = useState([]);
  const [dataProps, setDataprops] = useState({
    customerIds: voucher.appliedCustomers,
    type: voucher.type,
  });

  const onSubmit = async () => {
    let value = getValues();
    let {
      code,
      maxUsage,
      maxUsagePerCustomer,
      promotionId,
      startTime,
      endTime,
      publicTime,
      status,
    } = value;
    let { type, customerIds } = dataProps;
    let createVoucherResponse = await updateVoucher(
      voucher.voucherId,
      parseInt(promotionId.value),
      startTime,
      endTime,
      publicTime,
      type,
      parseInt(maxUsage),
      parseInt(maxUsagePerCustomer),
      customerIds,
      promotionId.label,
      status ? "ACTIVE" : "WAITING"
    );
    if (createVoucherResponse && createVoucherResponse.status === "OK") {
      toast.success("Cập nhật mã khuyến mãi thành công");
    } else {
      return toast.error(createVoucherResponse.message);
    }
    await router.push("/crm/voucher");
  };

  const handleSetShowAutoComplete = (value) => {
    setShowAutoComplete(value);
  };

  const handleSetShowListAutoComplete = (value) => {
    setListPromotionSearch(value);
  };

  const handleChangePromotion = (e, promotion) => {
    setDataprops({ ...dataProps, promotionId: promotion.promotionId });
  };

  const handleChangeCustomer = (e, customers) => {
    let customerIds = [];
    customers.forEach((c) => customerIds.push(c.customerID));
    setDataprops({ ...dataProps, customerIds: customerIds });
  };

  const handleChangeType = (value) => {
    setDataprops({ ...dataProps, type: value });
  };

  return (
    <AppCRM select="/crm/voucher">
      <div>
        <title>Chỉnh sửa mã khuyến mãi</title>
      </div>
      <MyCard>
        <MyCardHeader title="CHỈNH SỬA MÃ KHUYẾN MÃI" />
        <MyCardContent style={{ margin: "0 3rem 3rem 3rem" }}>
          <VoucherCodeBody
            errors={errors}
            setValue={setValue}
            getValue={getValues}
            defaultStatus={props.voucher.status === "ACTIVE"}
            promotion={props.promotion}
            listPromotionDefault={props.listPromotionDefault || []}
            control={control}
            handleChangeType={handleChangeType}
            dataProps={dataProps}
            edit={true}
            compareTime={compareTimeFlag}
            showPromotionPublic={true}
            listCustomerDefault={props.listCustomerDefault || []}
            appliedCustomers={props.customers}
            onChangeCustomer={handleChangeCustomer}
            onChangePromotion={handleChangePromotion}
            listPromotionSearch={listPromotionSearch}
            showAutoComplete={showAutoComplete}
            setListPromotionSearch={setListPromotionSearch}
            register={register}
          />
        </MyCardContent>
        <MyCardActions>
          <ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              style={{ margin: 8 }}
              onClick={handleSubmit(onSubmit)}
            >
              CẬP NHẬT
            </Button>
          </ButtonGroup>
        </MyCardActions>
      </MyCard>
    </AppCRM>
  );
}
