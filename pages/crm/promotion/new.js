import {
    Box,
    Button,
    FormGroup,
    Paper,
    Grid,
    Divider, ButtonGroup,
} from "@material-ui/core";
import Head from "next/head";
import AppCRM from "pages/_layout";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import styles from "./promotion.module.css";
import {
    doWithLoggedInUser,
    renderWithLoggedInUser,
} from "@thuocsi/nextjs-components/lib/login";
import {getPromoClient} from "../../../client/promo";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {useToast} from "@thuocsi/nextjs-components/toast/useToast";
import {getProductClient} from "../../../client/product";
import {getCategoryClient} from "../../../client/category";
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
import {useRouter} from "next/router";
import InfomationFields from "components/component/promotion/infomation-fields";
import ConditionFields from "components/component/promotion/condition-fields";
import ApplyFields from "components/component/promotion/apply-fields";
import dynamic from "next";

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
    listCategoryAction:[],
    listProductDefault: [],
    listCategoryPromotion: [],
};

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadDataBefore(ctx);
    });
}

export async function loadDataBefore(ctx) {
    let returnObject = {props: {defaultState : defaultState}};
    let _categoryClient = getCategoryClient(ctx, {});
    let listCategoryResponse = await _categoryClient.getListCategoryTemp();
    if (listCategoryResponse && listCategoryResponse.status === "OK") {
        listCategoryResponse.data.forEach((category, index) => {
            returnObject.props.defaultState.listCategoryDefault.push({
                category: category,
                active: false,
            });
        });
    }

    let _productClient = getProductClient(ctx, {})
    let listProductResponse = await _productClient.getProductListNone(5)
    if (listProductResponse && listProductResponse.status === "OK") {
        listProductResponse.data.forEach((product, index) => {
            returnObject.props.defaultState.listProductDefault.push({
                product: product,
                active: false,
            });
        });
        returnObject.props.defaultState.listCategoryProduct = listCategoryResponse.data
    }

    return returnObject
}


export default function NewPage(props) {
    return renderWithLoggedInUser(props, render);
}

async function createPromontion(promotionCode, totalCode, promotionName, promotionType, startTime, endTime, objects, applyPerUser, rule, useType) {
    let data = {totalCode, promotionName, promotionType, startTime, objects, applyPerUser, rule, useType,};
    if (promotionCode !== "") {
        data.promotionCode = promotionCode;
    }
    if (endTime !== "") {
        data.endTime = endTime
    }
    return getPromoClient().createPromotion(data);
}

