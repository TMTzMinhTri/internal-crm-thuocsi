import {
  Box,
  Button,
  Divider,
  FormGroup,
  Grid,
  Paper,
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
import { defaultPromotionScope } from "../../../components/component/constant";
import {
  displayTime,
  parseRuleToObject,
  setRulesPromotion,
  setScopeObjectPromontion,
} from "../../../components/component/until";

import { useToast } from "@thuocsi/nextjs-components/toast/useToast";

import { getPromoClient } from "../../../client/promo";
import { getProductClient } from "../../../client/product";
import { getCategoryClient } from "../../../client/category";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useRouter } from "next/router";
import InfomationFields from "components/component/promotion/infomation-fields";
import ConditionFields from "components/component/promotion/condition-fields";
import ApplyFields from "components/component/promotion/apply-fields";
import RenderTableListCategory from "../../../components/component/promotion/modal-list-category";
import RenderTableListProduct from "../../../components/component/promotion/modal-list-product";

export async function getServerSideProps(ctx) {
  return await doWithLoggedInUser(ctx, () => {
    return loadPromotionData(ctx);
  });
}

export async function loadPromotionData(ctx) {
  let returnObject = { props: {} };
  let query = ctx.query;
  let _promotionClient = getPromoClient(ctx, {});
  let getPromotionResponse = await _promotionClient.getPromotionByID(
    query.promotionId
  );
  if (getPromotionResponse && getPromotionResponse.status === "OK") {
    returnObject.props.data = getPromotionResponse.data[0];
  }

  let defaultState = parseRuleToObject(getPromotionResponse.data[0]);
  let _productClient = getProductClient(ctx, {});
  if (defaultState.listProductIDs.length > 0) {
    let listProductPromotionResponse = await _productClient.getListProductByIdsOrCodes(
      defaultState.listProductIDs
    );
    if (
      listProductPromotionResponse &&
      listProductPromotionResponse.status === "OK"
    ) {
      defaultState.listProductPromotion = listProductPromotionResponse.data;
    }
  }
  defaultState.listProductDefault = [];
  let listProductDefault = await _productClient.getListProduct();
  if (listProductDefault && listProductDefault.status === "OK") {
    listProductDefault.data.forEach((product, index) => {
      if (index < 5) {
        defaultState.listProductDefault.push({
          product: product,
          active:
            defaultState.listProductIDs?.find(
              (productId) => productId === product.productID
            ) || false,
        });
      }
    });
  }

  defaultState.listCategoryDefault = [];
  let _categoryClient = getCategoryClient(ctx, {});
  let listCategoryResponse = await _categoryClient.getListCategoryTemp();
  if (listCategoryResponse && listCategoryResponse.status === "OK") {
    listCategoryResponse.data.forEach((category, index) => {
      defaultState.listCategoryDefault.push({
        category: category,
        active:
          defaultState.listCategoryCodes?.find(
            (categoryCode) => categoryCode === category.code
          ) || false,
      });
    });
  }

  let listCategoryPromotionResponse = await _categoryClient.getListCategoryByCodes(
    defaultState.listCategoryCodes
  );
  if (
    listCategoryPromotionResponse &&
    listCategoryPromotionResponse.status === "OK"
  ) {
    defaultState.listCategoryPromotion = listCategoryPromotionResponse.data;
  }

  returnObject.props.defaultState = defaultState;
  return returnObject;
}

async function updatePromotion(
  promotionCode,
  applyPerUser,
  totalCode,
  promotionName,
  promotionType,
  startTime,
  endTime,
  objects,
  useType,
  rule,
  promotionId
) {
  let data = {
    applyPerUser,
    totalCode,
    promotionName,
    promotionType,
    startTime,
    endTime,
    objects,
    useType,
    rule,
    promotionId,
  };
  if (promotionCode !== "") {
    data.promotionCode = promotionCode;
  }
  return getPromoClient().updatePromotion(data);
}

async function getProduct(productName, categoryCode) {
  return getProductClient().searchProductCategoryListFromClient(
    productName,
    categoryCode
  );
}

