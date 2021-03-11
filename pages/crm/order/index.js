import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Grid,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import {
    doWithLoggedInUser,
    renderWithLoggedInUser,
} from "@thuocsi/nextjs-components/lib/login";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { getOrderClient } from "client/order";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./order.module.css";
import { formatDateTime, formatNumber } from "components/global";
import { formatUrlSearch } from 'components/global';
import { MyCard, MyCardActions, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { OrderFilter } from "containers/crm/order/OrderFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadOrderData(ctx);
    });
}

export async function loadOrderData(ctx) {
    let data = { props: {} };
    let query = ctx.query;
    let q = typeof (query.q) === "undefined" ? '' : query.q;
    let page = query.page || 0;
    let limit = query.limit || 20;
    let offset = page * limit;

    let orderClient = getOrderClient(ctx, data);
    let resp = await orderClient.getOrder(offset, limit, q);
    if (resp.status !== 'OK') {
        if (resp.status === 'NOT_FOUND') {
            return { props: { data: [], count: 0, message: 'Không tìm thấy đơn hàng' } };
        }
        return { props: { data: [], count: 0, message: resp.message } };
    }
    // Pass data to the page via props
    return {
        props: {
            data: resp.data,
            count: resp.total
        }
    };
}

async function getOrderByFilter(data, limit, offset) {
    const res = {
        orders: [],
        total: 0,
        message: "",
    };
    try {
        let orderClient = getOrderClient();
        const orderResp = await orderClient.getOrderByFilter({ ...data, limit, offset });
        if (orderResp.status !== "OK") {
            if (orderResp.status === 'NOT_FOUND') {
                res.message = "Không tìm thấy kết quả phù hợp";
            } else {
                res.message = orderResp.message;
            }
        } else {
            res.orders = orderResp.data;
            res.total = orderResp.total;
        }
    } catch (e) {
        res.message = e.message;
    }
    return res;
}

const statusColor = {
    "WaitConfirm": "blue",
    "Confirmed": "green",
    "Canceled": "red",
    "undefined": "grey",
};

const RenderRow = (row, i) => (
    <TableRow key={i}>
        <TableCell component="th" scope="row">{row.data.orderNo}</TableCell>
        <TableCell align="left">{row.data.customerName}</TableCell>
        <TableCell align="left">{row.data.customerPhone}</TableCell>
        <TableCell align="left">{row.data.customerShippingAddress}</TableCell>
        <TableCell align="right">{formatNumber(row.data.totalFee) || 0}</TableCell>
        <TableCell align="right">{formatNumber(row.data.totalDiscount) || 0}</TableCell>
        <TableCell align="right">{formatNumber(row.data.totalPrice) || 0}</TableCell>
        <TableCell align="left">{formatDateTime(row.data.createdTime) || "-"}</TableCell>
        <TableCell align="left">{formatDateTime(row.data.confirmationDate) || "-"}</TableCell>
        <TableCell align="right">{row.data.source ?? "-"}</TableCell>
        <TableCell align="center">
            <Button
                size="small"
                variant="outlined"
                style={{ color: statusColor[row.data.status], borderColor: statusColor[row.data.status] }}
                disabled
            >
                {row.data.status === "Confirmed" ? "Đã xác nhận" : row.data.status === "WaitConfirm" ? "Chờ xác nhận"
                    : row.data.status === "Canceled" ? "Hủy bỏ" : "-"}
            </Button>
        </TableCell>
        <TableCell align="center">
            <Link href={`/crm/order/edit?orderNo=${row.data.orderNo}`}>
                <Tooltip title="Cập nhật thông tin">
                    <IconButton>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Link>
        </TableCell>
    </TableRow>
);

const breadcrumb = [
    {
        name: "Trang chủ",
        link: "/crm"
    },
    {
        name: "Danh sách đơn hàng",
    },
];

