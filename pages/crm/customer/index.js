import { faFilter, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SearchIcon from "@material-ui/icons/Search";
import {
    doWithLoggedInUser,
    renderWithLoggedInUser
} from "@thuocsi/nextjs-components/lib/login";
import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getCommonAPI } from 'client/common';
import { getCustomerClient } from "client/customer";
import { formatUrlSearch, statuses } from 'components/global';
import { ConfirmApproveDialog } from "containers/crm/customer/ConfirmApproveDialog";
import { ConfirmLockDialog } from "containers/crm/customer/ConfirmLockDialog";
import { CustomerFilter } from "containers/crm/customer/CustomerFilter";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./customer.module.css";

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
    const [customers, setCustomers] = useState(props.data);
    const [message, setMessage] = useState(props.message);
    const [openCustomerFilter, setOpenCustomerFilter] = useState(false);
    const [customerFilter, setCustomerFilter] = useState({});
    let q = router.query.q || "";
    const [search, setSearch] = useState(q);
    const [pagination, setPagination] = useState({
        page: parseInt(router.query.page) || 0,
        limit: parseInt(router.query.limit) || 20,
        count: props.count,
    })
    const { limit, page, count } = pagination;
    const { error, success } = useToast()

    useEffect(() => {
        setPagination({
            page: parseInt(router.query.page) || 0,
            limit: parseInt(router.query.limit) || 20,
            count: props.count,
        })
    }, [router.query.page, router.query.limit, props.count]);

    useEffect(() => {
        setCustomers(props.data);
        setMessage(props.message);
    }, [props.data, props.message]);

    async function getCustomerByFilter(data, q, limit, page) {
        try {
            const customerClient = getCustomerClient({});
            const { pointFrom, pointTo, ...others } = data;
            const customersResp = await customerClient.getCustomerByFilter({
                q: formatUrlSearch(q),
                limit,
                offset: page * limit,
                point: {
                    from: pointFrom,
                    to: pointTo,
                },
                ...others,
            });
            if (customersResp.status !== "OK") {
                setMessage(customersResp.message);
            }
            setCustomers(customersResp.data ?? []);
            setPagination({
                page,
                limit,
                count: customersResp.total,
            })
        } catch (e) {
            error(e.message);
        }

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

    async function handleChange(event) {
        const target = event.target;
        const value = target.value;
        setSearch(value);
    }

    async function onSearch() {
        if (openCustomerFilter) {
            getCustomerByFilter(customerFilter, q, limit, page);
        } else {
            q = formatUrlSearch(search);
            router.push(`?q=${q}`);
        }
    }

    const handleApplyFilter = async (data) => {
        setCustomerFilter(data);
        getCustomerByFilter(data, q, limit, page);
    }

    const handlePageChange = async (event, page, rowsPerPage) => {
        if (openCustomerFilter) {
            getCustomerByFilter(customerFilter, q, limit, page);
        } else {
            Router.push(`/crm/customer?page=${page}&limit=${rowsPerPage}&q=${q}`);
        }
    }

    const RenderRow = ({ row }) => {
        let mainColor = statuses.find((e) => e.value === row.status)?.color || "grey"
        let status = statuses.find((e) => e.value === row.status)?.label || "Chưa xác định"
        return (
            <TableRow>
                <TableCell component="th" scope="row">
                    {row.code}
                </TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left" style={{ overflowWrap: 'anywhere' }}>{row.email || '-'}</TableCell>
                <TableCell align="left">{props.condUserType.find(e => e.value === row.level)?.label || '-'}</TableCell>
                <TableCell align="left">{row.point}</TableCell>
                <TableCell align="left">{row.phone}</TableCell>
                <TableCell align="center">
                    <Button size="small" variant="outlined" style={{ color: `${mainColor}`, borderColor: `${mainColor}` }}>{status}</Button>
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
                    {row.isActive == '-1' ? <Tooltip title="Nhấp vào để mở khóa">
                        <IconButton onClick={() => { setOpenApproveAccountDialog(true); setApprovedCustomerCode(row) }}>
                            <LockIcon fontSize="small" />
                        </IconButton>
                    </Tooltip> :
                        <Tooltip title="Nhấp vào để khoá">
                            <IconButton onClick={() => { setOpenLockAccountDialog(true); setLockedCustomerCode(row) }}>
                                <LockOpenIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>}
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
            <MyCard>
                <MyCardHeader title="Danh sách khách hàng">
                    <Button variant="contained" color="primary" style={{ marginRight: 8 }}
                        onClick={() => setOpenCustomerFilter(!openCustomerFilter)}
                    >
                        <FontAwesomeIcon icon={faFilter} style={{ marginRight: 8 }} />
                        Bộ lọc
                    </Button>
                    <Link href="/crm/customer/new">
                        <Button variant="contained" color="primary">
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
                            Thêm khách hàng
                        </Button>
                    </Link>
                </MyCardHeader>
                <MyCardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
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
                    </Grid>
                </MyCardContent>
                <CustomerFilter open={openCustomerFilter} userTypes={props.condUserType} onFilterChange={handleApplyFilter} />
            </MyCard>
            <MyCard>
                <TableContainer>
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
                        {customers.length > 0 ? (
                            <TableBody>
                                {customers.map((row, i) => (
                                    <RenderRow key={i} row={row} i={i} />
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
                            labelUnit="khách hàng"
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
