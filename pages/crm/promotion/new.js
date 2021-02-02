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
import React, { useState } from "react";
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
  setRulesPromotion,
  setScopeObjectPromontion,
} from "../../../components/component/until";
import { useRouter } from "next/router";
import InfomationFields from "components/component/promotion/infomation-fields";
import ConditionFields from "components/component/promotion/condition-fields";
import dynamic from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "@material-ui/core/Link";
import TitleLink from "../../../components/component/promotion/title";
import {
  MyCard,
  MyCardActions,
  MyCardContent,
  MyCardHeader,
} from "@thuocsi/nextjs-components/my-card/my-card";

const defaultState = {
  promotionOption: defaultRulePromotion.MIN_ORDER_VALUE,
  promotionTypeRule: defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE,
  promotionScope: defaultPromotionScope.GLOBAL,
  promotionUseType: defaultUseTypePromotion.MANY,
  promotionRulesLine: [
    {
      id: 1,
    },
  ],
  listGiftPromotion: [],
  listProductGiftPromotion: [],
  listProductPromotion: [],
  listCategoryDefault: [],
  listProductAction: [],
  listCategoryAction: [],
  listProductDefault: [],
  listCategoryPromotion: [],
};

export async function getServerSideProps(ctx) {
  return await doWithLoggedInUser(ctx, (ctx) => {
    return loadDataBefore(ctx);
  });
}

export async function loadDataBefore(ctx) {
  let returnObject = { props: { defaultState: defaultState } };
  let _categoryClient = getCategoryClient(ctx, {});
  let listCategoryResponse = await _categoryClient.getListCategory();
  if (listCategoryResponse && listCategoryResponse.status === "OK") {
    listCategoryResponse.data.forEach((category, index) => {
      returnObject.props.defaultState.listCategoryDefault.push({
        category: category,
        active: false,
      });
    });
  }

  let _productClient = getProductClient(ctx, {});
  let listProductResponse = await _productClient.getProductList(0, 5, "");

  if (listProductResponse && listProductResponse.status === "OK") {
    listProductResponse.data.forEach((product, index) => {
      returnObject.props.defaultState.listProductDefault.push({
        product: product,
        active: false,
      });
    });
    returnObject.props.defaultState.listCategoryProduct =
      listCategoryResponse.data;
  }

  return returnObject;
}

export default function NewPage(props) {
  return renderWithLoggedInUser(props, render);
}

async function createPromontion(data) {
  // if (promotionCode !== "") {
  //   data.promotionCode = promotionCode;
  // }
  // if (endTime !== "") {
  //   data.endTime = endTime;
  // }
  return getPromoClient().createPromotion(data);
}

async function getProduct(offset, limit, q) {
  return getProductClient().getProductListFromClient(offset, limit, q);
}

async function getListProductGift(productName) {
  return await getProductClient().getProductListFromClient(productName);
}

async function searchProductList(q, categoryCode) {
  return await getProductClient().searchProductListFromClient(q, categoryCode);
}

async function getListCategory() {
  return await getCategoryClient().getListCategoryFromClient("", "", "");
}

