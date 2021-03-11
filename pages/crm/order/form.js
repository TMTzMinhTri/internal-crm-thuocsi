import {
    Box, Button, ButtonGroup, CardContent, FormGroup, Paper, TextField, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TableFooter,
    CardHeader,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import { formatNumber, orderStatus } from "components/global"
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { ConfirmDialog } from "containers/crm/order/ConfirmDialog"
import { TableQuantityValueCell } from "containers/crm/order/TableQuantityValueCell"
import Typography from "@material-ui/core/Typography";
import { getMasterDataClient } from "client/master-data";
import Link from "next/link";
import { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./order.module.css";
import { NotFound } from "components/components-global";
import { getOrderClient } from "client/order";
import { getProductClient } from "client/product";
import { getSellerClient } from "client/seller";
import { MyCard, MyCardActions, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import Head from "next/head";
import { getPaymentClient } from "client/payment";
import { getDeliveryClient } from "client/delivery";
import { OrderPaymentMethod } from "view-models/order";

export async function loadData(ctx) {
    let data = {
        props: {
            status: "OK"
        }
    }

    let query = ctx.query
    let order_no = typeof (query.orderNo) === "undefined" ? '' : query.orderNo
    data.props.isUpdate = false
    if (order_no !== '') {
        data.props.isUpdate = true
        let orderClient = getOrderClient(ctx, data)
        let orderResp = await orderClient.getOrderByOrderNo(order_no)
        if (orderResp.status !== 'OK') {
            data.props.message = orderResp.message
            data.props.status = orderResp.status;
            return data
        }
        let order = orderResp.data[0]
        data.props.order = order

        //Get Master Data Client
        let masterDataClient = getMasterDataClient(ctx, data)

        let wardResp = await masterDataClient.getWardByWardCode(order.customerWardCode)
        if (wardResp.status === 'OK') {
            data.props.order.customerProvinceCode = wardResp.data[0].provinceName
            data.props.order.customerDistrictCode = wardResp.data[0].districtName
            data.props.order.customerWardCode = wardResp.data[0].name
        }

        // Get list delivery
        let deliveryClient = getDeliveryClient(ctx, data)
        let deliveryResp = await deliveryClient.getListDeliveryByCode(order.deliveryPlatform);
        if (deliveryResp.status == 'OK') {
            data.props.order.deliveryPlatform = deliveryResp.data[0];
        }

        // Get list payment method
        let paymentClient = getPaymentClient(ctx, data)
        let paymentResp = await paymentClient.getPaymentMethodByCode(order.paymentMethod);
        if (paymentResp.status == 'OK') {
            data.props.order.paymentMethod = paymentResp.data[0];
        }

        //get list order-item 
        let orderItemResp = await orderClient.getOrderItemByOrderNo(order_no)
        if (orderItemResp.status !== 'OK') {
            data.props.message = orderItemResp.message
            data.props.status = orderItemResp.status;
            return data
        }

        let lstProductCode = []
        orderItemResp.data = orderItemResp.data.map(orderItem => {
            let productCode = orderItem.productSku.split("").slice(orderItem.productSku.split("").indexOf('.') + 1, orderItem.productSku.split("").length).join("")
            lstProductCode.push(productCode)
            return { ...orderItem, productCode }
        })

        let _client = getProductClient(ctx, data)
        let lstProductResp = await _client.postListProducstWithCodes(lstProductCode)
        if (lstProductResp.status !== "OK") {

        } else {
            orderItemResp.data = orderItemResp.data.map((orderItem) => {
                let imgProduct, nameProduct
                lstProductResp.data.map(product => {
                    if (product.code === orderItem.productCode) {
                        if (product.imageUrls) {
                            imgProduct = product.imageUrls[0] || "/default.png"
                        } else {
                            imgProduct = "/default.png"
                        }
                        nameProduct = product.name
                    }
                })
                return { ...orderItem, image: imgProduct, name: nameProduct }
            })

        }

        for (let idx = 0; idx < orderItemResp.data?.length; idx++) {
            let sellerCode = orderItemResp.data[idx].productSku.split("").slice(0, orderItemResp.data[idx].productSku.split("").indexOf(".")).join("")
            let _sellerClient = getSellerClient(ctx, data)
            let result = await _sellerClient.getSellerBySellerCode(sellerCode)
            orderItemResp.data[idx] = { ...orderItemResp.data[idx], sellerName: result.status === "OK" ? result.data[0].name : "-" }
        }

        data.props.orderItem = orderItemResp.data

    }
    return data
}

export default function renderForm(props, toast) {
    const titlePage = "Cập nhật đơn hàng"
    if (props.status && props.status !== "OK") {
        return (
            <NotFound link='/crm/order' titlePage={titlePage} labelLink="đơn hàng" />
        )
    }

    let { error, success } = toast;
    let editObject = props.isUpdate ? props.order : {}

    const [loading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [defaultQuantity, setDefaultQuantity] = useState(props.orderItem?.map(item => item.quantity))
    const [orderItem, setOrderItem] = useState(props.orderItem)
    const [order, setOrder] = useState(props.order)
    const [focused, setFocused] = useState(false)
    const [currentEditValue, setCurrentEditValue] = useState(null)
    const [maxQuantity, setMaxQuantity] = useState()
    const [deletedOrderItem, setDeletedOrderItem] = useState(null);
    const router = useRouter();

    const { watch, register, handleSubmit, errors, control, getValues, setError, clearErrors } = useForm({
        defaultValues: editObject,
        mode: "onSubmit"
    });

    const onSubmit = async (formData) => {
        if (props.isUpdate) {
            formData.orderNo = props.order.orderNo
            await updateOrder(formData)
        }
    }

    async function updateOrder(formData) {
        let orderClient = getOrderClient()
        let resp = await orderClient.updateOrder(formData)
        if (resp.status !== 'OK') {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            success(titlePage + ' thành công')
            setOrder(resp.data)
        }
    }

    async function updateOrderItem(orderItem, i) {
        let orderClient = getOrderClient()
        let resp = await orderClient.updateOrderItem({
            totalPrice: parseInt(orderItem[i].price * orderItem[i].quantity), orderNo: orderItem[i].orderNo, orderItemNo: orderItem[i].orderItemNo
            , quantity: parseInt(orderItem[i].quantity), sellerCode: orderItem[i].sellerCode,
        })
        if (resp.status !== 'OK') {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            success(titlePage + ' thành công')
            window.location.reload()
        }
    }

    async function removeOrderItem(data) {
        try {
            const orderClient = getOrderClient();
            const res = await orderClient.removeOrderItem(data.orderItemNo);
            if (res.status === 'OK') {
                toast.success("Xóa mặt hàng thành công");
                props.order.totalPrice = props.order.totalPrice - data.totalPrice;
                setOrderItem(orderItem.filter(v => v.id !== data.id));
                setDeletedOrderItem(null);
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    const RenderRow = ({ data, index }) => {
        return (
            <TableRow key={index}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="left">{data.productSku}</TableCell>
                <TableCell align="left">{data.sellerName}</TableCell>
                <TableCell align="left">{data.name}</TableCell>
                {/* <TableQuantityValueCell
                    disabled={order?.status != 'WaitConfirm'}
                    watch={watch}
                    handleSubmit={handleSubmit}
                    index={index}
                    orderNo={data.orderNo}
                    orderItemNo={data.orderItemNo}
                    maxQuantity={data.maxQuantity}
                    errors={errors}
                    clearErrors={clearErrors}
                    defaultQuantity={defaultQuantity[index]}
                    initialQuantity={data.quantity}
                    setError={setError}
                    onUpdate={(values) => {
                        setCurrentEditValue(values);
                        setOpenModal(true);
                    }}
                    onChange={(value) => {
                        orderItem[index].quantity = value
                    }}
                /> */}
                <TableCell align="right">{data.maxQuantity}</TableCell>
                <TableCell align="right">{formatNumber(data.totalPrice)}</TableCell>
            </TableRow>
        );
    }


    const changeQuantityHandler = async () => {
        const { orderNo, orderItemNo, quantity } = currentEditValue
        let idxChangedItem
        orderItem?.map((item, idx) => {
            if (item.orderItemNo == orderItemNo) {
                idxChangedItem = idx
            }
        })

        let tmpOrderItem = orderItem.map((item, idx) => {
            if (idx == idxChangedItem) {
                return { ...item, quantity: quantity, totalPrice: quantity * item.price }
            }
            return item
        })
        // better performance
        props.order.totalPrice = props.order.totalPrice - orderItem[idxChangedItem].totalPrice + tmpOrderItem[idxChangedItem].totalPrice
        setOrderItem(tmpOrderItem)
        await updateOrderItem(tmpOrderItem, idxChangedItem)
    }

    const ConfirmDeleteOrderItemDialog = () => {
        const handleClose = () => setDeletedOrderItem(null);
        return (
            <Dialog open={!!deletedOrderItem} onClose={handleClose}>
                <DialogTitle>Xác nhận</DialogTitle>
                <DialogContent dividers>
                    Bạn có chắc muốn xóa mặt hàng?
            </DialogContent>
                <DialogActions>
                    <Button
                        color="default"
                        onClick={handleClose}
                    >
                        Hủy bỏ
                </Button>
                    <Button
                        color="secondary"
                        autoFocus
                        onClick={() => {
                            removeOrderItem(deletedOrderItem);
                            handleClose();
                        }}
                    >
                        Xóa
                </Button>
                </DialogActions>
            </Dialog>)
    }

    let breadcrumb = [
        {
            name: "Trang chủ",
            link: "/crm"
        },
        {
            name: "Danh sách đơn hàng",
            link: "/crm/order"
        },
        {
            name: "Cập nhật đơn hàng"
        }
    ]

    return (
        <AppCRM select="/crm/order" breadcrumb={breadcrumb}>
            <Head>
                <title>Thông tin đơn hàng</title>
            </Head>
            <MyCard>
                <MyCardHeader title={`Đơn hàng #${props.order?.orderId}`}>

                </MyCardHeader>
                <MyCardContent>
                    <Grid spacing={3} container>
                        <Grid item xs={12} sm={4} md={4}>
                            <Typography variant="h6" component="h6"
                                style={{ marginBottom: '10px', fontSize: 16, fontWeight: 'bold' }}>
                                Tên khách hàng
                                            </Typography>
                            <TextField
                                id="customerName"
                                name="customerName"
                                size="small"
                                placeholder=""
                                inputProps={{
                                    readOnly: true,
                                    disabled: true,
                                }}
                                helperText={errors.name?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ width: '100%' }}
                                error={!!errors.customerName}
                                required
                                inputRef={
                                    register()
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <Typography variant="h6" component="h6"
                                style={{ marginBottom: '10px', fontSize: 16, fontWeight: 'bold' }}>
                                ID khách hàng
                                            </Typography>
                            <TextField
                                id="customerID"
                                name="customerID"
                                size="small"
                                placeholder=""
                                inputProps={{
                                    readOnly: true,
                                    disabled: true,
                                }}
                                helperText={errors.customerID?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ width: '100%' }}
                                error={!!errors.customerID}
                                required
                                inputRef={
                                    register()
                                }
                            />
                        </Grid>
                    </Grid>
                    <Grid spacing={3} container>
                        <Grid item xs={12} sm={3} md={3}>
                            <Typography variant="h6" component="h6"
                                style={{ marginBottom: '10px', fontSize: 16, fontWeight: 'bold' }}>
                                Số điện thoại
                                            </Typography>
                            <TextField
                                id="customerPhone"
                                name="customerPhone"
                                size="small"
                                placeholder=""
                                inputProps={{
                                    readOnly: true,
                                    disabled: true,
                                }}
                                type="number"
                                helperText={errors.customerPhone?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ width: '100%' }}
                                error={!!errors.customerPhone}
                                required
                                inputRef={
                                    register()
                                }
                            />
                        </Grid>
                    </Grid>
                    <Grid spacing={3} container>
                        <Grid item xs={12} sm={6} md={6}>
                            <Typography variant="h6" component="h6"
                                style={{ marginBottom: '10px', fontSize: 16, fontWeight: 'bold' }}>
                                Địa chỉ
                                            </Typography>
                            <TextField
                                id="customerShippingAddress"
                                name="customerShippingAddress"
                                size="small"
                                inputProps={{
                                    readOnly: true,
                                    disabled: true,
                                }}
                                placeholder=""
                                helperText={errors.customerShippingAddress?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ width: '100%' }}
                                error={!!errors.customerShippingAddress}
                                required
                                inputRef={
                                    register()
                                }
                            />
                        </Grid>
                    </Grid>
                    <Grid spacing={3} container>
                        <Grid item xs={12} sm={3} md={3}>
                            <Typography variant="h6" component="h6"
                                style={{ marginBottom: '10px', fontSize: 16, fontWeight: 'bold' }}>
                                Tỉnh/Thành phố
                                            </Typography>
                            <TextField
                                id="customerProvinceCode"
                                name="customerProvinceCode"
                                size="small"
                                inputProps={{
                                    readOnly: true,
                                    disabled: true,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputRef={
                                    register()
                                }
                                style={{ width: '100%' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3}>
                            <Typography variant="h6" component="h6"
                                style={{ marginBottom: '10px', fontSize: 16, fontWeight: 'bold' }}>
                                Quận/Huyện
                                            </Typography>
                            <TextField
                                id="customerDistrictCode"
                                name="customerDistrictCode"
                                size="small"
                                inputProps={{
                                    readOnly: true,
                                    disabled: true,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                placeholder=""
                                style={{ width: '100%' }}
                                inputRef={
                                    register()
                                }
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3}>
                            <Typography variant="h6" component="h6"
                                style={{ marginBottom: '10px', fontSize: 16, fontWeight: 'bold' }}>
                                Phường/Xã
                                            </Typography>
                            <TextField
                                id="customerWardCode"
                                name="customerWardCode"
                                size="small"
                                inputProps={{
                                    readOnly: true,
                                    disabled: true,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ width: '100%' }}
                                inputRef={
                                    register()
                                }
                            />
                        </Grid>
                    </Grid>
                    <Grid spacing={3} container>
                        <Grid item xs={12} sm={3} md={3}>
                            <Typography variant="h6" component="h6"
                                style={{ marginBottom: '10px', fontSize: 16, fontWeight: 'bold' }}>
                                Hình thức vận chuyển
                                            </Typography>
                            <TextField
                                id="deliveryPlatform.name"
                                name="deliveryPlatform.name"
                                size="small"
                                inputProps={{
                                    readOnly: true,
                                    disabled: true,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputRef={
                                    register()
                                }
                                style={{ width: '100%' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3}>
                            <Typography variant="h6" component="h6"
                                style={{ marginBottom: '10px', fontSize: 16, fontWeight: 'bold' }}>
                                Phương thức thanh toán
                                            </Typography>
                            <TextField
                                id="paymentMethod.name"
                                name="paymentMethod.name"
                                size="small"
                                inputProps={{
                                    readOnly: true,
                                    disabled: true,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputRef={
                                    register()
                                }
                                style={{ width: '100%' }}
                            />
                        </Grid>
                    </Grid>
                </MyCardContent>
                <MyCardContent>
                    <ConfirmDialog
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                        onConfirm={() => changeQuantityHandler()}
                    />
                    <ConfirmDeleteOrderItemDialog />
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <FormControl style={{ width: '100%' }} size="small">
                                <Typography variant="h6" component="h6"
                                    style={{ marginBottom: '10px', fontSize: 16, fontWeight: 'bold' }}>Trạng thái</Typography>
                                <Controller
                                    name="status"
                                    control={control}
                                    defaultValue={orderStatus ? orderStatus[0].value : ''}
                                    rules={{ required: true }}
                                    error={!!errors.status}
                                    as={
                                        <Select label="Trạng thái" disabled={order?.status != 'WaitConfirm'}>
                                            {orderStatus?.map(({ value, label }) => (
                                                <MenuItem value={value} key={value}>{label}</MenuItem>
                                            ))}
                                        </Select>
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={7}>

                        </Grid>
                    </Grid>
                    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                        <Table size="small" aria-label="a dense table">
                            <colgroup>
                                <col width="10%" />
                                <col width="20%" />
                                <col width="20%" />
                                <col width="15%" />
                                <col width="15%" />
                                <col width="20%" />
                            </colgroup>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Số thứ tự</TableCell>
                                    <TableCell align="left">SKU</TableCell>
                                    <TableCell align="left">Tên người bán</TableCell>
                                    <TableCell align="left">Tên sản phẩm</TableCell>
                                    <TableCell align="left">Số lượng</TableCell>
                                    <TableCell align="right">Thành tiền</TableCell>
                                </TableRow>
                            </TableHead>
                            {orderItem && orderItem.length > 0 ? (
                                <TableBody>
                                    {orderItem.map((row, i) => (
                                        <RenderRow data={row} key={i} index={i} />
                                    ))}
                                </TableBody>
                            ) : (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={3} align="left">{props.message}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4} />
                                    <TableCell align="right">Phí vận chuyển</TableCell>
                                    <TableCell align="right">{props.order?.shippingFee}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={4} />
                                    <TableCell align="right">Giảm giá</TableCell>
                                    <TableCell align="right">{props.order?.totalDiscount}</TableCell>
                                </TableRow>
                                {props.order?.paymentMethod.code === OrderPaymentMethod.PAYMENT_METHOD_BANK && (
                                    <TableRow>
                                        <TableCell colSpan={4} />
                                        <TableCell align="right">{props.order?.paymentMethod.subTitle}</TableCell>
                                        <TableCell align="right">{props.order?.paymentMethodFee}</TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableCell colSpan={4} />
                                    <TableCell align="right" style={{ fontWeight: 'bold', color: 'black', fontSize: '20px' }}>Tổng tiền</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 'bold', color: 'black', fontSize: '20px' }} >{formatNumber(props.order?.totalPrice)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </MyCardContent>
                <MyCardActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit(onSubmit)}
                        disabled={order?.status != 'WaitConfirm'}
                        style={{ margin: 8 }}>
                        {loading && <CircularProgress size={20} />}
                                Lưu
                                </Button>
                    <Link href={`/crm/order`}>
                        <ButtonGroup color="primary" aria-label="contained primary button group">
                            <Button variant="contained" color="default">Quay lại</Button>
                        </ButtonGroup>
                    </Link>
                </MyCardActions>
            </MyCard>


        </AppCRM >
    )
}