import {
    Button,
    ButtonGroup,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { ConfirmApproveDialog } from "containers/crm/customer/ConfirmApproveDialog"
import { ConfirmLockDialog } from "containers/crm/customer/ConfirmLockDialog"
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import SearchIcon from "@material-ui/icons/Search";
import {
    doWithLoggedInUser,
    renderWithLoggedInUser
} from "@thuocsi/nextjs-components/lib/login";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getCustomerClient } from "client/customer";
import { formatUrlSearch, statuses } from 'components/global';
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./customer.module.css";
import { getCommonAPI } from 'client/common';

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadCustomerData(ctx);
    });
}

export async function loadCustomerData(ctx) {
    let data = { props: {} }
    let query = ctx.query
    let q = typeof (query.q) === "undefined" ? '' : query.q
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit

    let customerClient = getCustomerClient(ctx, data)
    let resp = await customerClient.getCustomer(offset, limit, q)
    if (resp.status !== 'OK') {
        if (resp.status === 'NOT_FOUND') {
            return { props: { data: [], count: 0, message: 'Không tìm thấy khách hàng' } }
        }
        return { props: { data: [], count: 0, message: resp.message } }
    }

    const customerCommon = getCommonAPI(ctx, {})
    const resLevel = await customerCommon.getListLevelCustomers()
    let condUserType = []
    if (resLevel.status === 'OK') {
        condUserType = resLevel.data.map(item => { return { value: item.code, label: item.name } })
    }
    // Pass data to the page via props
    return { props: { data: resp.data, count: resp.total, condUserType } }
}

export default function CustomerPage(props) {
    return renderWithLoggedInUser(props, render);
}

function render(props) {
    let router = useRouter();
    const { register, handleSubmit } = useForm();
    const [openApproveAccountDialog, setOpenApproveAccountDialog] = useState(false);
    const [openLockAccountDialog, setOpenLockAccountDialog] = useState(false);
    const [approvedCustomerCode, setApprovedCustomerCode] = useState();
    const [lockedCustomerCode, setLockedCustomerCode] = useState();

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

    async function approveAccount() {
        const _client = getCustomerClient()
        setOpenApproveAccountDialog(false)
        const resp = await _client.approveAccount({ code: approvedCustomerCode.code, isActive: 1 })
        if (resp.status !== "OK") {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            props.data.filter(row => row.code === approvedCustomerCode.code)[0].isActive = 1
            props.data.filter(row => row.code === approvedCustomerCode.code)[0].status = "ACTIVE"
            setApprovedCustomerCode(null)
            success("Kích hoạt tài khoản thành công")
        }
    }

    async function lockAccount() {
        const _client = getCustomerClient()
        setOpenLockAccountDialog(false)
        const resp = await _client.lockAccount({ code: lockedCustomerCode.code, isActive: -1 })
        if (resp.status !== "OK") {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            props.data.filter(row => row.code === lockedCustomerCode.code)[0].isActive = -1
            setApprovedCustomerCode(null)
            success("Khóa tài khoản thành công")
        }
    }

    const RenderRow = ({ row, i }) => {
        let mainColor = statuses.find((e) => e.value === row.status)?.color || "grey"
        let status = statuses.find((e) => e.value === row.status)?.label || "Chưa xác định"
        return (
            <TableRow key={i}>
                <TableCell component="th" scope="row">
                    {row.code}
                </TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left" style={{ overflowWrap: 'anywhere' }}>{row.email || '-'}</TableCell>
                <TableCell align="left">{props.condUserType.find(e => e.value === row.level)?.label || '-'}</TableCell>
                <TableCell align="left">{row.point}</TableCell>
                <TableCell align="left">{row.phone}</TableCell>
                <TableCell align="center">
                    {row.isActive == -1 && row.status == 'ACTIVE' ? <Button size="small" variant="outlined" style={{ color: 'red', borderColor: 'red' }}>Bị Khóa</Button> :
                        <Button size="small" variant="outlined" style={{ color: `${mainColor}`, borderColor: `${mainColor}` }}>{status}</Button>}
                </TableCell>
                <TableCell align="left">
                    <Link href={`/crm/customer/edit?customerCode=${row.code}`}>
                        <a>
                            <Tooltip title="Cập nhật thông tin">
                                <IconButton>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </a>
                    </Link>
                    {row.isActive == '1' ? <Tooltip title="Khóa tài khoản">
                        <IconButton onClick={() => { setOpenLockAccountDialog(true); setLockedCustomerCode(row) }}>
                            <CheckCircleIcon fontSize="small" style={{ color: 'green' }} />
                        </IconButton>
                    </Tooltip> :
                        row.isActive == '-1' ? <Tooltip title="Kích hoạt tài khoản">
                            <IconButton onClick={() => { setOpenApproveAccountDialog(true); setApprovedCustomerCode(row) }}>
                                <RemoveCircleIcon fontSize="small" style={{ color: 'red' }} />
                            </IconButton>
                        </Tooltip> :
                            row.status !== 'DRAFT' ? <Tooltip title="Kích hoạt tài khoản">
                                <IconButton onClick={() => { setOpenApproveAccountDialog(true); setApprovedCustomerCode(row) }}>
                                    <CheckCircleIcon fontSize="small" style={{ color: 'grey' }} />
                                </IconButton>
                            </Tooltip> : null}
                </TableCell>
            </TableRow >
        );
    }


    return (
        <AppCRM select="/crm/customer">
            <Head>
                <title>Danh sách khách hàng</title>
            </Head>
            <ConfirmApproveDialog
                open={openApproveAccountDialog}
                onClose={() => setOpenApproveAccountDialog(false)}
                onConfirm={() => approveAccount()}
            />
            <ConfirmLockDialog
                open={openLockAccountDialog}
                onClose={() => setOpenLockAccountDialog(false)}
                onConfirm={() => lockAccount()}
            />
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
                                placeholder="Nhập Tên khách hàng, Email, Số điện thoại"
                                inputProps={{ 'aria-label': 'Nhập Tên khách hàng, Email, Số điện thoại' }}
                            />
                            <IconButton className={styles.iconButton} aria-label="search"
                                onClick={handleSubmit(onSearch)}>
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Link href="/crm/customer/new">
                            <ButtonGroup color="primary" aria-label="contained primary button group"
                                className={styles.rightGroup}>
                                <Button variant="contained" color="primary">Thêm khách hàng</Button>
                            </ButtonGroup>
                        </Link>
                    </Grid>
                </Grid>
            </div>

            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <colgroup>
                        <col width="10%" />
                        <col width="15%" />
                        <col width="20%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="15%" />
                        <col width="10%" />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Mã khách hàng</TableCell>
                            <TableCell align="left">Tên khách hàng</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Cấp độ</TableCell>
                            <TableCell align="left">Điểm</TableCell>
                            <TableCell align="left">Số điện thoại</TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="left">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {props.data.length > 0 ? (
                        <TableBody>
                            {props.data.map((row, i) => (
                                <RenderRow row={row} i={i} />
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
                        labelUnit="khách hàng"
                        count={props.count}
                        rowsPerPage={limit}
                        page={page}
                        onChangePage={(event, page, rowsPerPage) => {
                            Router.push(
                                `/crm/customer?page=${page}&limit=${rowsPerPage}&q=${q}`
                            );
                        }}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    );
}
