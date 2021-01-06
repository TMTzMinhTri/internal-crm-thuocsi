import Head from "next/head";
import React, { useEffect, useState } from 'react';
import Router, { useRouter } from "next/router";

import {
    Button, ButtonGroup, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Grid
} from "@material-ui/core";
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import Link from "next/link";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";

import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import AppCRM from "pages/_layout";
import { getPricingClient } from 'client/pricing';
import { condUserType, Brand, formatNumber } from 'components/global';

const useStyles = makeStyles((theme) => ({
    root: {
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}));

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

    let categoryLists = {};
    let provinceLists = {};
    let configPriceLists = [];
    let total = 0;

    let configPriceClient = getPricingClient(ctx, {});
    const res = await configPriceClient.getListConfigPrice({ q, limit, offset })

    if (res.status === 'OK') {
        if (res.data.length > 0) {
            let categoryCodes = res.data.map((item) => item.categoryCode);
            categoryCodes = new Set(categoryCodes.flat());

            let [categoryList, provinceList] = await Promise.all([
                configPriceClient.getCategoryWithArrayID([...categoryCodes]),
                configPriceClient.getProvinceLists()
            ]);
            if (categoryList.status === "OK") {
                if (categoryList.data.length > 0) {
                    categoryList.data.map((item) => { categoryLists[item.code] = { ...item } });
                }
            }
            provinceList.data.map((item) => { provinceLists[item.code] = { ...item } });
            total = res.total;
            configPriceLists = res.data;
        }
    }
    return {
        props: {
            configPriceLists,
            provinceLists,
            categoryLists,
            total,
            message: res.message
        }
    };
}

export default function ConfigPricingPage(props) {
    return renderWithLoggedInUser(props, render)
}

function render(props) {

    const classes = useStyles();
    let router = useRouter()
    let q = router.query.q || ''
    let page = parseInt(router.query.page) || 0
    let limit = parseInt(router.query.limit) || 20

    const [configPricingList, setConfigPricingList] = useState(props.configPriceLists);
    const [provinceLists, setProvinceLists] = useState(props.provinceLists);
    const [categoryLists, setCategoryLists] = useState(props.categoryLists);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setConfigPricingList(props.configPriceLists);
        setProvinceLists(props.provinceLists);
        setCategoryLists(props.categoryLists);
        setTotal(props.total);
    }, [props]);

    function typeCategorys(catagory) {
        if (catagory.length > 0) {
            const chips = catagory.map(item => {
                if (categoryLists[item]?.shortName) {
                    return <Chip size="small" label={categoryLists[item]?.shortName} variant="outlined" />;
                }
            });
            return chips;
        }
        return '---';
    }

    function provices(provi) {
        if (provi === 'All') {
            return <Chip size="small" label="All" variant="outlined" />;
        }
        if (provi.length > 0) {
            const chips = provi.map(item => {
                if (provinceLists[item]?.name) {
                    return <Chip size="small" label={provinceLists[item]?.name} variant="outlined" />;
                }
            });
            return chips;
        }
        return '---';
    }

    return (
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Danh sách cấu hình giá</title>
            </Head>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Code</TableCell>
                            <TableCell align="left">Loại khách hàng</TableCell>
                            <TableCell align="left">Danh mục</TableCell>
                            <TableCell align="left">Tỉnh/thành</TableCell>
                            <TableCell align="left">Cấp số nhân</TableCell>
                            <TableCell align="left">Cấp số cộng</TableCell>
                            <TableCell align="left">Brand</TableCell>
                            <TableCell align="left">Cập nhật</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            total ? configPricingList.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell align="left">{row.code || '---'}</TableCell>
                                    <TableCell align="left">{condUserType.find(e => e.value === row.customerType)?.label}</TableCell>
                                    <TableCell align="left" className={classes.root}>{typeCategorys(row.categoryCode)}</TableCell>
                                    <TableCell align="left">{provices(row.locationCode)}</TableCell>
                                    <TableCell align="right">{row.numMultiply}</TableCell>
                                    <TableCell align="right">{formatNumber(row.numAddition)}</TableCell>
                                    <TableCell align="left">{Brand[row.brand].value}</TableCell>
                                    <TableCell align="left">{moment(row.lastUpdatedTime).utcOffset('+0700').format("DD-MM-YYYY HH:mm:ss")}</TableCell>
                                    <TableCell align="center">
                                        <Link href={`/crm/pricing/`}>
                                            <Tooltip title="Cập nhật thông tin">
                                                <IconButton>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="left">{props.message}</TableCell>
                                    </TableRow>
                                )
                        }
                    </TableBody>
                    <MyTablePagination
                        labelUnit="Config"
                        count={total}
                        rowsPerPage={limit}
                        page={page}
                        onChangePage={(event, page, rowsPerPage) => {
                            Router.push(`/crm/pricing?page=${page}&limit=${rowsPerPage}`)
                        }}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    )
}