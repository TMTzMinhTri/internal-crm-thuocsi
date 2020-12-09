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
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import Head from "next/head";
import Link from "next/link";
import Router, {useRouter} from "next/router";
import AppCRM from "pages/_layout";
import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-components/lib/login";
import React, {useState} from "react";
import styles from "./customer.module.css";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from '@material-ui/icons/Search';
import IconButton from "@material-ui/core/IconButton";
import {useForm} from "react-hook-form";
import {getCustomerClient} from "../../../client/customer";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from '@material-ui/icons/Edit';
// import {levels, statuses} from "./form"

const levels = [
    {
        value: "Infinity",
        label: "Không giới hạn"
    },
    {
        value: "Diamond",
        label: "Kim cương",
    },
    {
        value: "Platinum",
        label: "Bạch kim",
    },
    {
        value: "Gold",
        label: "Vàng",
    },
    {
        value: "Sliver",
        label: "Bạc",
    },
];

const statuses = [
    {
        value: "ACTIVE",
        label: "Đang hoạt động",
    },
    {
        value: "DRAFT",
        label: "Nháp",
    },
    {
        value: "NEW",
        label: "Mới",
    },
    {
        value: "GUEST",
        label: "Khách",
    },
]


export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadCustomerData(ctx)
    })
}

export async function loadCustomerData(ctx) {
    let data = {props: {}}
    let query = ctx.query
    let q = typeof (query.q) === "undefined" ? '' : query.q
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit

    let customerClient = getCustomerClient(ctx, data)
    let resp = await customerClient.getCustomer(offset, limit, q)
    if (resp.status !== 'OK') {
        return {props: {data: [], count: 0, message: resp.message}}
    }
    // Pass data to the page via props
    return {props: {data: resp.data, count: resp.total}}
}

export default function CustomerPage(props) {
    return renderWithLoggedInUser(props, render)
}

export function formatNumber(num) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function render(props) {
    let router = useRouter()
    const {register, handleSubmit, errors} = useForm();
    let [search, setSearch] = useState('')
    let q = router.query.q || ''
    let page = parseInt(router.query.page) || 0
    let limit = parseInt(router.query.limit) || 20

    function searchCustomer(formData) {
        let q = formData.q
        Router.push(`/crm/customer?q=${q}`)
    }

    async function handleChange(event) {
        const target = event.target;
        const value = target.value;
        setSearch(value)
    }

    function onSearch(formData) {
        try {
            searchCustomer(formData)
            setSearch('')
        } catch (error) {
            console.log(error)
        }
    }

    const RenderRow = (row) => (
        <TableRow>
            <TableCell component="th" scope="row">{row.data.customerID}</TableCell>
            <TableCell align="left">{row.data.name}</TableCell>
            <TableCell align="left">{row.data.email}</TableCell>
            <TableCell align="left">{levels.find(e => e.value === row.data.level)?.label}</TableCell>
            <TableCell align="left">{row.data.point}</TableCell>
            <TableCell align="left">{row.data.phone}</TableCell>
            <TableCell align="left">{statuses.find(e => e.value === row.data.status)?.label}</TableCell>
            <TableCell align="center">
                <Link href={`/crm/customer/edit?customerID=${row.data.customerID}`}>
                    <a>
                        <Tooltip title="Cập nhật thông tin">
                            <IconButton>
                                <EditIcon fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    </a>
                </Link>
            </TableCell>
        </TableRow>
    )

    return (
        <AppCRM select="/crm/customer">
            <Head>
                <title>Danh sách khách hàng</title>
            </Head>
            <div className={styles.grid}>
                <Grid container spacing={3} direction="row"
                      justify="space-evenly"
                      alignItems="center"
                >
                    <Grid item xs={12} sm={6} md={6}>
                        <form>
                            <Paper component="form" className={styles.search}>
                                <InputBase
                                    id="q"
                                    name="q"
                                    className={styles.input}
                                    value={search}
                                    onChange={handleChange}
                                    inputRef={register}
                                    placeholder="Tìm kiếm khách hàng"
                                    inputProps={{'aria-label': 'Tìm kiếm khách hàng'}}
                                />
                                <IconButton className={styles.iconButton} aria-label="search"
                                            onClick={handleSubmit(onSearch)}>
                                    <SearchIcon/>
                                </IconButton>
                            </Paper>
                        </form>
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
            {
                q === '' ? (
                    <span/>
                ) : (
                    <div className={styles.textSearch}>Kết quả tìm kiếm cho <i>'{q}'</i></div>
                )
            }
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Tên khách hàng</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Cấp độ</TableCell>
                            <TableCell align="left">Điểm</TableCell>
                            <TableCell align="left">Số điện thoại</TableCell>
                            <TableCell align="left">Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {props.data.length > 0 ? (
                        <TableBody>
                            {props.data.map(row => (
                                <RenderRow data={row}/>
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
                            Router.push(`/customer?page=${page}&limit=${rowsPerPage}`)
                        }}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    )
}