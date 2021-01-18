import {
    Button,
    ButtonGroup,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SearchIcon from "@material-ui/icons/Search";
import {
    doWithLoggedInUser,
    renderWithLoggedInUser,
} from "@thuocsi/nextjs-components/lib/login";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getOrderClient } from "client/order";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./order.module.css";
import {formatDateTime} from "components/global"
import { ErrorCode, formatUrlSearch, statuses, condUserType } from 'components/global';
import { Lock, SettingsPhoneRounded } from "@material-ui/icons";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadOrderData(ctx);
    });
}

export async function loadOrderData(ctx) {
    let data = { props: {} }
    let query = ctx.query
    let q = typeof (query.q) === "undefined" ? '' : query.q
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit

    let orderClient = getOrderClient(ctx, data)
    let resp = await orderClient.getOrder(offset, limit)
    if (resp.status !== 'OK') {
        if (resp.status === 'NOT_FOUND') {
            return { props: { data: [], count: 0, message: 'Không tìm thấy hóa đơn' } }
        }
        return { props: { data: [], count: 0, message: resp.message } }
    }
    // Pass data to the page via props
    return { props: { data: resp.data,
        //  count: resp.total 
    } }
}

export default function OrderPage(props) {
    return renderWithLoggedInUser(props, render);
}

function render(props) {
    let router = useRouter();
    const { register, handleSubmit, errors } = useForm();
    
    let q = router.query.q || "";
    const [search, setSearch] = useState(q);
    let page = parseInt(router.query.page) || 0;
    let limit = parseInt(router.query.limit) || 20;
    const { error, success } = useToast()

    async function handleChange(event) {
        const target = event.target;
        const value = target.value;
        setSearch(value);
    }

    async function onSearch() {
        q = formatUrlSearch(search);
        router.push(`?q=${q}`);
    }

    const RenderRow = (row, i) => (
        <TableRow key={i}>
            <TableCell component="th" scope="row">
                {row.data.orderNo}
            </TableCell>
            <TableCell align="left">{row.data.customerName}</TableCell>
            <TableCell align="left">{row.data.customerPhone}</TableCell>
            <TableCell align="left">{row.data.customerShippingAddress}</TableCell>
            <TableCell align="left">{row.data.totalPrice}</TableCell>
            <TableCell align="left">{formatDateTime(row.data.deliveryDate)}</TableCell>
            <TableCell align="left">
                <Link href={`/crm/order/edit?order_no=${row.data.orderNo}`}>
                    <a>
                        <Tooltip title="Cập nhật thông tin">
                            <IconButton>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </a>
                </Link>
            </TableCell>
        </TableRow>
    );

    return (
        <AppCRM select="/crm/order">
            <Head>
                <title>Danh sách hóa đơn</title>
            </Head>
            <div className={styles.grid}>
                <Grid container spacing={3} direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <Grid item xs={12} sm={4} md={4}>
                        <Paper className={styles.search}>
                            <InputBase
                                id="q"
                                name="q"
                                className={styles.input}
                                value={search}
                                onChange={handleChange}
                                inputRef={register}
                                onKeyPress={event => {
                                    if (event.key === 'Enter' || event.keyCode === 13) {
                                        onSearch()
                                    }
                                }}
                                placeholder="Nhập mã hóa đơn"
                                inputProps={{ 'aria-label': 'Nhập mã hóa đơn' }}
                            />
                            <IconButton className={styles.iconButton} aria-label="search"
                                onClick={handleSubmit(onSearch)}>
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Grid>
              </Grid>
            </div>

            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <colgroup>
                        <col width="10%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="10%" />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Mã hóa đơn</TableCell>
                            <TableCell align="left">Tên khách hàng</TableCell>
                            <TableCell align="left">Số điện thoại</TableCell>
                            <TableCell align="left">Địa Chỉ</TableCell>
                            <TableCell align="left">Tổng tiền</TableCell>
                            <TableCell align="left">Ngày giao</TableCell>
                            <TableCell align="left">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {props.data.length > 0 ? (
                        <TableBody>
                            {props.data.map((row, i) => (
                                <RenderRow data={row} key={i} />
                            ))}
                        </TableBody>
                    ) : (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={3} align="left">{props.message}</TableCell>
                                </TableRow>
                            </TableBody>
                        )}

                    <MyTablePagination
                        labelUnit="hoá đơn"
                        count={props.count}
                        rowsPerPage={limit}
                        page={page}
                        onChangePage={(event, page, rowsPerPage) => {
                            Router.push(
                                `/crm/order?page=${page}&limit=${rowsPerPage}&q=${q}`
                            );
                        }}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    );
}
