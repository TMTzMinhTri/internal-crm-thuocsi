import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Box,
    Button,
    Grid,
    IconButton,
    InputBase,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { MyCard, MyCardActions, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { getPricingClient } from 'client/pricing';
import { getSellerClient } from "client/seller";
import { formatDateTime, formatNumber, formatUrlSearch, ProductStatus, SellPrices } from "components/global";
import { SkuActiveFilter } from "containers/crm/sku/active/SkuActiveFilter";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from "react";
import styles from "./pricing.module.css";
import { getFirstImage } from "./request";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadPricingData(ctx);
    });
}

export async function loadPricingData(ctx) {
    const query = ctx.query;
    const page = query.page || 0;
    const limit = query.limit || 20;
    const offset = page * limit;
    const q = query.q || '';
    const props = {
        data: [],
        count: 0,
        statuses: {},
        message: "",
    };

    try {
        const pricingClient = getPricingClient(ctx, {});
        const pricingResp = await pricingClient.getListPricingByFilter({ status: "ACTIVE", q, offset, limit });
        if (pricingResp.status === 'OK') {
            props.data = pricingResp.data ?? [];
            props.count = pricingResp.total;
        } else {
            if (pricingResp.status === 'NOT_FOUND') {
                props.message = "Không tìm thấy kết quả phù hợp";
            } else {
                props.message = pricingResp.message;
            }
            return { props };
        }

        const productCodes = [];
        pricingResp.data.forEach(sku => {
            if (!productCodes.find(code => sku.productCode === code)) {
                productCodes.push(sku.productCode);
            }
        });
        const listProductsResp = await pricingClient.getListProductByProductCode(productCodes);
        if (listProductsResp.status === 'OK') {
            props.data = props.data.map(sku => ({
                ...sku,
                product: listProductsResp.data.find(product => product.code === sku.productCode) ?? {},
            }));
            props.statuses = pricingResp.data.reduce((acc, cur) => {
                acc[cur.sellPriceCode] = cur.status;
                return acc;
            }, {});
        } else {
            props.message = listProductsResp.message;
        }

        const sellerCodes = [];
        pricingResp.data.forEach(sku => {
            if (!sellerCodes.find(code => sku.sellerCode === code)) {
                sellerCodes.push(sku.sellerCode);
            }
        });
        const sellerClient = getSellerClient(ctx, {});
        const sellerResp = await sellerClient.getSellerBySellerCodes(sellerCodes);
        if (sellerResp.status === "OK") {
            props.data = props.data.map(sku => ({
                ...sku,
                seller: sellerResp.data.find(seller => seller.code === sku.sellerCode) ?? {},
            }));
        } else {
            props.message = sellerResp.message;
        }

    } catch (e) {
        props.message = e.message;
    }
    return { props };
}

async function getPricingDataByFilter(data, limit, offset) {
    const res = {
        pricingData: [],
        total: 0,
        message: "",
        statuses: {},
    };
    try {
        const pricingClient = getPricingClient();
        const pricingResp = await pricingClient.getListPricingByFilterFromClient({ ...data, status: "ACTIVE", limit, offset });
        if (pricingResp.status !== "OK") {
            if (pricingResp.status === 'NOT_FOUND') {
                res.message = "Không tìm thấy kết quả phù hợp";
            } else {
                res.message = pricingResp.message;
            }
            return res;
        }
        res.pricingData = pricingResp.data ?? [];
        res.statuses = pricingResp.data.reduce((acc, cur) => {
            acc[cur.sellPriceCode] = cur.status;
            return acc;
        }, {});
        res.total = pricingResp.total;

        const productCodes = [];
        res.pricingData.forEach(sku => {
            if (!productCodes.find(code => sku.productCode === code)) {
                productCodes.push(sku.productCode);
            }
        });
        const listProductsResp = await pricingClient.getListProductByProductCodeFromClient(productCodes);
        if (listProductsResp.status === "OK") {
            res.pricingData = res.pricingData.map(sku => ({
                ...sku,
                product: listProductsResp.data.find(product => product.code === sku.productCode) ?? {},
            }));
        } else {
            res.message = listProductsResp.message;
        }

        const sellerCodes = [];
        pricingResp.data.forEach(sku => {
            if (!sellerCodes.find(code => sku.sellerCode === code)) {
                sellerCodes.push(sku.sellerCode);
            }
        });
        const sellerClient = getSellerClient();
        const sellerResp = await sellerClient.getSellerBySellerCodesClient(sellerCodes);
        if (sellerResp.status === "OK") {
            res.pricingData = res.pricingData.map(sku => ({
                ...sku,
                seller: sellerResp.data.find(seller => seller.code === sku.sellerCode) ?? {},
            }));
        } else {
            res.message = sellerResp.message;
        }

    } catch (e) {
        res.message = e.message;
    }
    return res;
}

export default function PricingPage(props) {
    return renderWithLoggedInUser(props, render);
}

const breadcrumb = [
    {
        name: "Trang chủ",
        link: "/crm"
    },
    {
        name: "Danh sách sku"
    },
];

const statusColor = {
    "NEW": "blue",
    "ACTIVE": "green",
    "INACTIVE": "grey"
};

