import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    doWithLoggedInUser,
    renderWithLoggedInUser,
} from "@thuocsi/nextjs-components/lib/login";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import {
    MyCard,
    MyCardActions,
    MyCardHeader,
} from "@thuocsi/nextjs-components/my-card/my-card";
import Link from "next/link";
import {
    Button,
    Grid,
    IconButton,
    InputBase,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import { Search as SearchIcon, Edit as EditIcon } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import styles from "./deal.module.css";
import { formatDateTime, formatNumber, formatUrlSearch } from "components/global";
import AppCRM from "pages/_layout";
import { getDealClient } from "client/deal";
import {
    DealFlashSaleLabel,
    DealStatusLabel,
    DealStatusOptions,
    DealTypeLabel,
} from "view-models/deal";

async function loadDealData(ctx) {
    const props = {
        deals: [],
        count: 0,
        message: "",
    };
    const query = ctx.query;
    const q = query.q ?? "";
    const page = +query.page ?? 0;
    const limit = +query.limit ?? 20;
    const offset = page * limit;
    const dealType = query.dealType ?? "";

    const dealClient = getDealClient(ctx, {});
    const dealsResp = await dealClient.getDealList({ q, limit, offset, dealType, getTotal: true });
    if (dealsResp.status !== "OK") {
        if (dealsResp.status === "NOT_FOUND") {
            props.message = "Không tìm thấy kết quả phù hợp";
        } else {
            props.message = dealsResp.message;
        }
        return {
            props,
        };
    }
    props.deals = dealsResp.data ?? [];
    props.count = dealsResp.total ?? 0;

    return {
        props,
    };
}

export function getServerSideProps(ctx) {
    return doWithLoggedInUser(ctx, loadDealData);
}

const breadcrumb = [
    {
        name: "Trang chủ",
        link: "/crm",
    },
    {
        name: "Danh sách deal",
    },
];

const render = (props) => {
    const router = useRouter();

    const [deals, setDeals] = useState(props.deals);
    const [message, setMessage] = useState(props.message);
    const [pagination, setPagination] = useState({
        page: parseInt(router.query.page) || 0,
        limit: parseInt(router.query.limit) || 20,
        count: props.count,
    });
    const { limit, page, count } = pagination;
    const filterForm = useForm({
        defaultValues: {
            expireDate: null,
            status: null,
            searchText: router.query.q ?? "",
        }
    });
    const { expireDate, searchText, status } = filterForm.watch();

    useEffect(() => {
        setPagination({
            page: parseInt(router.query.page) || 0,
            limit: parseInt(router.query.limit) || 20,
            count: props.count,
        });
    }, [router.query.page, router.query.limit, props.count]);
    useEffect(() => {
        setDeals(props.deals);
        setMessage(props.message);
    }, [props.deals, props.message]);

    const handleSearch = () => {
        router.push({
            pathname: "/crm/deal",
            query: {
                q: formatUrlSearch(searchText),
                expireDate,
                status,
            },
        });
    };

    const handlePageChange = (_, page, rowsPerPage) => {
        router.push({
            pathname: "/crm/deal",
            query: {
                q: formatUrlSearch(searchText),
                limit: rowsPerPage,
                page,
            },
        });
    };

    return (
        <AppCRM breadcrumb={breadcrumb}>
            <MyCard>
                <MyCardHeader>
                    <Link href="/crm/deal/new">
                        <Button variant="contained" color="primary">
                            <FontAwesomeIcon
                                icon={faPlus}
                                style={{ marginRight: 8 }}
                            />
                            Thêm mới
                        </Button>
                    </Link>
                </MyCardHeader>
                <MyCardActions>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <Paper className={styles.search}>
                                <InputBase
                                    id="q"
                                    name="q"
                                    className={styles.input}
                                    value={searchText}
                                    inputRef={filterForm.register}
                                    placeholder="Nhập tên deal"
                                    fullWidth
                                    onKeyPress={(event) => {
                                        if (event.key === "Enter" || event.keyCode === 13) {
                                            handleSearch();
                                        }
                                    }}
                                />
                                <IconButton
                                    className={styles.iconButton}
                                    aria-label="search"
                                    onClick={handleSearch}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                variant="outlined"
                                size="small"
                                type="date"
                                placeholder="Hạn sử dụng"
                                label="Hạn sử dụng"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    style: {
                                        background: "white"
                                    }
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Controller
                                control={filterForm.control}
                                name="status"
                                as={
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        select
                                        placeholder="Chọn trạng thái"
                                        label="Trang thái"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            style: {
                                                background: "white"
                                            },
                                        }}
                                        SelectProps={{
                                            displayEmpty: true,
                                        }}
                                        fullWidth
                                    >
                                        <MenuItem value={null}>Tất cả trạng thái</MenuItem>
                                        {DealStatusOptions.map(({ value, label }) => (
                                            <MenuItem key={value} value={value}>{label}</MenuItem>
                                        ))}
                                    </TextField>
                                }
                            />
                        </Grid>
                    </Grid>
                </MyCardActions>
            </MyCard>
            <MyCard>
                <TableContainer>
                    <Table size="small" aria-label="a dense table">
                        <colgroup>
                            <col width="15%" />
                            <col />
                            <col />
                            <col />
                            <col />
                            <col />
                            <col />
                            <col />
                            <col />
                            <col />
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Tên deal</TableCell>
                                <TableCell align="left">Loại deal</TableCell>
                                <TableCell align="right">Đã bán</TableCell>
                                <TableCell align="right">Số lượng</TableCell>
                                <TableCell align="right">Giá</TableCell>
                                <TableCell align="center">
                                    Thời gian áp dụng
                                </TableCell>
                                <TableCell align="center">
                                    Thời gian hiển thị
                                </TableCell>
                                <TableCell align="center">Flash sale</TableCell>
                                <TableCell align="center">Trạng thái</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        {deals.length > 0 ? (
                            <TableBody>
                                {deals.map((row, i) => (
                                    <TableRow key={i} row={row} i={i}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{DealTypeLabel[row.dealType]}</TableCell>
                                        <TableCell align="right">{row.quantity}</TableCell>
                                        <TableCell align="right">{row.maxQuantity}</TableCell>
                                        <TableCell align="right">{formatNumber(row.price ?? 0)}</TableCell>
                                        <TableCell align="center">{formatDateTime(row.startTime)}</TableCell>
                                        <TableCell align="center">{formatDateTime(row.readyTime)}</TableCell>
                                        <TableCell align="center">{DealFlashSaleLabel[row.isFlashSale]}</TableCell>
                                        <TableCell align="center">{DealStatusLabel[row.status]}</TableCell>
                                        <TableCell align="center">
                                            <Link
                                                href={`/crm/deal/edit?dealCode=${row.code}`}
                                            >
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
                                        <TableCell colSpan={3} align="left">
                                            {message}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            )}

                        <MyTablePagination
                            labelUnit="deal"
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
};

export default function ListDealPage(props) {
    return renderWithLoggedInUser(props, render);
}