function render(props) {
    let router = useRouter();
    const { register, handleSubmit } = useForm();

    const [search, setSearch] = useState(router.query.q ?? "");
    const [orders, setOrders] = useState(props.data ?? []);
    const [message, setMessage] = useState(props.message);
    const [openOrderFilter, setOpenOrderFilter] = useState(false);
    const [orderFilter, setOrderFilter] = useState();
    const [pagination, setPagination] = useState({
        page: parseInt(router.query.page) || 0,
        limit: parseInt(router.query.limit) || 20,
        count: props.count,
    });
    const { limit, page, count } = pagination;

    useEffect(() => {
        setOrders(props.data ?? []);
        setMessage(props.message);
        setSearch(router.query.q ?? "");
    }, [props.data, props.message, router.query.q]);
    useEffect(() => {
        setPagination({
            page: parseInt(router.query.page) || 0,
            limit: parseInt(router.query.limit) || 20,
            count: props.count,
        });

    }, [router.query.page, router.query.limit, props.count]);

    const handleApplyFilter = async (data) => {
        setOrderFilter(data);
        const { orders, message, total } = await getOrderByFilter(data, limit, 0);
        if (message) setMessage(message);
        setOrders(orders);
        setPagination({
            limit,
            page: 0,
            count: total,
        });
        Router.replace("/crm/order", "/crm/order", {
            shallow: true,
        });
    };

    async function onSearch() {
        const q = formatUrlSearch(search);
        router.push(`?q=${q}`);
    }

    const handlePageChange = async (event, page, rowsPerPage) => {
        if (openOrderFilter && orderFilter) {
            const { orders, message, total } = await getOrderByFilter(orderFilter, rowsPerPage, page);
            if (message) setMessage(message);
            setOrders(orders);
            setPagination({
                limit: rowsPerPage,
                page,
                count: total,
            });
        } else {
            Router.push(`/crm/order?page=${page}&limit=${rowsPerPage}&q=${search}`);
        }
    };

    return (
        <AppCRM select="/crm/order" breadcrumb={breadcrumb}>
            <Head>
                <title>Danh sách đơn hàng</title>
            </Head>
            <MyCard>
                <MyCardHeader title="Danh sách đơn hàng">
                    <Button variant="contained" color="primary" style={{ marginRight: 8 }}
                        onClick={() => setOpenOrderFilter(!openOrderFilter)}
                    >
                        <FontAwesomeIcon icon={faFilter} style={{ marginRight: 8 }} />
                        Bộ lọc
                    </Button>
                </MyCardHeader>
                <Box display={!openOrderFilter ? "block" : "none"}>
                    <MyCardActions>
                        <Grid container>
                            <Grid item xs={12} md={4}>
                                <Paper className={styles.search}>
                                    <InputBase
                                        id="q"
                                        name="q"
                                        className={styles.input}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        inputRef={register}
                                        onKeyPress={event => {
                                            if (event.key === 'Enter' || event.keyCode === 13) {
                                                onSearch();
                                            }
                                        }}
                                        placeholder="Nhập mã đơn hàng"
                                        inputProps={{ 'aria-label': 'Nhập mã đơn hàng' }}
                                    />
                                    <IconButton className={styles.iconButton} aria-label="search"
                                        onClick={handleSubmit(onSearch)}>
                                        <SearchIcon />
                                    </IconButton>
                                </Paper>
                            </Grid>
                        </Grid>
                    </MyCardActions>
                </Box>
                <OrderFilter
                    open={openOrderFilter}
                    onFilterChange={handleApplyFilter}
                    q={search}
                    onClose={({ q }) => setSearch(q ?? "")}
                />
            </MyCard>
            <MyCard>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <colgroup>
                            <col/>
                            <col/>
                            <col/>
                            <col width="15%"/>
                            <col/>
                            <col/>
                            <col/>
                            <col/>
                            <col/>
                            <col/>
                            <col/>
                            <col/>
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Mã đơn hàng</TableCell>
                                <TableCell align="left">Tên khách hàng</TableCell>
                                <TableCell align="left">Số điện thoại</TableCell>
                                <TableCell align="left">Địa Chỉ</TableCell>
                                <TableCell align="right">Phí dịch vụ</TableCell>
                                <TableCell align="right">Khuyến mãi</TableCell>
                                <TableCell align="right">Tổng tiền</TableCell>
                                <TableCell align="left">Ngày mua</TableCell>
                                <TableCell align="left">Ngày xác nhận</TableCell>
                                <TableCell align="right">Nguồn</TableCell>
                                <TableCell align="center">Trạng thái</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        {orders.length > 0 ? (
                            <TableBody>
                                {orders.map((row, i) => (
                                    <RenderRow data={row} key={i} />
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
                            labelUnit="đơn hàng"
                            count={count}
                            rowsPerPage={limit}
                            page={page}
                            onChangePage={handlePageChange}
                        />
                    </Table>
                </TableContainer>
            </MyCard>
        </AppCRM>
    );
}

export default function OrderPage(props) {
    return renderWithLoggedInUser(props, render);
}