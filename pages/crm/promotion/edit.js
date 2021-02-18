import { Button, FormGroup, Paper, ButtonGroup } from "@material-ui/core";
import Head from "next/head";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./promotion.module.css";
import {
  doWithLoggedInUser,
  renderWithLoggedInUser,
} from "@thuocsi/nextjs-components/lib/login";
import { getPromoClient } from "../../../client/promo";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getProductClient } from "../../../client/product";
import { getCategoryClient } from "../../../client/category";
import {
  defaultCondition,
  defaultReward,
  defaultScope,
} from "../../../components/component/constant";
import { validatePromotion } from "./new";
import {
  displayNameBasedOnCondition,
  displayLabelBasedOnCondition,
  formatUTCTime,
} from "../../../components/component/util";
import { useRouter } from "next/router";
import InfomationFields from "components/component/promotion/infomation-fields";
import ConditionFields from "components/component/promotion/condition-fields";
import {
  MyCard,
  MyCardActions,
  MyCardContent,
  MyCardHeader,
} from "@thuocsi/nextjs-components/my-card/my-card";
import { getCustomerClient } from "client/customer";
import { getTagClient } from "client/tag";
import { getAreaClient } from "client/area";
import { getProducerClient } from "client/producer";
import { getIngredientClient } from "client/ingredient";
import { getSellerClient } from "client/seller";

export async function getServerSideProps(ctx) {
  return await doWithLoggedInUser(ctx, async (ctx) => {
    return await loadDataBefore(ctx);
  });
}

export async function loadDataBefore(ctx) {
  let returnObject = {
    props: {
      gifts: [],
      productConditions: [],
      promotionRes: null,
    },
  };

  let promotionId = ctx.query.promotionId;

  let _promotionClient = getPromoClient(ctx, {});
  let promotionRes = await _promotionClient.getPromotionByID(promotionId);

  if (promotionRes && promotionRes.status === "OK") {
    let data = promotionRes.data[0];

    console.log(promotionRes, "promotionRes");

    returnObject.props.promotionRes = data;
  }

  return returnObject;
}

export default function NewPage(props) {
  return renderWithLoggedInUser(props, render);
}

async function updatePromontion(data) {
  return getPromoClient().updatePromotion(data);
}

async function getListProductByIdsClient(q) {
  return getProductClient().getListProductByIdsClient(q);
}

async function getListCategoryByCodesClient(q) {
  return getCategoryClient().getListCategoryByCodesClient(q);
}

async function getProductTagByCodeClient(q) {
  return getTagClient().getTagByTagCodesClient(q);
}

async function getListAreaClient() {
  return getAreaClient().getListArea();
}

async function getListLevelClient() {
  return getCustomerClient().getLevel();
}

async function getListProducerByCodesClient(q) {
  return getProducerClient().getProducerByCodesClient(q);
}

async function getListSellerByCodesClient(q) {
  return getSellerClient().getSellerBySellerCodesClient(q);
}

async function getListIngredientByCodesClient(q) {
  return getIngredientClient().getIngredientByCodesClient(q);
}

async function updateStatusPromotion(promotionId, status) {
  return getPromoClient().updateStatusPromotion({ promotionId, status });
}

