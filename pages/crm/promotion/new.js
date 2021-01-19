import {
  Box,
  Button,
  CardContent,
  CardHeader,
  FormControlLabel,
  FormGroup,
  Paper,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import Head from "next/head";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./promotion.module.css";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
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
  defaultNameRulesValue,
  defaultPromotionScope,
  defaultPromotionType,
  defaultRulePromotion,
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
import RenderTableListProduct from "components/component/promotion/modal-list-product";
import RenderTableListCategory from "components/component/promotion/modal-list-category";
import InfomationFields from "components/component/promotion/infomation-fields";
import ConditionFields from "components/component/promotion/condition-fields";

export async function getServerSideProps(ctx) {
  return await doWithLoggedInUser(ctx, (ctx) => {
    return { props: {} };
  });
}

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
  listProductDefault: [],
  listCategoryPromotion: [],
};

export default function NewPage(props) {
  return renderWithLoggedInUser(props, render);
}

async function createPromontion(
  totalCode,
  promotionName,
  promotionType,
  startTime,
  endTime,
  objects,
  applyPerUser,
  rule,
  useType
) {
  let data = {
    totalCode,
    promotionName,
    promotionType,
    startTime,
    endTime,
    objects,
    applyPerUser,
    rule,
    useType,
  };
  return getPromoClient().createPromotion(data);
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

function render(props) {
  const toast = useToast();
  const router = useRouter();
  const [state, setState] = useState(defaultState);
  const {
    promotionOption,
    promotionTypeRule,
    promotionScope,
    listProductPromotion,
    listCategoryPromotion,
    listProductDefault,
    listCategoryDefault,
    listCategoryFull,
    promotionRulesLine,
    listGiftPromotion,
    listProductGiftPromotion,
    promotionUseType,
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
  const [stateTest, setStateTest] = useState(0);
  const [open, setOpen] = useState({
    openModalGift: false,
    openModalProductGift: false,
    openModalProductScopePromotion: false,
    openModalCategoryScopePromotion: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

    const handleChangeScope = async (event) => {
        if (event.target.value === defaultPromotionScope.PRODUCT) {
            event.persist();
            let listCategoryResponse = await getListCategory();
            if (!listCategoryResponse || listCategoryResponse.status !== "OK") {
                return toast.warn("Không tìm thấy danh sách danh mục");
            }
            let productDefaultResponse = await getProduct();
            if (productDefaultResponse && productDefaultResponse.status === "OK") {
                let listProductDefault = [];
                productDefaultResponse.data.forEach((productResponse, index) => {
                    if (index < 5) {
                        listProductDefault.push({
                            product: productResponse,
                            active: false,
                        });
                    }
                });
                setState({
                    ...state,
                    [event.target?.name]: event.target?.value,
                    listProductDefault: listProductDefault,
                    listProductPromotion: [],
                    listCategoryPromotion: listCategoryResponse.data,
                });
                setOpen({...open, openModalProductScopePromotion: true});
            }
        } else if (event.target.value === defaultPromotionScope.CATEGORY) {
            event.persist();
            let listCategoryResponse = await getListCategory();
            if (!listCategoryResponse || listCategoryResponse.status !== "OK") {
                return toast.warn("Không tìm thấy danh sách danh mục");
            }
            let listCategoryDefault = [];
            listCategoryResponse.data.forEach((categoryResponse, index) => {
                listCategoryDefault.push({
                    category: categoryResponse,
                    active: false,
                });
            });
            setState({
                ...state,
                [event.target?.name]: event.target?.value,
                listCategoryDefault: listCategoryDefault,
                listCategoryPromotion: [],
            });
            setOpen({...open, openModalCategoryScopePromotion: true});
        } else {
            setState({
                ...state,
                [event.target?.name]: event.target?.value,
                listCategoryPromotion: [],
                listProductPromotion: [],
            });
        }
    };

  const resetPrice = () => {
    for (const [key, value] of Object.entries(defaultNameRulesValue)) {
      let priceMinValue = displayNameRule(promotionOption, value, 0);
      setValue(priceMinValue, "");
    }
  };

  const handleChangeStatus = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
      promotionRulesLine: [{ id: 0 }],
    });
    resetPrice();
    setState({ ...state, [event.target.name]: event.target.value });
    reset();
  };

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
        console.log('categoryList',categoryList)
        setOpen({...open, openModalCategoryScopePromotion: false});
        let listCategory = [];
        categoryList.forEach((category) => {
            if (category.active) {
                listCategory.push(category.category);
            }
        });
        setState({...state, listCategoryPromotion: listCategory});
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

  const handleRemoveProductPromotion = (product) => {
    let { listProductPromotion, listProductDefault } = state;
    listProductPromotion.forEach((productPromotion, index) => {
      if (productPromotion.productID === product.productID) {
        return listProductPromotion.splice(index, 1);
      }
    });
    listProductDefault.forEach((productDefault) => {
      if (productDefault.product.productID === product.productID) {
        productDefault.active = false;
      }
    });
    setState({
      ...state,
      listProductPromotion: listProductPromotion,
      listProductDefault: listProductDefault,
    });
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

  const handleAddGift = (listGiftNew) => {
    let listGiftAction = listGiftPromotion;
    listGiftNew.forEach((giftNew) => {
      if (giftNew.active) {
        listGiftAction.push(giftNew);
      }
    });
    setState({ ...state, listGiftPromotion: listGiftAction });
  };

  // func onSubmit used because useForm not working with some fields
  async function onSubmit() {
    let {
      promotionName,
      totalCode,
      startTime,
      endTime,
      totalApply,
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
      listGiftPromotion,
      listProductGiftPromotion
    );
    startTime = startTime + ":00Z";
    endTime = endTime + ":00Z";
    let objects = setScopeObjectPromontion(
      promotionScope,
      listProductIDs,
      listCategoryCodes
    );
    let promotionResponse = await createPromontion(
      parseInt(totalCode),
      promotionName,
      defaultPromotionType.COMBO,
      startTime,
      endTime,
      objects,
      parseInt(totalApply),
      rule,
      promotionUseType
    );
    if (promotionResponse.status === "OK") {
      toast.success("Tạo khuyến mãi thành công");
    } else {
      toast.error(`${promotionResponse.message}`);
    }
  }

  return (
    <AppCRM select="/crm/promotion">
      <Head>
        <title>Thêm khuyến mãi</title>
      </Head>
      <Box component={Paper} style={{ width: "100%" }}>
        <FormGroup style={{ width: "100%" }}>
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
                  <h3>Thêm khuyến mãi mới</h3>
                </Box>
              </Grid>
            </Grid>
            <InfomationFields
              errors={errors}
              handleChange={handleChange}
              register={register}
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
            />

            <Divider />
            <CardHeader subheader="Cách áp dụng" />
            <CardContent>
              <Grid spacing={3} container>
                <RadioGroup
                  aria-label="quiz"
                  name="promotionUseType"
                  value={promotionUseType}
                  onChange={handleChange}
                >
                  <Grid
                    spacing={3}
                    container
                    justify="space-around"
                    alignItems="center"
                  >
                    <Grid item xs={12} sm={6} md={6}>
                      <FormControlLabel
                        value={defaultUseTypePromotion.MANY}
                        control={<Radio color="primary" />}
                        label="Được áp dụng với khuyến mãi khác"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <FormControlLabel
                        value={defaultUseTypePromotion.ALONE}
                        control={<Radio color="primary" />}
                        label="Không được áp dụng vưới khuyến mãi khác"
                      />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </Grid>
            </CardContent>
            <CardHeader subheader="Áp dụng cho" />
            <CardContent>
              <Grid spacing={3} container>
                <RadioGroup
                  aria-label="quiz"
                  name="promotionScope"
                  value={promotionScope}
                  onChange={handleChangeScope}
                >
                  <Grid
                    spacing={3}
                    container
                    justify="space-around"
                    alignItems="center"
                  >
                    <Grid item xs={12} sm={4} md={4}>
                      <FormControlLabel
                        value={defaultPromotionScope.GLOBAL}
                        control={<Radio color="primary" />}
                        label="Toàn sàn"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                      <FormControlLabel
                        value={defaultPromotionScope.PRODUCT}
                        control={<Radio color="primary" />}
                        label="Sản phẩm được chọn"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                      <FormControlLabel
                        value={defaultPromotionScope.CATEGORY}
                        control={<Radio color="primary" />}
                        label="Danh mục được chọn"
                      />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </Grid>
            </CardContent>
            {promotionScope === defaultPromotionScope.PRODUCT && (
              <RenderTableListProduct
                handleClickOpen={() =>
                  setOpen({ ...open, openModalProductScopePromotion: true })
                }
                handleClose={() =>
                  setOpen({ ...open, openModalProductScopePromotion: false })
                }
                open={open.openModalProductScopePromotion}
                register={register}
                getValue={getValues()}
                listProductDefault={listProductDefault}
                promotionScope={promotionScope}
                listCategoryPromotion={listCategoryPromotion}
                listProductPromotion={listProductPromotion}
                handleAddProductPromotion={handleAddProductPromotion}
                handleRemoveProductPromotion={handleRemoveProductPromotion}
              />
            )}
            {promotionScope === defaultPromotionScope.CATEGORY && (
              <RenderTableListCategory
                handleClickOpen={() =>
                  setOpen({ ...open, openModalCategoryScopePromotion: true })
                }
                handleClose={() =>
                  setOpen({ ...open, openModalCategoryScopePromotion: false })
                }
                open={open.openModalCategoryScopePromotion}
                register={register}
                getValue={getValues()}
                promotionScope={promotionScope}
                listCategoryDefault={listCategoryDefault}
                listCategoryPromotion={listCategoryPromotion}
                handleAddCategoryPromotion={handleAddCategoryPromotion}
                handleRemoveCategoryPromotion={handleRemoveCategoryPromotion}
              />
            )}
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
                style={{ margin: 8 }}
              >
                Lưu
              </Button>
              <Button variant="contained" style={{ margin: 8 }}>
                Làm mới
              </Button>
            </Box>
          </Box>
        </FormGroup>
      </Box>
    </AppCRM>
  );
}