async function getListProductGift(productName) {
  return await getProductClient().getProductListFromClient(productName);
}

async function searchProductList(q, categoryCode) {
  return await getProductClient().searchProductListFromClient(q, categoryCode);
}

async function getListCategory() {
  return await getCategoryClient().getListCategoryFromClient();
}

export default function NewPage(props) {
  return renderWithLoggedInUser(props, render);
}

function render(props) {
  const toast = useToast();
  const router = useRouter();
  let dataRender = props.data;
  let defaultState = props.defaultState;
  let startTime = dataRender.startTime;
  let endTime = dataRender.endTime;
  startTime = displayTime(startTime);
  endTime = displayTime(endTime);
  const [state, setState] = useState(defaultState);
  const [updateDateProps, setUpdateDataProps] = useState({});
  const {
    promotionOption,
    promotionTypeRule,
    promotionScope,
    promotionRulesLine,
    conditions,
    listProductDefault,
    listProductPromotion,
    listCategoryPromotion,
    listGiftPromotion,
    promotionUseType,
    listCategoryDefault,
  } = state;
  const {
    register,
    getValues,
    handleSubmit,
    setError,
    setValue,
    reset,
    errors,
  } = useForm();
  const [open, setOpen] = useState({
    openModalGift: false,
    openModalProductGift: false,
    openModalProductScopePromotion: false,
    openModalCategoryScopePromotion: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleChangeState = (name, value) => {
    setState({ ...state, name: value });
  };

  const handleChangeStatus = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
      promotionRulesLine: [{ id: 0 }],
    });
    reset();
  };

  function handleRemoveCodePercent(id) {
    const newCodes = promotionRulesLine.filter((item) => item.id !== id);
    setState({ ...state, promotionRulesLine: newCodes });
  }

  function handleAddCodePercent(id) {
    setState({
      ...state,
      promotionRulesLine: [...promotionRulesLine, { id: id + 1 }],
    });
  }

  const handleAddProductPromotion = (productList) => {
    setOpen({ ...open, openModalProductScopePromotion: false });
    let listProductPromotion = [];
    productList.forEach((product) => {
      if (product.active) {
        listProductPromotion.push(product.product);
      }
    });
    setState({ ...state, listProductPromotion: listProductPromotion });
  };

  const handleAddCategoryPromotion = (categoryList) => {
    setOpen({ ...open, openModalCategoryScopePromotion: false });
    let listCategory = [];
    categoryList.forEach((category) => {
      if (category.active) {
        listCategory.push(category.category);
      }
    });
    setState({ ...state, listCategoryPromotion: listCategory });
  };

  const handleRemoveCategoryPromotion = (category) => {
    let { listCategoryPromotion, listCategoryDefault } = state;
    listCategoryPromotion.forEach((o, index) => {
      if (o.categoryID === category.categoryID) {
        return listCategoryPromotion.splice(index, 1);
      }
    });
    listCategoryDefault.forEach((o) => {
      if (o.category.categoryID === category.categoryID) {
        o.active = false;
      }
    });
    setState({
      ...state,
      listCategoryPromotion: listCategoryPromotion,
      listCategoryDefault: listCategoryDefault,
    });
  };

  const handleRemoveProductPromotion = (product) => {
    let { listProductPromotion, listProductDefault } = state;
    listProductPromotion.forEach((productPromotion, index) => {
      if (productPromotion.productID === product.productID) {
        return listProductPromotion.splice(index, 1);
      }
    });
    listProductDefault.forEach((productDefault) => {
      if (productDefault.product.productID === product.productID) {
        product.active = false;
      }
    });
    setState({
      ...state,
      listProductPromotion: listProductPromotion,
      listProductDefault: listProductDefault,
    });
  };

  const handleChangeScope = async (event) => {
    if (event.target.value === defaultPromotionScope.PRODUCT) {
      event.persist();
      setState({
        ...state,
        listProductPromotion: defaultState.listProductPromotion,
        [event.target?.name]: event.target?.value,
      });
      setOpen({ ...open, openModalProductScopePromotion: true });
    } else if (event.target.value === defaultPromotionScope.CATEGORY) {
      setState({
        ...state,
        listCategoryPromotion: defaultState.listCategoryPromotion,
        [event.target?.name]: event.target?.value,
      });
      setOpen({ ...open, openModalCategoryScopePromotion: true });
    } else {
      setState({
        ...state,
        [event.target?.name]: event.target?.value,
        listCategoryPromotion: defaultState.listCategoryPromotion,
        listProductPromotion: defaultState.listProductPromotion,
      });
    }
  };

  // func onSubmit used because useForm not working with some fields
  async function onSubmit() {
    let {
      promotionName,
      totalCode,
      startTime,
      endTime,
      totalApply,
      promotionCode,
    } = getValues();
    let value = getValues();
    let listProductIDs = [];
    let listCategoryCodes = [];
    listProductPromotion.forEach((product) =>
      listProductIDs.push(product.productID)
    );
    listCategoryPromotion.forEach((category) =>
      listCategoryCodes.push(category.code)
    );
    let rule = setRulesPromotion(
      promotionOption,
      promotionTypeRule,
      value,
      promotionRulesLine.length,
      listProductIDs
    );
    startTime = startTime + ":00Z";
    endTime = endTime + ":00Z";
    let objects = setScopeObjectPromontion(
      promotionScope,
      listProductIDs,
      listCategoryCodes
    );
    let promotionResponse = await updatePromotion(
      promotionCode,
      parseInt(totalApply),
      parseInt(totalCode),
      promotionName,
      dataRender.promotionType,
      startTime,
      endTime,
      objects,
      promotionUseType,
      rule,
      dataRender.promotionId
    );

    if (promotionResponse.status === "OK") {
      toast.success("Cập nhật khuyến mãi thành công");
    } else {
      toast.error(promotionResponse.message);
    }
  }

  return (
    <AppCRM select="/crm/promotion">
      <Head>
        <title>Chỉnh sửa khuyến mãi</title>
      </Head>
      <Box component={Paper}>
        <form>
          <FormGroup>
            <Box className={styles.contentPadding}>
              <Grid container>
                <Grid xs={4}>
                  <ArrowBackIcon
                    style={{ fontSize: 30 }}
                    onClick={() => router.back()}
                  />
                </Grid>
                <Grid>
                  <Box style={{ fontSize: 24 }}>
                    <h3>Chỉnh sửa khuyến mãi</h3>
                  </Box>
                </Grid>
              </Grid>
              <InfomationFields
                dataRender={dataRender}
                errors={errors}
                startTime={startTime}
                endTime={endTime}
                handleChange={handleChange}
                register={register}
                edit
              />

              <Divider />

              <ConditionFields
                state={state}
                errors={errors}
                handleAddCodePercent={handleAddCodePercent}
                handleChangeStatus={handleChangeStatus}
                handleRemoveCodePercent={handleRemoveCodePercent}
                handleChange={handleChange}
                register={register}
                getValues={getValues}
                setError={setError}
                edit
              />

              <Divider />

              <ApplyFields
                open={open}
                state={state}
                register={register}
                handleChange={handleChange}
                handleChangeScope={handleChangeScope}
                handleOpenListProduct={() =>
                  setOpen({ ...open, openModalProductScopePromotion: true })
                }
                handleCloseListProduct={() =>
                  setOpen({ ...open, openModalProductScopePromotion: false })
                }
                handleOpenListCategory={() =>
                  setOpen({ ...open, openModalCategoryScopePromotion: true })
                }
                handleCloseListCategory={() =>
                  setOpen({ ...open, openModalCategoryScopePromotion: false })
                }
                handleAddProductPromotion={handleAddProductPromotion}
                handleRemoveProductPromotion={handleRemoveProductPromotion}
                handleAddCategoryPromotion={handleAddCategoryPromotion}
                handleRemoveCategoryPromotion={handleRemoveCategoryPromotion}
              />

              <Box>
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
                  onClick={() => router.back()}
                >
                  Trở về
                </Button>
              </Box>
            </Box>
          </FormGroup>
        </form>
      </Box>
    </AppCRM>
  );
}
