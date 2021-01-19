import {
    Box,
    Button, ButtonGroup, CardContent,
    CardHeader,
    FormControl, FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem, Modal,
    Paper, Radio, RadioGroup,
    Select, Table, TableCell, TableContainer, TableHead, TableRow,
    TextField
} from "@material-ui/core";
import Head from "next/head";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from "./promotion.module.css";
import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-components/lib/login";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import {
    defaultNameRulesValue,
    defaultPromotionScope,
    defaultRulePromotion,
    defaultTypeConditionsRule,
    defaultPromotionType,
    defaultUseTypePromotion
} from "../../../components/component/constant";
import {
    displayNameRule, displayTime,
    limitText,
    parseConditionValue,
    parseRuleToObject,
    setRulesPromotion,
    setScopeObjectPromontion
} from "../../../components/component/until";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import {useToast} from "@thuocsi/nextjs-components/toast/useToast";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Checkbox from "@material-ui/core/Checkbox";
import DialogActions from "@material-ui/core/DialogActions";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import {loadPromoData} from "./index";
import {getPromoClient} from "../../../client/promo";
import {getProductClient} from "../../../client/product";
import {getCategoryClient} from "../../../client/category";
import Image from "next/image";
import {route} from "next/dist/next-server/server/router";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {useRouter} from "next/router";
import RenderTableListCategory from "../../../components/component/promotion/modal-list-category";

export async function getServerSideProps(ctx ) {
    return await doWithLoggedInUser(ctx, () => {
        return loadPromotionData(ctx)
    })
}

export async function loadPromotionData(ctx) {
    let returnObject = {props: {}}
    let query = ctx.query
    let _promotionClient = getPromoClient(ctx,{})
    let getPromotionResponse = await _promotionClient.getPromotionByID(query.promotionId)
    if (getPromotionResponse && getPromotionResponse.status === "OK") {
        returnObject.props.data = getPromotionResponse.data[0]
    }

    let defaultState = parseRuleToObject(getPromotionResponse.data[0])
    let _productClient = getProductClient(ctx, {})
    if (defaultState.listProductIDs.length > 0 ) {
        let listProductPromotionResponse = await _productClient.getListProductByIdsOrCodes(defaultState.listProductIDs)
        if (listProductPromotionResponse && listProductPromotionResponse.status === "OK") {
            defaultState.listProductPromotion = listProductPromotionResponse.data
        }
    }
    defaultState.listProductDefault = []
    let listProductDefault = await _productClient.getListProduct()
    if (listProductDefault && listProductDefault.status === "OK") {
        listProductDefault.data.forEach((product,index) => {
            if (index < 5 ) {
                defaultState.listProductDefault.push({
                    product: product,
                    active: defaultState.listProductIDs.find(productId => productId === product.productID) || false
                })
            }
        })
    }

    let _categoryClient = getCategoryClient(ctx,{})
    let listCategoryResponse = await _categoryClient.getListCategory()
    if (listCategoryResponse && listCategoryResponse.status === "OK") {
        defaultState = listCategoryResponse.data
    }

    returnObject.props.defaultState = defaultState
    return returnObject
}

async function updatePromotion(promotionCode,applyPerUser,totalCode,promotionName,promotionType,startTime,endTime,objects,useType,rule,promotionId) {
    let data = {applyPerUser,totalCode,promotionName,promotionType,startTime,endTime,objects,useType,rule,promotionId}
    if (promotionCode !== "") {
        data.promotionCode = promotionCode
    }
    return getPromoClient().updatePromotion(data)
}

async function getProduct(productName,categoryCode) {
    return getProductClient().searchProductCategoryListFromClient(productName,categoryCode)
}

async function getListProductGift(productName) {
    return await getProductClient().getProductListFromClient(productName)
}

async function searchProductList(q,categoryCode) {
    return await getProductClient().searchProductListFromClient(q,categoryCode)
}

async function getListCategory() {
    return await getCategoryClient().getListCategoryFromClient()
}


export default function NewPage(props) {
    return renderWithLoggedInUser(props, render)
}

