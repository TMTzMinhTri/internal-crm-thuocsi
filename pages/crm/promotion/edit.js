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
import { getCustomerClient } from "client/customer";
import { getTagClient } from "client/tag";
import { getAreaClient } from "client/area";
import { getProducerClient } from "client/producer";
import { getIngredientClient } from "client/ingredient";

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

    returnObject.props.promotionRes = data;

    if (data.rule.conditions[0].gifts) {
      let ids = data.rule.conditions[0].gifts.map((o) => o.productId);
      let listProductRes = await getProductClient(
        ctx,
        {}
      ).getListProductByIdsOrCodes(ids, []);
      returnObject.props.gifts = listProductRes.data;
    }

    if (data.rule.conditions[0].productConditions) {
      let listId = [];
      data.rule.conditions[0].productConditions.map(async (o) =>
        listId.push(o.productId)
      );
      let listProductRes = await getProductClient(
        ctx,
        {}
      ).getListProductByIdsOrCodes(listId, []);
      returnObject.props.productConditions = listProductRes.data;
    }
  }

  return returnObject;
}

export default function NewPage(props) {
  return renderWithLoggedInUser(props, render);
}

async function createPromontion(data) {
  return getPromoClient().createPromotion(data);
}

async function updatePromontion(data) {
  return getPromoClient().updatePromotion(data);
}

async function getListProductByCodesClient(q) {
  return getProductClient().getListProductByIdsClient(q);
}

async function getListCategoryByCodesClient(q) {
  return getCategoryClient().getListCategoryByCodesClient(q);
}