function render(props) {
  const toast = useToast();
  const router = useRouter();

  const urls = [
    {
      title: "Trang chủ",
      url: "/crm/promotion",
    },
    {
      title: "Khuyến mãi",
      url: "/crm/promotion",
    },
    {
      title: "Tạo mới",
      url: `/crm/promotion/new?type=${router.query.type}`,
    },
  ];
  const [state, setState] = useState(props.defaultState);

  const {
    register,
    getValues,
    handleSubmit,
    setError,
    setValue,
    reset,
    errors,
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
      selectField: "",
      registeredBefore: new Date(),
      registeredAfter: new Date(),
      list: [],
    },
  ]);

  const [conditionObject, setConditionObject] = useState({
    selectField: "",
    minValue: 0,
    productList: [{ productName: "", productNumber: 0, productValue: 0 }],
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

  const handleChangeFieldOfProductList = (index, key) => (event) => {
    conditionObject.productList[index][key] = event.target.value;
    setConditionObject({ ...conditionObject });
  };

  const handleChangeConditionField = (key) => (event) => {
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
    conditionObject.productList.splice(index, 1);
    setConditionObject({ ...conditionObject });
  };

  const handleAddScopeSelect = () => {
    scopeObject.push({
      selectField: "",
      registeredBefore: new Date(),
      registeredAfter: new Date(),
      list: [],
    });
    setScopeObject([...scopeObject]);
  };

  const handleChangeScopeField = (index, key) => (event) => {
    scopeObject[index][key] = event.target.value;
    setScopeObject([...scopeObject]);
  };

  const handleChangeScopeList = (index) => (event, value) => {
    scopeObject[index].list = value;
    if (scopeObject[index].selectField == defaultScope.product) {
      conditionObject.productList = [];
      value.map((product, i) => {
        conditionObject.productList.push({
          product,
          productNumber: 0,
          productValue: 0,
        });
        setConditionObject({ ...conditionObject });
        console.log(product, i, "handleChangeScopeList");
        console.log(getValues(), "getValue");
      });
    }
    setScopeObject([...scopeObject]);
  };

  // func onSubmit used because useForm not working with some fields
  async function onSubmit() {
    let value = getValues();
    console.log(value, "value");
    console.log(scopeObject, "scopeObject");
    console.log(conditionObject, "conditionObject");
    console.log(rewardObject, "rewardObject");
    let objects = [];
    scopeObject.map((o, index) => {
      switch (o.selectField) {
        case defaultScope.product:
          objects.push({
            products: o.list.map((product) => product.productID),
          });
          break;
        case defaultScope.customer:
          objects.push({
            registeredBefore: o.registeredBefore,
            registeredAfter: o.registeredAfter,
            customerLevels: o.list.map((level) => level.code),
          });
          break;
        case defaultScope.area:
          objects.push({
            areaCodes: o.list.map((area) => area.code),
          });
          break;
        case defaultScope.producer:
          objects.push({
            sellerCodes: o.list.map((seller) => seller.code),
          });
          break;
        case defaultScope.productCatergory:
          objects.push({
            categoryCodes: o.list.map((category) => category.code),
          });
          break;
        case defaultScope.ingredient:
          objects.push({
            ingredients: o.list.map((ingredient) => ingredient.code),
          });
          break;
        case defaultScope.productTag:
          objects.push({
            productTag: o.list.map((tag) => tag.code),
          });
          break;
        default:
          break;
      }
      objects[index].scope = o.selectField;
      objects[index].type = "MANY";
    });

    let rules = {
      field: conditionObject.selectField,
      type: rewardObject.selectField,
      conditions: [{}],
    };

    let productConditions = [];
    let minOrverValue = 0;

    if (conditionObject.selectField == defaultCondition.product) {
      console.log(conditionObject.selectField, "conditionObject.selectField");
      conditionObject.productList.map((o, index) => {
        productConditions.push({
          productId: o.product.productID,
          minQuantity: parseInt(value["productNumber" + index]),
          minTotalValue: parseInt(value["productValue" + index]),
        });
      });
      rules.conditions[0].productConditions = productConditions;
    }
    if (conditionObject.selectField == defaultCondition.orderValue) {
      minOrverValue = parseInt(value.minValue);
      rules.conditions[0].minOrverValue = parseInt(minOrverValue);
    }

    if (rewardObject.selectField == defaultReward.absolute) {
      rules.conditions[0].discountValue = parseInt(value.absoluteDiscount);
    }

    if (rewardObject.selectField == defaultReward.precentage) {
      rules.conditions[0].percent = value.percentageDiscount;
      rules.conditions[0].maxDiscountValue = value.maxDiscount;
    }

    if (rewardObject.selectField == defaultReward.point) {
      rules.conditions[0].pointValue = value.pointValue;
    }

    if (rewardObject.selectField == defaultReward.gift) {
      let gifts = [];
      rewardObject.attachedProduct.map((o, index) =>
        gifts.push({
          productId: o.product.productID,
          quantity: parseInt(value["number" + index]),
        })
      );
      rules.conditions[0].gifts = gifts;
    }

    let body = {
      promotionName: value.promotionName,
      promotionType: textField.promotionTypeField,
      promotionOrganizer: textField.promotionField,
      startTime: value.startTime + ":00.000Z",
      endTime: value.endTime + ":00.000Z",
      description: textField.descriptionField,
      rule: rules,
      objects: objects,
    };

    console.log(JSON.stringify(body), "body");

    let res = await createPromontion(body);
    console.log(res, "res");
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
              errors={errors}
              promotionType={router.query?.type}
              textField={textField}
              errorTextField={errorTextField}
              handleChangeTextField={handleChangeTextField}
              register={register}
            />
            <ConditionFields
              register={register}
              errors={errors}
              setValue={setValue}
              object={{ scopeObject, conditionObject, rewardObject }}
              textField={textField}
              handleAddAttachedProduct={handleAddAttachedProduct}
              handleRemoveAttachedProduct={handleRemoveAttachedProduct}
              handleChangeTextField={handleChangeTextField}
              handleChangeScopeList={handleChangeScopeList}
              handleChangeScopeField={handleChangeScopeField}
              handleAddScopeSelect={handleAddScopeSelect}
              handleChangeConditionField={handleChangeConditionField}
              handleChangeFieldOfProductList={handleChangeFieldOfProductList}
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
                onClick={handleSubmit(onSubmit)}
                style={{ margin: 8 }}
              >
                Lưu
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