function render(props) {
    const toast = useToast()
    const router = useRouter()
    let dataRender = props.data
    console.log('data',dataRender)
    let defaultState = props.defaultState
    let startTime = dataRender.startTime
    let endTime = dataRender.endTime
    startTime = displayTime(startTime)
    endTime = displayTime(endTime)
    const [state, setState] = useState(defaultState);
    const [updateDateProps, setUpdateDataProps] = useState({
    })
    const {promotionOption, promotionTypeRule,
        promotionScope,promotionRulesLine,conditions,
        listProductDefault,listProductPromotion,
        listCategoryPromotion,listGiftPromotion,promotionUseType,listCategoryDefault} = state
    const {register,getValues, handleSubmit,setError,setValue,reset, errors} = useForm();
    const [open, setOpen] = useState({
        openModalGift : false,
        openModalProductGift: false,
        openModalProductScopePromotion: false,
        openModalCategoryScopePromotion: false,
    });

    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.value})
    }

    const handleChangeState = (name,value) => {
        setState({...state,name:value})
    }

    const handleChangeStatus = (event) => {
        setState({...state, [event.target.name]: event.target.value,promotionRulesLine: [{id:0}]})
        reset()
    }

    function handleRemoveCodePercent(id) {
        const newCodes = promotionRulesLine.filter((item) => item.id !== id);
        setState({...state,promotionRulesLine: newCodes});
    }

    function handleAddCodePercent(id) {
        setState({...state,promotionRulesLine: [...promotionRulesLine,{id: id + 1}]});
    }

    const handleAddProductPromotion = (productList) => {
        setOpen({...open,openModalProductScopePromotion: false})
        let listProductPromotion = []
        productList.forEach(product => {
            if (product.active) {
                listProductPromotion.push(product.product)
            }
        })
        setState({...state,listProductPromotion:listProductPromotion})
    }

    const handleAddCategoryPromotion = (categoryList) => {
        setOpen({...open, openModalCategoryScopePromotion: false});
        let listCategory = [];
        categoryList.forEach((category) => {
            if (category.active) {
                listCategory.push(category.category);
            }
        });
        setState({...state, listCategoryPromotion: listCategory});
    };

    const handleRemoveCategoryPromotion = (category) => {
        let {listCategoryPromotion, listCategoryDefault} = state;
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
        console.log("listCategoryDefault", listCategoryDefault);
        setState({
            ...state,
            listCategoryPromotion: listCategoryPromotion,
            listCategoryDefault: listCategoryDefault,
        });
    };

    const handleRemoveProductPromotion = (product) => {
        let {listProductPromotion,listProductDefault} = state
        listProductPromotion.forEach((productPromotion,index) => {
            if (productPromotion.productID === product.productID) {
                return listProductPromotion.splice(index,1)
            }
        })
        listProductDefault.forEach(productDefault => {
            if (productDefault.product.productID === product.productID) {
                product.active=false
            }
        })
        setState({...state,listProductPromotion: listProductPromotion,listProductDefault: listProductDefault})
    }

    const handleChangeScope = async (event) => {
        if (event.target.value === defaultPromotionScope.PRODUCT) {
            event.persist();
            let listCategoryResponse = await getListCategory()
            if (!listCategoryResponse || listCategoryResponse.status !== "OK") {
                return toast.warn('Không tìm thấy danh sách danh mục')
            }
            let productDefaultResponse = await getProduct()
            if (productDefaultResponse && productDefaultResponse.status === "OK") {
                let listProductDefault = []
                productDefaultResponse.data.forEach((productResponse,index) => {
                    if (index < 5) {
                        listProductDefault.push({
                            product: productResponse,
                            active: listProductPromotion.find(productPromotion => productPromotion.productID === productResponse.productID) || false
                        })
                    }
                })
                setState({...state,[event.target?.name]: event.target?.value,listProductDefault: listProductDefault,listCategoryPromotion: listCategoryResponse.data})
                setOpen({...open,openModalProductScopePromotion: true})
            }
        }else {
            setState({...state,[event.target?.name]: event.target?.value,listProductPromotion: []})
        }
    }

    // func onSubmit used because useForm not working with some fields
    async function onSubmit() {
        let {promotionName,totalCode,startTime,endTime,totalApply,promotionCode} = getValues()
        let value = getValues()
        let listProductIDs = []
        listProductPromotion.forEach(product => listProductIDs.push(product.productID))
        let rule = setRulesPromotion(promotionOption,promotionTypeRule,value,promotionRulesLine.length,listProductIDs)
        startTime  = startTime + ":00Z"
        endTime  = endTime + ":00Z"
        let objects = setScopeObjectPromontion(promotionScope,listProductIDs)
        let promotionResponse = await updatePromotion(promotionCode,parseInt(totalApply),parseInt(totalCode),promotionName,dataRender.promotionType,startTime,endTime,objects,promotionUseType,rule,dataRender.promotionId)

        if (promotionResponse.status === "OK") {
            toast.success('Cập nhật khuyến mãi thành công')
        }else {
            toast.error(promotionResponse.message)
        }
    }

    return (
        <AppCRM select="/crm/promotion">
            <Head>
                <title>Chỉnh sửa khuyến mãi</title>
            </Head>
            <Box component={Paper}>
                <FormGroup style={{width: "100%"}}>
                    <Box className={styles.contentPadding}>
                        <Grid container>
                            <Grid  xs={4}>
                                <ArrowBackIcon style={{fontSize : 30}} onClick={() => router.back()}/>
                            </Grid>
                            <Grid>
                                <Box style={{fontSize: 24}}>
                                    <h3>Chỉnh sửa khuyến mãi</h3>
                                </Box>
                            </Grid>
                        </Grid>
                        <CardHeader
                            subheader="Thông tin khuyến mãi"
                        />
                        <CardContent>
                            <Grid spacing={3} container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        id="promotionName"
                                        name="promotionName"
                                        label="Tên khuyến mãi"
                                        placeholder=""
                                        defaultValue={dataRender.promotionName}
                                        helperText={errors.promotionName?.message}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{width: '100%'}}
                                        error={errors.promotionName ? true : false}
                                        required
                                        inputRef={
                                            register({
                                                required: "Tên khuyến mãi không được để trống",
                                                maxLength: {
                                                    value: 250,
                                                    message: "Tên khuyến mãi không được vượt quá 250 kí tự"
                                                },
                                                minLength: {
                                                    value: 6,
                                                    message: "Tên khuyến mãi phải có độ dài lớn hơn 6 kí tự"
                                                },
                                                pattern: {
                                                    value: /[A-Za-z]/,
                                                    message: "Tên khuyến mãi phải có kí tự là chứ số"
                                                }
                                            })
                                        }
                                    />
                                </Grid>
                                {
                                    dataRender.promotionType === defaultPromotionType.VOUCHER_CODE ? (
                                        <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            id="promotionCode"
                                            name="promotionCode"
                                            label="Mã khuyến mãi"
                                            placeholder=""
                                            defaultValue={dataRender.promotionCode}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{width: '100%'}}
                                            inputRef={register}
                                        />
                                        </Grid>
                                    ): (
                                        <Container></Container>
                                    )
                                }
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        id="totalCode"
                                        name="totalCode"
                                        label="Số lần áp dụng"
                                        type="number"
                                        defaultValue={dataRender.totalCode}
                                        helperText={errors.totalCode?.message}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{width: '100%'}}
                                        error={errors.totalCode ? true : false}
                                        required
                                        inputRef={register(
                                            {
                                                required: "Số lần áp dụng không được để trống",
                                                pattern: {
                                                    value: /[0-9]/,
                                                    message: "Chỉ chấp nhận kí tự là số"
                                                }
                                            }
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        id="totalApply"
                                        name="totalApply"
                                        label="Số lần áp dụng tối đa"
                                        type="number"
                                        defaultValue={dataRender.applyPerUser}
                                        helperText={errors.totalApply?.message}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{width: '100%'}}
                                        error={errors.totalApply ? true : false}
                                        required
                                        inputRef={register(
                                            {
                                                required: "Số lần áp dụng tối đa không được để trống",
                                                pattern: {
                                                    value: /[0-9]/,
                                                    message: "Chỉ chấp nhận kí tự là số"
                                                }
                                            }
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        id="totalUsed"
                                        name="totalUsed"
                                        label="Số lượng user đã sử dụng"
                                        placeholder=""
                                        disabled={true}
                                        defaultValue={dataRender.totalUsed || 0}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{width: '100%'}}
                                        inputRef={register}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        id="totalCollect"
                                        name="totalCollect"
                                        label="Số lần khuyến mãi đã được sử dụng"
                                        placeholder=""
                                        disabled={true}
                                        defaultValue={dataRender.totalCollect || 0}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{width: '100%'}}
                                        inputRef={register}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        id="startTime"
                                        name="startTime"
                                        label="Thời gian bắt đầu"
                                        placeholder=""
                                        defaultValue={startTime}
                                        helperText={errors.startTime?.message}
                                        type="datetime-local"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{width: '100%'}}
                                        error={errors.startTime ? true : false}
                                        required
                                        inputRef={
                                            register({
                                                required: "Vui lòng chọn thời gian bắt đầu",
                                            })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        id="endTime"
                                        name="endTime"
                                        label="Thời gian kết thúc"
                                        placeholder=""
                                        type="datetime-local"
                                        defaultValue={endTime}
                                        helperText={errors.endTime?.message}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{width: '100%'}}
                                        onChange={handleChange}
                                        error={errors.endTime ? true : false}
                                        required
                                        inputRef={
                                            register({
                                                required: "Vui lòng chọn ngày kêt thúc",
                                            })
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider/>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Điều kiện
                            </Typography>
                            <RadioGroup aria-label="quiz" name="promotionOption" value={promotionOption}
                                        onChange={handleChangeStatus}>
                                <Grid spacing={3} container justify="space-around" alignItems="center">
                                    <Grid item xs={12} sm={6} md={6}>
                                        <FormControlLabel value={defaultRulePromotion.MIN_ORDER_VALUE} control={<Radio color="primary"/>}
                                                          label="Giảm giá theo giá trị đơn hàng"/>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <FormControlLabel value={defaultRulePromotion.MIN_QUANTITY} control={<Radio color="primary"/>}
                                                          label="Giảm giá theo số lượng sản phẩm"/>
                                    </Grid>
                                </Grid>
                            </RadioGroup>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Loại
                                    </Typography>
                                    <RadioGroup aria-label="quiz" name="promotionTypeRule" value={promotionTypeRule}
                                                onChange={handleChangeStatus}>
                                        <Grid spacing={1} container justify="space-around" alignItems="center">
                                            <Grid item xs={12} sm={6} md={4}>
                                                <FormControlLabel value={defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE}
                                                                  control={<Radio style={{color: 'blue'}}/>}
                                                                  label="Giảm tiền"/>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <FormControlLabel value={defaultTypeConditionsRule.DISCOUNT_PERCENT}
                                                                  control={<Radio style={{color: 'blue'}}/>}
                                                                  label="Giảm % giá sản phẩm"/>
                                            </Grid>
                                            {/*<Grid item xs={12} sm={6} md={4}>*/}
                                            {/*    <FormControlLabel value={defaultTypeConditionsRule.GIFT}*/}
                                            {/*                      control={<Radio style={{color: 'blue'}}/>}*/}
                                            {/*                      label="Quà"/>*/}
                                            {/*</Grid>*/}
                                            {/*<Grid item xs={12} sm={6} md={4}>*/}
                                            {/*    <FormControlLabel value={defaultTypeConditionsRule.PRODUCT_GIFT}*/}
                                            {/*                      control={<Radio style={{color: 'blue'}}/>}*/}
                                            {/*                      label="Tặng sản phẩm"/>*/}
                                            {/*</Grid>*/}
                                        </Grid>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                            {
                                promotionTypeRule === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE ? (
                                    <Card variant="outlined" style={{marginTop: '10px'}}
                                    >
                                        <List component="nav" aria-label="mailbox folders">
                                            {
                                                promotionRulesLine.map((code, index) => (
                                                    <ListItem
                                                        key={defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE + "_" + code.id}
                                                        button>
                                                        <Grid
                                                            spacing={1} container alignItems="center">
                                                            <Grid item xs={5} sm={5} md={5}>
                                                                <TextField
                                                                    id={displayNameRule(promotionOption,defaultNameRulesValue.priceMinValue,index)}
                                                                    name={displayNameRule(promotionOption,defaultNameRulesValue.priceMinValue,index)}
                                                                    label={promotionOption === defaultRulePromotion.MIN_ORDER_VALUE? "Giá trị đơn hàng": "Số lượng sản phẩm"}
                                                                    placeholder=""
                                                                    type="number"
                                                                    variant="outlined"
                                                                    defaultValue={parseConditionValue(conditions,promotionOption,promotionTypeRule,displayNameRule(promotionOption,defaultNameRulesValue.priceMinValue,index),index)}
                                                                    size="small"
                                                                    helperText={errors[displayNameRule(promotionOption,defaultNameRulesValue.priceMinValue,index)]?.message}
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    style={{width: '100%'}}
                                                                    error={!!errors[displayNameRule(promotionOption,defaultNameRulesValue.priceMinValue,index)]}
                                                                    required
                                                                    inputRef={
                                                                        register({
                                                                            required: "Giá trị đơn hàng không được bỏ trống",
                                                                            maxLength: {
                                                                                value: 10,
                                                                                message: "Giá trị đơn hàng không được vượt quá 10 kí tự"
                                                                            },
                                                                            minLength: {
                                                                                value: promotionOption === defaultRulePromotion.MIN_ORDER_VALUE? 6: 2,
                                                                                message: "Giá trị đơn hàng phải lớn hơn 6 kí tự"
                                                                            },
                                                                        })
                                                                    }
                                                                />
                                                            </Grid>
                                                            <Grid item xs={5} sm={5} md={5}>
                                                                <TextField
                                                                    id={displayNameRule(promotionOption,defaultNameRulesValue.priceDiscountValue,index)}
                                                                    name={displayNameRule(promotionOption,defaultNameRulesValue.priceDiscountValue,index)}
                                                                    type="number"
                                                                    label="Số tiền giảm"
                                                                    placeholder=""
                                                                    variant="outlined"
                                                                    defaultValue={parseConditionValue(conditions,promotionOption,promotionTypeRule,displayNameRule(promotionOption,defaultNameRulesValue.priceDiscountValue,index),index)}
                                                                    size="small"
                                                                    helperText={errors[displayNameRule(promotionOption,defaultNameRulesValue.priceDiscountValue,index)]?.message}
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    InputProps={{
                                                                        endAdornment: <InputAdornment
                                                                            position="end">đ</InputAdornment>,
                                                                    }}
                                                                    style={{width: '100%'}}
                                                                    error={errors[displayNameRule(promotionOption,defaultNameRulesValue.priceDiscountValue,index)] ? true : false}
                                                                    required
                                                                    inputRef={
                                                                        register({
                                                                            required: "Số tiền giảm không được bỏ trống",
                                                                            maxLength: {
                                                                                value: 250,
                                                                                message: "Số tiền giảm không được vượt quá 250 kí tự"
                                                                            },
                                                                            minLength: {
                                                                                value: 3,
                                                                                message: "Giá trị sản phẩm phải lớn hơn 1000"
                                                                            },
                                                                        })
                                                                    }
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2} sm={2} md={2}>
                                                                <Grid spacing={1} container alignItems="center">
                                                                    <Grid item xs={6} sm={4} md={2}>
                                                                        {
                                                                            promotionRulesLine.length !== 1 ? (
                                                                                <IconButton color="secondary"
                                                                                            component="span"
                                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                                    <HighlightOffOutlinedIcon/>
                                                                                </IconButton>
                                                                            ) : (
                                                                                <div/>
                                                                            )
                                                                        }
                                                                    </Grid>
                                                                    {
                                                                        index + 1 === promotionRulesLine.length ?
                                                                            (
                                                                                <Grid item xs={6} sm={4} md={2}>
                                                                                    <IconButton color="primary"
                                                                                                onClick={() => handleAddCodePercent(code.id)}
                                                                                                aria-label="upload picture"
                                                                                                component="span">
                                                                                        <AddCircleOutlineOutlinedIcon/>
                                                                                    </IconButton>
                                                                                </Grid>
                                                                            ) : (
                                                                                <div/>
                                                                            )
                                                                    }
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                ))
                                            }
                                        </List>
                                    </Card>
                                ) : promotionTypeRule === defaultTypeConditionsRule.DISCOUNT_PERCENT ? (
                                    <Card variant="outlined" style={{marginTop: '10px'}}>
                                        <List component="nav" aria-label="mailbox folders">
                                            {
                                                promotionRulesLine.map((code, index) => (
                                                    <ListItem key={defaultTypeConditionsRule.DISCOUNT_PERCENT+ "_" + code.id} button>
                                                        <Grid spacing={1} container alignItems="center">
                                                            <Grid item xs={4} sm={4} md={4}>
                                                                <TextField
                                                                    id={displayNameRule(promotionOption,defaultNameRulesValue.priceMinValuePercent,index)}
                                                                    name={displayNameRule(promotionOption,defaultNameRulesValue.priceMinValuePercent,index)}
                                                                    label={promotionOption === defaultRulePromotion.MIN_ORDER_VALUE? "Giá trị đơn hàng": "Số lượng sản phẩm"}
                                                                    placeholder=""
                                                                    type="number"
                                                                    defaultValue={parseConditionValue(conditions,promotionOption,promotionTypeRule,displayNameRule(promotionOption,defaultNameRulesValue.priceMinValuePercent,index),index)}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    helperText={errors[displayNameRule(promotionOption,defaultNameRulesValue.priceMinValuePercent,index)]?.message}
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    style={{width: '100%'}}
                                                                    error={!!errors[displayNameRule(promotionOption,defaultNameRulesValue.priceMinValuePercent,index)]}
                                                                    required
                                                                    inputRef={
                                                                        register({
                                                                            required: "Giá trị đơn hàng không được bỏ trống",
                                                                            maxLength: {
                                                                                value: 10,
                                                                                message: "Giá trị đơn hàng không được vượt quá 10 kí tự"
                                                                            },
                                                                            minLength: {
                                                                                value: promotionOption === defaultRulePromotion.MIN_ORDER_VALUE? 6: 2,
                                                                                message: "Giá trị đơn hàng phải lớn hơn 6 kí tự"
                                                                            },
                                                                        })
                                                                    }
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2} sm={2} md={2}>
                                                                <TextField
                                                                    id={displayNameRule(promotionOption,defaultNameRulesValue.percentValue,index)}
                                                                    name={displayNameRule(promotionOption,defaultNameRulesValue.percentValue,index)}
                                                                    type="number"
                                                                    label="Số % giảm"
                                                                    placeholder=""
                                                                    variant="outlined"
                                                                    defaultValue={parseConditionValue(conditions,promotionOption,promotionTypeRule,displayNameRule(promotionOption,defaultNameRulesValue.percentValue,index),index)}
                                                                    size="small"
                                                                    helperText={errors[displayNameRule(promotionOption,defaultNameRulesValue.percentValue,index)]?.message}
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    InputProps={{
                                                                        endAdornment: <InputAdornment
                                                                            position="end">%</InputAdornment>,
                                                                    }}
                                                                    style={{width: '100%'}}
                                                                    error={errors[displayNameRule(promotionOption,defaultNameRulesValue.percentValue,index)] ? true : false}
                                                                    required
                                                                    inputRef={
                                                                        register({
                                                                            required: "Số % giảm không được để trống",
                                                                            maxLength: {
                                                                                value: 3,
                                                                                message: "Số % giảm không đượt vượt quá 3 kí tự"
                                                                            },
                                                                            minLength: {
                                                                                value: 1,
                                                                                message: "Số % giảm có độ dài lớn hơn 1 kí tự"
                                                                            },
                                                                            pattern: {
                                                                                value: /[0-9]/,
                                                                                message: "Chỉ chấp nhận kí tự là số"
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </Grid>
                                                            <Grid item xs={4} sm={4} md={4}>
                                                                <TextField
                                                                    id={displayNameRule(promotionOption,defaultNameRulesValue.priceMaxDiscountValue,index)}
                                                                    name={displayNameRule(promotionOption,defaultNameRulesValue.priceMaxDiscountValue,index)}
                                                                    type="number"
                                                                    label="Số tiền giảm tối đa"
                                                                    placeholder=""
                                                                    variant="outlined"
                                                                    defaultValue={parseConditionValue(conditions,promotionOption,promotionTypeRule,displayNameRule(promotionOption,defaultNameRulesValue.priceMaxDiscountValue,index),index)}
                                                                    size="small"
                                                                    helperText={errors[displayNameRule(promotionOption,defaultNameRulesValue.priceMaxDiscountValue,index)]?.message}
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    InputProps={{
                                                                        endAdornment: <InputAdornment
                                                                            position="end">đ</InputAdornment>,
                                                                    }}
                                                                    style={{width: '100%'}}
                                                                    error={errors[displayNameRule(promotionOption,defaultNameRulesValue.priceMaxDiscountValue,index)] ? true : false}
                                                                    required
                                                                    inputRef={
                                                                        register({
                                                                            required: "Số tiền giảm tối đa không được để trống",
                                                                            maxLength: {
                                                                                value: 250,
                                                                                message: "Số tiền giảm tối đa không đượt vượt quá 250 kí tự"
                                                                            },
                                                                            minLength: {
                                                                                value: 4,
                                                                                message: "Số tiền giảm tối đa phải có độ dài lớn hơn 4 kí tự"
                                                                            },
                                                                            pattern: {
                                                                                value: /[0-9]/,
                                                                                message: "Chỉ chấp nhận kí tự là số"
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2} sm={2} md={2}>
                                                                <Grid spacing={1} container alignItems="center">
                                                                    <Grid item xs={6} sm={4} md={2}>
                                                                        {
                                                                            promotionRulesLine.length !== 1 ? (
                                                                                <IconButton color="secondary"
                                                                                            component="span"
                                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                                    <HighlightOffOutlinedIcon/>
                                                                                </IconButton>
                                                                            ) : (
                                                                                <div/>
                                                                            )
                                                                        }
                                                                    </Grid>
                                                                    {
                                                                        index + 1 === promotionRulesLine.length ?
                                                                            (
                                                                                <Grid item xs={6} sm={4} md={2}>
                                                                                    <IconButton color="primary"
                                                                                                onClick={() => handleAddCodePercent(code.id)}
                                                                                                aria-label="upload picture"
                                                                                                component="span">
                                                                                        <AddCircleOutlineOutlinedIcon/>
                                                                                    </IconButton>
                                                                                </Grid>
                                                                            ) : (
                                                                                <div/>
                                                                            )
                                                                    }
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                ))
                                            }
                                        </List>
                                    </Card>
                                ) : promotionTypeRule === defaultTypeConditionsRule.GIFT ? (
                                    <RenderTableGift
                                        handleClickOpen={() => setOpen({...open,openModalGift: true})}
                                        handleClose={() => setOpen({...open,openModalGift: false})}
                                        open={open.openModalGift}
                                        register={register}
                                        state={state}
                                        handleRemoveCodePercent={handleRemoveCodePercent}
                                        handleChange={handleChange}/>
                                ) : promotionTypeRule === defaultTypeConditionsRule.PRODUCT_GIFT ? (
                                    <RenderTableProductGift
                                        handleClickOpen={() => setOpen({...open,openModalProductGift: true})}
                                        handleClose={() => setOpen({...open,openModalProductGift: false})}
                                        open={open.openModalProductGift}
                                        register={register}
                                        state={state}
                                        handleRemoveCodePercent={handleRemoveCodePercent}
                                        handleChange={handleChange}
                                    />
                                ): (
                                    <div/>
                                )
                            }
                        </CardContent>
                        <Divider/>
                        <CardHeader subheader="Cách áp dụng"/>
                        <CardContent>
                            <Grid spacing={3} container>
                                <RadioGroup aria-label="quiz" name="promotionUseType" value={promotionUseType}
                                            onChange={handleChange}>
                                    <Grid spacing={3} container justify="space-around" alignItems="center">
                                        <Grid item xs={12} sm={6} md={6}>
                                            <FormControlLabel value={defaultUseTypePromotion.MANY} control={<Radio color="primary"/>}
                                                              label="Được áp dụng với khuyến mãi khác"/>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <FormControlLabel value={defaultUseTypePromotion.ALONE} control={<Radio color="primary"/>}
                                                              label="Không được áp dụng với khuyến mãi khác"/>
                                        </Grid>
                                    </Grid>
                                </RadioGroup>
                            </Grid>
                        </CardContent>
                        <CardHeader
                            subheader="Áp dụng cho"
                        />
                        <CardContent>
                            <Grid spacing={3} container>
                                <RadioGroup aria-label="quiz" name="promotionScope" value={promotionScope}
                                            onChange={handleChangeScope}>
                                    <Grid spacing={3} container justify="space-around" alignItems="center">
                                        <Grid item xs={12} sm={6} md={6}>
                                            <FormControlLabel value={defaultPromotionScope.GLOBAL} control={<Radio color="primary"/>}
                                                              label="Toàn sàn"/>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <FormControlLabel value={defaultPromotionScope.PRODUCT} control={<Radio color="primary"/>}
                                                              label="Sản phẩm được chọn"/>
                                        </Grid>
                                        <Grid item xs={12} sm={4} md={4}>
                                            <FormControlLabel value={defaultPromotionScope.CATEGORY} control={<Radio color="primary"/>}
                                                              label="Danh mục được chọn"/>
                                        </Grid>
                                    </Grid>
                                </RadioGroup>
                            </Grid>
                        </CardContent>
                        {promotionScope === defaultPromotionScope.PRODUCT &&(
                                <RenderTableListProduct
                                    handleClickOpen={() => setOpen({...open,openModalProductScopePromotion: true})}
                                    handleClose={() => setOpen({...open,openModalProductScopePromotion: false})}
                                    open={open.openModalProductScopePromotion}
                                    register={register}
                                    getValue={getValues()}
                                    listProductDefault={listProductDefault}
                                    promotionScope={promotionScope}
                                    listCategoryPromotion={listCategoryPromotion}
                                    listProductPromotion={listProductPromotion}
                                    handleAddProductPromotion={handleAddProductPromotion}
                                    handleRemoveProductPromotion={handleRemoveProductPromotion}
                                />)
                        }
                        {promotionScope === defaultPromotionScope.CATEGORY && (
                            <RenderTableListCategory
                                handleClickOpen={() =>
                                    setOpen({...open, openModalCategoryScopePromotion: true})
                                }
                                handleClose={() =>
                                    setOpen({...open, openModalCategoryScopePromotion: false})
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
                                style={{margin: 8}}>
                                Lưu
                            </Button>
                            <Button variant="contained" style={{margin: 8}} onClick={() => router.back()}>Trở về</Button>
                        </Box>
                    </Box>
                </FormGroup>
            </Box>
        </AppCRM>
    )
}

export function RenderTableGift(props) {
    const [stateGift, setStateGift] = useState({
        listGiftSearch: [],
        listGiftAction: [],
        listGiftNew: [],
    })

    const [showAutoComplete, setShowAutoComplete]   = useState(false);

    const handleSearchProductGift = async (productName) => {
        let giftResponse = await searchGift(productName)
        if (giftResponse.status === "OK") {
            setStateGift({...stateGift, listGiftSearch: giftResponse.data})
        }
    }

    const handleRemoveGift = (gift) => {
        let {listGiftAction} = stateGift
        listGiftAction.remove(giftAction => giftAction.gift.productId === gift.productId)
        setStateGift({...stateGift,listGiftAction: listGiftAction})
    }

    const handleChangeQuantityGift = (gift,quantity) =>{
        let {listGiftNew} = stateGift
        listGiftNew.forEach(giftNew => {
            if (giftNew.gift.productId === gift.productId) {
                giftNew.quantity = quantity
            }
        })
        setStateGift({...stateGift,listGiftNew: listGiftNew})
    }

    const handleActiveGift = (gift,active) => {
        let {listGiftNew} = stateGift
        listGiftNew.forEach(giftNew => {
            if (giftNew.gift.productId === gift.productId) {
                giftNew.active = active
            }
        })
        setStateGift({...stateGift,listGiftNew: listGiftNew})
    }

    const handleAddGiftNew = (e,value) => {
        let {listGiftNew} = stateGift
        if (value) {
            if (listGiftNew.find(giftnew => giftnew.productId === value.productId)) {
                listGiftNew.forEach(giftNew => {
                    if (giftNew.gift && giftNew.gift.productId === value.productId) {
                        return giftNew.quantity++
                    }
                })
            }else {
                listGiftNew.push({
                    gift: value,
                    quantity: 0,
                    active: true,
                })
            }
        }
        setStateGift({...stateGift,listGiftNew: listGiftNew,listGiftSearch: []})
    }

    const handleAddGiftAction = () => {
        let {listGiftAction,listGiftNew} = stateGift
        listGiftNew.forEach(giftNew => {
            if (giftNew.active) {
                listGiftAction.push(giftNew)
            }
        })
        props.handleClose()
    }

    return (
        <Card variant="outlined" style={{marginTop: '4px'}}>
            <ButtonGroup color="primary" size="small"
                         aria-label="contained primary button group"
                         className={styles.btnDialog}
                         onClick={props.handleClickOpen}
            >
                <Button variant="contained" color="primary">Thêm quà</Button>
            </ButtonGroup>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Hình ảnh</TableCell>
                            <TableCell align="left">Tên quà</TableCell>
                            <TableCell align="left">Số lượng</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {stateGift.listGiftAction.map(({gift,quantity,active}) => (
                        <TableRow>
                            <TableCell align="left">Balo</TableCell>
                            <TableCell align="left">{gift.name}</TableCell>
                            <TableCell align="left">quantity</TableCell>
                            <TableCell align="center">
                                <IconButton color="secondary"
                                            component="span"
                                            onClick={() => handleRemoveGift(gift)}
                                >
                                    <HighlightOffOutlinedIcon/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </TableContainer>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Chọn quà"}</DialogTitle>
                <DialogContent>
                    <div style={{marginBottom: '1rem'}}>
                        <Autocomplete
                            options={stateGift.listGiftSearch}
                            variant="outlined"
                            name="searchProductGift"
                            loading={showAutoComplete}
                            fullWidth
                            loadingText="Không tìm thấy quà tặng"
                            onOpen={() => {
                                setShowAutoComplete(true)
                            }}
                            onClose={() => {
                                setShowAutoComplete(false)
                            }}
                            getOptionLabel={option => option.name}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label="Tên quà tặng"
                                    placeholder=""
                                    variant="outlined"
                                    onChange={e => handleSearchProductGift(e.target.value)}
                                />
                            )}
                            onChange={(e,value) => handleAddGiftNew(e,value)}
                        />
                    </div>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Hình ảnh</TableCell>
                                    <TableCell align="left">Tên quà</TableCell>
                                    <TableCell align="left" style={{width: '25%'}}>Số
                                        lượng</TableCell>
                                    <TableCell align="center">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            {stateGift.listGiftNew.map(({gift,active,quantity}) => (
                                <TableRow>
                                    <TableCell align="left">
                                        {
                                            gift.imageUrls? (
                                                <image src={gift.imageUrls[0]}></image>
                                            ):(
                                                <div></div>
                                            )
                                        }
                                    </TableCell>
                                    <TableCell align="left">{gift.name}</TableCell>
                                    <TableCell align="left">
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            style={{
                                                height: '40%'
                                            }}
                                            type="number"
                                            value={quantity}
                                            onChange={(e,value) => handleChangeQuantityGift(gift,value)}
                                            id="outlined-adornment-weight"
                                            aria-describedby="outlined-weight-helper-text"
                                            labelWidth={0}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox checked={active} style={{color: 'green'}} onChange={(e,value) => handleActiveGift(gift,value)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleAddGiftAction} color="primary" autoFocus>
                        Thêm
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export function RenderTableProductGift(props) {

    const [stateProductGift, setStateProductGift] = useState({
        listProductGiftSearch: [],
        listProductGiftAction: [],
        listProductGiftNew: [],
    })

    const [showAutoComplete, setShowAutoComplete]   = useState(false);

    const handleSearchProductGift = async (productName) => {
        let categoryGiftResponse = await getListGift()
        if (categoryGiftResponse.status === "OK") {
            let giftResponse = await searchGift(categoryGiftResponse.data[0].code)
            if (giftResponse.status === "OK") {
                setStateProductGift({...stateProductGift, listProductGiftSearch: giftResponse.data})
            }
        }
    }

    const handleRemoveProductGift = (gift) => {
        let {listProductGiftAction} = stateProductGift
        listGiftAction.remove(giftAction => giftAction.gift.productId === gift.productId)
        setStateProductGift({...stateProductGift,listProductGiftAction: listGiftAction})
    }

    const handleChangeQuantityProductGift = (giftId,quantity) =>{
        let {listProductGiftNew} = stateProductGift
        listGiftNew.forEach(giftNew => {
            if (giftNew.gift.productId === giftId) {
                giftNew.quantity = quantity
            }
        })
        setStateProductGift({...stateProductGift,listProductGiftNew: listGiftNew})
    }

    const handleActiveProductGift = (gift,active) => {
        let {listProductGiftNew} = stateProductGift
        listGiftNew.forEach(giftNew => {
            if (giftNew.gift.productId === giftId) {
                giftNew.active = active
            }
        })
        setStateProductGift({...stateProductGift,listProductGiftNew: listGiftNew})
    }

    const handleAddProductGiftNew = (e,value) => {
        let {listProductGiftNew} = stateProductGift
        if (value) {
            listGiftNew.push({
                gift: value,
                quantity: 0,
            })
        }
        setStateProductGift({...stateProductGift,listProductGiftNew: listGiftNew})
    }

    return (
        <Card variant="outlined" style={{marginTop: '10px'}}>
            <div>
                <ButtonGroup color="primary" size="small"
                             aria-label="contained primary button group"
                             className={styles.btnDialog}
                             onClick={props.handleClickOpen}
                >
                    <Button variant="contained" size="small"  color="primary">Thêm sản phẩm</Button>
                </ButtonGroup>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Hình ảnh</TableCell>
                                <TableCell align="left">Tên sản phẩm</TableCell>
                                <TableCell align="left">Số lượng</TableCell>
                                <TableCell align="left">Đơn vị</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        {stateProductGift.listProductGiftAction.map(({gift,quantity,active}) => (
                            <TableRow>
                                <TableCell align="left">Balo</TableCell>
                                <TableCell align="left">{gift.name}</TableCell>
                                <TableCell align="left">quantity</TableCell>
                                <TableCell align="left">quantity</TableCell>
                                <TableCell align="center">
                                    <IconButton color="secondary"
                                                component="span"
                                                onClick={() => handleRemoveGift(gift)}
                                    >
                                        <HighlightOffOutlinedIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </TableContainer>
                <Dialog
                    open={props.open}
                    onClose={props.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Chọn sản phẩm"}</DialogTitle>
                    <DialogContent>
                        <Paper component="form" className={styles.search}
                               style={{marginBottom: '10px'}}>
                            <InputBase
                                id="q"
                                name="q"
                                className={styles.input}
                                onChange={props.handleChange}
                                inputRef={props.register}
                                placeholder="Tìm kiếm sản phẩm"
                                inputProps={{'aria-label': 'Tìm kiếm sản phẩm'}}
                            />
                            <IconButton className={styles.iconButton} aria-label="search">
                                <SearchIcon/>
                            </IconButton>
                        </Paper>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Hình ảnh</TableCell>
                                        <TableCell align="left">Tên sản phẩm</TableCell>
                                        <TableCell align="left">Đơn vị</TableCell>
                                        <TableCell align="left" style={{width: '25%'}}>Số
                                            lượng</TableCell>
                                        <TableCell align="center">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                {stateProductGift.listProductGiftNew.map(({gift,active}) => (
                                    <TableRow>
                                        <TableCell align="left">
                                            Ảnh
                                        </TableCell>
                                        <TableCell align="left">{gift.name}</TableCell>
                                        <TableCell align="left">
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                style={{
                                                    height: '40%'
                                                }}
                                                type="number"
                                                onChange={(e,value) => handleChangeQuantityProductGift(gift,value)}
                                                id="outlined-adornment-weight"
                                                aria-describedby="outlined-weight-helper-text"
                                                labelWidth={0}
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                style={{
                                                    height: '40%'
                                                }}
                                                type="number"
                                                onChange={(e,value) => handleChangeQuantityProductGift(gift,value)}
                                                id="outlined-adornment-weight"
                                                aria-describedby="outlined-weight-helper-text"
                                                labelWidth={0}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Checkbox checked={active} style={{color: 'green'}} onChange={(e,value) => handleActiveProductGift(gift,value)} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={props.handleClose} color="secondary">
                            Hủy
                        </Button>
                        <Button onClick={props.handleClose} color="primary" autoFocus>
                            Thêm
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Card>
    )
}

export function RenderTableListProduct(props) {
    const [stateProduct, setStateProduct] = useState({
        listProductAction: props.listProductDefault,
        listCategoryPromotion: props.listCategoryPromotion,
        categorySearch: {},
        productNameSearch: "",
    })

    const [showAutoComplete, setShowAutoComplete]   = useState(false);

    const handleChangeProductSearch = (event) => {
        setStateProduct({...stateProduct,productNameSearch: event.target.value})
    }

    const handleCloseModal = () => {
        setStateProduct({...stateProduct,listProductAction: props.listProductDefault})
        return props.handleClose()
    }

    const handleChangeCategory = (event) => {
        setStateProduct({...stateProduct,categorySearch: event.target.value})
    }

    const handleActiveProduct = (product,active) => {
        let {listProductAction} = stateProduct
        listProductAction.forEach(productAction => {
            if (productAction.product.productID === product.productID) {
                productAction.active = active
            }
        })
        setStateProduct({...stateProduct,listProductAction: listProductAction})
    }

    const handleOnSearchProductCategory = async () => {
        let seachProductResponse = await searchProductList(stateProduct.productNameSearch, stateProduct.categorySearch.code)
        if (seachProductResponse && seachProductResponse.status === "OK") {
            let listProductAction = []
            seachProductResponse.data.forEach((searchProduct, index) => {
                if (index < 5) {
                    listProductAction.push({
                        product: searchProduct,
                        active: props.listProductPromotion.find(productPromotion => productPromotion.productID === searchProduct.productID)
                    })
                }
            })
            setStateProduct({...stateProduct, listProductAction: listProductAction})
        }else {
            setStateProduct({...stateProduct, listProductAction: []})
        }
    }

    return (
        <div>
            <Button variant="contained" style={{margin: "1rem 0"}} onClick={props.handleClickOpen}>Chọn sản phẩm</Button>
            <Modal open={props.open} onClose={handleCloseModal} className={styles.modal}>
                <div className={styles.modalBody}>
                    <h1 className={styles.headerModal}>
                        Chọn sản phẩm
                    </h1>
                    <div style={{margin: "1.25rem"}}>
                        <Grid spacing={3} container>
                            <Grid item sx={12} sm={4} md={4}>
                                <TextField
                                    placeholder="Tên sản phẩm"
                                    label="Tên sản phẩm"
                                    name="searchProduct"
                                    onChange={handleChangeProductSearch}
                                    style={{width: '100% !important'}}
                                    inputRef={props.register}
                                />
                            </Grid>
                            <Grid item sx={12} sm={4} md={4} className={styles.blockSearch}>
                                <FormControl className={styles.select}>
                                    <InputLabel id="category-select-outlined-label">Chọn danh mục</InputLabel>
                                    <Select
                                        autoWidth={false}
                                        style={{width: '100% !important'}}
                                        labelId="category-select-outlined-label"
                                        id="category-select-outlined"
                                        onChange={handleChangeCategory}
                                        inputRef={props.register}
                                        label="Chọn danh mục">
                                        {stateProduct.listCategoryPromotion.map((category) => (
                                            <MenuItem value={category} key={category.categoryID}>
                                                {limitText(category.name,20) || "...Không xác định"}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item sx={12} sm={4} md={4} style={{display: "flex"}}>
                                <Button variant="contained"  onClick={handleOnSearchProductCategory} className={styles.buttonSearch}>Tìm kiếm<IconButton>
                                    <SearchIcon/>
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
                                {stateProduct.listProductAction.map(({product,active}) => (
                                    <TableRow key={product?.productID}>
                                        <TableCell align="left">
                                            <Checkbox checked={active} style={{color: 'green'}} onChange={(e,value) => handleActiveProduct(product,value)} />
                                        </TableCell>
                                        <TableCell align="left">
                                            {product?.name}
                                        </TableCell>
                                        <TableCell align="left">
                                            {
                                                product?.imageUrls? (
                                                    <image src={product.imageUrls[0]}></image>
                                                ):(
                                                    <div></div>
                                                )
                                            }
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
                            <Button onClick={() => props.handleAddProductPromotion(stateProduct.listProductAction)} color="primary" autoFocus>
                                Thêm
                            </Button>
                        </ButtonGroup>
                    </DialogActions>
                </div>
            </Modal>
            {
                props.promotionScope === defaultPromotionScope.PRODUCT ? (
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
                                            {
                                                product.imageUrls?.length > 0 ?(
                                                    <Image src={product.imageUrls[0]}></Image>
                                                ):(
                                                    <div></div>
                                                )
                                            }
                                        </TableCell>
                                        <TableCell align="left">{product.name}</TableCell>
                                        <TableCell align="left">
                                            <IconButton color="secondary"
                                                        component="span"
                                                        onClick={() => props.handleRemoveProductPromotion(product)}
                                            >
                                                <HighlightOffOutlinedIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </TableContainer>
                    </Card>
                ): (
                    <div></div>
                )
            }
        </div>
    )
}
