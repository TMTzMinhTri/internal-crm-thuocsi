import React, { useState } from "react";
import {
    Button,
    ButtonGroup,
    Grid,
    IconButton,
    InputBase,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";

import AppCMS from "pages/_layout";
import {
    doWithLoggedInUser,
    renderWithLoggedInUser,
} from "@thuocsi/nextjs-components/lib/login";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { ErrorCode, formatUrlSearch } from "components/global";

import styles from "./fee.module.css";
import { feeLabels } from "view-models/fee";
import { getFeeClient } from "client/fee";

async function loadFeeData(ctx) {
    const query = ctx.query;
    const q = query.q ?? "";
    const page = query.page || 0;
    const limit = query.limit || 20;
    const offset = page * limit;
    const feeClient = getFeeClient(ctx);
    const res = await feeClient.getFee(offset, limit, q);
    if (res.status !== 'OK') {
        if (res.status === 'NOT_FOUND') {
            return { data: [], count: 0, message: 'Không tìm thấy phí dịch vụ' }
        }
        return { data: [], count: 0, message: res.message }
    }
    return { data: res.data, count: res.total }

}

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, async () => {
        return {
            props: {
                data: await loadFeeData(ctx),
            },
        };
    });
}

function render({data}) {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");

    async function onSearch() {
        const q = formatUrlSearch(searchText);
        router.push(`?q=${q}`);
    }

    return (
        <AppCMS select="/crm/fee">
            <Head>
                <title>Phí dịch vụ</title>
            </Head>
            <div className={styles.grid}>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <Grid item xs={6} sm={4} md={4}>
                        <Paper className={styles.search}>
                            <InputBase
                                id="q"
                                name="q"
                                className={styles.input}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                autoComplete="off"
                                placeholder="Nhập tên hoặc mã phí dịch vụ"
                            />
                            <IconButton
                                className={styles.iconButton}
                                aria-label="search"
                                onClick={onSearch}
                            >
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={3} md={3}>
                        <Link href="/crm/fee/new">
                            <ButtonGroup
                                color="primary"
                                aria-label="contained primary button group"
                                className={styles.rightGroup}
                            >
                                <Button variant="contained" color="primary">
                                    Thêm phí dịch vụ
                                </Button>
                            </ButtonGroup>
                        </Link>
                    </Grid>
                </Grid>
            </div>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <colgroup>
                        <col width="15%" />
                        <col width="20%" />
                        <col width="15%" />
                        <col width="30%" />
                        <col width="10%" />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Mã phí</TableCell>
                            <TableCell align="left">Tên phí</TableCell>
                            <TableCell align="left">Loại công thức áp dụng</TableCell>
                            <TableCell align="left">Công thức tính</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {data.count <= 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="left">
                                {ErrorCode["NOT_FOUND_TABLE"]}
                            </TableCell>
                        </TableRow>
                    ) : (
                            <TableBody>
                                {data.data.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{row.code}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{feeLabels[row.type]}</TableCell>
                                        <TableCell>{row.formula}</TableCell>
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
                    {data.count > 0 ?? (
                        <MyTablePagination
                            labelUnit="phí dịch vụ"
                            count={data.count}
                            rowsPerPage={limit}
                            page={page}
                            onChangePage={(_, page, rowsPerPage) => {
                                Router.push(
                                    `/cms/fee?page=${page}&limit=${rowsPerPage}&q=${searchText}`
                                );
                            }}
                        />
                    )}
                </Table>
            </TableContainer>
        </AppCMS>
    );
}

export default function FeePage(props) {
    return renderWithLoggedInUser(props, render);
}
