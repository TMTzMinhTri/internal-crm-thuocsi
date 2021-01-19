import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Card,
  IconButton,
  DialogContent,
  Checkbox,
  DialogActions,
  Grid,
  Divider,
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
  limitText,
  parseRuleToObject,
  setRulesPromotion,
  setScopeObjectPromontion,
} from "../../../components/component/until";

import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";

import { useToast } from "@thuocsi/nextjs-components/toast/useToast";

import SearchIcon from "@material-ui/icons/Search";

import { getPromoClient } from "../../../client/promo";
import { getProductClient } from "../../../client/product";
import { getCategoryClient } from "../../../client/category";
import Image from "next/image";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useRouter } from "next/router";
import InfomationFields from "components/component/promotion/infomation-fields";
import ConditionFields from "components/component/promotion/condition-fields";
import ApplyFields from "components/component/promotion/apply-fields";

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

  let listProductDefault = await _productClient.getListProduct();
  if (listProductDefault && listProductDefault.status === "OK") {
    defaultState.listProductDefault = listProductDefault.data.slice(0, 5);
  }

  returnObject.props.defaultState = defaultState;
  return returnObject;
}

async function updatePromotion(
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
  return getPromoClient().updatePromotion({
    promotionId,
    totalCode,
    promotionName,
    promotionType,
    startTime,
    endTime,
    objects,
    rule,
  });
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
              active:
                listProductPromotion.find(
                  (productPromotion) =>
                    productPromotion.productID === productResponse.productID
                ) || false,
            });
          }
        });
        setState({
          ...state,
          [event.target?.name]: event.target?.value,
          listProductDefault: listProductDefault,
          listCategoryPromotion: listCategoryResponse.data,
        });
        setOpen({ ...open, openModalProductScopePromotion: true });
      }
    } else {
      setState({
        ...state,
        [event.target?.name]: event.target?.value,
        listProductPromotion: [],
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
    } = getValues();
    let value = getValues();
    let listProductIDs = [];
    listProductPromotion.forEach((product) =>
      listProductIDs.push(product.productID)
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
    let objects = setScopeObjectPromontion(promotionScope, listProductIDs);
    let promotionResponse = await updatePromotion(
      parseInt(totalApply),
      parseInt(totalCode),
      promotionName,
      defaultPromotionType.COMBO,
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
            />

            <Divider />

            <ConditionFields
              state={state}
              errors={errors}
              handleAddCodePercent={handleAddCodePercent}
              handleChangeStatus={handleChangeStatus}
              handleRemoveCodePercent={handleRemoveCodePercent}
              handleChange={handleChange}
            />

            <Divider />

            <ApplyFields
              state={state}
              handleChange={handleChange}
              handleChangeScope={handleChangeScope}
            />

            {promotionScope === defaultPromotionScope.PRODUCT ? (
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
            ) : (
              <div></div>
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
      </Box>
    </AppCRM>
  );
}

export function RenderTableListProduct(props) {
  const [stateProduct, setStateProduct] = useState({
    listProductAction: props.listProductDefault,
    listCategoryPromotion: props.listCategoryPromotion,
    categorySearch: {},
    productNameSearch: "",
  });

  const [showAutoComplete, setShowAutoComplete] = useState(false);

  const handleChangeProductSearch = (event) => {
    setStateProduct({ ...stateProduct, productNameSearch: event.target.value });
  };

  const handleCloseModal = () => {
    setStateProduct({
      ...stateProduct,
      listProductAction: props.listProductDefault,
    });
    return props.handleClose();
  };

  const handleChangeCategory = (event) => {
    setStateProduct({ ...stateProduct, categorySearch: event.target.value });
  };

  const handleActiveProduct = (product, active) => {
    let { listProductAction } = stateProduct;
    listProductAction.forEach((productAction) => {
      if (productAction.product.productID === product.productID) {
        productAction.active = active;
      }
    });
    setStateProduct({ ...stateProduct, listProductAction: listProductAction });
  };

  const handleOnSearchProductCategory = async () => {
    let seachProductResponse = await searchProductList(
      stateProduct.productNameSearch,
      stateProduct.categorySearch.code
    );
    if (seachProductResponse && seachProductResponse.status === "OK") {
      let listProductAction = [];
      seachProductResponse.data.forEach((searchProduct, index) => {
        if (index < 5) {
          listProductAction.push({
            product: searchProduct,
            active: props.listProductPromotion.find(
              (productPromotion) =>
                productPromotion.productID === searchProduct.productID
            ),
          });
        }
      });
      setStateProduct({
        ...stateProduct,
        listProductAction: listProductAction,
      });
    } else {
      setStateProduct({ ...stateProduct, listProductAction: [] });
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        style={{ margin: "1rem 0" }}
        onClick={props.handleClickOpen}
      >
        Chọn sản phẩm
      </Button>
      <Modal
        open={props.open}
        onClose={handleCloseModal}
        className={styles.modal}
      >
        <div className={styles.modalBody}>
          <h1 className={styles.headerModal}>Chọn sản phẩm</h1>
          <div style={{ margin: "1.25rem" }}>
            <Grid spacing={3} container>
              <Grid item sx={12} sm={4} md={4}>
                <TextField
                  placeholder="Tên sản phẩm"
                  label="Tên sản phẩm"
                  name="searchProduct"
                  onChange={handleChangeProductSearch}
                  style={{ width: "100% !important" }}
                  inputRef={props.register}
                />
              </Grid>
              <Grid item sx={12} sm={4} md={4} className={styles.blockSearch}>
                <FormControl className={styles.select}>
                  <InputLabel id="category-select-outlined-label">
                    Chọn danh mục
                  </InputLabel>
                  <Select
                    autoWidth={false}
                    style={{ width: "100% !important" }}
                    labelId="category-select-outlined-label"
                    id="category-select-outlined"
                    onChange={handleChangeCategory}
                    inputRef={props.register}
                    label="Chọn danh mục"
                  >
                    {stateProduct.listCategoryPromotion.map((category) => (
                      <MenuItem value={category} key={category.categoryID}>
                        {limitText(category.name, 20) || "...Không xác định"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sx={12} sm={4} md={4} style={{ display: "flex" }}>
                <Button
                  variant="contained"
                  onClick={handleOnSearchProductCategory}
                  className={styles.buttonSearch}
                >
                  Tìm kiếm
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </Button>
              </Grid>
            </Grid>
          </div>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Thao tác</TableCell>
                    <TableCell align="left">Thông tin sản phẩm</TableCell>
                    <TableCell align="left">Ảnh</TableCell>
                  </TableRow>
                </TableHead>
                {stateProduct.listProductAction.map(({ product, active }) => (
                  <TableRow key={product?.productID}>
                    <TableCell align="left">
                      <Checkbox
                        checked={active}
                        style={{ color: "green" }}
                        onChange={(e, value) =>
                          handleActiveProduct(product, value)
                        }
                      />
                    </TableCell>
                    <TableCell align="left">{product?.name}</TableCell>
                    <TableCell align="left">
                      {product?.imageUrls ? (
                        <image src={product.imageUrls[0]}></image>
                      ) : (
                        <div></div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <ButtonGroup>
              <Button onClick={handleCloseModal} color="secondary">
                Hủy
              </Button>
              <Button
                onClick={() =>
                  props.handleAddProductPromotion(
                    stateProduct.listProductAction
                  )
                }
                color="primary"
                autoFocus
              >
                Thêm
              </Button>
            </ButtonGroup>
          </DialogActions>
        </div>
      </Modal>
      {props.promotionScope === defaultPromotionScope.PRODUCT ? (
        <Card>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Ảnh</TableCell>
                  <TableCell align="left">Thông tin sản phẩm</TableCell>
                  <TableCell align="left">Hành Động</TableCell>
                </TableRow>
              </TableHead>
              {props.listProductPromotion.map((product) => (
                <TableRow>
                  <TableCell align="left">
                    {product.imageUrls?.length > 0 ? (
                      <Image src={product.imageUrls[0]}></Image>
                    ) : (
                      <div></div>
                    )}
                  </TableCell>
                  <TableCell align="left">{product.name}</TableCell>
                  <TableCell align="left">
                    <IconButton
                      color="secondary"
                      component="span"
                      onClick={() =>
                        props.handleRemoveProductPromotion(product)
                      }
                    >
                      <HighlightOffOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </TableContainer>
        </Card>
      ) : (
        <div></div>
      )}
    </div>
  );
}
