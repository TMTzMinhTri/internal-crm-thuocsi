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
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { getSellerClient } from "client/seller";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./seller.module.css";
// import {levels, statuses} from "./form"

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
        return loadSellerData(ctx)
    })
}

export async function loadSellerData(ctx) {
    let data = {props: {}}
    let query = ctx.query
    let q = typeof (query.q) === "undefined" ? '' : query.q
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit

    let sellerClient = getSellerClient(ctx, data)
    let resp = await sellerClient.getSeller(offset, limit, q)
    if (resp.status !== 'OK') {
        return {props: {data: [], count: 0, message: resp.message}}
    }
    // Pass data to the page via props
    return {props: {data: resp.data, count: resp.total}}
}

export default function SellerPage(props) {
    return renderWithLoggedInUser(props, render)
}

function render(props) {
    let router = useRouter()
    const {register, handleSubmit, errors} = useForm();
    let [search, setSearch] = useState('')
    let q = router.query.q || ''
    let page = parseInt(router.query.page) || 0
    let limit = parseInt(router.query.limit) || 20

    function searchSeller(formData) {
        let q = formData.q
        Router.push(`/crm/seller?q=${q}`)
    }

    async function handleChange(event) {
        const target = event.target;
        const value = target.value;
        setSearch(value)
    }

    function onSearch(formData) {
        try {
            searchSeller(formData)
            setSearch('')
        } catch (error) {
            console.log(error)
        }
    }

    const RenderRow = (row, i) => (
        <TableRow key={i}>
            <TableCell component="th" scope="row">{row.data.code}</TableCell>
            <TableCell align="left">{row.data.name}</TableCell>
            <TableCell align="left">{row.data.email}</TableCell>
            <TableCell align="left">{row.data.phone}</TableCell>
            <TableCell align="left">{statuses.find(e => e.value === row.data.status)?.label}</TableCell>
            <TableCell align="center">
                <Link href={`/crm/seller/edit?sellerCode=${row.data.code}`}>
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
        <AppCRM select="/crm/seller">
            <Head>
                <title>Danh sách người bán hàng</title>
            </Head>
            <div className={styles.grid}>
                <Grid container spacing={3} direction="row"
                      justify="flex-start"
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
                                placeholder="Tìm kiếm người bán hàng"
                                inputProps={{'aria-label': 'Tìm kiếm người bán hàng'}}
                            />
                            <IconButton className={styles.iconButton} aria-label="search"
                                        onClick={handleSubmit(onSearch)}>
                                <SearchIcon/>
                            </IconButton>
                        </Paper>
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
                            <TableCell align="left">Mã người bán hàng</TableCell>
                            <TableCell align="left">Tên người bán hàng</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Số điện thoại</TableCell>
                            <TableCell align="left">Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {props.data.length > 0 ? (
                        <TableBody>
                            {props.data.map((row, i) => (
                                <RenderRow data={row} key={i}/>
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
                        labelUnit="người bán hàng"
                        count={props.count}
                        rowsPerPage={limit}
                        page={page}
                        onChangePage={(event, page, rowsPerPage) => {
                            Router.push(`/crm/seller?page=${page}&limit=${rowsPerPage}`)
                        }}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    )
}