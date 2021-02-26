import {
  Button,
  FormGroup,
  Paper,
  ButtonGroup,
  CircularProgress,
} from "@material-ui/core";
import Head from "next/head";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  formatUTCTime,
  onSubmitPromotion,
  validatePromotion,
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
      promotionRes: null,
    },
  };
  let promotionId = ctx.query.promotionId;
  let _promotionClient = getPromoClient(ctx, {});
  let promotionRes = await _promotionClient.getPromotionByID(promotionId);

  if (promotionRes && promotionRes.status === "OK") {
    let data = promotionRes.data[0];
    returnObject.props.promotionRes = data;
  }

  return returnObject;
}

export default function NewPage(props) {
  return renderWithLoggedInUser(props, render);
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

  console.log(formatUTCTime(new Date()) + ":00Z" < startTime, "formatUTCTime");

  console.log("props", props);

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
      list: [],
    },
    {
      selectField: defaultScope.area,
      list: [],
    },
  ]);

  const [conditionObject, setConditionObject] = useState({
    selectField: conditions[0].type
      ? conditions[0].type
      : defaultCondition.noRule,
    minTotalValue: "",
    seller: [""],
    productList:
      conditions[0].type == defaultCondition.noRule
        ? [""]
        : conditions[0].productConditions?.map((o) => ""),
    item: {},
  });

  const [rewardObject, setRewardObject] = useState({
    selectField: rewards[0].type ? rewards[0].type : "",
    percentageDiscount: "",
    maxDiscount: "",
    absoluteDiscount: "",
    attachedProduct:
      rewards[0].type == defaultReward.gift
        ? rewards[0].gifts.map((o) => "")
        : [""],
    pointValue: "",
  });

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

  const fillDefaultData = async () => {
    //---------- Scope ---------
    setValue(
      "registeredBefore",
      scopes[0].registeredBefore
        ? formatUTCTime(scopes[0].registeredBefore)
        : new Date()
    );
    setValue(
      "registeredAfter",
      scopes[0].registeredAfter
        ? formatUTCTime(scopes[0].registeredAfter)
        : new Date()
    );

    // ** CustomerLevel
    if (scopes[0].quantityType == "ALL") {
      setValue("customerLevel", [{ name: "Chọn tất cả" }]);
    } else {
      let arr = [];
      let res = await getListLevelClient();
      if (res?.status == "OK") {
        scopes[0].customerLevelCodes.map((code) =>
          arr.unshift(res.data.find((v) => v.code == code))
        );
        setValue("customerLevel", arr);
      }
    }

    // ** Area
    if (scopes[1].quantityType == "ALL") {
      setValue("area", [{ name: "Chọn tất cả" }]);
    } else {
      let arr = [];
      let res = await getListAreaClient();
      if (res?.status == "OK") {
        scopes[1].areaCodes.map((code) =>
          arr.unshift(res.data.find((v) => v.code == code))
        );
        setValue("area", arr);
      }
    }

    //---------- Condition ---------

    setValue("minOrderValue", conditions[0].minOrderValue);

    conditions.map(async (o) => {
      let code;

      if (o.type != defaultCondition.noRule) {
        let res;

        o.productConditions.map(async (ob, i) => {
          // Handle Sellers, Quantity, Value
          if (ob.sellerQuantityType == "ALL") {
            setValue("seller" + i, [{ name: "Chọn tất cả" }]);
          } else {
            let response = await getListSellerByCodesClient(ob.sellerCodes);
            if (response?.status == "OK") {
              setValue("seller" + i, response.data);
            }
          }
          setValue("minQuantity" + i, ob.minQuantity);
          setValue("minTotalValue" + i, ob.minTotalValue);

          // Handle Item
          switch (o.type) {
            case defaultCondition.product:
              res = await getListProductByIdsClient([ob.productId]);
              if (res?.status == "OK") {
                setValue("product" + i, res.data[0]);
              }
              break;
            case defaultCondition.productTag:
              res = await getProductTagByCodeClient([ob.productTag]);
              if (res?.status == "OK") {
                setValue("productTag" + i, res.data[0]);
              }
              break;
            case defaultCondition.productCategory:
              res = await getListCategoryByCodesClient([ob.categoryCode]);
              if (res?.status == "OK") {
                setValue("productCategory" + i, res.data[0]);
              }
              break;
            case defaultCondition.ingredient:
              res = await getListIngredientByCodesClient([ob.ingredientCode]);
              if (res?.status == "OK") {
                setValue("ingredient" + i, res.data[0]);
              }
              break;
            case defaultCondition.producer:
              res = await getListProducerByCodesClient([ob.producerCode]);
              if (res?.status == "OK") {
                console.log();
                setValue("producer" + i, res.data[0]);
              }
              break;
            default:
              break;
          }
        });
      }
    });

    //---------- Reward ---------

    if (rewards[0].type == defaultReward.gift) {
      rewards[0].gifts.map(async (gift, index) => {
        setValue("quantity" + index, gift.quantity);
        let res = await getListProductByIdsClient([gift.productId]);
        if (res?.status == "OK") {
          setValue("gift" + index, res.data[0]);
        }
      });
    } else {
      setValue("percentageDiscount", rewards[0]?.percentageDiscount);
      setValue("absoluteDiscount", rewards[0]?.absoluteDiscount);
      setValue("maxDiscount", rewards[0]?.maxDiscount);
      setValue("pointValue", rewards[0]?.pointValue);
    }
  };

  async function onSubmitUpdate() {
    onSubmitPromotion(
      getValues,
      toast,
      router,
      conditionObject,
      rewardObject,
      false,
      promotionId
    );
  }

  useEffect(() => {
    fillDefaultData();
  }, []);

  console.log(getValues(), "getValues()");
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
              disabled={new Date() >= new Date(startTime)}
              useForm={{ errors, register, getValues, control, setValue }}
              textField={textField}
              handleChangeTextField={handleChangeTextField}
            />
            <ConditionFields
              disabled={new Date() >= new Date(startTime)}
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
                onClick={handleSubmit(onSubmitUpdate)}
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
