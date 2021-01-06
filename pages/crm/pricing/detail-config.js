import Head from "next/head";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import Router, { useRouter } from "next/router";

import {
    Box, Button, Grid, Paper, TextField
} from "@material-ui/core";
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import moment from "moment";

import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import styles from "./pricing.module.css";
import AppCRM from "pages/_layout";
import { getPricingClient } from 'client/pricing';
import { condUserType, Brand, formatNumber } from 'components/global';
import DefaultErrorPage from 'next/error'

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadConfigPriceData(ctx)
    })
}

export async function loadConfigPriceData(ctx) {

    let categoryLists = {};
    let provinceLists = {};
    let configPrice = [];
    const _priceAPI = getPricingClient(ctx, {})
    const query = ctx.query;
    const priceCode = query.priceCode || '';
    const res = await _priceAPI.getConfigPriceByID(priceCode);
    if (res.status === 'OK') {
        if (res.data.length > 0) {
            let categoryCodes = res.data.map((item) => item.categoryCode);
            categoryCodes = new Set(categoryCodes.flat());

            let [categoryList, provinceList] = await Promise.all([
                _priceAPI.getCategoryWithArrayID([...categoryCodes]),
                _priceAPI.getProvinceLists()
            ]);
            if (categoryList.status === "OK") {
                if (categoryList.data.length > 0) {
                    categoryList.data.map((item) => { categoryLists[item.code] = { ...item } });
                }
            }
            provinceList.data.map((item) => { provinceLists[item.code] = { ...item } });
            configPrice = res.data[0];
        }
    }
    return {
        props: {
            configPrice,
            provinceLists,
            categoryLists,
            message: res.message,
            status: res.status
        }
    };
}

export default function ConfigPriceDetailPage(props) {
    return renderWithLoggedInUser(props, render)
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}));

function render(props) {

    const [configPricing, setConfigPricing] = useState(props.configPrice);
    const [provinceLists, setProvinceLists] = useState(props.provinceLists);
    const [categoryLists, setCategoryLists] = useState(props.categoryLists);

    const classes = useStyles();
    const router = useRouter();

    useEffect(() => {
        setConfigPricing(props.configPrice);
        setProvinceLists(props.provinceLists);
        setCategoryLists(props.categoryLists);
    }, [props]);

    function typeCategorys(catagory) {
        if (catagory?.length > 0) {
            const chips = catagory.map((item, i) => {
                if (categoryLists[item]?.shortName) {
                    return <Chip key={i} label={categoryLists[item]?.shortName} variant="outlined" />;
                }
            });
            return chips;
        }
        return 'Không có danh mục.';
    }

    function provices(provi) {
        if (provi?.length > 0) {
            if (provi[0] === 'ALL') {
                return <Chip label="All" variant="outlined" />;
            }
            const chips = provi.map((item, i) => {
                if (provinceLists[item]?.name) {
                    return <Chip key={i} label={provinceLists[item]?.name} variant="outlined" />;
                }
            });
            return chips;
        }
        return 'Không có tỉnh thành.';
    }

    return (
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Thông tin chi tiết của 1 Gen config price</title>
            </Head>
            {
                props.status === 'OK' ? (
                    <Box component={Paper} className={`${styles.padding12}`}>
                        <Grid container direction="row" alignItems="center" style={{ height: 'auto' }}>

                            <Grid item xs={12} sm={12} md={12}>
                                <Box style={{ fontSize: 24, marginBottom: 20 }} >Thông tin chi tiết Gen config</Box>
                            </Grid>
                            <Grid item xs={12} sm={9} md={6}>
                                <hr/>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}></Grid>
                            <Grid item xs={12} sm={5} md={3}>
                                <TextField
                                    inputProps={{
                                        readOnly: true,
                                        disabled: true,
                                    }}
                                    label="Code"
                                    size="small"
                                    value={configPricing.code}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{ margin: 12 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={5} md={3}>
                                <TextField
                                    inputProps={{
                                        readOnly: true,
                                        disabled: true,
                                    }}
                                    label="Loại khách hàng"
                                    size="small"
                                    value={condUserType.find(e => e.value === configPricing.customerType)?.label}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{ margin: 12 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={9} md={12}></Grid>
                            <Grid item xs={12} sm={5} md={3}>
                                <TextField
                                    inputProps={{
                                        readOnly: true,
                                        disabled: true,
                                    }}
                                    label="Hệ số nhân"
                                    size="small"
                                    value={configPricing.numMultiply}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{ margin: 12 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={5} md={3}>
                                <TextField
                                    inputProps={{
                                        readOnly: true,
                                        disabled: true,
                                    }}
                                    label="Hệ số cộng"
                                    size="small"
                                    value={formatNumber(configPricing.numAddition)}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{ margin: 12 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={9} md={12}></Grid>

                            <Grid item xs={12} sm={5} md={3}>
                                <TextField
                                    inputProps={{
                                        readOnly: true,
                                        disabled: true,
                                    }}
                                    label="Brand"
                                    size="small"
                                    value={Brand[configPricing.brand].value}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{ margin: 12 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={5} md={3}>
                                <TextField
                                    inputProps={{
                                        readOnly: true,
                                        disabled: true,
                                    }}
                                    label="Thời gian cập nhật"
                                    size="small"
                                    value={moment(configPricing.lastUpdatedTime).utcOffset('+0700').format("DD-MM-YYYY HH:mm:ss")}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{ margin: 12 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={9} md={12}></Grid>

                            <Grid item xs={12} sm={9} md={6}>
                                <div style={{ margin: 12 }}>
                                    <label className={styles.labelDetail}>
                                        Danh mục:
                            </label>
                                    <div className={classes.root}>
                                        {
                                            typeCategorys(configPricing.categoryCode)
                                        }
                                    </div>
                                </div>
                            </Grid>

                            <Grid item xs={12} sm={9} md={7}>
                                <div style={{ margin: 12 }}>
                                    <label className={styles.labelDetail}>
                                        Tỉnh thành:
                            </label>
                                    <div className={classes.root}>
                                        {
                                            provices(configPricing.locationCode)
                                        }
                                    </div>
                                </div>
                            </Grid>

                            <Grid item xs={12} sm={9} md={6}>
                                <hr/>
                            </Grid>
                            <Grid item xs={12} sm={9} md={12}></Grid>
                            <Grid item xs={12} sm={9} md={6} container justify={'flex-end'} style={{ marginTop: 12 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => router.back()}
                                >
                                    Quay lại
                                    </Button>
                            </Grid>
                            <Grid item xs={12} sm={9} md={12}></Grid>
                        </Grid>
                    </Box>
                ) :
                    <div className={styles.height404}>
                        <div>
                            <span>Không tìm thấy kết quả | </span>
                            <Link href={`/crm/pricing`}>
                                Quay lại trang danh sách
                            </Link>
                        </div>
                    </div>
            }
        </AppCRM>
    )
}