import {
    Box, Button, ButtonGroup,
    Divider,
    FormControl, Grid, Paper,
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
import AppCRM from "pages/_layout";
import Link from "next/link";
import React, { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import styles from "./pricing.module.css";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadConfigPricingData(ctx)
    })
}

export async function loadConfigPricingData(ctx) {
    let query = ctx.query
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
        const { error, success } = useToast()
        const [provinceLists] = useState(props.provinceLists);
        const [categoryLists] = useState(props.categoryLists);
        const { register, handleSubmit, errors, control } = useForm({ mode: 'onSubmit', defaultValues: props.data });
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
            return null;
        };

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
                                <Grid item xs={12} sm={12} md={4}>
                                    <Typography gutterBottom>
                                        <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                            Loại khách hàng<span style={{color: 'red'}}>*</span>:
                                        </FormLabel>
                                    </Typography>
                                    <MuiSingleAuto
                                        id="customerType"
                                        options={condUserType}
                                        // label="Loại khách hàng"
                                        control={control}
                                        placeholder="Chọn"
                                        errors={errors}
                                        name="customerType"
                                        message="Vui lòng chọn"
                                        required={true}
                                    />

                                </Grid>
                                <Grid item xs={12} sm={12} md={12} />
                                <Grid item xs={12} sm={12} md={6}>
                                    <Typography gutterBottom>
                                        <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                            Loại sản phẩm<span style={{color: 'red'}}>*</span>:
                                        </FormLabel> 
                                    </Typography>
                                    <MuiMultipleAuto
                                        id="categoryCodes"
                                        options={[...categoryLists.map(category => {
                                            return { label: category.name, value: category.code }
                                        })]}
                                        // label="Loại sản phẩm"
                                        name="categoryCodes"
                                        message="Vui lòng chọn"
                                        placeholder="Chọn"
                                        control={control}
                                        errors={errors}
                                        onFieldChange={searchCatogery}
                                        required={true}
                                    />
                                    
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} />
                                <Grid item xs={12} sm={12} md={6}>
                                    <Typography gutterBottom>
                                        <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                            Tỉnh thành<span style={{color: 'red'}}>*</span>:
                                        </FormLabel> 
                                    </Typography>
                                    <MuiMultipleAuto
                                        id="locationCode"
                                        options={[...provinceLists.map(category => {
                                            return { label: category.name, value: category.code }
                                        })]}
                                        // label="Tỉnh/thành"
                                        name="locationCode"
                                        placeholder="Chọn"
                                        control={control}
                                        errors={errors}
                                        message="Vui lòng chọn"
                                        required={true}
                                    />
                                    
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} style={{ marginTop: '10px' }}>
                                    <FormControl component="fieldset" className={styles.marginTopBottom}>
                                    <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>Nơi bán</FormLabel>
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
                                <Grid container item xs={12} sm={12} md={12} spacing={3}>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Typography gutterBottom>
                                            <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                                Hệ số<span style={{color: 'red'}}>*</span>:
                                            </FormLabel> 
                                        </Typography>
                                        <TextField
                                            id="value"
                                            name="value"
                                            variant="outlined"
                                            size="small"
                                            type="number"
                                            placeholder=""
                                            helperText={errors.value?.message}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{ width: '100%' }}
                                            error={!!errors.value}
                                            helperText={errors.value?.message}
                                            required
                                            inputRef={
                                                register({
                                                    required: "Vui lòng nhập",
                                                    valueAsNumber: true,
                                                    max: {
                                                        value: 200,
                                                        message: "Hệ số tối đa là 200"
                                                    },
                                                    min: {
                                                        value: 0,
                                                        message: "Hệ số tối thiểu là 1"
                                                    }
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
                                <Link href="/crm/sku">
                                    <ButtonGroup>
                                        <Button variant="contained">Quay lại</Button>
                                    </ButtonGroup>
                                </Link>     
                                </Box>
                            </Grid>
                        </Box>
                    </form>
                </Box>
            </AppCRM >
        )
    }
}