async function getListProductTagByCodesClient(q) {
  return getTagClient().getTagByTagCodeClient(q);
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

async function getListIngredientByCodesClient(q) {
  return getIngredientClient().getIngredientByCodesClient(q);
}

function render(props) {
  const { productConditions, promotionRes, gifts } = props;

  const {
    description,
    endTime,
    startTime,
    promotionName,
    promotionOrganizer,
    promotionType,
    objects,
    rule,
  } = promotionRes
    ? promotionRes
    : {
        description: "",
        endTime: new Date(),
        startTime: new Date(),
        promotionName: "",
        promotionOrganizer: "",
        promotionType: "",
        objects: null,
        rule: null,
      };

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

  const {
    register,
    getValues,
    handleSubmit,
    setError,
    setValue,
    reset,
    control,
    errors,
  } = useForm({
    defaultValues: {
      startTime: formatUTCTime(startTime),
      endTime: formatUTCTime(endTime),
    },
  });

  const [listDataForAutoComplete, setListDataForAutoComplete] = useState({
    products: [],
    categoryCodes: [],
    customerLevels: [],
    ingredients: [],
    sellerCodes: [],
    productTag: [],
    areaCodes: [],
  });

  const [textField, setTextField] = useState({
    descriptionField: description ? description : "",
    promotionField: promotionOrganizer ? promotionOrganizer : "",
    promotionTypeField: promotionType ? promotionType : "",
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

  const {
    products,
    categoryCodes,
    customerLevels,
    ingredients,
    sellerCodes,
    productTag,
    areaCodes,
  } = listDataForAutoComplete;

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

  const handleRemoveScopeSelect = (index) => {
    scopeObject.splice(index, 1);
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
      });
    }
    setScopeObject([...scopeObject]);
  };

  const handleChangeProductListOfCondition = (index) => (event, value) => {
    conditionObject.productList[index] = {
      product: value,
      productNumber: 0,
      productValue: 0,
    };

    setConditionObject({ ...conditionObject });
  };

  const getListDataForAutoComplete = () => {
    objects.map(async (o, index) => {
      let typeVariable = "";
      let listRes = [];

      let arrAll = [];
      switch (o.scope) {
        case defaultScope.product:
          typeVariable = "products";
          listRes = await getListProductByCodesClient(o[typeVariable]);
          break;

        case defaultScope.productCatergory:
          typeVariable = "categoryCodes";
          listRes = await getListCategoryByCodesClient(o[typeVariable]);
          break;
        case defaultScope.customerLevel:
          typeVariable = "customerLevels";
          arrAll = await getListLevelClient();
          o.customerLevels.map((code) =>
            listRes.push(arrAll.data.find((v) => v.code == code))
          );
          break;
        case defaultScope.ingredient:
          typeVariable = "ingredients";
          // listRes = await getListIngredientByCodesClient(o[typeVariable]);
          break;
        case defaultScope.producer:
          typeVariable = "producerCodes";
          listRes = getListProducerByCodesClient(o[typeVariable]);
          break;
        case defaultScope.productTag:
          typeVariable = "productTag";
          listRes = await getListProductTagByCodesClient(o[typeVariable]);
          break;
        case defaultScope.area:
          typeVariable = "areaCodes";
          arrAll = await getListAreaClient();
          o.areaCodes.map((code) =>
            listRes.push(arrAll.data.find((v) => v.code == code))
          );
          break;

        default:
          break;
      }

      if (listRes && listRes.status && listRes.status == "OK") {
        setListDataForAutoComplete({
          ...listDataForAutoComplete,
          [typeVariable]: listRes.data ? listRes.data : listRes,
        });
      }
    });
  };

  // func onSubmit used because useForm not working with some fields
  async function onSubmit() {
    let value = getValues();
    let objects = [];
    scopeObject.map((o, index) => {
      switch (o.selectField) {
        case defaultScope.product:
          objects.push({
            products: o.list.map((product) => product.productID),
          });
          break;
        case defaultScope.customerLevel:
          objects.push({
            registeredBefore: new Date(o.registeredBefore).toISOString(),
            registeredAfter: new Date(o.registeredAfter).toISOString(),
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
            producerCodes: o.list.map((producer) => producer.code),
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
      if (o.list.length == 0) {
        objects[index].type = "ALL";
      } else {
        objects[index].type = "MANY";
      }
    });

    let rules = {
      field: conditionObject.selectField,
      type: rewardObject.selectField,
      conditions: [{}],
    };

    let productConditions = [];
    let minOrderValue = 0;

    if (conditionObject.selectField == defaultCondition.product) {
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
      minOrderValue = parseInt(value.minValue);
      rules.conditions[0].minOrderValue = parseInt(minOrderValue);
    }

    if (rewardObject.selectField == defaultReward.absolute) {
      rules.conditions[0].discountValue = parseInt(value.absoluteDiscount);
    }

    if (rewardObject.selectField == defaultReward.percentage) {
      rules.conditions[0].percent = parseInt(value.percentageDiscount);
      rules.conditions[0].maxDiscountValue = parseInt(value.maxDiscount);
    }

    if (rewardObject.selectField == defaultReward.point) {
      rules.conditions[0].pointValue = parseInt(value.pointValue);
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
      promotionId: promotionRes.promotionId,
      promotionName: value.promotionName,
      promotionType: textField.promotionTypeField,
      promotionOrganizer: textField.promotionField,
      startTime: new Date(value.startTime).toISOString(),
      endTime: new Date(value.endTime).toISOString(),
      description: textField.descriptionField,
      rule: rules,
      objects: objects,
    };

    console.log(JSON.stringify(body));

    let res = await updatePromontion(body);

    if (res.status == "OK") {
      toast.success("Cập nhật khuyến mãi thành công");
    } else {
      toast.error("Xảy ra lỗi");
    }
    console.log(res, "res");
  }

  useEffect(() => {
    getListDataForAutoComplete();
  }, []);

  useEffect(() => {
    if (objects) {
      setValue("promotionName", promotionRes.promotionName);
      objects.map((o, index) => {
        scopeObject[index].selectField = o.scope;
        if (o.scope == defaultScope.customerLevel) {
          scopeObject[index].registeredBefore = o.registeredBefore;
          scopeObject[index].registeredAfter = o.registeredAfter;
          scopeObject[index].list = customerLevels;
        }

        if (o.scope == defaultScope.area) {
          scopeObject[index].list = areaCodes;
        }

        if (o.scope == defaultScope.ingredient) {
          scopeObject[index].list = ingredients;
        }

        if (o.scope == defaultScope.producer) {
          scopeObject[index].list = sellerCodes;
        }

        if (o.scope == defaultScope.product) {
          scopeObject[index].list = products;
        }

        if (o.scope == defaultScope.productCatergory) {
          scopeObject[index].list = categoryCodes;
        }

        if (o.scope == defaultScope.productTag) {
          scopeObject[index].list = productTag;
        }

        setScopeObject([...scopeObject]);
      });

      if (rule.field == defaultCondition.orderValue) {
        conditionObject.minValue = rule.conditions[0].minOrderValue;
      }

      if (rule.field == defaultCondition.product) {
        conditionObject.productList = productConditions.map((o, index) => ({
          product: o,
          productNumber:
            rule.conditions[0].productConditions[index].minQuantity,
          productValue:
            rule.conditions[0].productConditions[index].minTotalValue,
        }));
      }

      if (rule.type == defaultReward.absolute) {
        rewardObject.absoluteDiscount = rule.conditions[0].discountValue;
      }

      if (rule.type == defaultReward.gift) {
        gifts.map((o, index) => {
          setValue("number" + index, rule.conditions[0].gifts[index].quantity);
        });
        rewardObject.attachedProduct = gifts;
      }

      if (rule.type == defaultReward.percentage) {
        rewardObject.percentageDiscount =
          promotionRes.rule.conditions[0].percent;
        rewardObject.maxDiscount =
          promotionRes.rule.conditions[0].maxDiscountValue;
      }

      if (rule.type == defaultReward.point) {
        rewardObject.pointValue = promotionRes.rule.conditions[0].pointValue;
      }

      setConditionObject({ ...conditionObject, selectField: rule.field });

      setRewardObject({ ...rewardObject, selectField: rule.type });
    }
  }, [objects, listDataForAutoComplete]);

  console.log(props, "props");

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
              control={control}
              setValue={setValue}
              object={{ scopeObject, conditionObject, rewardObject }}
              textField={textField}
              handleRemoveScopeSelect={handleRemoveScopeSelect}
              handleChangeProductListOfCondition={
                handleChangeProductListOfCondition
              }
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
