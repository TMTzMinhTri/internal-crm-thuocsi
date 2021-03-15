import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    IconButton, InputBase, Paper, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography
} from "@material-ui/core";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import AppHRM from "pages/_layout"
import styles from "./account.module.css"
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { getAccountClient } from "client/account";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faPencilAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import SearchIcon from "@material-ui/icons/Search";
import { MyCard, MyCardActions, MyCardHeader } from '@thuocsi/nextjs-components/my-card/my-card';

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadAccountData(ctx)
    })
}

export async function loadAccountData(ctx) {

    // setup data
    let data = { props: {} }

    // load parameters
    let query = ctx.query
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit

    let accClient = getAccountClient(ctx, data)
    data.props.accounts = await accClient.getAccount(query.search || "", offset, limit)
    // console.log(data.props.accounts)
    return data
}

export default function AccountPage(props) {
    return renderWithLoggedInUser(props, render)
}

// render page after logged in
function render(props) {
    let router = useRouter()
    const { success, error } = useToast()

    // states
    const [openDialog, setOpenDialog] = React.useState(false);
    const [username, setUsername] = React.useState("")
    const [fullname, setFullname] = React.useState("")
    const [newPassword, setNewPassword] = React.useState("")
    const [search, setSearch] = React.useState(router.query.q || "")
    const [page, setPage] = React.useState(parseInt(router.query.page) || 0)
    const [limit, setLimit] = React.useState(parseInt(router.query.limit) || 20)
    const [refresh, setRefresh] = React.useState(+new Date())

    // simplify data access
    let accounts = []
    if (props.accounts && props.accounts.data && props.accounts.data.length) {
        accounts = props.accounts.data
    }

    // open reset password dialog
    let openResetPaswordDialog = (username, fullname) => {
        setUsername(username)
        setFullname(fullname)
        setOpenDialog(true)
    }

    // reset user's password
    let doResetPassword = async (username) => {
        let accClient = getAccountClient()
        let result = await accClient.resetCustomerPassword(username)
        if (result && result.status === "OK") {
            setNewPassword(result.data[0].rawPassword)
            success("Cấp lại mật khẩu thành công")
        } else {
            error((result && result.message) || "Tạm thời không thể cấp lại mật khẩu. Vui lòng thử lại sau")
        }

    }

    // close reset password dialog
    let onClose = () => {
        setOpenDialog(false)
        setTimeout(() => {
            setNewPassword("")
        }, 500)

    }

    // do search account
    let onSearch = () => {
        setPage(0)
        setLimit(20)
        router.push(`?search=${search}`)
    }

    // enable or disable account
    let toogleStatus = async (row) => {

        for (let i = 0, acc; acc = accounts[i]; i++) {
            if (acc.username == row.username) {
                let accClient = getAccountClient()
                let result = await accClient.updateAccountStatus({
                    username: acc.username,
                    status: row.status != "INACTIVE" ? "INACTIVE" : "ACTIVE"
                })
                if (result.status == "OK") {
                    acc.status = row.status != "INACTIVE" ? "INACTIVE" : "ACTIVE"
                    success("Cập nhật trạng thái tài khoản khách hàng " + acc.username + " thành công.")
                } else {
                    error("Thao tác thất bại.")
                    return
                }
                break
            }
        }
        setRefresh(+new Date())
    }

    let breadcrumb = [
        {
            name: "Khách hàng",
            link: "/crm/customer"
        },
        {
            name: "Tài khoản"
        }
    ]
    return (
        <AppHRM select="/crm/account" breadcrumb={breadcrumb}>
            <Head>
                <title>Danh sách tài khoản khách hàng</title>
            </Head>
            <MyCard>
                <MyCardHeader title="Danh sách tài khoản">
                </MyCardHeader>
                <MyCardActions>
                    <Paper className={styles.search}>
                        <InputBase
                            id="q"
                            name="q"
                            className={styles.input}
                            value={search}
                            onChange={(event) => { setSearch(event.target.value) }}
                            onKeyPress={event => {
                                if (event.key === 'Enter') {
                                    onSearch()
                                }
                            }}
                            placeholder="Tìm kiếm tài khoản"
                            inputProps={{ 'aria-label': 'Tìm kiếm tài khoản' }}
                        />
                        <IconButton className={styles.iconButton} aria-label="search"
                            onClick={onSearch}>
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </MyCardActions>

            </MyCard>
            <MyCard>
                <Table size="small">
                    <colgroup>
                        <col style={{ width: 120 }} />
                        <col style={{ minWidth: 160 }} />
                        <col />
                        <col />
                        <col style={{ width: 180 }} />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tài khoản</TableCell>
                            <TableCell align="left">Họ tên</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">SĐT</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.accounts.data ? props.accounts.data.map((row) => (
                            <TableRow key={row.username} style={{ height: 51 }}>
                                <TableCell component="th" scope="row">
                                    {row.username}
                                </TableCell>
                                <TableCell align="left">{row.fullname}</TableCell>
                                <TableCell align="left">{row.email}</TableCell>
                                <TableCell align="left">{row.phoneNumber}</TableCell>
                                <TableCell align="left">
                                    <Tooltip title={row.status != "INACTIVE" ? "Nhấn để khóa tài khoản" : "Nhấn để mở lại tài khoản"}>
                                        <Switch
                                            checked={row.status != "INACTIVE"}
                                            onChange={() => toogleStatus(row)}
                                            color="primary"
                                            name="checkedB"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </Tooltip>

                                    {
                                        row.role != "Master" && <Link href={`/crm/account/edit?username=${row.username}`} passHref>
                                            <a>
                                                <Tooltip title="Cập nhật thông tin">
                                                    <IconButton>
                                                        <FontAwesomeIcon
                                                            icon={faPencilAlt} style={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </a>
                                        </Link>
                                    }
                                    {
                                        row.role != "Master" && <Tooltip title="Cấp lại mật khẩu">
                                            <IconButton onClick={() => {
                                                openResetPaswordDialog(row.username, row.fullname);
                                            }}>
                                                <FontAwesomeIcon
                                                    icon={faKey} style={{ fontSize: 14 }} />
                                            </IconButton>
                                        </Tooltip>
                                    }

                                </TableCell>
                            </TableRow>
                        )) : <TableRow>
                                <TableCell colSpan="100%">Không có tài khoản khách hàng nào</TableCell>
                            </TableRow>}
                    </TableBody>
                    {
                        props.accounts.data && <MyTablePagination
                            labelUnit="tài khoản"
                            count={props.accounts.total}
                            rowsPerPage={limit}
                            page={page}
                            onChangePage={(event, page, rowsPerPage) => {
                                setPage(page)
                                setLimit(rowsPerPage)
                                Router.push(`/crm/account?q=${search}&page=${page}&limit=${rowsPerPage}`)
                            }}
                        />
                    }
                </Table>
            </MyCard>
            <Typography style={{ fontStyle: "italic", marginTop: 10, color: "gray", fontSize: 12 }}>
                Cấp lại mật khẩu sẽ dùng mật khẩu cung cấp tự động bởi hệ thống để tránh việc sử dụng mật khẩu quá đơn giản.
            </Typography>
            <Dialog
                open={openDialog}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Cấp lại mật khẩu cho khách hàng</DialogTitle>
                <DialogContent>
                    {!newPassword && <DialogContentText>
                        Bạn muốn cấp lại mật khẩu cho khách hàng sau ?
                    </DialogContentText>}
                    <DialogContentText>
                        <li>Tài khoản: <b>{username}</b></li>
                        <li>Họ tên: <b>{fullname}</b></li>
                    </DialogContentText>
                    {(newPassword && (<DialogContentText component={'div'}>
                        Mật khẩu mới là <TextField disabled value={newPassword}
                            style={{ width: 160, verticalAlign: "middle", textAlign: "center" }}
                            inputProps={{ style: { textAlign: 'center' } }} />
                    </DialogContentText>)) || ""}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="default">
                        Đóng
                    </Button>
                    {!newPassword && <Button onClick={() => doResetPassword(username)} color="primary">
                        Lấy mật khẩu mới
                    </Button>}
                </DialogActions>
            </Dialog>
        </AppHRM>
    )
}