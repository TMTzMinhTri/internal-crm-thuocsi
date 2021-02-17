import { Box, Button, FormGroup, Paper, ButtonGroup } from "@material-ui/core";
import Head from "next/head";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  doWithLoggedInUser,
  renderWithLoggedInUser,
} from "@thuocsi/nextjs-components/lib/login";
import { getPromoClient } from "../../../client/promo";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import {
  defaultCondition,
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

async function createPromontion(data) {
  return getPromoClient().createPromotion(data);
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
    promotionTypeField: "",
  });

  const [errorTextField, setErrorTextField] = useState({
    descriptionError: "",
    promotionError: "",
    promotionTypeError: "",
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
    selectField: "",
    minValue: 0,
    seller: [],
    productList: [{ productName: "", productNumber: 0, productValue: 0 }],
    list: [],
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

  const validate = () => {
    let value = getValues();
    if (value.promotionField == "")
      setError("promotionField", {
        type: "required",
        message: "Chưa chọn bên tổ chức",
      });
    if (value.promotionTypeField == "")
      setError("promotionTypeField", {
        type: "required",
        message: "Chưa chọn hình thức áp dụng",
      });
    if (value.area == "")
      setError("area", {
        type: "required",
        message: "Chưa chọn khu vực áp dụng",
      });
    if (value.seller.length == 0)
      setError("seller", {
        type: "required",
        message: "Chưa chọn người bán",
      });
    if (value.condition == defaultCondition.product) {
      conditionObject.list.map((o, index) => {
        if (getValues("seller" + index).length == 0)
          setError("seller" + index, {
            type: "required",
            message: "Chưa chọn người bán",
          });
      });
    }
    if (value[displayNameBasedOnCondition(conditionObject.selectField)]) {
      setError(displayNameBasedOnCondition(conditionObject.selectField), {
        type: "required",
        message:
          displayLabelBasedOnCondition(conditionObject.selectField) +
          " không được bỏ trống",
      });
    }
    if (value.customerLevel == "")
      setError("customerLevel", {
        type: "required",
        message: "Chưa chọn đối tượng áp dụng",
      });
    if (value.condition == "")
      setError("condition", {
        type: "required",
        message: "Chưa chọn điều kiện khuyến mãi",
      });
    if (value.reward == "")
      setError("reward", {
        type: "required",
        message: "Chưa chọn giá trị khuyến mãi",
      });
    if (!value.description || value.description == "")
      setError("description", {
        type: "required",
        message: "Mô tả không được trống",
      });
  };

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
      setValue("number" + i, value["number" + (i + 1)]);
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
    conditionObject.list = [];
    setConditionObject({ ...conditionObject, [key]: event.target.value });
  };

  const handleAddProductOfProductList = () => {
    conditionObject.productList.push({
      productName: "",
      productNumber: 0,
      productValue: 0,
    });
    setConditionObject({ ...conditionObject });
  };

  const handleRemoveProductOfProductList = (index) => {
    let value = getValues();
    for (let i = index; i < conditionObject.productList.length - 1; i++) {
      setValue("productNumber" + i, value["productNumber" + (i + 1)]);
      setValue("productValue" + i, value["productValue" + (i + 1)]);
    }

    conditionObject.productList.splice(index, 1);

    setConditionObject({ ...conditionObject });
  };

  const handleChangeScopeList = (index) => (event, value) => {
    scopeObject[index].list = value;
    setScopeObject([...scopeObject]);
  };

  const handleChangeConditionList = (event, value) => {
    conditionObject.list = value;
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
      productNumber: 0,
      productValue: 0,
    };

    setConditionObject({ ...conditionObject });
  };

  // func onSubmit used because useForm not working with some fields
  async function onSubmit() {
    let value = getValues();
    let isCustomerLevelAll = scopeObject[0].list[0].name == "Chọn tất cả";
    let isAreaAll = scopeObject[1].list[0].name == "Chọn tất cả";
    let scopes = [
      {
        type: defaultScope.customerLevel,
        quantityType: isCustomerLevelAll ? "ALL" : "MANY",
        customerLevelCodes: isCustomerLevelAll
          ? []
          : value.customerLevel.map((o) => o.code),
        registeredBefore: new Date(value.registeredBefore).toISOString(),
        registeredAfter: new Date(value.registeredAfter).toISOString(),
      },
      {
        type: defaultScope.area,
        quantityType: isAreaAll ? "ALL" : "MANY",
        areaCodes: isAreaAll ? [] : value.area.map((o) => o.code),
      },
    ];

    let conditions;

    if (value.condition == defaultCondition.noRule)
      conditions = [{ type: value.condition }];
    else {
      let sellerObject;
      if (value.condition != defaultCondition.product) {
        sellerObject = {
          sellerCodes: value.seller.map((seller) => seller.code),
          sellerQuantityType:
            value.seller[0].name == "Chọn tất cả" ? "ALL" : "MANY",
          minQuantity: parseInt(value.conditionNumber),
          minTotalValue: parseInt(value.conditionValue),
        };
      }
      conditions = [
        {
          type: value.condition,
          minOrderValue: parseInt(value.minValue),
          productConditions: conditionObject.productList.map((o, index) => {
            switch (value.condition) {
              case defaultCondition.ingredient:
                return {
                  ...sellerObject,
                  ingredientCode: value.ingredient.code,
                };
              case defaultCondition.producer:
                return {
                  ...sellerObject,
                  producerCode: value.producer.code,
                };
              case defaultCondition.product:
                return {
                  sellerCodes: value["seller" + index].map(
                    (seller) => seller.code
                  ),
                  sellerQuantityType:
                    value["seller" + index][0].name == "Chọn tất cả"
                      ? "ALL"
                      : "MANY",
                  productId: value["product" + index].productID,
                  minQuantity: parseInt(value["productNumber" + index]),
                  minTotalValue: parseInt(value["productValue" + index]),
                };
              case defaultCondition.productCatergory:
                return {
                  ...sellerObject,
                  categoryCode: value.productCategory.code,
                };
              case defaultCondition.productTag:
                return {
                  ...sellerObject,
                  productTag: value.productTag.code,
                };
              default:
                break;
            }
          }),
        },
      ];
    }

    let rewards;
    switch (value.reward) {
      case defaultReward.absolute:
        rewards = [
          {
            type: value.reward,
            absoluteDiscount: parseInt(value.absoluteDiscount),
          },
        ];
        break;
      case defaultReward.gift:
        rewards = [
          {
            type: value.reward,
            gifts: rewardObject.attachedProduct.map((o, index) => ({
              productId: value["gift" + index].productID,
              quantity: parseInt(value["number" + index]),
            })),
          },
        ];
        break;
      case defaultReward.percentage:
        rewards = [
          {
            type: value.reward,
            percentageDiscount: parseInt(value.percentageDiscount),
            maxDiscount: parseInt(value.maxDiscount),
          },
        ];
        break;
      case defaultReward.point:
        rewards = [
          {
            type: value.reward,
            pointValue: parseInt(value.pointValue),
          },
        ];
        break;

      default:
        break;
    }

    let body = {
      promotionName: value.promotionName,
      promotionType: value.promotionTypeField,
      promotionOrganizer: value.promotionField,
      description: value.description,
      startTime: new Date(value.startTime).toISOString(),
      publicTime: new Date(value.startTime).toISOString(),
      endTime: new Date(value.endTime).toISOString(),
      status: "ACTIVE",
      scopes,
      conditions,
      rewards,
    };

    console.log(value, "getValues");

    let res = await createPromontion(body);

    console.log(res);

    if (res.status == "OK") {
      toast.success("Tạo chương trình khuyến mãi thành công");
      router.back();
    } else {
      toast.error("Xảy ra lỗi");
    }

    console.log(res, "res");
  }

  console.log(getValues(), "getValues()");

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
              textField={textField}
              errorTextField={errorTextField}
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
                onClick={handleSubmit(onSubmit, validate)}
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