async function getProduct() {
    return getProductClient().getListProductNoneFromClient(5)
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
    const [state, setState] = useState(props.defaultState);
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
        listProductAction,
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
        setState({...state, [event.target.name]: event.target.value});
    };

    const handleChangeScope = async (event) => {
        if (event.target.value === defaultPromotionScope.PRODUCT) {
            event.persist();
            let productDefaultResponse = await getProduct();
            if (productDefaultResponse && productDefaultResponse.status === "OK") {
                let listProductDefault = [];
                productDefaultResponse.data.forEach(productResponse=> {
                    listProductDefault.push({
                        product: productResponse,
                        active: false,
                    });
                });
                setState({
                    ...state,
                    [event.target?.name]: event.target?.value,
                    listProductDefault: listProductDefault,
                    listCategoryDefault:[],
                    listProductPromotion: [],
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
                listProductDefault: [],
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
            promotionRulesLine: [{id: 0}],
        });
        resetPrice();
        reset();
    };

    const handleAddProductPromotion = (productList) => {
        setOpen({...open, openModalProductScopePromotion: false});
        let listProductPromotion = [];
        productList.forEach((product) => {
            if (product.active) {
                listProductPromotion.push(product.product);
            }
        });
        setState({...state, listProductPromotion: listProductPromotion});
    };

    const handleAddCategoryPromotion = (categoryList) => {
        setOpen({...open, openModalCategoryScopePromotion: false});
        let listCategory = [];
        categoryList.forEach((category) => {
            if (category.active && !listCategory?.find(c => c.categoryID === category.category.categoryID)) {
                listCategory.push(category.category);
            }
        });
        setState({...state, listCategoryPromotion: listCategory});
    };

    function handleRemoveCodePercent(id) {
        const newCodes = promotionRulesLine.filter((item) => item.id !== id);
        setState({...state, promotionRulesLine: newCodes});
    }

    function handleAddCodePercent(id) {
        setState({
            ...state,
            promotionRulesLine: [...promotionRulesLine, {id: id + 1}],
        });
    }

    const handleRemoveProductPromotion = (product) => {
        let {listProductPromotion, listProductDefault} = state;
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
        setState({...state, listGiftPromotion: listGiftAction});
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
        if (promotionScope == defaultPromotionScope.PRODUCT) {
            listProductPromotion.forEach((product) =>
                listProductIDs.push(product.productID)
            );
        }
        if (promotionScope == defaultPromotionScope.CATEGORY) {
            listCategoryPromotion.forEach((category) =>
                listCategoryCodes.push(category.code)
            );
        }
        let rule = setRulesPromotion(
            promotionOption,
            promotionTypeRule,
            value,
            promotionRulesLine.length,
            listGiftPromotion,
            listProductGiftPromotion
        );
        startTime = startTime + ":00Z";
        if (endTime !== "") {
            endTime = endTime + ":00Z";
        }
        let objects = setScopeObjectPromontion(
            promotionScope,
            listProductIDs,
            listCategoryCodes
        );
        let promotionResponse = await createPromontion(promotionCode, parseInt(totalCode), promotionName, router.query?.type, startTime, endTime, objects, parseInt(totalApply), rule, promotionUseType);
        if (promotionResponse.status === "OK") {
            console.lo
            toast.success("Tạo khuyến mãi thành công");
            return router.push({
                pathname: '/crm/promotion/edit',
                query: {
                    promotionId: promotionResponse.data[0]?.promotionId
                }
            })
        } else {
            toast.error(`${promotionResponse.message}`);
        }
    }

    return (
        <AppCRM select="/crm/promotion">
            <Head>
                <title>Tạo khuyến mãi</title>
            </Head>
            <Box component={Paper} style={{padding: "0 3rem", height: "100%"}}>
                <FormGroup style={{width: "100%"}}>
                    <Box>
                        <Grid container justify="center" alignItems="center">
                            <Box style={{fontSize: 24}}>
                                <h3>
                                    {router.query?.type === defaultPromotionType.COMBO
                                        ? "Tạo combo linh hoạt"
                                        : "Tạo mã khuyến mãi"}
                                </h3>
                            </Box>
                        </Grid>
                        <InfomationFields
                            errors={errors}
                            promotionType={router.query?.type}
                            handleChange={handleChange}
                            register={register}
                        />

                        <Divider/>

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

                        <Divider/>

                        <ApplyFields
                            open={open}
                            state={state}
                            register={register}
                            handleChange={handleChange}
                            handleChangeScope={handleChangeScope}
                            handleOpenListProduct={() =>
                                setOpen({...open, openModalProductScopePromotion: true})
                            }
                            handleCloseListProduct={() =>
                                setOpen({...open, openModalProductScopePromotion: false})
                            }
                            handleOpenListCategory={() =>
                                setOpen({...open, openModalCategoryScopePromotion: true})
                            }
                            handleCloseListCategory={() =>
                                setOpen({...open, openModalCategoryScopePromotion: false})
                            }
                            handleAddProductPromotion={handleAddProductPromotion}
                            handleRemoveProductPromotion={handleRemoveProductPromotion}
                            handleAddCategoryPromotion={handleAddCategoryPromotion}
                            handleRemoveCategoryPromotion={handleRemoveCategoryPromotion}
                        />

                        <Divider/>

                        <ButtonGroup fullWidth style={{marginTop: "1rem"}}>
                            <Box style={{marginLeft: "auto"}}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit(onSubmit)}
                                    style={{margin: 8}}>
                                    Lưu
                                </Button>
                                <Button variant="contained" style={{margin: 8}} onClick={() => router.reload()}>
                                    Làm mới
                                </Button>
                            </Box>
                        </ButtonGroup>
                    </Box>
                </FormGroup>
            </Box>
        </AppCRM>
    );
}
