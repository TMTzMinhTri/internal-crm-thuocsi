import Head from "next/head";
import React, { useEffect, useState } from 'react';
import Router, { useRouter } from "next/router";
import Link from "next/link";
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
// import Chip from '@material-ui/core/Chip';
// import { makeStyles } from '@material-ui/core/styles';
// import Autocomplete from "@material-ui/lab/Autocomplete";

import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import AppCRM from "pages/_layout";
import { condUserType, noOptionsText, Brand } from 'components/global';
import { getPricingClient } from 'client/pricing';
import { Controller, useForm } from "react-hook-form";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import useDebounce from "components/useDebounce"
import { getCategoryClient } from "client/category";
import { MuiAuto, SingleAuto } from "components/mul-single-autocomplete/mul-single-auto"

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

    const [configPricingList, setConfigPricingList] = useState(props.configPriceLists);
    const [provinceLists, setProvinceLists] = useState(props.provinceLists);
    const [categoryLists, setCategoryLists] = useState(props.categoryLists);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, errors, reset, watch, control, getValues, setValue } = useForm({ mode: 'onChange' });
    const [searchCategory, setSearchCategory] = useState("");
    const debouncedSearchCategory = useDebounce(searchCategory, 200);

    const onSubmit = async (formData) => {
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
            return res.data;
        }
        return res;
    };

    useEffect(() => {
        if (debouncedSearchCategory) {
            searchCatogery(debouncedSearchCategory).then((results) => {
                const parseCategory = results.map((category) => {
                    return { value: category.code, name: category.name, code: category.code };
                });
                setCategoryLists(parseCategory);
            });
        }
    }, [debouncedSearchCategory, searchCategory]);

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
                                <SingleAuto
                                    id="customerType"
                                    options={condUserType}
                                    label="Loại khách hàng"
                                    control={control}
                                    errors={errors}
                                    name="customerType"
                                    width="250px"
                                />

                            </Grid>
                            <Grid item xs={12} sm={12} md={12} />
                            <Grid item xs={12} sm={12} md={6}>
                                <MuiAuto
                                    id="categoryCodes"
                                    options={[...categoryLists.map(category => {
                                        return { label: category.name, value: category.code }
                                    })]}
                                    label="Loại sản phẩm"
                                    name="categoryCodes"
                                    control={control}
                                    errors={errors}
                                    onFieldChange={searchCatogery}
                                />
                                {/* <Controller
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
                                            noOptionsText={noOptionsText}
                                            filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Loại sản phẩm"
                                                    error={!!errors.categoryCodes}
                                                    placeholder=""
                                                    inputRef={
                                                        register({
                                                            required: "Loại sản phẩm không thể để trống",
                                                        })
                                                    }
                                                    required
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
                                /> */}
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} />
                            <Grid item xs={12} sm={12} md={6}>
                                <MuiAuto
                                    id="locationCode"
                                    options={[...provinceLists.map(category => {
                                        return { label: category.name, value: category.code }
                                    })]}
                                    label="Tỉnh/thành"
                                    name="locationCode"
                                    control={control}
                                    errors={errors}
                                // onFieldChange={setProvinceLists}
                                />
                                {/* <Controller
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
                                            noOptionsText={noOptionsText}
                                            filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Tỉnh thành"
                                                    error={!!errors.locationCode}
                                                    helperText={errors.provinceCode?.message}
                                                    placeholder=""
                                                    size="small"
                                                    inputRef={
                                                        register({
                                                            required: "Tỉnh/ Thành phố không thể để trống",
                                                        })
                                                    }
                                                    required
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
                                /> */}
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
                                <Link href="/crm/http://localhost:3000/crm/sku">
                                    <ButtonGroup>
                                        <Button variant="contained">Quay lại</Button>
                                    </ButtonGroup>
                                </Link>
                                {/* {
                                    typeof props.product === "undefined" ? (
                                        <Button variant="contained" type="reset" style={{ margin: 8 }}>Làm mới</Button>
                                    ) : (
                                            <Link href="/crm/sku">
                                                <ButtonGroup>
                                                    <Button variant="contained">Quay lại</Button>
                                                </ButtonGroup>
                                            </Link>
                                        )
                                } */}
                            </Box>
                        </Grid>
                    </Box>
                </form>
            </Box>
        </AppCRM >
    )
}