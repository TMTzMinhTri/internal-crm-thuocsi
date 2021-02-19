import { Box, Button, FormGroup, Paper, ButtonGroup } from "@material-ui/core";
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
  } = useForm();

  const [textField, setTextField] = useState({
    descriptionField: "",
    promotionField: "",
    promotionType: "",
  });

  const [scopeObject, setScopeObject] = useState([
    {
      selectField: defaultScope.customerLevel,
      registeredBefore: new Date(),
      registeredAfter: new Date(),
      list: [
        {
          name: "Chọn tất cả",
        },
      ],
    },
    {
      selectField: defaultScope.area,
      list: [
        {
          name: "Chọn tất cả",
        },
      ],
    },
  ]);

  const [conditionObject, setConditionObject] = useState({
    selectField: defaultCondition.noRule,
    minValue: 0,
    seller: [],
    productList: [{ productName: "", minQuantity: 0, minTotalValue: 0 }],
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

  const handleChangeTextField = (key) => (event) => {
    setTextField({ ...textField, [key]: event.target.value });
  };

  const handleAddAttachedProduct = () => {
    rewardObject.attachedProduct.push({
      product: "",
      number: 0,
    });
    setRewardObject({ ...rewardObject });
  };

  const handleRemoveAttachedProduct = (index) => {
    let value = getValues();
    for (let i = index; i < rewardObject.attachedProduct.length - 1; i++) {
      setValue("quantity" + i, value["quantity" + (i + 1)]);
    }
    rewardObject.attachedProduct.splice(index, 1);
    setRewardObject({ ...rewardObject });
  };

  const handleChangeListReward = (index) => (event, value) => {
    rewardObject.attachedProduct[index].product = value;
    setRewardObject({ ...rewardObject });
  };

  const handleChangeRewardField = (key) => (event) => {
    setRewardObject({ ...rewardObject, [key]: event.target.value });
  };

  const handleChangeConditionField = (key) => (event) => {
    conditionObject.item = {};
    conditionObject.seller = [];
    setConditionObject({ ...conditionObject, [key]: event.target.value });
  };

  const handleAddProductOfProductList = () => {
    conditionObject.productList.push({
      productName: "",
      minQuantity: 0,
      minTotalValue: 0,
    });
    setConditionObject({ ...conditionObject });
  };

  const handleRemoveProductOfProductList = (index) => {
    let value = getValues();
    for (let i = index; i < conditionObject.productList.length - 1; i++) {
      setValue("minQuantity" + i, value["minQuantity" + (i + 1)]);
      setValue("minTotalValue" + i, value["minTotalValue" + (i + 1)]);
    }

    conditionObject.productList.splice(index, 1);

    setConditionObject({ ...conditionObject });
  };

  const handleChangeScopeList = (index) => (event, value) => {
    scopeObject[index].list = value;
    setScopeObject([...scopeObject]);
  };

  const handleChangeConditionList = (event, value) => {
    conditionObject.item = value;
    setConditionObject({ ...conditionObject });
  };

  const handleChangeConditionSeller = (event, value) => {
    conditionObject.seller = value;
    setConditionObject({ ...conditionObject });
  };

  const handleChangeProductListOfCondition = (index, type) => (
    event,
    value
  ) => {
    conditionObject.productList[index] = {
      seller:
        type != "SELLER" ? conditionObject.productList[index]?.seller : value,
      product:
        type == "SELLER" ? conditionObject.productList[index]?.product : value,
      minQuantity: 0,
      minTotalValue: 0,
    };

    setConditionObject({ ...conditionObject });
  };

  async function onSubmit() {
    onSubmitPromotion(
      getValues,
      toast,
      router,
      scopeObject,
      conditionObject,
      rewardObject,
      true,
      null
    );
  }

  return (
    <AppCRM select="/crm/promotion">
      <Head>
        <title>Tạo khuyến mãi</title>
      </Head>
      <MyCard component={Paper} style={{ padding: "0 3rem", height: "100%" }}>
        <FormGroup style={{ width: "100%" }}>
          <MyCardHeader title="TẠO CHƯƠNG TRÌNH KHUYẾN MÃI"></MyCardHeader>
          <MyCardContent>
            <InfomationFields
              getValues={getValues}
              errors={errors}
              control={control}
              setValue={setValue}
              textField={textField}
              handleChangeTextField={handleChangeTextField}
              register={register}
            />
            <ConditionFields
              register={register}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
              control={control}
              object={{ scopeObject, conditionObject, rewardObject }}
              textField={textField}
              handleChangeConditionSeller={handleChangeConditionSeller}
              handleChangeConditionList={handleChangeConditionList}
              handleChangeProductListOfCondition={
                handleChangeProductListOfCondition
              }
              handleAddAttachedProduct={handleAddAttachedProduct}
              handleRemoveAttachedProduct={handleRemoveAttachedProduct}
              handleChangeTextField={handleChangeTextField}
              handleChangeScopeList={handleChangeScopeList}
              handleChangeConditionField={handleChangeConditionField}
              handleChangeRewardField={handleChangeRewardField}
              handleChangeListReward={handleChangeListReward}
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
                  validatePromotion(getValues, setError, conditionObject)
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
