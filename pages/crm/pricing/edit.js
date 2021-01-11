import Head from "next/head";
import React, { useEffect, useState } from 'react';
import Router, { useRouter } from "next/router";

import {
    Button, ButtonGroup,
    Box, Divider,
    Paper,
    TextField, InputAdornment,
    Typography,
    Grid, FormControl
} from "@material-ui/core";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import styles from "./pricing.module.css"
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from "@material-ui/lab/Autocomplete";

import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import AppCRM from "pages/_layout";
import { getPricingClient } from 'client/pricing';
import { condUserType } from 'components/global';
import { Controller, useForm } from "react-hook-form";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import useDebounce from "components/useDebounce"
import { getCategoryClient } from "client/category";


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
    provinceResult.data.unshift({ name: "ALL", code: "ALL" })
    let priceData = await client.getConfigPriceByCode(query.priceCode);
    priceData.data[0].customerType = { value: priceData.data[0].customerType, label: condUserType.filter(type => type.value === priceData.data[0].customerType)[0].label }
    priceData.data[0].locationCode = priceData.data[0].locationCode.map(_code => ({ name: provinceResult.data.filter(province => province.code === _code)[0].name, code: _code }))
    let listCateProduct = await client.getCategoryWithArrayID(priceData.data[0].categoryCode)
    priceData.data[0].categoryCodes = [...listCateProduct.data]
    priceData.data[0].multiply = priceData.data[0].numMultiply
    priceData.data[0].addition = priceData.data[0].numAddition
    return {
        props: {
            provinceLists: provinceResult.data || [],
            categoryLists: categoryResult.data || [],
            data: priceData.data[0] || []
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

    const [configPricingList, setConfigPricingList] = useState(props.configPriceLists);
    const [provinceLists, setProvinceLists] = useState(props.provinceLists);
    const [categoryLists, setCategoryLists] = useState(props.categoryLists);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, errors, reset, watch, control, getValues, setValue } = useForm({ mode: 'onChange', defaultValues: props.data });
    const [searchCategory, setSearchCategory] = useState("");
    const debouncedSearchCategory = useDebounce(searchCategory, 500);

    const onSubmit = async (formData) => {
        formData.categoryCode = formData.categoryCodes.map(category => category.code)
        formData.locationCode = formData.locationCode.map(location => location.code)
        formData.customerType = formData.customerType.value
        formData.code = props.data.code
        let client = getPricingClient();
        let result = await client.updatePriceGenConfig(formData)
        if (result.status === "OK") {
            success(result.message ? 'Chỉnh sửa thành công' : 'Thông báo không xác định')
        } else {
            error(result.message || 'Thao tác không thành công, vui lòng thử lại sau')
        }
    }

    const searchCatogery = async (search) => {
        let categoryClient = getCategoryClient();
        let res = await categoryClient.getListCategoryFromClient(0, 20, search);
        if (res.status === "OK") {
            return res.data;
        }
        return [];
    };

    useEffect(() => {
        if (debouncedSearchCategory) {
            searchCatogery(debouncedSearchCategory).then((results) => {
                const parseCategory = results.map((category) => {
                    return { value: category.code, name: category.name , code:category.code };
                });
                setCategoryLists(parseCategory);
            });
        }
    }, [debouncedSearchCategory]);

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
                                <Controller
                                    render={({ onChange, ...props }) => (
                                        <Autocomplete
                                            id="customerType"
                                            size="small"
                                            options={condUserType}
                                            getOptionLabel={option => option.label}
                                            getOptionSelected={(option, value) => option.label === value.label}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Loại khách hàng"
                                                    error={!!errors.customerType}
                                                    placeholder=""
                                                    size="small"
                                                    helperText={errors.customerType?.message}
                                                    inputRef={
                                                        register({
                                                            required: "Vui lòng chọn loại khách hàng"
                                                        })
                                                    }
                                                // onChange={(e) => setSearchCategory(e.target.value)}
                                                />
                                            )}
                                            onChange={(e, data) => onChange(data)}
                                            {...props}
                                        />
                                    )}
                                    name="customerType"
                                    control={control}
                                    // onChange={([, { id }]) => id}

                                    rules={{
                                        validate: (d) => {
                                            return typeof d != "undefined";
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} />
                            <Grid item xs={12} sm={12} md={6}>
                                <Controller
                                    render={({ onChange, ...props }) => (
                                        <Autocomplete
                                            id="categoryCodes"
                                            multiple
                                            size="small"
                                            options={categoryLists}
                                            getOptionLabel={option => option.name}
                                            getOptionSelected={(value, option) => value.name === option.name}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Loại sản phẩm"
                                                    error={!!errors.categoryCodes}
                                                    placeholder=""
                                                    size="small"
                                                onChange={(e) => setSearchCategory(e.target.value)}
                                                />
                                            )}
                                            onChange={(e, data) => onChange(data)}
                                            {...props}
                                        />
                                    )}
                                    name="categoryCodes"
                                    control={control}
                                    // onChange={([, { id }]) => id}
                                    rules={{
                                        validate: (d) => {
                                            return typeof d != "undefined";
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} />
                            <Grid item xs={12} sm={12} md={6}>
                                <Controller
                                    render={({ onChange, ...props }) => (
                                        <Autocomplete
                                            id="locationCode"
                                            multiple
                                            size="small"
                                            options={provinceLists}
                                            getOptionLabel={option => option.name}
                                            getOptionSelected={(value, option) => value.name === option.name}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Tỉnh thành"
                                                    error={!!errors.locationCode}
                                                    placeholder=""
                                                    size="small"
                                                // onChange={(e) => setSearchCategory(e.target.value)}
                                                />
                                            )}
                                            onChange={(e, data) => onChange(data)}
                                            {...props}
                                        />
                                    )}
                                    name="locationCode"
                                    control={control}
                                    // onChange={([, { id }]) => id}
                                    rules={{
                                        validate: (d) => {
                                            return typeof d != "undefined";
                                        },
                                    }}
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
                                                    control={<Radio />}
                                                    label="Trong nước"
                                                />
                                                <FormControlLabel
                                                    value="FOREIGN"
                                                    control={<Radio />}
                                                    label="Ngoại nhập"
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
                                        <Button variant="contained" type="reset" style={{ margin: 8 }}>Làm mới</Button>
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