import {
  Box,
  Button,
  FormGroup,
  Paper,
  Grid,
  Divider,
  ButtonGroup,
} from "@material-ui/core";
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
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getProductClient } from "../../../client/product";
import { getCategoryClient } from "../../../client/category";
import {
  defaultCondition,
  defaultNameRulesValue,
  defaultPromotionScope,
  defaultPromotionType,
  defaultReward,
  defaultRulePromotion,
  defaultScope,
  defaultTypeConditionsRule,
  defaultUseTypePromotion,
  queryParamGetProductGift,
} from "../../../components/component/constant";
import {
  displayNameRule,
  formatUTCTime,
  setRulesPromotion,
  setScopeObjectPromontion,
} from "../../../components/component/util";
import { useRouter } from "next/router";
import InfomationFields from "components/component/promotion/infomation-fields";
import ConditionFields from "components/component/promotion/condition-fields";
import dynamic from "next";
import Link from "@material-ui/core/Link";
import TitleLink from "../../../components/component/promotion/title";
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

    // if (data.rule.conditions[0].gifts) {
    //   let ids = data.rule.conditions[0].gifts.map((o) => o.productId);
    //   let listProductRes = await getProductClient(
    //     ctx,
    //     {}
    //   ).getListProductByIdsOrCodes(ids, []);
    //   returnObject.props.gifts = listProductRes.data;
    // }

    // if (data.rule.conditions[0].productConditions) {
    //   let listId = [];
    //   data.rule.conditions[0].productConditions.map(async (o) =>
    //     listId.push(o.productId)
    //   );
    //   let listProductRes = await getProductClient(
    //     ctx,
    //     {}
    //   ).getListProductByIdsOrCodes(listId, []);
    //   returnObject.props.productConditions = listProductRes.data;
    // }
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
  return getTagClient().getTagByTagCode(q);
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
  return getSellerClient().getSellerBySellerCode;
}

async function getListIngredientByCodesClient(q) {
  return getIngredientClient().getIngredientByCodesClient(q);
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
    promotionName,
    promotionOrganizer,
    promotionType,
    conditions,
    rewards,
    scopes,
  } = promotionRes
    ? promotionRes
    : {
        promotionId: "",
        description: "",
        endTime: new Date(),
        startTime: new Date(),
        promotionName: "",
        promotionOrganizer: "",
        promotionType: "",
        scopes: null,
        conditions: null,
        rewards: null,
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
      promotionName: promotionName,
      promotionField: promotionOrganizer,
      promotionTypeField: promotionType,
    },
  });

  console.log("props", props);

  console.log(getValues(), "getValues");

  const [textField, setTextField] = useState({
    descriptionField: "",
    promotionField: "",
    promotionTypeField: "",
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
    productList: [{ productName: "", productNumber: 0, productValue: 0 }],
    list: [],
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
    if (value.reward == "")
      setError("reward", {
        type: "required",
        message: "Chưa chọn giá trị khuyến mãi",
      });
    if (value.description == "")
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

  const fillDefaultData = () => {
    scopes.map(async (o, index) => {
      let arrAll = [];
      if (o.quantityType != "ALL")
        switch (o.type) {
          case defaultScope.customerLevel:
            arrAll = await getListLevelClient();
            o.customerLevelCodes.map((code) =>
              scopeObject[0].list.push(arrAll.data.find((v) => v.code == code))
            );
            break;
          case defaultScope.area:
            arrAll = await getListAreaClient();

            o.areaCodes.map((code) =>
              scopeObject[1].list.push(arrAll.data.find((v) => v.code == code))
            );
            console.log(scopeObject[1], "scopeObject[1]");
            break;
          default:
            break;
        }
      else {
        scopeObject[index].list = [{ name: "Chọn tất cả" }];
      }

      setScopeObject([...scopeObject]);
    });

    conditions.map((o, index) => {
      let info = "";
      let sellers = [];

      console.log(o, "ooo");
      switch (o.type) {
        case defaultCondition.productTag:
          o.productConditions.map(async (ob) => {
            console.log("here");
            info = await getProductTagByCodeClient(ob.productTag);
            console.log(info, "info");
            // setValue("productTag", info.data);
            // if(ob.sellerQuantityType == "ALL"){
            //   setValue("seller" + index, [{name: "Chọn tất cả"}])
            // } else {
            //   sellers = await
            // }
          });

          break;

        case defaultCondition.ingredient:
          o.productConditions.map(async (ob) => {
            info = await getListIngredientByCodesClient(ob.ingredientCode);
            console.log(info);
            setValue("ingredient", info.data[0]);
          });
        default:
          break;
      }
    });

    if (rewards[0].type == defaultReward.gift) {
      rewards[0].gifts.map(async (gift, index) => {
        console.log(gift, "gifft");
        let res = await getListProductByIdsClient([gift.productId]);
        console.log(res, "ressss");
        if (res?.status == "OK")
          rewardObject.attachedProduct.push({
            product: res.data[0],
            number: gift.quantity,
          });
        setValue("number" + index, gift.quantiy);
        console.log("getValuess", getValues());
        setRewardObject({ ...rewardObject });
      });
    }
  };

  // console.log(rewardObject, "rewardObject");

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
    let conditions = [
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
        return;

      default:
        break;
    }

    let body = {
      promotionId: promotionId,
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

    let res = await updatePromontion(body);
    console.log(res, "res");

    if (res.status == "OK") {
      toast.success("Cập nhật chương trình khuyến mãi thành công");
      router.back();
    } else {
      toast.error("Xảy ra lỗi");
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
