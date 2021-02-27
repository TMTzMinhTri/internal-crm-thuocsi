import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
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
import { formatUrlSearch, sellerStatuses } from 'components/global';
import { MyCard, MyCardActions, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faPlus } from "@fortawesome/free-solid-svg-icons";
import { SellerFilter } from "containers/crm/seller/SellerFilter";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadSellerData(ctx)
    })
}

export async function loadSellerData(ctx) {
    let data = { props: {} }
    let query = ctx.query
    let q = typeof (query.q) === "undefined" ? '' : query.q
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit

    let sellerClient = getSellerClient(ctx, data)
    let resp = await sellerClient.getSeller(offset, limit, q)
    if (resp.status !== 'OK') {
        return { props: { data: [], count: 0, message: 'Không tìm thấy nhà bán hàng nào' } }
    }
    // Pass data to the page via props
    return { props: { data: resp.data, count: resp.total } }
}

async function getSellersByFilter(data, limit, offset) {
    const res = {
        sellers: [],
        total: 0,
        message: "",
    }
    try {
        let sellerClient = getSellerClient({});
        const sellerResp = await sellerClient.getSellerByFilter({ ...data, limit, offset });
        if (sellerResp.status !== "OK") {
            if (sellerResp.status === 'NOT_FOUND') {
                res.message = "Không tìm thấy kết quả phù hợp";
            } else {
                res.message = sellerResp.message;
            }
        } else {
            res.sellers = sellerResp.data;
            res.total = sellerResp.total;
        }
    } catch (e) {
        res.message = e.message;
    }
    return res;
}

export default function SellerPage(props) {
    return renderWithLoggedInUser(props, render)
}

function render(props) {
    const statusColor = {
        "NEW": "blue",
        "DRAFT": "grey"
    }
    let router = useRouter()
    const { register, handleSubmit } = useForm();
    let q = router.query.q || ''
    let [search, setSearch] = useState(q)
    const [sellers, setSellers] = useState(props.data ?? []);
    const [message, setMessage] = useState(props.message);
    const [openSellerFilter, setOpenSellerFilter] = useState(false);
    const [sellerFilter, setSellerFilter] = useState();
    const [pagination, setPagination] = useState({
        page: parseInt(router.query.page) || 0,
        limit: parseInt(router.query.limit) || 20,
        count: props.count,
    })
    const { limit, page, count } = pagination;

    async function handleChange(event) {
        const target = event.target;
        const value = target.value;
        setSearch(value)
    }

    function onSearch() {
        let q = formatUrlSearch(search)
        router.push(`?q=${q}`)
    }

    const handleApplyFilter = async (data) => {
        setSellerFilter(data);
        const { sellers, message, total } = await getSellersByFilter(data, limit, 0);
        if (message) setMessage(message);
        setSellers(sellers);
        setPagination({
            limit,
            page: 0,
            count: total,
        })
        Router.replace("/crm/seller", "/crm/seller", {
            shallow: true,
        });
    }

    const handlePageChange = async (event, page, rowsPerPage) => {
        if (openSellerFilter && sellerFilter) {
            const { sellers, message, total } = await getSellersByFilter(sellerFilter, rowsPerPage, page);
            if (message) setMessage(message);
            setSellers(sellers);
            setPagination({
                limit: rowsPerPage,
                page,
                count: total,
            })
        } else {
            Router.push(`/crm/seller?page=${page}&limit=${rowsPerPage}&q=${search}`);
        }
    }

    const RenderRow = (row, i) => (
        <TableRow key={i}>
            <TableCell component="th" scope="row">{row.data.code}</TableCell>
            <TableCell align="left">{row.data.name}</TableCell>
            <TableCell align="left" style={{ overflowWrap: 'anywhere' }}>{row.data.email}</TableCell>
            <TableCell align="left">{row.data.phone}</TableCell>
            <TableCell align="left">
                <Button size="small" variant="outlined" style={{ color: `${statusColor[row.data.status]}`, borderColor: `${statusColor[row.data.status]}` }}>
                    {sellerStatuses.find(e => e.value === row.data.status)?.label}
                </Button>
            </TableCell>
            <TableCell align="center">
                <Link href={`/crm/seller/edit?sellerCode=${row.data.code}`}>
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
    )

    let breadcrumb = [
        {
            name: "Trang chủ",
            link: "/crm"
        },
        {
            name: "Danh sách nhà bán hàng",
        },
    ]

    return (
        <AppCRM select="/crm/seller" breadcrumb={breadcrumb}>
            <Head>
                <title>Danh sách nhà bán hàng</title>
            </Head>
            <MyCard>
                <MyCardHeader title="Danh sách nhà bán hàng">
                    <Button variant="contained" color="primary" style={{ marginRight: 8 }}
                        onClick={() => setOpenSellerFilter(!openSellerFilter)}
                    >
                        <FontAwesomeIcon icon={faFilter} style={{ marginRight: 8 }} />
                        Bộ lọc
                    </Button>
                    <Link href="/crm/seller/new">
                        <Button variant="contained" color="primary">
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />  Thêm nhà bán hàng
                        </Button>
                    </Link>
                </MyCardHeader>
                <Box display={!openSellerFilter ? "block" : "none"}>
                    <MyCardActions>
                        <Paper className={styles.search}>
                            <InputBase
                                id="q"
                                name="q"
                                className={styles.input}
                                value={search}
                                onKeyPress={event => {
                                    if (event.key === 'Enter' || event.keyCode === 13) {
                                        onSearch()
                                    }
                                }}
                                onChange={handleChange}
                                inputRef={register}
                                placeholder="Tìm kiếm nhà bán hàng"
                                inputProps={{ 'aria-label': 'Tìm kiếm nhà bán hàng' }}
                            />
                            <IconButton className={styles.iconButton} aria-label="search"
                                onClick={handleSubmit(onSearch)}>
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </MyCardActions>
                </Box>
                <SellerFilter
                    open={openSellerFilter}
                    onFilterChange={handleApplyFilter}
                    q={search}
                    onClose={({q}) => setSearch(q)}
                />
            </MyCard>
            <MyCard>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Mã nhà bán hàng</TableCell>
                                <TableCell align="left">Tên nhà bán hàng</TableCell>
                                <TableCell align="left">Email</TableCell>
                                <TableCell align="left">Số điện thoại</TableCell>
                                <TableCell align="left">Trạng thái</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        {sellers.length > 0 ? (
                            <TableBody>
                                {sellers.map((row, i) => (
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
                            labelUnit="nhà bán hàng"
                            count={count}
                            rowsPerPage={limit}
                            page={page}
                            onChangePage={handlePageChange}
                        />
                    </Table>
                </TableContainer>
            </MyCard>
        </AppCRM>
    )
}