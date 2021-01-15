import {
    Button, ButtonGroup,
    Grid, InputBase, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow
} from "@material-ui/core";
import Chip from '@material-ui/core/Chip';
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from '@material-ui/icons/Search';
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { getPricingClient } from 'client/pricing';
import { Brand, condUserType, formatEllipsisText, formatNumber, formatUrlSearch } from 'components/global';
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import styles from "./pricing.module.css";


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
            categoryCodes = [...categoryCodes].filter(item => item !== null)
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
            // message: res.message,
            message: "Không tìm thấy kết quả phù hợp"
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
    let [search, setSearch] = useState(q)
    let page = parseInt(router.query.page) || 0
    let limit = parseInt(router.query.limit) || 20

    const [configPricingList, setConfigPricingList] = useState(props.configPriceLists);
    const [provinceLists, setProvinceLists] = useState(props.provinceLists);
    const [categoryLists, setCategoryLists] = useState(props.categoryLists);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, errors } = useForm();

    async function handleChange(event) {
        const target = event.target;
        const value = target.value;
        setSearch(value)
    }

    function onSearch() {
        q = formatUrlSearch(search)
        router.push(`?q=${q}`)
    }

    useEffect(() => {
        setConfigPricingList(props.configPriceLists);
        setProvinceLists(props.provinceLists);
        setCategoryLists(props.categoryLists);
        setTotal(props.total);
    }, [props]);

    function typeCategorys(catagory) {
        if (catagory?.length > 0) {
            const chips = catagory.map((item, i) => {
                if (categoryLists[item]?.name) {
                    return <Chip className={styles.chipCaterogy} key={i} size="small" label={ formatEllipsisText(categoryLists[item]?.name, 30) } variant="outlined" />;
                }
            });
            return chips;
        }
        return 'Không có danh mục.';
    }

    function provices(provi) {
        if (provi?.length > 0) {
            if (provi[0] === 'ALL') {
                return <Chip size="small" label="Tất cả" variant="outlined" />;
            }
            const chips = provi.map((item, i) => {
                if (provinceLists[item]?.name) {
                    return <Chip className={styles.chipCaterogy} key={i} size="small" label={provinceLists[item]?.name} variant="outlined" />;
                }
            });
            return chips;
        }
        return 'Không có tỉnh thành.';
    }

    return (
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Danh sách cấu hình giá</title>
            </Head>
            <div className={styles.grid}>
                <Grid container spacing={3} direction="row"
                    justify="space-evenly"
                    alignItems="center"
                >
                    <Grid item xs={12} sm={6} md={6}>
                        <Paper className={styles.search}>
                            <InputBase
                                id="q"
                                name="q"
                                className={styles.input}
                                value={search}
                                onChange={handleChange}
                                onKeyPress={event => {
                                    if (event.key === 'Enter' || event.keyCode === 13) {
                                        onSearch()
                                    }
                                }}
                                inputRef={register}
                                placeholder="Tìm kiếm giá"
                                inputProps={{ 'aria-label': 'Tìm kiếm giá' }}
                            />
                            <IconButton className={styles.iconButton} aria-label="search"
                                onClick={handleSubmit(onSearch)}>
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Link href="/crm/pricing/new">
                            <ButtonGroup color="primary" aria-label="contained primary button group"
                                className={styles.rightGroup}>
                                <Button variant="contained" color="primary">Thêm giá mới</Button>
                            </ButtonGroup>
                        </Link>
                    </Grid>
                </Grid>
            </div>

            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <colgroup>
                        <col width="10%"/>
                        <col width="10%"/>
                        <col width="20%"/>
                        <col width="20%"/>
                        <col width="10%"/>
                        <col width="5%"/>
                        <col width="5%"/>
                        <col width="15%"/>
                        <col width="5%"/>
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Code</TableCell>
                            <TableCell align="left">Loại khách hàng</TableCell>
                            <TableCell align="left">Danh mục</TableCell>
                            <TableCell align="left">Tỉnh/thành</TableCell>
                            <TableCell align="right">Hệ số nhân</TableCell>
                            <TableCell align="right">Hệ số cộng</TableCell>
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
                                        <Link href={`/crm/pricing/edit?priceCode=${row.code}`}>
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
                        labelUnit="Cấu hình giá"
                        count={total}
                        rowsPerPage={limit}
                        page={page}
                        onChangePage={(event, page, rowsPerPage) => {
                            Router.push(`/crm/pricing?page=${page}&limit=${rowsPerPage}&q=${q}`)
                        }}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    )
}