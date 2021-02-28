import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Box, Button,


    FormControl, FormLabel,
    Grid, IconButton,


    InputBase, MenuItem, Paper,


    Select, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,

    TextField, Tooltip,
    Typography
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { MyCard, MyCardActions, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import ModalCustom from "@thuocsi/nextjs-components/simple-dialog/dialogs";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getPriceClient } from "client/price";
import { getPricingClient } from 'client/pricing';
import { formatDateTime, formatNumber, formatUrlSearch, ProductStatus, SellPrices, SkuStatuses } from "components/global";
import { SkuFilter } from "containers/crm/sku/SkuFilter";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
    let mixData = {}
    if (result.status === 'OK') {
        if (result.data.length > 0) {
            const productCodes = result.data.map((item) => item.productCode);
            const listProducts = await _client.getListProductByProductCode(productCodes);
            if (listProducts.status === 'OK') {
                mixData = result.data.map(t1 => ({ ...t1, ...listProducts.data.find(t2 => t2.code === t1.productCode) }))
                let statuses = {}
                result.data?.forEach(e => {
                    statuses[e.sellPriceCode] = e.status
                });
                return { props: { data: mixData, statuses: statuses, count: result.total } }
            }


            return {
                props: {
                    data: result.data,
                    count: result.total,
                    statuses: {}
                }
            }
        }
    }
    // Pass data to the page via props
    return { props: { data: [], count: 0, message: "Không tìm thấy kết quả phù hợp" } }
}

async function getPricingDataByFilter(data, limit, offset) {
    const res = {
        pricingData: [],
        total: 0,
        message: "",
        statuses: {},
    }
    try {
        const pricingClient = getPricingClient();
        const pricingResp = await pricingClient.getListPricingByFilter({ ...data, limit, offset });
        if (pricingResp.status !== "OK") {
            if (pricingResp.status === 'NOT_FOUND') {
                res.message = "Không tìm thấy kết quả phù hợp";
            } else {
                res.message = pricingResp.message;
            }
        } else {
            
            const productCodes = pricingResp.data.map(item => item.productCode);
            const listProducts = await pricingClient.getListProductByProductCodeFromClient(productCodes);
            const mixData = pricingResp.data.map(t1 => ({ ...t1, ...listProducts.data.find(t2 => t2.code === t1.productCode) }));
            const statuses = pricingResp.data.reduce((acc, cur) => {
                acc[cur.sellPriceCode] = cur.status;
                return acc;
            }, {});
            res.pricingData = mixData;
            res.total = pricingResp.total;
            res.statuses = statuses;
        }
    } catch (e) {
        res.message = e.message;
    }
    return res;
}

export default function PricingPage(props) {
    return renderWithLoggedInUser(props, render)
}

const breadcrumb = [
    {
        name: "Trang chủ",
        link: "/crm"
    },
    {
        name: "Danh sách sku"
    },
]

const statusColor = {
    "NEW": "blue",
    "ACTIVE": "green",
    "INACTIVE": "grey"
}