function render(props) {
    let router = useRouter();

    const [skus, setSkus] = useState(props.data ?? []);
    const [message, setMessage] = useState(props.message);
    const [openSkuFilter, setOpenSkuFilter] = useState(false);
    const [skuFilter, setSkuFilter] = useState();
    const [pagination, setPagination] = useState({
        page: parseInt(router.query.page) || 0,
        limit: parseInt(router.query.limit) || 20,
        count: props.count,
    });
    const { limit, page, count } = pagination;

    let [searchText, setSearchText] = useState(router.query.q || '');
    const [statuses, setStatuses] = useState(props.statuses);

    useEffect(() => {
        setSkus(props.data);
        setMessage(props.message);
        setStatuses(props.statuses);
    }, [props.data, props.message, props.statuses]);

    useEffect(() => {
        setPagination({
            page: parseInt(router.query.page) || 0,
            limit: parseInt(router.query.limit) || 20,
            count: props.count,
        });
    }, [router.query.page, router.query.limit, props.count]);
    useEffect(() => {
        setSearchText(router.query.q || '');
    }, [router.query.q]);

    const handleApplyFilter = async (data) => {
        setSkuFilter(data);
        const { pricingData, message, total, statuses } = await getPricingDataByFilter(data, limit, 0);
        if (message) setMessage(message);
        setSkus(pricingData);
        setStatuses(statuses);
        setPagination({
            limit,
            page: 0,
            count: total,
        });
        Router.replace("/crm/sku", "/crm/sku", {
            shallow: true,
        });
    };

    function showType(type) {
        let a = SellPrices.filter((item) => {
            return item.value === type;
        });
        if (typeof a !== 'undefined' && a.length > 0) {
            return a[0]?.label;
        }
        return "Chưa cập nhật";
    }

    async function searchSku() {
        const q = formatUrlSearch(searchText);
        router.push(`?limit${limit}&q=${q}`);
    }

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            searchSku();
        }
    };

    const handlePageChange = async (event, page, rowsPerPage) => {
        if (openSkuFilter && skuFilter) {
            const { pricingData, message, total, statuses } = await getPricingDataByFilter(skuFilter, rowsPerPage, page);
            if (message) setMessage(message);
            setSkus(pricingData);
            setStatuses(statuses);
            setPagination({
                limit: rowsPerPage,
                page,
                count: total,
            });
        } else {
            Router.push(`/crm/sku?page=${page}&limit=${rowsPerPage}&q=${searchText}`);
        }
    };

    return (
        <AppCRM select="/crm/sku" breadcrumb={breadcrumb}>
            <Head>
                <title>Danh sách sku</title>
            </Head>
            <MyCard>
                <MyCardHeader title="Danh sách sku" >
                    <Button variant="contained" color="primary" style={{ marginRight: 8 }}
                        onClick={() => setOpenSkuFilter(!openSkuFilter)}
                    >
                        <FontAwesomeIcon icon={faFilter} style={{ marginRight: 8 }} />
                        Bộ lọc
                    </Button>
                </MyCardHeader>
                <Box display={!openSkuFilter ? "block" : "none"}>
                    <MyCardActions>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={4}>
                                <Paper className={styles.search} style={{ width: '100%' }}>
                                    <InputBase
                                        id="q"
                                        name="q"
                                        className={styles.input}
                                        value={searchText}
                                        autoComplete='off'
                                        onChange={(e) => setSearchText(e.target.value)}
                                        onKeyPress={handleSearch}
                                        placeholder="Nhập tên sản phẩm, mã sku, tên nhà bán hàng,..."
                                    />
                                    <IconButton className={styles.iconButton} aria-label="search"
                                        onClick={searchSku}>
                                        <SearchIcon />
                                    </IconButton>
                                </Paper>
                            </Grid>
                        </Grid>
                    </MyCardActions>
                </Box>
                <SkuActiveFilter
                    open={openSkuFilter}
                    onFilterChange={handleApplyFilter}
                    q={searchText}
                    onClose={({ q }) => setSearchText(q)}
                />
            </MyCard>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <colgroup>
                        <col/>
                        <col width="10%" />
                        <col width="20%" />
                        <col width="20%" />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">SKU</TableCell>
                            <TableCell align="center">Hình ảnh</TableCell>
                            <TableCell align="left">Tên Sản Phẩm</TableCell>
                            <TableCell align="left">Nhà bán hàng</TableCell>
                            <TableCell align="left">Loại</TableCell>
                            <TableCell align="right">Giá bán lẻ</TableCell>
                            <TableCell align="left">Ngày cập nhật</TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {skus.length > 0 ? (
                        <TableBody>
                            {skus.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell align="left">{row.sku}</TableCell>
                                    <TableCell align="center">
                                        <Image src={getFirstImage(row.product.imageUrls)} title="image" alt="image" width={100} height={100} objectFit="contain" />
                                    </TableCell>
                                    <TableCell align="left">{row.product.name || '-'}</TableCell>
                                    <TableCell>{row.seller?.code ? (row.seller?.code + ' - ' + row.seller?.name) : row.sellerCode}</TableCell>
                                    <TableCell align="left">{
                                        showType(row.retailPrice.type)
                                    }</TableCell>
                                    <TableCell align="right">{formatNumber(row.retailPrice.price)}</TableCell>
                                    <TableCell align="left">{formatDateTime(row.lastUpdatedTime)}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="outlined" disabled
                                            size="small"
                                            style={{ color: `${statusColor[row.status]}`, borderColor: `${statusColor[row.status]}`, width: '150px' }}>
                                            {typeof (row.sellPriceCode) !== 'undefined' ? ProductStatus[statuses[row.sellPriceCode]] : 'Chưa xác định'}
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Link href={`/crm/sku/edit?sellPriceCode=${row.sellPriceCode}`}>
                                            <Tooltip title="Cập nhật thông tin">
                                                <IconButton>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={3} align="left">{message}</TableCell>
                            </TableRow>
                        </TableBody>
                    )}
                    <MyTablePagination
                        labelUnit="sku"
                        count={count}
                        rowsPerPage={limit}
                        page={page}
                        onChangePage={handlePageChange}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    );
}