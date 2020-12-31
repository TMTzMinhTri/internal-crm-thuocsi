import {
    Button, ButtonGroup, Divider, Grid, IconButton, InputBase, Paper,
    Table, TableCell, TableContainer, TableHead, TableRow, Tooltip
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { getPricingClient } from 'client/pricing';
import { formatDateTime, formatEllipsisText, formatNumber, ProductStatus, SellPrices } from "components/global";
import TableBodyTS from "components/table/table";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./pricing.module.css";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadPricingData(ctx)
    })
}

export async function loadPricingData(ctx) {
    // Fetch data from external API
    let query = ctx.query
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit
    let q = query.q || ''

    let _client = getPricingClient(ctx, {})

    let result = { data: {}, count: 0 };
    result = await _client.getListPricing(offset, limit, q);
    let listProductData = {};
    if (result.status === 'OK') {
        if (result.data.length > 0) {
            const productCodes = result.data.map((item) => item.productCode);
            const uniqueProductCodes = new Set(productCodes);
            const listProducts = await _client.getListProductByProductCode([...uniqueProductCodes]);
            if (listProducts.status === 'OK') {
                if (listProducts.data.length > 0) {
                    listProducts.data.map((item) => {
                        listProductData[item.code] = { ...item };
                    });
                }

                return {
                    props: {
                        data: {
                            listProductData,
                            listPricingData: result.data
                        }, count: result.total
                    }
                }
            }
            return {
                props: {
                    data: result.data,
                    count: result.total
                }
            }
        }
    }
    // Pass data to the page via props
    return { props: { data: [], count: 0 } }
}

export default function PricingPage(props) {
    return renderWithLoggedInUser(props, render)
}

function render(props) {
    let router = useRouter();
    const { register, handleSubmit } = useForm();

    let page = parseInt(router.query.page) || 0;
    let limit = parseInt(router.query.limit) || 20;
    let q = router.query.q && router.query.q !== '' ? `q=${router.query.q}` : '';

    const [productList, setProductData] = useState([]);
    let [pricingList, setPricingData] = useState([]);
    let [countSelling, setCountSelling] = useState(0);
    let [search, setSearch] = useState(router.query.q || '');
    let [open, setOpen] = useState(false);

    useEffect(() => {
        setPricingData(props.data.listPricingData);
        setProductData(props.data.listProductData)
        setCountSelling(props.count);
    }, [props]);

    async function handleChange(event) {
        const target = event.target;
        const value = target.value;
        setSearch(value)
    }

    function onSearch(formData) {
        try {
            Router.push(`/crm/sku?${q}`)
        } catch (error) {
            console.log(error)
        }
    }

    function onCollapse() {
        // func set expand panel search
        setOpen(!open);
    }

    function fnSearch(data) {
        // TODO example
        alert(data)
    }

    function showType(type) {
        let a = SellPrices.filter((item) => {
            return item.value === type;
        });
        return a[0].label;
    }

    return (
        <AppCRM select="/crm/sku">
            <Head>
                <title>Danh sách cài đặt</title>
            </Head>
            <div className={styles.grid}>
                <Grid container spacing={3} direction="row"
                    justify="space-evenly"
                    alignItems="center"
                >
                    <Grid item xs={12} sm={6} md={6}>
                        <Paper component="form" className={styles.search}>
                            <InputBase
                                id="q"
                                name="q"
                                className={styles.input}
                                value={search}
                                onChange={handleChange}
                                inputRef={register}
                                onKeyPress={event => {
                                    if (event.key === 'Enter') {
                                        onSearch()
                                    }
                                }}
                                placeholder="Tìm kiếm theo tên sản phẩm"
                                inputProps={{ 'aria-label': 'Tìm kiếm theo tên sản phẩm' }}
                            />
                            <IconButton className={open === true ? styles.iconButtonHidden : styles.iconButton} aria-label="search"
                                onClick={handleSubmit(onSearch)}>
                                <SearchIcon />
                            </IconButton>
                            <Divider className={styles.divider} orientation="vertical" />
                            <IconButton className={styles.iconButton} aria-label="filter-list"
                                onClick={onCollapse}>
                                <FilterListIcon />
                            </IconButton>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <Link href="/crm/sku/new">
                            <ButtonGroup color="primary" aria-label="contained primary button group"
                                className={styles.rightGroup}>
                                <Button variant="contained" color="primary" className={styles.btnAction}>Thêm cài đặt</Button>
                            </ButtonGroup>
                        </Link>
                    </Grid>
                </Grid>
            </div>
            {
                q === '' ? (
                    <span />
                ) : (
                        <div className={styles.textSearch}>Kết quả tìm kiếm cho <i>'{search}'</i></div>
                    )
            }
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">SKU</TableCell>
                            <TableCell align="left">Tên Sản Phẩm</TableCell>
                            <TableCell align="left">Seller</TableCell>
                            <TableCell align="left">Loại</TableCell>
                            <TableCell align="right">Giá bán lẻ (đ)</TableCell>
                            <TableCell align="right">Giá bán buôn</TableCell>
                            <TableCell align="left">Cập nhật</TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBodyTS data={pricingList} message={props.message}>
                        {
                            pricingList.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell align="left">{row.sku}</TableCell>
                                    <TableCell align="left">{formatEllipsisText(productList[row.productCode]?.name)}</TableCell>
                                    <TableCell align="left">{row.sellerCode}</TableCell>
                                    <TableCell align="left">{
                                        showType(row.retailPrice.type)
                                    }</TableCell>
                                    <TableCell align="right">{formatNumber(row.retailPrice.price)}</TableCell>
                                    <TableCell align="right">
                                        array whosalePrice
                                    </TableCell>
                                    <TableCell align="left">{formatDateTime(row.lastUpdatedTime)}</TableCell>
                                    <TableCell align="center">{ProductStatus[row.status]}</TableCell>
                                    <TableCell align="center">
                                        <Link href={`/cms/sku/edit?pricingID=${row.sellPriceId}`}>
                                            <Tooltip title="Cập nhật thông tin">
                                                <IconButton>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBodyTS>
                    
                    <MyTablePagination
                        labelUnit="chỉ số"
                        count={countSelling}
                        rowsPerPage={limit}
                        page={page}
                        onChangePage={(event, page, rowsPerPage) => {
                            let qq = q ? '&' + q : '';
                            Router.push(`/crm/sku?page=${page}&limit=${rowsPerPage}${qq}`)
                        }}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    )
}