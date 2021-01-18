import {
    Box, Button, ButtonGroup,
    Divider,
    FormControl, Grid, InputAdornment, Paper,
    TextField,
    Typography
} from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getCategoryClient } from "client/category";
import { getPricingClient } from 'client/pricing';
import { NotFound } from 'components/components-global';
import { Brand, condUserType } from 'components/global';
import MuiMultipleAuto from "components/muiauto/multiple";
import MuiSingleAuto from "components/muiauto/single";
import Head from "next/head";
import { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import styles from "./pricing.module.css";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadConfigPricingData(ctx)
    })
}

export async function loadConfigPricingData(ctx) {
    let data = { props: {} }
    let query = ctx.query
    let q = typeof (query.q) === "undefined" ? '' : query.q
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit;
    let client = getPricingClient(ctx, {});
    let categoryResult = await client.getListCategory();
    let provinceResult = await client.getProvinceLists();
    provinceResult.data.unshift({ name: "Tất cả", code: "ALL" })
    let priceData = await client.getConfigPriceByCode(query.priceCode);

    let priceDataTmp = []
    if (priceData.status === "OK") {
        priceData.data[0].customerType = { value: priceData.data[0].customerType, label: condUserType.filter(type => type.value === priceData.data[0].customerType)[0].label }
        if (priceData.data[0]?.locationCode !== null) {
            priceData.data[0].locationCode = priceData.data[0].locationCode.map(_code => ({ label: provinceResult.data.filter(province => province.code === _code)[0].name, value: _code }))
        } else {
            priceData.data[0].locationCode = []
        }
        let listCateProduct = await client.getCategoryWithArrayID(priceData.data[0].categoryCode || [])
        if (listCateProduct.status === 'OK') {
            priceData.data[0].categoryCodes = listCateProduct.data.map(item => { return { label: item.name, value: item.code } })
        } else {
            priceData.data[0].categoryCodes = [{ label: '', value: '' }]
        }

        priceData.data[0].multiply = priceData.data[0].numMultiply || []
        priceData.data[0].addition = priceData.data[0].numAddition || []

        priceDataTmp = priceData.data[0]
    }

    return {
        props: {
            provinceLists: provinceResult.data || [],
            categoryLists: categoryResult.data || [],
            data: priceDataTmp,
            status: priceData.status
            // total,
        }
    };
}

export default function ConfigPricingPage(props) {
    return renderWithLoggedInUser(props, render)
}

