import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from 'react';
import { debounce } from "lodash";

import { Controller, useForm } from "react-hook-form";
import {
    Box, Button, ButtonGroup, Grid, IconButton, InputBase, Paper, Tooltip, FormControl,
    TextField
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import ReactSelect from "react-select";

import AppCRM from "pages/_layout";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { condUserType } from 'components/global';
import styles from "./pricing.module.css";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { getPricingClient } from 'client/pricing';

const customStylesSelectOption = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? '' : 'rgba(0, 0, 0, 0.23)',
        border: state.isFocused ? '1px solid #00b46e !important' : '',
        boxShadow: '0 0 0 #00b46e !important'
    }),
    menu: (provided, state) => ({
        ...provided,
        zIndex: 99999999,
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: "#fff",
        color: state.isFocused ? "#00b46e" : '#777'
    }),
}

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadPriceData(ctx)
    })
}

export async function loadPriceData(ctx) {
    let data = { props: {} }
    const _client = getPricingClient(ctx, {})
    const res = await _client.getListCategory('');
    if (res.status !== "OK") {
        return { props: { categoryCodeData: [] } }
    }
    data.props.categoryCodeData = res.data;
    return data;
}

export default function ConfigPricePage(props) {
    return renderWithLoggedInUser(props, render)
}

function render(props) {
    const { error, success, warn, info } = useToast();
    const [categoryCodeData, setCategoryCodeData] = useState([]);

    let initData = {
        customerType: { ...condUserType[0] }
    }

    useEffect(() => {
        setCategoryCodeData(refactorCategoryCodeData(props.categoryCodeData));
    }, [props])

    const { register, handleSubmit, setValue, errors, control, reset } = useForm({ defaultValues: initData });

    async function onSubmit(data) {
        const _client = getPricingClient();

        const categoryCodes = data.categoryCodes.map((item) => item.value);
        const customerType = data.customerType.value;
        data.categoryCodes = categoryCodes;
        data.customerType = customerType;
        data.addition = parseFloat(data.addition);
        data.multiply = parseFloat(data.multiply);
        const res = await _client.configPrice(data);
        console.log(data);
        if (res.status === "OK") {
            success('Thành công.');
        } else {
            error(res.message)
        }
    }

    function refactorCategoryCodeData(a) {
        return a.map((item) => {
            return {
                value: item.code,
                label: item.name
            }
        })
    }

    function onInputChangeCategory(e) {
        e = e || '';
        const _client = getPricingClient();
        const debouncedSearchCategory = debounce(async () => {
            const res = await _client.getListCategoryFromClient(e);
            if (res.status === "OK") {
                if (res.data.length > 0) {
                    setCategoryCodeData(refactorCategoryCodeData(res.data));
                }
            }
        }, 100);
        debouncedSearchCategory();
    }

    return (
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Danh sách cài đặt</title>
            </Head>
            <Box component={Paper} className={`${styles.gridPadding}`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3} direction="row" alignItems="center">
                        <Grid item xs={12} sm={12} md={12}>
                            <Box style={{ fontSize: 24 }}>Cấu hình giá sản phẩm</Box>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6}>
                            <FormControl className={styles.formControl} size="small" variant="outlined"
                                style={{ width: '100%' }}>
                                <label className={styles.labelSelectOption} id="department-select-label">
                                    Loại khách hàng*
                                </label>
                                <Controller
                                    as={<ReactSelect />}
                                    styles={customStylesSelectOption}
                                    instanceId
                                    value={condUserType[0]}
                                    options={condUserType}
                                    name="customerType"
                                    control={control}
                                    rules={{
                                        required: true,
                                        validate: (value) => {
                                            if (value === "") {
                                                return "Vui lòng chọn Loại khách hàng";
                                            }
                                        }
                                    }}
                                    onChange={([selected]) => {
                                        return { value: selected };
                                    }}
                                />
                                <div className={styles.alert}>
                                    <span>{errors.customerType && "⚠ Vui lòng chọn Loại khách hàng."} &nbsp;</span>
                                </div>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} className={styles.padding}></Grid>

                        <Grid item xs={12} sm={12} md={6}>
                            <FormControl className={styles.formControl} size="small" variant="outlined"
                                style={{ width: '100%' }}>
                                <label className={styles.labelSelectOption}>Loại sản phẩm*</label>
                                <Controller
                                    as={<ReactSelect onInputChange={event => onInputChangeCategory(event)} />}
                                    styles={customStylesSelectOption}
                                    instanceId
                                    isMulti
                                    defaultValue=""
                                    value={categoryCodeData[0]}
                                    options={categoryCodeData}
                                    name="categoryCodes"
                                    control={control}
                                    onChange={([selected]) => {
                                        return { value: selected };
                                    }}
                                    rules={{
                                        required: true,
                                        validate: (value) => {
                                            if (value === "") {
                                                return "Vui lòng chọn Loại sản phẩm";
                                            }
                                        }
                                    }}
                                />
                                <div className={styles.alert}>
                                    <span>{errors.categoryCodes && "⚠ Vui lòng chọn Loại sản phẩm."} &nbsp;</span>
                                </div>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} className={styles.padding}></Grid>

                        <Grid item xs={12} sm={6} md={3} className={styles.padding}>
                            <TextField
                                label="Cấp số nhân"
                                id="outlined-size-small"
                                variant="outlined"
                                size="small"
                                name="multiply"
                                type="number"
                                autoComplete="off"
                                style={{ width: '100%' }}
                                inputRef={register({
                                    required: true
                                })}
                            />
                            <div className={styles.alert}>
                                <span>{errors.multiply && "⚠ Vui lòng nhập giá trị."} &nbsp;</span>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} className={styles.padding}>
                            <TextField
                                label="Cấp số cộng"
                                id="outlined-size-small"
                                variant="outlined"
                                size="small"
                                name="addition"
                                type="number"
                                autoComplete="off"
                                style={{ width: '100%' }}
                                inputRef={register({
                                    required: true
                                })}
                            />
                            <div className={styles.alert}>
                                <span>{errors.addition && "⚠ Vui lòng nhập giá trị."} &nbsp;</span>
                            </div>
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={12} className={styles.padding}></Grid>
                        <Grid item xs={12} sm={12} md={6} className={styles.padding}>
                            <TextField
                                label="Thương hiệu"
                                id="outlined-size-small"
                                variant="outlined"
                                size="small"
                                name="brand"
                                autoComplete="off"
                                style={{ width: '100%' }}
                                inputRef={register}
                            />
                            <div className={styles.alert}>
                                <span> &nbsp;</span>
                            </div>
                        </Grid> */}

                        <Grid item xs={12} sm={12} md={12} className={styles.padding}></Grid>

                    </Grid>
                    <Grid container className={styles.padding}>
                        <Grid item xs={12} sm={6} md={6} className={`${styles.padding} ${styles.conBtn}`}>
                            <Button variant="contained" style={{ marginRight: 8 }}
                                onClick={() => reset()}
                            >
                                Reset
                            </Button>
                            <Button style={{ marginRight: 8 }}
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit(onSubmit)}
                            >
                                Lưu
                            </Button>
                            {/* <Button
                                variant="contained"
                                color="primary"
                                onClick={() => router.back()}
                            >
                                Quay lại
                            </Button> */}
                        </Grid>

                    </Grid>
                </form>



            </Box>
        </AppCRM>
    )
}