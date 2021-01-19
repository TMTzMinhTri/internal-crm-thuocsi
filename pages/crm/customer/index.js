import {
    Button,
    ButtonGroup,

    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Paper,





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
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getCustomerClient } from "client/customer";
import { condUserType, formatUrlSearch, statuses } from 'components/global';
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
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
    // Pass data to the page via props
    return { props: { data: resp.data, count: resp.total } }
}

export default function CustomerPage(props) {
    return renderWithLoggedInUser(props, render);
}

function render(props) {
    let router = useRouter();
    const { register, handleSubmit, errors } = useForm();
    const [openApproveDialog, setOpenApproveDialog] = useState(false);
    const [openLockAccountDialog, setOpenLockAccountDialog] = useState(false);
    const [approvedCustomerCode, setApprovedCustomerCode] = useState();
    const [lockedCustomerCode,setLockedCustomerCode]=useState();
    
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
        setOpenApproveDialog(false)
        const resp = await _client.updateStatus({ code:approvedCustomerCode.code, status: "APPROVED" })
        if (resp.status !== "OK") {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            props.data.filter(row => row.code === approvedCustomerCode.code)[0].status = "APPROVED" 
            setApprovedCustomerCode(null)
            success("Kích hoạt tài khoản thành công")
            // window.location.reload()
        }
    }

    async function lockAccount() {
        const _client = getCustomerClient()
        setOpenLockAccountDialog(false)
        const resp = await _client.updateStatus({ code:lockedCustomerCode.code, status: "NEW" })
        if (resp.status !== "OK") {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            props.data.filter(row => row.code === lockedCustomerCode.code)[0].status = "NEW" 
            setApprovedCustomerCode(null)
            success("Khóa tài khoản thành công")
            // window.location.reload()
        }
    }

    const RenderRow = (row, i) => (
        <TableRow key={i}>
            <TableCell component="th" scope="row">
                {row.data.code}
            </TableCell>
            <TableCell align="left">{row.data.name}</TableCell>
            <TableCell align="left" style={{ overflowWrap: 'anywhere' }}>{row.data.email || '-'}</TableCell>
            <TableCell align="left">{condUserType.find(e => e.value === row.data.level)?.label || '-'}</TableCell>
            <TableCell align="left">{row.data.point}</TableCell>
            <TableCell align="left">{row.data.phone}</TableCell>
            <TableCell align="left">
                {statuses.find((e) => e.value === row.data.status)?.label}
            </TableCell>
            <TableCell align="left">
                <Link href={`/crm/customer/edit?customerCode=${row.data.code}`}>
                    <a>
                        <Tooltip title="Cập nhật thông tin">
                            <IconButton>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </a>
                </Link>
                {row.data.status === 'APPROVED' ? <Tooltip title="Khóa tài khoản">
                    <IconButton onClick={() => {setOpenLockAccountDialog(true); setLockedCustomerCode(row.data)}}>
                        <LockOpenIcon fontSize="small" />
                    </IconButton>
                </Tooltip> : row.data.status !== 'DRAFT' ? <Tooltip title="Kích hoạt tài khoản">
                    <IconButton onClick={() => {setOpenApproveDialog(true); setApprovedCustomerCode(row.data)}}>
                        <LockIcon fontSize="small" style={{color:'red'}}/>
                    </IconButton>
                </Tooltip> : null}
            </TableCell>
        </TableRow>
    );

    const ApproveDialog = () => (
        <div>
            <Dialog
                open={true}
                onClose={() => setOpenApproveDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Kích Hoạt Tài Khoản"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có muốn kích hoạt tài khoản này chứ ?
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenApproveDialog(false)} color="primary">
                        Hủy bỏ
                    </Button>
                    <Button onClick={approveAccount} color="primary" autoFocus>
                        Đồng ý
                     </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
    const LockAccountDialog = () => (
        <div>
            <Dialog
                open={true}
                onClose={() => setOpenLockAccountDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Khoá Tài Khoản"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có muốn khóa tài khoản này chứ ?
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLockAccountDialog(false)} color="primary">
                        Hủy bỏ
                    </Button>
                    <Button onClick={lockAccount} color="primary" autoFocus>
                        Đồng ý
                     </Button>
                </DialogActions>
            </Dialog>
        </div>
    );


    return (
        <AppCRM select="/crm/customer">
            <Head>
                <title>Danh sách khách hàng</title>
            </Head>
            {openApproveDialog ? <ApproveDialog /> : null}
            {openLockAccountDialog ? <LockAccountDialog/> : null }
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
                        <col width="20%" />
                        <col width="20%" />
                        <col width="10%" />
                        <col width="5%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="15%"  />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Mã khách hàng</TableCell>
                            <TableCell align="left">Tên khách hàng</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Cấp độ</TableCell>
                            <TableCell align="left">Điểm</TableCell>
                            <TableCell align="left">Số điện thoại</TableCell>
                            <TableCell align="left">Trạng thái</TableCell>
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