function render(props) {
    if (props.status !== "OK") {
        return <NotFound link='/crm/pricing' titlePage='Cập nhật giá mới' labelLink='danh sách cấu hình giá' />
    } else {
        let router = useRouter()
        const { error, success } = useToast()

        const [configPricingList, setConfigPricingList] = useState(props.configPriceLists);
        const [provinceLists, setProvinceLists] = useState(props.provinceLists);
        const [categoryLists, setCategoryLists] = useState(props.categoryLists);
        const [total, setTotal] = useState(0);
        const [loading, setLoading] = useState(true);
        const { register, handleSubmit, errors, reset, watch, control, getValues, setValue } = useForm({ mode: 'onSubmit', defaultValues: props.data });
        const [searchCategory, setSearchCategory] = useState("");
        

        const onSubmit = async (formData) => {
            formData.categoryCode = formData.categoryCodes.map(category => category.value)
            formData.locationCode = formData.locationCode.map(location => location.value)
            formData.customerType = formData.customerType.value
            formData.code = props.data.code
            let client = getPricingClient();
            let result = await client.updatePriceGenConfig(formData)
            if (result.status === "OK") {
                success(result.message ? 'Cập nhật thành công' : 'Thông báo không xác định')
            } else {
                error(result.message || 'Thao tác không thành công, vui lòng thử lại sau')
            }
        }

        const searchCatogery = async (search) => {
            let categoryClient = getCategoryClient();
            let res = await categoryClient.getListCategoryFromClient(0, 100, search);
            if (res.status === "OK") {
                return res.data.map(category => {
                    return { label: category.name, value: category.code }
                });
            }
            return [{ value: '', label: '' }];
        };

        const onSubmit2 = (data, e) => console.log(data, e);
        const onError2 = (errors, e) => console.log(errors, e);

        return (
            <AppCRM select="/crm/pricing">
                <Head>
                    <title>Cập nhật giá mới</title>
                </Head>
                <Box component={Paper} display="block">
                    <form noValidate>
                        <Box className={styles.contentPadding}>
                            <Box style={{ fontSize: 30, margin: 5 }}>Cập nhật giá mới</Box>
                            <Grid container spacing={2} style={{ padding: '10px' }}>
                                <Grid item xs={12} md={12} sm={12} />
                                <Grid item xs={12} sm={12} md={2}>
                                    <MuiSingleAuto
                                        id="customerType"
                                        options={condUserType}
                                        label="Loại khách hàng"
                                        message="Vui lòng chọn"
                                        control={control}
                                        errors={errors}
                                        required={true}
                                        name="customerType"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} />
                                <Grid item xs={12} sm={12} md={6}>
                                    <MuiMultipleAuto
                                        id="categoryCodes"
                                        options={[...categoryLists.map(category => {
                                            return { label: category.name, value: category.code }
                                        })]}
                                        label="Loại sản phẩm"
                                        message="Vui lòng chọn"
                                        name="categoryCodes"
                                        control={control}
                                        errors={errors}
                                        message="Vui lòng chọn"
                                        onFieldChange={searchCatogery}
                                        required={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} />
                                <Grid item xs={12} sm={12} md={6}>
                                    <MuiMultipleAuto
                                        id="locationCode"
                                        options={[...provinceLists.map(province => {
                                            return { label: province.name, value: province.code }
                                        })]}
                                        label="Tỉnh/thành"
                                        message="Vui lòng chọn"
                                        name="locationCode"
                                        control={control}
                                        errors={errors}
                                        required={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} style={{ marginTop: '10px' }}>
                                    <FormControl component="fieldset" className={styles.marginTopBottom}>
                                        <FormLabel component="legend">Nơi bán</FormLabel>
                                        <Controller
                                            rules={{ required: true }}
                                            control={control}
                                            defaultValue="LOCAL"
                                            name="brand"
                                            as={
                                                <RadioGroup
                                                    aria-label="brand"
                                                    row
                                                >
                                                    <FormControlLabel
                                                        value="LOCAL"
                                                        control={<Radio color="primary" />}
                                                        label={Brand.LOCAL.value}
                                                    />
                                                    <FormControlLabel
                                                        value="FOREIGN"
                                                        control={<Radio color="primary" />}
                                                        label={Brand.FOREIGN.value}
                                                    />
                                                </RadioGroup>
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid container item xs={12} sm={12} md={8} spacing={3}>
                                    <Grid item xs={12} sm={12} md={5}>
                                        <Typography gutterBottom>
                                            Multiply:
                                </Typography>
                                        <TextField
                                            id="multiply"
                                            name="multiply"
                                            size="small"
                                            type="number"
                                            placeholder=""
                                            defaultValue={props.data?.numMultiply || 1}
                                            helperText={errors.name?.message}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                endAdornment: <InputAdornment
                                                    position="end">x</InputAdornment>,
                                            }}
                                            style={{ width: '100%' }}
                                            error={!!errors.multiply}
                                            helperText={errors.multiply?.message}
                                            required
                                            inputRef={
                                                register({
                                                    required: "Vui lòng nhập",
                                                    valueAsNumber: true, // important
                                                })
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={5}>
                                        <Typography gutterBottom>
                                            Addition:
                                        </Typography>
                                        <TextField
                                            id="addition"
                                            name="addition"
                                            size="small"
                                            type="number"
                                            // disabled={hidden}
                                            // label=""
                                            placeholder=""
                                            defaultValue={props.data?.numAddition || 5000}
                                            helperText={errors.name?.message}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                endAdornment: <InputAdornment
                                                    position="end">đ</InputAdornment>,
                                            }}
                                            // onChange={(e) => setValue(tag, parseInt(e.target.value,10))}
                                            style={{ width: '100%' }}
                                            error={!!errors.addition}
                                            helperText={errors.addition?.message}
                                            required
                                            inputRef={
                                                register({
                                                    required: "Vui lòng nhập",
                                                    valueAsNumber: true, // important
                                                })
                                            }
                                        />
                                    </Grid>
                                </Grid>

                            </Grid>
                            <Divider style={{ margin: '10px' }} />
                            <Grid item xs={12} sm={12} md={12}>
                                <Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit(onSubmit,onError2)}
                                        style={{ margin: 8 }}>
                                        Lưu
                                </Button>
                                    {
                                        typeof props.product === "undefined" ? (
                                            <Button variant="contained" type="reset" style={{ margin: 8 }}
                                                onClick={() => {
                                                    reset({
                                                       ...props.data 
                                                    }, {
                                                        errors: false, // errors will not be reset 
                                                        dirtyFields: false, // dirtyFields will not be reset
                                                        isDirty: false, // dirty will not be reset
                                                        isSubmitted: false,
                                                        touched: false,
                                                        isValid: false,
                                                        submitCount: false,
                                                    });
                                                }}
                                            >Làm mới</Button>
                                        ) : (
                                                <Link href="/crm/sku">
                                                    <ButtonGroup>
                                                        <Button variant="contained">Quay lại</Button>
                                                    </ButtonGroup>
                                                </Link>
                                            )
                                    }
                                </Box>
                            </Grid>
                        </Box>
                    </form>
                </Box>
            </AppCRM >
        )
    }
}