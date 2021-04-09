import {
    InputBase, Button, ButtonGroup, CardContent, IconButton, Paper, Typography, Box,
    TextField, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow,
} from "@material-ui/core";
import { MyCard, MyCardActions, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import SearchIcon from "@material-ui/icons/Search";
import Grid from "@material-ui/core/Grid";
import { getCommonAPI } from 'client/common';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import Link from "next/link";
import AppCRM from "pages/_layout";
import { unknownErrorText } from "components/commonErrors";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { formSetter } from "utils/HookForm"
import styles from "./order.module.css";
import { getOrderClient } from "client/order";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { formatDateTime } from 'components/global';
import { useRouter } from "next/router";
import { OrderLog, OrderItemLog, OrderAction } from "components/global"
import { makeStyles } from "@material-ui/core";

const breadcrumb = [
    {
        name: "Trang chủ",
        link: "/crm"
    },
    {
        name: "Danh sách đơn hàng",
        link: "/crm/order",
    },
    {
        name: "Lịch sử đơn hàng",
    },
];



const useStyles = makeStyles({
    root: {
        '&.MuiTableRow-root': {
            verticalAlign: 'initial',
        }
    },
});

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadData(ctx);
    });
}

export async function loadData(ctx) {
    let data = {
        props: {
            status: "OK"
        }
    };


    const orderCode = ctx.query.orderCode

    data.props.orderCode = orderCode || ""

    return data;
}

export default function CreateCartPage(props) {
    return renderWithLoggedInUser(props, renderForm)
}

