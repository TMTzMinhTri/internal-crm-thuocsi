import React, { useCallback, useEffect, useState } from "react";
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
    Switch,
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
    DealStatus,
    DealStatusLabel,
    DealStatusOptions,
    DealTypeLabel,
    DealTypeOptions,
} from "view-models/deal";
import ModalCustom from "components/modal/dialogs";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";

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
    const status = query.status ?? "";

    const dealClient = getDealClient(ctx, {});
    const dealsResp = await dealClient.getDealList({ q, limit, offset, dealType, status, getTotal: true });
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

const FlashSaleLabel = {
    [true]: "Đã bật",
    [false]: "Đã tắt",
    "": "Không xác định"
};

const FlashSaleStyles = {
    [true]: {
        borderColor: "green",
        color: "green",
    },
    [false]: {
        borderColor: "blue",
        color: "blue",
    },
    "": {
        borderColor: "grey",
        color: "grey",
    }
}

const render = (props) => {
    const router = useRouter();
    const toast = useToast();

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
            status: "",
            dealType: "",
            searchText: router.query.q ?? "",
        }
    });
    const { searchText, status, dealType } = filterForm.watch();
    const [selectedDeal, setSelectedDeal] = useState(null);

    const search = useCallback(() => {
        router.push({
            pathname: "/crm/deal",
            query: {
                q: formatUrlSearch(searchText ?? ""),
                status,
                dealType,
                searchText,
            },
        });
    }, [searchText, status, dealType]);

    const updateStatus = useCallback(async () => {
        let { code, status } = selectedDeal;
        if (status === DealStatus.ACTIVE) {
            status = DealStatus.INACTIVE;
        } else {
            status = DealStatus.ACTIVE;
        }
        const dealClient = getDealClient();
        const resp = await dealClient.updateDealStatus({ code, status });
        if (resp.status !== "OK") {
            throw new Error(resp.message);
        }
    }, [selectedDeal]);

    const changePage = useCallback((page, rowsPerPage) => {
        router.push({
            pathname: "/crm/deal",
            query: {
                q: formatUrlSearch(searchText ?? ""),
                limit: rowsPerPage,
                status,
                dealType,
                page,
            },
        });
    }, [searchText, status, dealType])

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

    useEffect(() => {
        search();
    }, [status, dealType]);

    const handleSearch = () => {
        search();
    };

    const handleUpdateDealStatus = async () => {
        try {
            await updateStatus();
            setSelectedDeal(null);
            changePage(page, limit);
        } catch (e) {
            toast.error(e.message);
        }
    }

    const handlePageChange = (_, page, rowsPerPage) => {
        changePage(page, rowsPerPage);
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
                        {/* <Grid item xs={12} sm={2}>
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
                        </Grid> */}
                        <Grid item xs={12} sm={2}>
                            <Controller
                                control={filterForm.control}
                                name="dealType"
                                as={
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        select
                                        placeholder="Chọn loại deal"
                                        label="Loại deal"
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
                                        <MenuItem value="">Tất cả trạng thái</MenuItem>
                                        {DealTypeOptions.map(({ value, label }) => (
                                            <MenuItem key={value} value={value}>{label}</MenuItem>
                                        ))}
                                    </TextField>
                                }
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
                                        <MenuItem value="">Tất cả trạng thái</MenuItem>
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
                            <col width="10%" />
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
                                <TableCell align="left">
                                    Thời gian áp dụng
                                </TableCell>
                                <TableCell align="left">
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
                                        <TableCell align="left">
                                            Từ: {formatDateTime(row.startTime)}
                                            <br />
                                            Đến: {formatDateTime(row.endTime)}
                                        </TableCell>
                                        <TableCell align="left">{formatDateTime(row.readyTime)}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="outlined" style={FlashSaleStyles[row.isFlashSale]} disabled>
                                                {FlashSaleLabel[row.isFlashSale ?? ""]}
                                            </Button>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Switch
                                                color="primary"
                                                checked={row.status === DealStatus.ACTIVE}
                                                onClick={() => setSelectedDeal(row)}
                                            />
                                        </TableCell>
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
                <ModalCustom
                    open={!!selectedDeal}
                    title="Thông báo"
                    onClose={() => setSelectedDeal(null)}
                    onExcute={handleUpdateDealStatus}
                >
                    Bạn có muốn&nbsp;
                    <strong>{selectedDeal?.status === DealStatus.ACTIVE ? "Bật" : "Tắt"}</strong>
                    &nbsp;trạng thái của <strong>{selectedDeal?.name}</strong> này không?
                </ModalCustom>
            </MyCard>
        </AppCRM>
    );
};

export default function ListDealPage(props) {
    return renderWithLoggedInUser(props, render);
}
