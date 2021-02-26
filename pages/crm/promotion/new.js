import { Button, FormGroup, Paper, ButtonGroup } from "@material-ui/core";
import Head from "next/head";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  doWithLoggedInUser,
  renderWithLoggedInUser,
} from "@thuocsi/nextjs-components/lib/login";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import {
  defaultCondition,
  defaultPromotion,
  defaultPromotionType,
  defaultReward,
  defaultScope,
} from "../../../components/component/constant";
import { useRouter } from "next/router";
import InfomationFields from "components/component/promotion/infomation-fields";
import ConditionFields from "components/component/promotion/condition-fields";
import {
  MyCard,
  MyCardActions,
  MyCardContent,
  MyCardHeader,
} from "@thuocsi/nextjs-components/my-card/my-card";
import {
  onSubmitPromotion,
  validatePromotion,
} from "components/component/util";
import ModalCustom from "components/modal/dialogs";

export async function getServerSideProps(ctx) {
  return await doWithLoggedInUser(ctx, (ctx) => {
    return loadDataBefore(ctx);
  });
}

export async function loadDataBefore(ctx) {
  let returnObject = { props: {} };
  return returnObject;
}

export default function NewPage(props) {
  return renderWithLoggedInUser(props, render);
}

function render(props) {
  const toast = useToast();
  const router = useRouter();

  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    errors,
    control,
    setError,
  } = useForm({
    defaultValues: {
      customerLevel: [{ name: "Chọn tất cả" }],
      area: [{ name: "Chọn tất cả" }],
      promotionOrganizer: defaultPromotion.MARKETPLACE,
      promotionType: defaultPromotionType.VOUCHER_CODE,
    },
  });

  const [promotionId, setPromotionId] = useState("");

  const [textField, setTextField] = useState({
    descriptionField: "",
    promotionOrganizer: "",
    promotionType: "",
  });

  const [scopeObject, setScopeObject] = useState([
    {
      selectField: defaultScope.customerLevel,
      registeredBefore: new Date(),
      registeredAfter: new Date(),
      list: [""],
    },
    {
      selectField: defaultScope.area,
      list: [""],
    },
  ]);

  const [conditionObject, setConditionObject] = useState({
    selectField: defaultCondition.noRule,
    minOrderValue: 0,
    seller: [""],
    productList: [""],
    item: {},
  });

  const [rewardObject, setRewardObject] = useState({
    selectField: "",
    percentageDiscount: 0,
    maxDiscount: 0,
    absoluteDiscount: 0,
    attachedProduct: [
      {
        product: "",
        number: 0,
      },
    ],
    pointValue: 0,
  });

  const [openModal, setOpenModal] = useState(false);

  const handleChangeTextField = (key) => (event) => {
    setTextField({ ...textField, [key]: event.target.value });
  };

  const handleAddAttachedProduct = () => {
    rewardObject.attachedProduct.push("");
    setRewardObject({ ...rewardObject });
  };

  const handleRemoveAttachedProduct = (index) => {
    let value = getValues();
    for (let i = index; i < rewardObject.attachedProduct.length - 1; i++) {
      setValue("gift" + i, value["gift" + (i + 1)]);
      setValue("quantity" + i, value["quantity" + (i + 1)]);
    }
    rewardObject.attachedProduct.splice(index, 1);
    setRewardObject({ ...rewardObject });
  };

  const handleChangeRewardField = (key) => (event) => {
    if (event.target.value == defaultReward.gift) {
      rewardObject.attachedProduct = [""];
      setRewardObject({ ...rewardObject });
    }
    setRewardObject({ ...rewardObject, [key]: event.target.value });
  };

  const handleChangeConditionField = (key) => (event) => {
    conditionObject.productList = [""];
    setConditionObject({ ...conditionObject, [key]: event.target.value });
  };

  const handleAddProductOfProductList = () => {
    conditionObject.productList.push("");
    setConditionObject({ ...conditionObject });
  };

  const handleRemoveProductOfProductList = (index) => {
    let value = getValues();
    for (let i = index; i < conditionObject.productList.length - 1; i++) {
      setValue("seller" + i, value["seller" + (i + 1)]);
      setValue("product" + i, value["product" + (i + 1)]);
      setValue("minQuantity" + i, value["minQuantity" + (i + 1)]);
      setValue("minTotalValue" + i, value["minTotalValue" + (i + 1)]);
    }
    conditionObject.productList.splice(index, 1);
    setConditionObject({ ...conditionObject });
  };

  async function onSubmit() {
    if (validatePromotion(getValues, setError, conditionObject, rewardObject)) {
      let res = await onSubmitPromotion(
        getValues,
        toast,
        router,
        conditionObject,
        rewardObject,
        true,
        null
      );
      console.log(res, "res create");
      if (res?.status == "OK") {
        if (getValues().promotionType == defaultPromotionType.VOUCHER_CODE) {
          setPromotionId(res.data[0].promotionId);
          setOpenModal(true);
        } else {
          router.push("/crm/promotion");
        }
      }
    }
  }

  return (
    <AppCRM select="/crm/promotion">
      <Head>
        <title>Tạo khuyến mãi</title>
      </Head>
      <ModalCustom
        title="Thông báo"
        open={openModal}
        onClose={(val) => {
          setOpenModal(val), router.push(`/crm/promotion`);
        }}
        primaryText="Đồng ý"
        onExcute={() =>
          router.push(`/crm/voucher/new?promotionId=${promotionId}`)
        }
      >
        <p>
          Bạn có muốn tiếp tục tạo Mã khuyến mãi cho chương trình{" "}
          <b>{getValues().promotionName}</b> này không?
        </p>
      </ModalCustom>
      <MyCard component={Paper} style={{ padding: "0 3rem", height: "100%" }}>
        <FormGroup style={{ width: "100%" }}>
          <MyCardHeader title="TẠO CHƯƠNG TRÌNH KHUYẾN MÃI"></MyCardHeader>
          <MyCardContent>
            <InfomationFields
              useForm={{ errors, register, getValues, control, setValue }}
              textField={textField}
              handleChangeTextField={handleChangeTextField}
            />
            <ConditionFields
              useForm={{ errors, register, getValues, control }}
              object={{ scopeObject, conditionObject, rewardObject }}
              handleAddAttachedProduct={handleAddAttachedProduct}
              handleRemoveAttachedProduct={handleRemoveAttachedProduct}
              handleChangeTextField={handleChangeTextField}
              handleChangeConditionField={handleChangeConditionField}
              handleChangeRewardField={handleChangeRewardField}
              handleAddProductOfProductList={handleAddProductOfProductList}
              handleRemoveProductOfProductList={
                handleRemoveProductOfProductList
              }
            />
          </MyCardContent>
          <MyCardActions>
            <ButtonGroup>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit, () =>
                  validatePromotion(
                    getValues,
                    setError,
                    conditionObject,
                    rewardObject
                  )
                )}
                style={{ margin: 8 }}
              >
                thêm chương trình khuyến mãi
              </Button>
              <Button
                variant="contained"
                style={{ margin: 8 }}
                onClick={() => router.reload()}
              >
                Làm mới
              </Button>
            </ButtonGroup>
          </MyCardActions>
        </FormGroup>
      </MyCard>
    </AppCRM>
  );
}
