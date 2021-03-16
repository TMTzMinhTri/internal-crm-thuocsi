import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    IconButton,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import { Save as SaveIcon } from "@material-ui/icons";
import {
    MyCard,
    MyCardActions,
    MyCardContent,
    MyCardHeader
} from "@thuocsi/nextjs-components/my-card/my-card";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getOrderClient } from "client/order";
import { getProductClient } from "client/product";
import { getSellerClient } from "client/seller";
import { actionErrorText, unknownErrorText } from "components/commonErrors";
import { formatDatetimeFormType, formatNumber, orderStatus } from "components/global";
import { useFormStyles } from "components/MuiStyles";
import moment from "moment";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { Controller, useController, useForm } from "react-hook-form";
import { OrderPaymentMethod, OrderStatus } from "view-models/order";
import { CustomerCard } from "./CustomerCard";
import { useStyles } from "./Styles";


async function loadOrderFormDataClient({ orderNo }) {
    const props = {
        message: "",
        order: null,
        orderItems: [],
    };

    if (!orderNo) {
        props.message = "Không tìm thấy kết quả phù hợp";
        return props;
    }


    const orderClient = getOrderClient();
    const orderResp = await orderClient.getOrderByOrderNoFromClient(orderNo);
    if (orderResp.status !== "OK") {
        props.message = orderResp.message;
        props.status = orderResp.status;
        return props;
    }
    const order = orderResp.data[0];
    props.order = order;

    //get list order-item
    const orderItemResp = await orderClient.getOrderItemByOrderNoFromClient(orderNo);
    if (orderItemResp.status !== "OK") {
        props.message = orderItemResp.message;
        props.status = orderItemResp.status;
        return props;
    }

    const productClient = getProductClient();
    const sellerClient = getSellerClient();
    const skuMap = {};
    const skuCodes = [];
    const productMap = {};
    const sellerMap = {};
    const sellerCodes = [];
    orderItemResp.data.forEach(({ productSku, sellerCode }) => {
        if (productSku && !skuMap[productSku]) {
            skuMap[productSku] = true;
            skuCodes.push(productSku);
        }
        if (sellerCode && !sellerMap[sellerCode]) {
            sellerMap[sellerCode] = true;
            sellerCodes.push(sellerCode);
        }
    });
    const [productResp, sellerResp] = await Promise.all([
        productClient.getProductBySKUsFromClient(skuCodes),
        sellerClient.getSellerBySellerCodesClient(sellerCodes)
    ])
    productResp.data?.forEach(product => {
        productMap[product.code] = product;
    });
    sellerResp.data?.forEach(seller => {
        sellerMap[seller.code] = seller;
    });

    props.orderItems = orderItemResp.data.map(orderItem => ({
        ...orderItem,
        product: productMap[skuMap[orderItem.productSku].productCode] ?? null,
        seller: sellerMap[orderItem.sellerCode] ?? null,
    }))
    return props;
}

/**
 * @param {object} props 
 * @param {*} props.order
 * @param {*} props.message
 * @param {*} props.order
 * @param {*} props.orderItems
 * @param {*} props.productMap
 * @param {*} props.productCodes
 * @param {*} props.sellerMap
 * @param {*} props.sellerCodes
 * @param {*} props.provinces
 * @param {*} props.districts
 * @param {*} props.wards
 * @param {*} props.paymentMethods
 * @param {*} props.deliveryPlatforms
 */
