import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Button,
    Grid,
    IconButton,
    InputBase,
    Paper,
    Switch, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import {
    doWithLoggedInUser,
    renderWithLoggedInUser
} from "@thuocsi/nextjs-components/lib/login";
import { MyCard, MyCardActions, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getFeeClient } from "client/fee";
import { actionErrorText, unknownErrorText } from "components/commonErrors";
import { ErrorCode, formatUrlSearch } from "components/global";
import { ConfirmDialog } from "containers/crm/fee/ConfirmDialog";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { feeLabels } from "view-models/fee";
import styles from "./fee.module.css";

async function loadFeeData(ctx, offset, limit, q) {

    const feeClient = getFeeClient(ctx);
    const res = await feeClient.getFee(offset, limit, q);
    if (res.status !== 'OK') {
        if (res.status === 'NOT_FOUND') {
            return { data: [], count: 0, message: 'Không tìm thấy công thức phí' }
        }
        return { data: [], count: 0, message: res.message }
    }
    return { data: res.data, count: res.total }

}

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, async () => {
        const query = ctx.query;
        const q = query.q ?? "";
        const page = +(query.page ?? 0);
        const limit = +(query.limit ?? 20);
        const offset = page * limit;

        return {
            props: {
                feeData: await loadFeeData(ctx, offset, limit, q),
                page,
                limit,
                q,
            },
        };
    });
}

function render({ feeData, page, limit, q }) {
    const router = useRouter();
    const { error, success } = useToast();
    const [searchText, setSearchText] = useState(q);
    const [openModal, setOpenModal] = useState(false);
    const [currentEditValue, setCurrentEditValue] = useState();

    async function searchFee() {
        const q = formatUrlSearch(searchText);
        router.push(`?limit${limit}&q=${q}`);
    }

    const updateFeeStatus = async () => {
        try {
            const { feeCode, isActive } = currentEditValue
            if (isActive) {
                const client = getFeeClient()
                const res = await client.approveFee({ code: feeCode, status: "ACTIVE" })
                if (res.status === 'OK') {
                    feeData.data.filter(fee => fee.code === feeCode)[0].status = isActive ? "ACTIVE" : "INACTIVE"
                    success("Kích hoạt phí thành công");
                } else {
                    error(res.message ?? actionErrorText);
                }
            }
            else {
                const client = getFeeClient()
                const res = await client.lockFee({ code: feeCode, status: "INACTIVE" })
                if (res.status === 'OK') {
                    feeData.data.filter(fee => fee.code === feeCode)[0].status = isActive ? "ACTIVE" : "INACTIVE"
                    success("Khóa phí thành công");
                } else {
                    error(res.message ?? actionErrorText);
                }
            }
            setCurrentEditValue(null)
        } catch (err) {
            error(err ?? unknownErrorText)
        }
    }

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            searchFee();
        }
    }

    let breadcrumb = [
        {
            name: "Trang chủ",
            link: "/crm"
        },
        {
            name: "Danh sách công thức phí"
        }
    ]

    return (
        <AppCRM select="/crm/fee" breadcrumb={breadcrumb}>
            <Head>
                <title>Danh sách công thức phí</title>
            </Head>
            <MyCard>
                <MyCardHeader title="Danh sách công thức phí">
                    <Link href="/crm/fee/new">
                        <Button variant="contained" color="primary">
                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />  Thêm công thức phí
                        </Button>
                    </Link>
                </MyCardHeader>
                <MyCardActions>
                    <Grid container spacing={1} md={6}>
                        <Grid item xs={4}>
                            <Paper className={styles.search} style={{width: '100%'}}>
                                <InputBase
                                    id="q"
                                    name="q"
                                    className={styles.input}
                                    value={searchText}
                                    autoComplete='off'
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyPress={handleSearch}
                                    placeholder="Nhập tên hoặc mã công thức phí"
                                    inputProps={{ 'aria-label': 'Nhập tên phí' }}
                                />
                                <IconButton className={styles.iconButton} aria-label="search"
                                    onClick={searchFee}>
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </Grid>
                    </Grid>
                </MyCardActions>
            </MyCard>
            <MyCard>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <colgroup>
                            <col width="10%" />
                            <col width="20%" />
                            <col width="15%" />
                            <col width="30%" />
                            <col width="15%" />
                            <col width="10%" />
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Mã phí</TableCell>
                                <TableCell align="left">Tên phí</TableCell>
                                <TableCell align="left">Loại công thức áp dụng</TableCell>
                                <TableCell align="left">Công thức tính</TableCell>
                                <TableCell align="center">Trạng thái</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        {!feeData.count ? (
                            <TableRow>
                                <TableCell colSpan={5} align="left">
                                    {ErrorCode["NOT_FOUND_TABLE"]}
                                </TableCell>
                            </TableRow>
                        ) : (
                                <TableBody>
                                    {feeData.data.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{row.code}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{feeLabels[row.type]}</TableCell>
                                            <TableCell>{row.formula}</TableCell>
                                            <TableCell align="center">
                                                <Switch
                                                    onChange={(event) => {
                                                        setOpenModal(true)
                                                        setCurrentEditValue({ feeCode: row.code, isActive: event.target.checked });
                                                    }}
                                                    checked={row.status === "ACTIVE" ? true : false}
                                                    color="primary"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Link href={`/crm/fee/edit?feeCode=${row.code}`}>
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
                                    ))}
                                </TableBody>
                            )}
                        {!!feeData.count && (
                            <MyTablePagination
                                labelUnit="công thức phí"
                                count={feeData.count}
                                rowsPerPage={limit}
                                page={page}
                                onChangePage={(_, page, rowsPerPage) => {
                                    Router.push(
                                        `/crm/fee?page=${page}&limit=${rowsPerPage}&q=${searchText}`
                                    );
                                }}
                            />
                        )}
                    </Table>
                </TableContainer>
            </MyCard>
            <ConfirmDialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={() => updateFeeStatus()}
            />
        </AppCRM>
    );
}

export default function FeePage(props) {
    return renderWithLoggedInUser(props, render);
}
