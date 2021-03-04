import React, { useEffect, useState } from "react";
import { Grid, IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";
import { useRouter } from "next/router";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { MyCard, MyCardActions, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import Head from "next/head";

import { TableDeliveryTimeValueCell } from "containers/crm/delivery/time/TableDeliveryTimeValueCell";
import { ConfirmDeliveryTimeDialog } from "containers/crm/delivery/time/ConfirmDeliveryTimeDialog";
import AppCRM from "pages/_layout";
import { getFeeClient } from "client/fee";
import { unknownErrorText } from "components/commonErrors";
import { formatUrlSearch } from "components/global";
import styles from "./delivery.module.css";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";

export async function loadPricingData(ctx, offset, limit, q) {
    const feeClient = getFeeClient(ctx);
    const resp = await feeClient.getRegionFeeList(offset, limit, q);
    if (resp.status === "OK") {
        return {
            total: resp.total,
            data: resp.data,
        };
    }
    if (resp.status === "NOT_FOUND") {
        return {
            message: "Không tìm thấy vùng phù hợp."
        };
    }
    return {
        message: resp.message,
    };
}

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, async (ctx) => {
        try {
            const limit = +(ctx.query.limit ?? 20);
            const page = +(ctx.query.page ?? 0);
            const q = ctx.query.q ?? "";
            const { data, message, total } = await loadPricingData(ctx, limit * page, limit, q);
            return {
                props: {
                    deliveryTimeData: data ?? [],
                    message: message ?? null,
                    count: total ?? null,
                }
            };
        } catch (e) {
            return {
                props: {
                    message: e.message,
                }
            };
        }
    });
}

const breadcrumb = [
    {
        name: "Trang chủ",
        link: "/crm"
    },
    {
        name: "Danh sách cài đặt thời gian giao hàng",
    },
];