function render(props) {
    const { error, success } = useToast();
    let router = useRouter();

    const [skus, setSkus] = useState(props.data ?? []);
    const [message, setMessage] = useState(props.message);
    const [openSkuFilter, setOpenSkuFilter] = useState(false);
    const [skuFilter, setSkuFilter] = useState();
    const [pagination, setPagination] = useState({
        page: parseInt(router.query.page) || 0,
        limit: parseInt(router.query.limit) || 20,
        count: props.count,
    })
    const { limit, page, count } = pagination;

    let [searchText, setSearchText] = useState(router.query.q || '');
    let [, setLoading] = useState(false);

    const { register, handleSubmit, errors, control } = useForm();
    const [open, setOpen] = useState(false);
    const [selectedSku, setSelectedSku] = useState({
        code: "",
        status: ""
    });
    const [statuses, setStatuses] = useState(props.statuses);

    useEffect(() => {
        setStatuses(props.statuses);
    }, [props.statuses])

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
        })
        Router.replace("/crm/sku", "/crm/sku", {
            shallow: true,
        });
    }

    const handleClickOpen = (code, status, ticketCode) => {
        setOpen(true);
        setSelectedSku({
            code: code,
            status: SkuStatuses.filter(e => e.value === status)[0],
            ticketCode: ticketCode
        })
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function onUpdateStatus(formData) {
        setLoading(true);
        let newStatuses = statuses
        newStatuses[selectedSku.code] = formData.status
        // setStatuses(newStatuses)
        formData.sellPriceCode = selectedSku.code
        formData.approveCodes = [selectedSku.ticketCode]
        let _client = getPriceClient()
        let result = await _client.updateStatusPrice(formData)
        setLoading(false);
        if (result.status === "OK") {
            success(result.message ? 'Thao tác thành công' : 'Thông báo không xác định')
        } else {
            error(result.message || 'Thao tác không thành công, vui lòng thử lại sau')
        }
        setOpen(false);

    }

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
    }

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
            })
        } else {
            Router.push(`/crm/sku?page=${page}&limit=${rowsPerPage}&q=${searchText}`);
        }
    }


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
                            <Grid item xs={12} sm={8} md={6}>
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
                                        inputProps={{ 'aria-label': 'Nhập tên phí' }}
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
                <SkuFilter
                    open={openSkuFilter}
                    onFilterChange={handleApplyFilter}
                    q={searchText}
                    onClose={({q}) => setSearchText(q)}
                />
            </MyCard>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">SKU</TableCell>
                            <TableCell align="left">Tên Sản Phẩm</TableCell>
                            <TableCell align="left">Loại</TableCell>
                            <TableCell align="right">Giá bán lẻ</TableCell>
                            {/* <TableCell align="left">Giá bán buôn</TableCell> */}
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="left">Ngày cập nhật</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {skus.length > 0 ? (
                        <TableBody>
                            {skus.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell align="left">{row.sku}</TableCell>
                                    <TableCell align="left">{row.name || '-'}</TableCell>
                                    <TableCell align="left">{
                                        showType(row.retailPrice.type)
                                    }</TableCell>
                                    <TableCell align="right">{formatNumber(row.retailPrice.price)}</TableCell>
                                    <TableCell align="center">
                                        {
                                            (row.ticketCode && row.status === 'NEW')?(
                                                <Button variant="outlined" 
                                                    size="small" 
                                                    style={{ color: `${statusColor[row.status]}`, borderColor: `${statusColor[row.status]}` }}
                                                    onClick={() => handleClickOpen(row.sellPriceCode, row.status, row.ticketCode)}>
                                                    {typeof (row.sellPriceCode) !== 'undefined' ? ProductStatus[statuses[row.sellPriceCode]] : 'Chưa xác định'}
                                                </Button>
                                            ):(
                                                <Button variant="outlined" disabled
                                                    size="small" 
                                                    style={{ color: `${statusColor[row.status]}`, borderColor: `${statusColor[row.status]}` }}>
                                                    {typeof (row.sellPriceCode) !== 'undefined' ? (ProductStatus[statuses[row.sellPriceCode]]?ProductStatus[statuses[row.sellPriceCode]]:'Chưa xác định') : 'Chưa xác định'}
                                                </Button>
                                            )
                                        }
                                    </TableCell>
                                    <TableCell align="left">{formatDateTime(row.lastUpdatedTime)}</TableCell>
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

                    <ModalCustom open={open} name="simple-dialog" title="Cập nhật trạng thái" onClose={handleClose} onExcute={handleSubmit(onUpdateStatus)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12}>
                                <FormControl style={{ width: '100%' }} size="small">
                                    <Typography gutterBottom>
                                        <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                            Trạng thái <span style={{ color: 'red' }}>*</span>
                                        </FormLabel>
                                    </Typography>
                                    <Controller
                                        id="status"
                                        name="status"
                                        variant="outlined"
                                        size="small"
                                        value={selectedSku.status}
                                        control={control}
                                        style={{ width: '50%' }}
                                        defaultValue={SkuStatuses ? SkuStatuses[0].value : ''}
                                        rules={{ required: true }}
                                        error={!!errors.status}
                                        as={
                                            <Select size="small">
                                                {SkuStatuses?.map(({ value, label }) => (
                                                    <MenuItem size="small" value={value} key={value}>{label}</MenuItem>
                                                ))}
                                            </Select>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <FormControl style={{ width: '100%' }}>
                                    <Typography gutterBottom>
                                        <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>Ghi chú</FormLabel>
                                    </Typography>
                                    <TextField
                                        id="description"
                                        name="description"
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        size="small"
                                        placeholder=""
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{ width: '100%' }}
                                        required
                                        inputRef={
                                            register()
                                        }
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </ModalCustom>
                    
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
    )
}