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
import { Brand, condUserType } from 'components/global';
import MuiMultipleAuto from "components/muiauto/multiple";
import MuiSingleAuto from "components/muiauto/single";
import Head from "next/head";
import Link from "next/link";
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
    return {
        props: {
            provinceLists: provinceResult.data || [],
            categoryLists: categoryResult.data || [],
            // total,
        }
    };
}

export default function ConfigPricingPage(props) {
    return renderWithLoggedInUser(props, render)
}

function render(props) {

    let router = useRouter()
    const { error, success } = useToast()
    // const [configPricingList, setConfigPricingList] = useState(props.configPriceLists);
    const [provinceLists, setProvinceLists] = useState(props.provinceLists);
    const [categoryLists, setCategoryLists] = useState(props.categoryLists);
    // const [total, setTotal] = useState(0);
    // const [loading, setLoading] = useState(true);
    const { register, handleSubmit, errors, reset, control } = useForm({
        mode: 'onSubmit',
        defaultValues: {
            addition: 5000,
            brand: "LOCAL",
            categoryCode: [],
            categoryCodes: [],
            locationCode: [],
            multiply: 2,
            numAddition: 5000,
            numMultiply: 1,
            customerType: condUserType[0]
        }
    });
    const [searchCategory, setSearchCategory] = useState("");

    const onSubmit = async (formData) => {
        console.log(formData)
        formData.categoryCode = formData.categoryCodes.map(category => category.value)
        formData.locationCode = formData.locationCode.map(location => location.value)
        formData.customerType = formData.customerType.value
        let client = getPricingClient();
        let result = await client.createNewPriceGenConfig(formData)
        if (result.status === "OK") {
            success('Tạo mới thành công')
            router.push(`/crm/pricing/edit?priceCode=${result.data[0].code}`)
        } else {
            error(result.message || 'Thao tác không thành công, vui lòng thử lại sau')
        }
    }

    const searchCatogery = async (search) => {
        let categoryClient = getCategoryClient();
        let res = await categoryClient.getListCategoryFromClient(0, 100, search);
        if (res.status === "OK") {
            return res.data.map((category) => {
                return { label: category.name, value: category.code };
            });
        }
        return [];
    };

    return (
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Cài đặt giá mới</title>
            </Head>
            <Box component={Paper} display="block">
                <form noValidate>
                    <Box className={styles.contentPadding}>
                        <Box style={{ fontSize: 30, margin: 5 }}>Cài đặt giá mới</Box>
                        <Grid container spacing={2} style={{ padding: '10px' }}>
                            <Grid item xs={12} md={12} sm={12} />
                            <Grid item xs={12} sm={12} md={2}>
                                <MuiSingleAuto
                                    id="customerType"
                                    options={condUserType}
                                    label="Loại khách hàng"
                                    control={control}
                                    errors={errors}
                                    name="customerType"
                                    message="Vui lòng chọn"
                                    required={true}
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
                                <MuiMultipleAuto
                                    id="locationCode"
                                    options={[...provinceLists.map(category => {
                                        return { label: category.name, value: category.code }
                                    })]}
                                    label="Tỉnh/thành"
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
                                    <FormLabel component="legend" style={{color: 'black !important'}}>Nơi bán</FormLabel>
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
                                        Hệ số nhân(*):
                            </Typography>
                                    <TextField
                                        id="multiply"
                                        name="multiply"
                                        size="small"
                                        type="number"
                                        placeholder=""
                                        defaultValue={2}
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
                                                max: {
                                                    value: 200,
                                                    message: "Hệ số tối đa là 200"
                                                },
                                                min: {
                                                    value: 1,
                                                    message: "Hệ số tối thiểu là 1"
                                                }
                                            })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={5}>
                                    <Typography gutterBottom>
                                        Hệ số cộng(*):
                                    </Typography>
                                    <TextField
                                        id="addition"
                                        name="addition"
                                        size="small"
                                        type="number"
                                        placeholder=""
                                        defaultValue={5000}
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
                                                max: {
                                                    value: 100000000,
                                                    message: "Hệ số tối đa là 100,000,000"
                                                },
                                                min: {
                                                    value: 0,
                                                    message: "Hệ số tối thiểu là 0"
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
                                    onClick={handleSubmit(onSubmit)}
                                    style={{ margin: 8 }}>
                                    Lưu
                                </Button>
                                {
                                    typeof props.product === "undefined" ? (
                                        <Button variant="contained" type="reset" style={{ margin: 8 }}
                                        onClick={() => {
                                            reset();
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