const render = props => {
    const router = useRouter();
    const toast = useToast();
    const [pagination, setPagination] = useState({
        page: parseInt(router.query.page) || 0,
        limit: parseInt(router.query.limit) || 20,
        count: props.count,
    });
    const { limit, page, count } = pagination;
    const [message, setMessage] = useState(router.query.message ?? "");
    const [search, setSearch] = useState(router.query.q ?? "");
    const [deliveryTimeData, setDeliveryTimeData] = useState(props.deliveryTimeData);
    const [openEstThuocSiModal, setOpenEstThuocSiModal] = useState(false);
    const [openEstLogisticModal, setOpenEstLogisticModal] = useState(false);
    const [estThuocSi, setEstThuocSi] = useState(null);
    const [estLogistic, setEstLogistic] = useState(null);

    const updateEstThuocSi = async () => {
        try {
            const { code, deliveryTime } = estThuocSi;
            const feeClient = getFeeClient();
            const res = await feeClient.updateRegionFee({ code, estThuocSi: deliveryTime });
            if (res.status === "OK") {
                toast.success("Cập nhật thời gian giao hàng thành công");
                const data = [...deliveryTimeData];
                data.find((v, i) => {
                    const found = v.code === code;
                    if (found) {
                        data[i].estThuocSi = deliveryTime;
                    }
                });
                setDeliveryTimeData(data);
            } else {
                toast.error(res.message ?? unknownErrorText);
            }
        } catch (err) {
            toast.error(err.message ?? unknownErrorText);
        }
    };

    const updateEstLogistic = async () => {
        try {
            const { code, deliveryTime } = estLogistic;
            const feeClient = getFeeClient();
            const res = await feeClient.updateRegionFee({ code, estLogistic: deliveryTime });
            if (res.status === "OK") {
                toast.success("Cập nhật thời gian giao hàng thành công");
                const data = [...deliveryTimeData];
                data.find((v, i) => {
                    const found = v.code === code;
                    if (found) {
                        data[i].estLogistic = deliveryTime;
                    }
                });
                setDeliveryTimeData(data);
            } else {
                toast.error(res.message ?? unknownErrorText);
            }
        } catch (err) {
            toast.error(err.message ?? unknownErrorText);
        }
    };

    useEffect(() => {
        setDeliveryTimeData(props.deliveryTimeData);
        setMessage(props.message);
    }, [props.deliveryTimeData, props.message]);
    useEffect(() => {
        setPagination({
            page: parseInt(router.query.page) || 0,
            limit: parseInt(router.query.limit) || 20,
            count: props.count,
        });
    }, [router.query.page, router.query.limit, props.count]);
    useEffect(() => {
        setSearch(router.query.q ?? "");
    }, [router.query.q]);

    const handleSearch = () => {
        router.push({
            pathname: "/crm/delivery/time",
            query: {
                q: formatUrlSearch(search),
            }
        });
    };

    const handlePageChange = async (event, page, rowsPerPage) => {
        router.push({
            pathname: "/crm/delivery/time",
            query: {
                page: page,
                limit: rowsPerPage,
                q: formatUrlSearch(search),
            }
        });
    };

    return (
        <AppCRM select="/crm/delivery/time" breadcrumb={breadcrumb}>
            <Head>
                <title>Danh sách thời gian giao hàng</title>
            </Head>
            <MyCard>
                <MyCardHeader title="Danh sách thời gian giao hàng" />
                <MyCardActions>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <Paper className={styles.search}>
                                <InputBase
                                    id="q"
                                    name="q"
                                    className={styles.input}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={event => {
                                        if (event.key === "Enter" || event.keyCode === 13) {
                                            handleSearch();
                                        }
                                    }}
                                    placeholder="Nhập mã vùng, tên vùng"
                                />
                                <IconButton className={styles.iconButton} aria-label="search"
                                    onClick={handleSearch}>
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </Grid>
                    </Grid>

                </MyCardActions>
            </MyCard>
            <MyCard>
                <TableContainer>
                    <Table size="small">
                        <colgroup>
                            <col width="20%"></col>
                            <col width="20%"></col>
                            <col width="20%"></col>
                            <col width="20%"></col>
                            <col width="20%"></col>
                        </colgroup>
                        <TableHead>
                            <TableCell>Mã vùng</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Thời gian giao hàng từ thuốc sỉ</TableCell>
                            <TableCell>Thời gian giao hàng từ DVGH</TableCell>
                            <TableCell align="center">Tổng thời gian dự kiến</TableCell>
                        </TableHead>
                        <TableBody>
                            {!deliveryTimeData?.length && (
                                <TableRow>
                                    <TableCell colSpan={6} align="left">
                                        {message}
                                    </TableCell>
                                </TableRow>
                            )}
                            {deliveryTimeData?.map((row, i) => (
                                <TableRow key={`tr_${i}`}>
                                    <TableCell>{row.code}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableDeliveryTimeValueCell
                                        code={row.code}
                                        initialDeliveryTime={row.estThuocSi}
                                        onUpdate={(values) => {
                                            setEstThuocSi(values);
                                            setOpenEstThuocSiModal(true);
                                        }}
                                    />
                                    <TableDeliveryTimeValueCell
                                        code={row.code}
                                        initialDeliveryTime={row.estLogistic}
                                        onUpdate={(values) => {
                                            setEstLogistic(values);
                                            setOpenEstLogisticModal(true);
                                        }}
                                    />
                                    <TableCell align="center">{row.estThuocSi + row.estLogistic} ngày</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        {count && (
                            <MyTablePagination
                                labelUnit="vùng"
                                count={count}
                                rowsPerPage={limit}
                                page={page}
                                onChangePage={handlePageChange}
                            />
                        )}
                    </Table>
                    <ConfirmDeliveryTimeDialog
                        open={openEstThuocSiModal}
                        onClose={() => setOpenEstThuocSiModal(false)}
                        onConfirm={() => updateEstThuocSi()}
                    />
                    <ConfirmDeliveryTimeDialog
                        open={openEstLogisticModal}
                        onClose={() => setOpenEstLogisticModal(false)}
                        onConfirm={() => updateEstLogistic()}
                    />
                </TableContainer>
            </MyCard>
        </AppCRM>
    );
};

export default function DeliveryTimePage(props) {
    return renderWithLoggedInUser(props, render);
}