function render(props) {
  const toast = useToast();

  const router = useRouter();

  const { promotionRes } = props;

  const {
    promotionId,
    description,
    endTime,
    startTime,
    publicTime,
    promotionName,
    promotionOrganizer,
    promotionType,
    conditions,
    rewards,
    scopes,
    status,
  } = promotionRes
    ? promotionRes
    : {
        promotionId: "",
        description: "",
        endTime: new Date(),
        startTime: new Date(),
        publicTime: new Date(),
        promotionName: "",
        promotionOrganizer: "",
        promotionType: "",
        scopes: null,
        conditions: null,
        rewards: null,
        status: true,
      };

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
      description: description,
      endTime: formatUTCTime(endTime),
      startTime: formatUTCTime(startTime),
      publicTime: formatUTCTime(publicTime),
      promotionName: promotionName,
      promotionOrganizer: promotionOrganizer,
      promotionType: promotionType,
      status: status == "ACTIVE" ? true : false,
    },
  });

  console.log("props", props);

  console.log(getValues(), "getValues");

  const [textField, setTextField] = useState({
    descriptionField: "",
    promotionOrganizer: "",
    promotionType: "",
  });

  const [scopeObject, setScopeObject] = useState([
    {
      selectField: defaultScope.customerLevel,
      registeredBefore: scopes[0].registeredBefore
        ? formatUTCTime(scopes[0].registeredBefore)
        : new Date(),
      registeredAfter: scopes[0].registeredAfter
        ? formatUTCTime(scopes[0].registeredAfter)
        : new Date(),
      list: [],
    },
    {
      selectField: defaultScope.area,
      list: [],
    },
  ]);

  const [conditionObject, setConditionObject] = useState({
    selectField: conditions[0].type ? conditions[0].type : "",
    minValue: conditions[0].minOrderValue ? conditions[0].minOrderValue : 0,
    seller: [],
    productList: [],
    item: {},
  });

  const [rewardObject, setRewardObject] = useState({
    selectField: rewards[0].type ? rewards[0].type : "",
    percentageDiscount: rewards[0].percentageDiscount
      ? rewards[0].percentageDiscount
      : 0,
    maxDiscount: rewards[0].maxDiscount ? rewards[0].maxDiscount : 0,
    absoluteDiscount: rewards[0].absoluteDiscount
      ? rewards[0].absoluteDiscount
      : 0,
    attachedProduct: [],
    pointValue: rewards[0].pointValue ? rewards[0].pointValue : 0,
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
    if (event.target.value == defaultReward.gift) {
      setRewardObject({
        ...rewardObject,
        attachedProduct: [
          {
            product: "",
            number: 0,
          },
        ],
      });
    }
    setRewardObject({ ...rewardObject, [key]: event.target.value });
  };

  const handleChangeConditionField = (key) => (event) => {
    conditionObject.item = [];
    conditionObject.seller = [];
    if (event.target.value == defaultCondition.product) {
      setConditionObject({
        ...conditionObject,
        productList: [{ productName: "", minQuantity: 0, minTotalValue: 0 }],
      });
    }
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

  const fillDefaultData = () => {
    scopes.map(async (o, index) => {
      let arrAll = [];
      if (o.quantityType != "ALL")
        switch (o.type) {
          case defaultScope.customerLevel:
            arrAll = await getListLevelClient();
            o.customerLevelCodes.map((code) =>
              scopeObject[index].list.unshift(
                arrAll.data.find((v) => v.code == code)
              )
            );
            setValue("customerLevel", scopeObject[index].list);
            break;
          case defaultScope.area:
            arrAll = await getListAreaClient();
            o.areaCodes.map((code) =>
              scopeObject[index].list.push(
                arrAll.data.find((v) => v.code == code)
              )
            );
            setValue("area", scopeObject[index].list);
            break;
          default:
            break;
        }
      else {
        scopeObject[index].list = [{ name: "Chọn tất cả" }];
      }

      setScopeObject([...scopeObject]);
    });

    conditions[0].productConditions?.map((o) => {
      conditionObject.productList.push({
        product: [],
        minQuantity: "",
        minTotalValue: "",
        seller: [],
      });
      setConditionObject({ ...conditionObject });
    });

    conditions.map(async (o) => {
      let code;
      if (o.type == defaultCondition.product) {
        o.productConditions.map(async (ob, i) => {
          let seller = [];
          let res = await getListProductByIdsClient([ob.productId]);
          if (res?.status == "OK") {
            if (ob.sellerQuantityType == "ALL") {
              seller = [{ name: "Chọn tất cả" }];
            } else {
              let response = await getListSellerByCodesClient(ob.sellerCodes);

              if (response?.status == "OK") {
                seller = response.data;
              }
            }

            let productInfo = {
              product: res.data[0],
              ["minQuantity" + i]: ob.minQuantity,
              ["minTotalValue" + i]: ob.minTotalValue,
              seller: seller,
            };
            conditionObject.productList[i] = productInfo;
            setConditionObject({ ...conditionObject });
            setValue("minQuantity" + i, ob.minQuantity);
            setValue("minTotalValue" + i, ob.minTotalValue);
            setValue("product" + i, res.data[0]);
            setValue("seller" + i, seller);
          }
        });
      } else if (o.type != defaultCondition.noRule) {
        let res;
        if (o.productConditions[0].sellerQuantityType == "ALL") {
          conditionObject.seller = [{ name: "Chọn tất cả" }];
          setConditionObject({ ...conditionObject });
          setValue("seller0", [{ name: "Chọn tất cả" }]);
        } else {
          let response = await getListSellerByCodesClient(
            o.productConditions[0].sellerCodes
          );
          if (response?.status == "OK") {
            conditionObject.seller = response.data;
            setConditionObject({ ...conditionObject });
            setValue("seller0", response.data);
          }
        }

        setValue("minQuantity", o.productConditions[0].minQuantity);
        setValue("minTotalValue", o.productConditions[0].minTotalValue);
        switch (o.type) {
          case defaultCondition.productTag:
            o.productConditions.map(async (ob) => {
              res = await getProductTagByCodeClient([ob.productTag]);

              if (res?.status == "OK") {
                setConditionObject({ ...conditionObject, item: res.data[0] });
                setValue("productTag", res.data[0]);
              }
            });
            break;

          case defaultCondition.productCategory:
            code = o.productConditions[0].categoryCode;
            res = await getListCategoryByCodesClient([code]);
            if (res?.status == "OK") {
              setConditionObject({ ...conditionObject, item: res.data[0] });
              setValue("productCategory", res.data[0]);
            }
            break;
          case defaultCondition.ingredient:
            code = o.productConditions[0].ingredientCode;
            res = await getListIngredientByCodesClient([code]);
            if (res?.status == "OK") {
              setConditionObject({ ...conditionObject, item: res.data[0] });
              setValue("ingredient", res.data[0]);
            }
            break;
          case defaultCondition.producer:
            code = o.productConditions[0].producerCode;
            res = await getListProducerByCodesClient([code]);
            if (res?.status == "OK") {
              setConditionObject({ ...conditionObject, item: res.data[0] });
              setValue("producer", res.data[0]);
            }
            break;
          default:
            break;
        }
      }
    });

    if (rewards[0].type == defaultReward.gift) {
      rewards[0].gifts.map((o) => {
        rewardObject.attachedProduct.unshift({
          product: [],
          number: o.quantity,
        });
        setRewardObject({ ...rewardObject });
      });
      rewards[0].gifts.map(async (gift, index) => {
        setValue("quantity" + index, gift.quantiy);
        let res = await getListProductByIdsClient([gift.productId]);
        if (res?.status == "OK") {
          rewardObject.attachedProduct[index] = {
            product: res.data[0],
            number: gift.quantity,
          };
          setValue("gift" + index, res.data[0]);
          setRewardObject({ ...rewardObject });
        }
      });
    }
  };

  const checkRegisterdTime = (value) => {
    if (value.registeredAfter != "" && value.registeredBefore != "") {
      return {
        registeredBefore: new Date(value.registeredBefore).toISOString(),
        registeredAfter: new Date(value.registeredAfter).toISOString(),
      };
    }
    if (value.registeredAfter != "") {
      return { registeredAfter: new Date(value.registeredAfter).toISOString() };
    }
    if (value.registeredBefore != "") {
      return {
        registeredBefore: new Date(value.registeredBefore).toISOString(),
      };
    }
    return;
  };

  console.log(rewardObject, "rewardObject");

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
        ...checkRegisterdTime(value),
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
          sellerCodes:
            value.seller0[0].name == "Chọn tất cả"
              ? []
              : value.seller0.map((seller) => seller.code),
          sellerQuantityType:
            value.seller0[0].name == "Chọn tất cả" ? "ALL" : "MANY",
          minQuantity: parseInt(value.minQuantity),
          minTotalValue: parseInt(value.minTotalValue),
        };
      }

      let tmpArr =
        value.condition == defaultCondition.product
          ? conditionObject.productList
          : [""];

      conditions = [
        {
          type: value.condition,
          minOrderValue: parseInt(value.minValue),
          productConditions: tmpArr.map((o, index) => {
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
                  minQuantity: parseInt(value["minQuantity" + index]),
                  minTotalValue: parseInt(value["minTotalValue" + index]),
                };
              case defaultCondition.productCategory:
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
              quantity: parseInt(value["quantity" + index]),
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
      promotionId: promotionId,
      promotionName: value.promotionName,
      promotionType: value.promotionType,
      promotionOrganizer: value.promotionOrganizer,
      description: value.description,
      startTime: new Date(value.startTime).toISOString(),
      publicTime: new Date(value.publicTime).toISOString(),
      endTime: new Date(value.endTime).toISOString(),
      scopes,
      conditions,
      rewards,
    };

    console.log(body, "bdoy");

    let res = await updatePromontion(body);
    console.log(res, "res");

    if (res.status == "OK") {
      toast.success("Cập nhật chương trình khuyến mãi thành công");
      // router.back();
    } else {
      toast.error(res.message);
    }
  }

  useEffect(() => {
    fillDefaultData();
  }, []);

  return (
    <AppCRM select="/crm/promotion">
      <Head>
        <title>Chỉnh sửa khuyến mãi</title>
      </Head>
      <MyCard component={Paper} style={{ padding: "0 3rem", height: "100%" }}>
        <FormGroup style={{ width: "100%" }}>
          <MyCardHeader title="CHỈNH SỬA CHƯƠNG TRÌNH KHUYẾN MÃI"></MyCardHeader>
          <MyCardContent>
            <InfomationFields
              getValues={getValues}
              errors={errors}
              control={control}
              setValue={setValue}
              updateStatusPromotion={updateStatusPromotion}
              promotionId={promotionId}
              edit
              promotionType={router.query?.type}
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
                cập nhật
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