export function renderForm(props) {

    const router = useRouter()
    const orderClient = getOrderClient()

    const [search, setSearch] = useState(router.query.orderCode || props.orderCode)
    const [orderData, setOrderData] = useState(null)

    const [orderLogData, setOrderLogData] = useState([])
    const { register, setValue, reset } = useForm({
        defaultValues: {},
        mode: "onChange"
    });

    useEffect(() => {
        onSearch()
    }, [router.query.orderCode])

    useEffect(() => {
        getOrderLogData()
    }, [orderData])


    const removeFalsyValue = (obj) => {
        let newObj = {}
        for (let key in obj) {
            if (obj[key]) {
                newObj[key] = obj[key]
            }
        }
        return newObj
    }

    const buildArray = (obj) => {
        let arr = []
        for (let key in obj) {
            arr.push({ "key": key, "value": obj[key] })
        }
        return arr
    }

    const getOrderData = async () => {
        if (search?.length == 0) return
        const resp = await orderClient.getOrderByOrderNoFromClient(search)
        if (resp.status === "OK") {
            setOrderData(resp.data[0])
            formSetter(resp.data[0], ["customerName", "customerPhone", "totalPrice", "totalFee"], setValue)
        } else {
            setOrderData(null)
            reset()
        }
    }

    const getOrderLogData = async () => {
        const orderClient = getOrderClient()
        const resp = await orderClient.getOrderLogByOrderNo(orderData?.orderNo)
        console.log(resp)
        if (resp.status == "OK") {
            resp.data.forEach((item, idx) => {
                let orderNext = removeFalsyValue(item.next.order)
                let orderPrevious = removeFalsyValue(item.previous.order)
                let orderItemsNext = item.next.orderItems ? removeFalsyValue(item.next.orderItems[0]) : {}
                let orderItemsPrevious = item.previous.orderItems ? removeFalsyValue(item.previous.orderItems[0]) : {}
                resp.data[idx].next.order = buildArray(orderNext)
                resp.data[idx].previous.order = buildArray(orderPrevious)
                resp.data[idx].next.orderItems = buildArray(orderItemsNext)
                resp.data[idx].previous.orderItems = buildArray(orderItemsPrevious)
            })
            setOrderLogData(resp.data)
        } else {
            setOrderLogData([])
        }
    }

    const onSearch = () => {
        getOrderData()
    }

    return (
        <AppCRM select="/crm/customer/order" breadcrumb={breadcrumb}>
            <Head>
                <title>Đặt hàng</title>
            </Head>
            <MyCard>
                <MyCardHeader title="Lịch sử đơn hàng" />
                <MyCardActions>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Paper className={styles.search}>
                                <InputBase
                                    id="q"
                                    name="q"
                                    className={styles.input}
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyPress={event => {
                                        if (event.key === 'Enter' || event.keyCode === 13) {
                                            // onSearch();
                                            router.push(`/crm/order/history?orderCode=${search}`)
                                        }
                                    }}
                                    placeholder="Nhập mã đơn hàng"
                                />
                                <IconButton className={styles.iconButton} aria-label="search"
                                    onClick={() => { if (search?.length > 0) router.push(`/crm/order/history?orderCode=${search}`) }}>
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </Grid>
                    </Grid>
                </MyCardActions>
            </MyCard>
            <form>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={6}>
                        <MyCard>
                            <MyCardHeader title={"Đơn hàng # " + orderData?.orderId} small={true}></MyCardHeader>
                            <MyCardContent style={{ display: orderData ? null : 'none' }}>
                                <Grid spacing={3} container>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            id="customerName"
                                            name="customerName"
                                            label="Tên khách hàng"
                                            variant="outlined"
                                            size="small"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            disabled
                                            fullWidth
                                            inputRef={register}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            id="customerPhone"
                                            name="customerPhone"
                                            label="Số điện thoại"
                                            variant="outlined"
                                            size="small"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            disabled
                                            fullWidth
                                            inputRef={register}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} />
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            id="totalFee"
                                            name="totalFee"
                                            label="Giá trị phí"
                                            variant="outlined"
                                            size="small"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            disabled
                                            fullWidth
                                            inputRef={register}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            id="totalPrice"
                                            name="totalPrice"
                                            label="Giá trị đơn hàng"
                                            variant="outlined"
                                            size="small"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            disabled
                                            fullWidth
                                            inputRef={register}
                                        />
                                    </Grid>
                                </Grid>
                            </MyCardContent>
                        </MyCard>
                    </Grid>
                </Grid>

                <MyCard>
                    <MyCardHeader title="Lịch sử thay đổi đơn hàng" small={true}></MyCardHeader>
                    <MyCardContent>
                        {orderLogData?.length > 0 && (<Box style={{ marginTop: '10px' }}>
                            <TableContainer>
                                <Table variant="outlined"
                                    size="small" aria-label="a dense table">
                                    <colgroup>
                                        <col width="15%" />
                                        <col width="15%" />
                                        <col width="15%" />
                                        <col width="20%" />
                                        <col width="5%" />
                                        <col width="25%" />
                                    </colgroup>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Thời gian cập nhật</TableCell>
                                            <TableCell align="left">Người cập nhật</TableCell>
                                            <TableCell align="left">Thao tác</TableCell>
                                            <TableCell align="left">Trước</TableCell>
                                            <TableCell align="left"></TableCell>
                                            <TableCell align="left">Sau</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderLogData?.map((row, i) => {
                                            let previousOrdersItemChange = 0
                                            let previousOrderChange = 0
                                            let nextOrdersItemChange = 0
                                            let nextOrderChange = 0
                                            row.previous.order?.map(item => {
                                                if (OrderLog[item.key]) {
                                                    previousOrderChange++
                                                }
                                            })
                                            row.previous.orderItems?.map(item => {
                                                if (OrderItemLog[item.key]) {
                                                    previousOrdersItemChange++
                                                }
                                            })
                                            row.next.order?.map(item => {
                                                if (OrderLog[item.key]) {
                                                    nextOrderChange++
                                                }
                                            })

                                            row.next.orderItems?.map(item => {
                                                if (OrderItemLog[item.key]) {
                                                    nextOrdersItemChange++
                                                }
                                            })
                                            if (previousOrderChange + nextOrderChange + previousOrdersItemChange + nextOrdersItemChange == 0) return null
                                            return (
                                                <TableRow key={i}>
                                                    <TableCell align="left">{formatDateTime(row.createdTime)}</TableCell>
                                                    <TableCell align="left">{row.actionBy}</TableCell>
                                                    <TableCell align="left">{OrderAction[row.actionCode]}</TableCell>
                                                    <TableCell align="left">
                                                        {
                                                            previousOrderChange > 0 &&
                                                            <>
                                                                <b>Order</b>
                                                                {row.previous.order?.map(item => {
                                                                    if (OrderLog[item.key]) {
                                                                        previousOrderChange++
                                                                        return (<p> {OrderLog[item.key]} : {item.value}</p>)
                                                                    }
                                                                }
                                                                )}
                                                            </>
                                                        }
                                                        <p></p>
                                                        {
                                                            previousOrdersItemChange > 0 &&
                                                            <>
                                                                <b>Order-Item</b>
                                                                {row.previous.orderItems?.map(item => {
                                                                    if (OrderItemLog[item.key]) {
                                                                        previousOrdersItemChange++
                                                                        return (<p> {OrderItemLog[item.key]} : {item.value}</p>)
                                                                    }
                                                                }
                                                                )}
                                                            </>
                                                        }
                                                        {previousOrdersItemChange == 0 && previousOrderChange == 0 && <p> ---- </p>}
                                                    </TableCell>
                                                    <TableCell>
                                                        <FontAwesomeIcon icon={faArrowRight} />
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {
                                                            nextOrderChange > 0 &&
                                                            <>
                                                                <b>Order</b>
                                                                {row.next.order?.map(item => {
                                                                    if (OrderLog[item.key]) {
                                                                        nextOrderChange++
                                                                        return (<p> {OrderLog[item.key]} : {item.value}</p>)
                                                                    }
                                                                }
                                                                )}
                                                            </>
                                                        }
                                                        <p></p>
                                                        {
                                                            nextOrdersItemChange > 0 &&
                                                            <>
                                                                <b>Order-Item</b>
                                                                {row.next.orderItems?.map(item => {
                                                                    if (OrderItemLog[item.key]) {
                                                                        nextOrdersItemChange++
                                                                        return (<p> {OrderItemLog[item.key]} : {item.value}</p>)
                                                                    }
                                                                }
                                                                )}
                                                            </>
                                                        }
                                                        {nextOrderChange == 0 && nextOrdersItemChange == 0 && <p> ---- </p>}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>)}
                        {orderLogData?.length == 0 && (<span>Hiện tại chưa có sự thay đổi nào</span>)}
                    </MyCardContent>
                </MyCard>

                <MyCard>
                    <MyCardActions>
                        <Link href={`/crm/customer`}>
                            <ButtonGroup color="primary" aria-label="contained primary button group">
                                <Button variant="contained" color="default">Quay lại</Button>
                            </ButtonGroup>
                        </Link>
                    </MyCardActions>
                </MyCard>
            </form>
        </AppCRM >
    );
}