export const OrderForm = props => {
    const toast = useToast();
    const formStyles = useFormStyles();
    const styles = useStyles();

    const orderForm = useForm({
        defaultValues: {
            ...props.order,
            deliveryDate: formatDatetimeFormType(props.order.deliveryDate),
        },
        mode: "onChange"
    });
    useController({ name: "redeemCode", control: orderForm.control, });
    useController({ name: "paymentMethodFee", control: orderForm.control, });
    const { status, deliveryTrackingNumber, redeemCode, paymentMethod, paymentMethodFee } = orderForm.watch();
    // Prevent item object reference
    const [orderItems, setOrderItems] = useState(props.orderItems?.map(values => ({ ...values })) ?? []);
    // For logging old value of Order item quantity to compare
    const [orderItemQuantyMap, setOrderItemQuantyMap] = useState(props.orderItems.reduce((acc, cur) => {
        acc[cur.orderItemNo] = cur.quantity;
        return acc;
    }, {}));
    const [loading, setLoading] = useState(false);

    const reloadOrder = useCallback(async (includeOderItems = false) => {
        const { message, order, orderItems } = await loadOrderFormDataClient({ orderNo: props.order.orderNo })
        if (message) {
            throw new Error(message);
        }
        console.log({ order });
        orderForm.setValue("customerName", order.customerName);
        orderForm.setValue("customerPhone", order.customerPhone);
        orderForm.setValue("customerShippingAddress", order.customerShippingAddress);
        orderForm.setValue("customerProvinceCode", order.customerProvinceCode);
        orderForm.setValue("customerDistrictCode", order.customerDistrictCode);
        orderForm.setValue("customerWardCode", order.customerWardCode);
        orderForm.setValue("deliveryPlatform", order.deliveryPlatform.code);
        orderForm.setValue("deliveryStatus", order.deliveryStatus?.code);
        orderForm.setValue("deliveryDate", formatDatetimeFormType(order.deliveryDate));
        orderForm.setValue("paymentMethod", order.paymentMethod.code);
        orderForm.setValue("paymentMethodFee", order.paymentMethodFee);
        orderForm.setValue("status", order.status);
        if (includeOderItems) {
            setOrderItems(orderItems);
            setOrderItemQuantyMap(orderItems.reduce((acc, cur) => {
                acc[cur.orderItemNo] = cur.quantity;
                return acc;
            }, {}));
        }
    }, [props.order.orderNo, orderItems.length]);

    const updateOrderItem = async ({ orderNo, orderItemNo, quantity }) => {
        const orderClient = getOrderClient();
        const resp = await orderClient.updateOrderItem({ orderNo, orderItemNo, quantity });
        if (resp.status !== "OK") {
            throw new Error(resp.message);
        }
        const orderItem = resp.data[0];
        if (orderItem.productCode && !props.productMap[orderItem.productCode]) {
            const productClient = getProductClient();
            const resp = productClient.getProductByCodeClient(orderItem.productCode);
            props.productMap[orderItem.productCode] = resp.data[0];
        }
        if (orderItem.sellerCode && !props.sellerMap[orderItem.sellerCode]) {
            const sellerClient = getSellerClient();
            const resp = sellerClient.getSellerBySellerCode(orderItem.sellerCode);
            props.sellerMap[orderItem.sellerCode] = resp.data[0];
        }
        orderItem.product = props.productMap[orderItem.productCode];
        orderItem.seller = props.sellerMap[orderItem.sellerCode];
        return orderItem;
    }

    const updateOrder = async (formData) => {
        let orderClient = getOrderClient();
        let resp = await orderClient.updateOrder(formData);
        if (resp.status !== "OK") {
            throw new Error(resp.message ?? actionErrorText)
        }
    }

    const handleOrderItemQuantityChange = (orderItemNo, value) => {
        const arr = [...orderItems];
        const index = arr.findIndex(orderItem => orderItem.orderItemNo === orderItemNo);
        arr[index].quantity = value;
        setOrderItems(arr);
    }

    const handleOderItemQuantityUpdate = async (orderItemNo, value) => {
        setLoading(true);
        try {
            await updateOrderItem({ orderNo: props.order.orderNo, orderItemNo, quantity: value });
            await reloadOrder(true);
        } catch (e) {
            toast.error(e.message ?? unknownErrorText);
        }
        setLoading(false);
    }

    const handleSubmitOrder = async (formData) => {
        try {
            const data = { ...formData };
            setLoading(true);
            data.orderNo = props.order.orderNo;
            data.deliveryDate = moment(formData.deliveryDate).toISOString();
            data.note = props.order.note + data.note;
            await updateOrder(data);
            toast.success("Cập nhật đơn hàng thành công");
            reloadOrder();
            orderForm.setValue("note", "");
        } catch (e) {
            toast.error(e.message ?? actionErrorText);
        }
        setLoading(false);
    }

    const getOrderItemQuantityStyle = useCallback(({ orderItemNo, quantity }) => {
        const oldValue = orderItemQuantyMap[orderItemNo];
        if (!oldValue || oldValue == quantity) return "none";
        else return "block";
    }, [orderItemQuantyMap])

    return (
        <MyCard>
            <MyCardHeader title={`Đơn hàng #${props.order?.orderId}`}>

            </MyCardHeader>
            <MyCardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <CustomerCard
                            orderForm={orderForm}
                            order={props.order}
                            provinces={props.provinces}
                            districts={props.districts}
                            wards={props.wards}
                        />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Card className={styles.section1} variant="outlined">
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid container spacing={3} item xs={12}>
                                        <Grid item xs={12} md={5}>
                                            <Typography className={`${formStyles.fieldLabel} ${formStyles.required}`} >Hình thức vận chuyển</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Controller
                                                control={orderForm.control}
                                                name="deliveryPlatform"
                                                as={
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        error={!!orderForm.errors.deliveryPlatform}
                                                        helperText={orderForm.errors.deliveryPlatform?.message}
                                                        fullWidth
                                                        required
                                                        select
                                                    >
                                                        {props.deliveryPlatforms.map(({ code, name, feeValue }) => (
                                                            <MenuItem key={`pv_${code}`} value={code}>{name} - {feeValue}đ</MenuItem>
                                                        ))}
                                                    </TextField>
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} item xs={12}>
                                        <Grid item xs={12} md={5}>
                                            <Typography className={`${formStyles.fieldLabel} ${formStyles.required}`} >Trạng thái vận chuyển</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Controller
                                                control={orderForm.control}
                                                name="deliveryStatus"
                                                as={
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        SelectProps={{
                                                            displayEmpty: true,
                                                        }}
                                                        error={!!orderForm.errors.deliveryPlatform}
                                                        helperText={orderForm.errors.deliveryPlatform?.message}
                                                        fullWidth
                                                        required
                                                        select
                                                    >
                                                        <MenuItem value={""}>không xác định</MenuItem>
                                                        {props.deliveryPlatforms.map(({ code, name, feeValue }) => (
                                                            <MenuItem key={`pv_${code}`} value={code}>{name} - {feeValue}đ</MenuItem>
                                                        ))}
                                                    </TextField>
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} item xs={12}>
                                        <Grid item xs={12} md={5}>
                                            <Typography className={`${formStyles.fieldLabel} ${formStyles.required}`} >Mã Tracking</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography className={`${formStyles.fieldLabel}`} >{deliveryTrackingNumber ?? "Không xác định"}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} item xs={12}>
                                        <Grid item xs={12} md={5}>
                                            <Typography className={`${formStyles.fieldLabel} ${formStyles.required}`} >Ngày giao hàng</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                name="deliveryDate"
                                                variant="outlined"
                                                size="small"
                                                placeholder=""
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                error={!!orderForm.errors.deliveryDate}
                                                helperText={orderForm.errors.deliveryDate?.message}
                                                fullWidth
                                                required
                                                type="datetime-local"
                                                inputRef={orderForm.register}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} item xs={12}>
                                        <Grid item xs={12} md={5}>
                                            <Typography className={`${formStyles.fieldLabel} ${formStyles.required}`} >Phương thức thanh toán</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Controller
                                                control={orderForm.control}
                                                name="paymentMethod"
                                                as={
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        error={!!orderForm.errors.paymentMethod?.name}
                                                        helperText={orderForm.errors.paymentMethod?.name?.message}
                                                        fullWidth
                                                        required
                                                        select
                                                    >
                                                        {props.paymentMethods.map(({ code, name }) => (
                                                            <MenuItem key={`pv_${code}`} value={code}>{name}</MenuItem>
                                                        ))}
                                                    </TextField>
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} item xs={12}>
                                        <Grid item xs={12} md={5}>
                                            <Typography className={`${formStyles.fieldLabel} ${formStyles.required}`} >Trạng thái</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Controller
                                                control={orderForm.control}
                                                name="status"
                                                as={
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        error={!!orderForm.errors.status}
                                                        helperText={orderForm.errors.status?.message}
                                                        fullWidth
                                                        select
                                                        disabled={status === OrderStatus.CANCELED}
                                                    >
                                                        {orderStatus.map(({ value, label }) => (
                                                            <MenuItem key={value} value={value}>{label}</MenuItem>
                                                        ))}
                                                    </TextField>
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={7}>
                        <Card className={styles.section2} variant="outlined">
                            <CardContent>
                                <Typography variant="h6">Mã giảm giá</Typography>
                                {!redeemCode?.length && (
                                    <Typography className={formStyles.helperText}>Không có mã giảm giá nào</Typography>
                                )}
                                <ul>
                                    {redeemCode?.map?.(code => (
                                        <Typography key={code} component="li" >{code}</Typography>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={5}>
                        <Card className={styles.section2} variant="outlined">
                            <CardContent>
                                <Typography variant="h6">Ghi chú đơn hàng</Typography>
                                <Grid container>
                                    <Grid spacing={3} item xs={12}>
                                        <TextField
                                            id="note"
                                            name="note"
                                            variant="outlined"
                                            size="small"
                                            placeholder=""
                                            multiline
                                            rows={3}
                                            rowsMax={6}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            error={!!orderForm.errors.note}
                                            helperText={orderForm.errors.note?.message}
                                            fullWidth
                                            inputRef={orderForm.register}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </MyCardContent >
            <MyCardContent>
                <TableContainer>
                    <Table variant="outlined"
                        size="small" aria-label="a dense table">
                        <colgroup>
                            <col />
                            <col />
                            <col width="10%" />
                            <col width="30%" />
                            <col width="15%" />
                            <col width="10%" />
                            <col />
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">STT</TableCell>
                                <TableCell align="left">SKU</TableCell>
                                <TableCell align="left">Tên người bán</TableCell>
                                <TableCell align="left">Tên sản phẩm</TableCell>
                                <TableCell align="right">Số lượng</TableCell>
                                <TableCell align="right">Giá</TableCell>
                                <TableCell align="right">Thành tiền</TableCell>
                            </TableRow>
                        </TableHead>
                        {orderItems && orderItems.length > 0 ? (
                            <TableBody>
                                {orderItems.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell align="center">{i + 1}</TableCell>
                                        <TableCell align="left">{row.productSku}</TableCell>
                                        <TableCell align="left">{row.seller?.name ?? row.sellerCode}</TableCell>
                                        <TableCell align="left">{row.product?.name ?? row.productCode}</TableCell>
                                        <TableCell align="right">
                                            {row.product?.deal && (
                                                row.quantity
                                            )}
                                            {!row.product?.deal && (
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    value={row.quantity}
                                                    type="number"
                                                    InputProps={{
                                                        endAdornment: (
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                style={{
                                                                    display: getOrderItemQuantityStyle(row)
                                                                }}
                                                                disabled={loading}
                                                                onClick={() => handleOderItemQuantityUpdate(row.orderItemNo, row.quantity)}
                                                            >
                                                                <SaveIcon fontSize="small" />
                                                            </IconButton>
                                                        )
                                                    }}
                                                    inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                                    onChange={e => handleOrderItemQuantityChange(row.orderItemNo, +e.target.value)}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell align="right">{formatNumber(row.price)}</TableCell>
                                        <TableCell align="right">{formatNumber(row.totalPrice)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={3} align="left">{props.message}</TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                        <TableFooter className={formStyles.tableFooter}>
                            <TableRow>
                                <TableCell colSpan={6} align="right">Phí vận chuyển</TableCell>
                                <TableCell align="right">{formatNumber(props.order?.shippingFee)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={6} align="right">Giảm giá</TableCell>
                                <TableCell align="right">{formatNumber(props.order?.totalDiscount)}</TableCell>
                            </TableRow>
                            {paymentMethod === OrderPaymentMethod.PAYMENT_METHOD_BANK && (
                                <TableRow>
                                    <TableCell colSpan={6} align="right">
                                        {props.paymentMethods?.find(method => method.code === paymentMethod).subTitle}
                                    </TableCell>
                                    <TableCell align="right">{formatNumber(paymentMethodFee)}</TableCell>
                                </TableRow>
                            )}
                            <TableRow>
                                <TableCell colSpan={6} style={{ fontWeight: 'bold', color: 'black', fontSize: '20px' }} align="right">Tổng tiền</TableCell>
                                <TableCell align="right" style={{ fontWeight: 'bold', color: 'black', fontSize: '20px' }}>
                                    {formatNumber(props.order?.totalPrice)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </MyCardContent>
            <MyCardActions>
                <Link href={`/crm/order`}>
                    <Button variant="contained" color="default">Quay lại</Button>
                </Link>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={orderForm.handleSubmit(handleSubmitOrder)}
                    disabled={props.order.status != 'WaitConfirm'}
                    style={{ margin: 8 }}
                >
                    {loading && <CircularProgress size={20} />}
                    Lưu
                </Button>
            </MyCardActions>
        </MyCard >
    )
};
