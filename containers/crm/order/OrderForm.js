import React, { useCallback, useEffect, useState } from "react";
import {
    MyCard,
    MyCardActions,
    MyCardContent,
    MyCardHeader,
} from "@thuocsi/nextjs-components/my-card/my-card";
import {
    Button,
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
    Typography,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { Save as SaveIcon } from "@material-ui/icons";

import { OrderPaymentMethod, OrderStatus, OrderValidation } from "view-models/order";
import { formatNumber, orderStatus } from "components/global";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { actionErrorText } from "components/commonErrors";
import { useFormStyles } from "components/MuiStyles";
import { getDeliveryClient } from "client/delivery";
import { getMasterDataClient } from "client/master-data";
import { getOrderClient } from "client/order";
import { getPaymentClient } from "client/payment";
import { getSellerClient } from "client/seller";
import { getProductClient } from "client/product";
import { getPricingClient } from "client/pricing";

async function loadOrderFormDataClient(orderNo) {
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

    //Get Master Data
    const masterDataClient = getMasterDataClient();
    // Pre-load provinces, distrists, wards for selector.
    const [
        provincesResp,
        districtsResp,
        wardsResp,
    ] = await Promise.all([
        masterDataClient.getProvinceFromClient(0, 100, ""),
        masterDataClient.getDistrictByProvinceCode(props.order.customerProvinceCode),
        masterDataClient.getWardByDistrictCode(props.order.customerDistrictCode),
    ])
    props.provinces = provincesResp.data ?? [];
    props.districts = districtsResp.data ?? [];
    props.wards = wardsResp.data ?? [];

    // Get list delivery
    const deliveryClient = getDeliveryClient();
    const deliveryResp = await deliveryClient.getListDeliveryByCodeFromClient(
        order.deliveryPlatform
    );
    if (deliveryResp.status == "OK") {
        props.order.deliveryPlatform = deliveryResp.data[0];
    }

    // Get list payment method
    const paymentClient = getPaymentClient();
    const paymentResp = await paymentClient.getPaymentMethodByCodeFromClient(
        order.paymentMethod
    );
    if (paymentResp.status == "OK") {
        props.order.paymentMethod = paymentResp.data[0];
    }

    //get list order-item
    const orderItemResp = await orderClient.getOrderItemByOrderNoFromClient(orderNo);
    if (orderItemResp.status !== "OK") {
        props.message = orderItemResp.message;
        props.status = orderItemResp.status;
        return props;
    }

    const pricingClient = getPricingClient();
    const productClient = getProductClient();
    const sellerClient = getSellerClient();
    const skuMap = {};
    const skuCodes = [];
    const productMap = {};
    const productCodes = [];
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
    const [skuResp, sellerResp] = await Promise.all([
        pricingClient.getPricingByCodesOrSKUsFromClient({ skus: skuCodes }),
        sellerClient.getSellerBySellerCodesClient(sellerCodes)
    ])
    skuResp.data?.forEach((sku) => {
        const { productCode } = sku;
        skuMap[sku.sku] = sku;
        if (productCode && !productMap[productCode]) {
            productMap[productCode] = true;
            productCodes.push(productCode);
        }
    })
    const productResp = await productClient.getListProductByIdsOrCodesFromClient([], productCodes);
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
    props.productMap = productMap;
    props.productCodes = productCodes;
    props.sellerMap = sellerMap;
    props.sellerCodes = sellerCodes;
    return props;
}

export const OrderForm = props => {
    const toast = useToast();
    const styles = useFormStyles();

    const [districts, setDistricts] = useState(props.districts);
    const [wards, setWards] = useState(props.wards);
    const orderForm = useForm({
        defaultValues: props.order,
        mode: "onChange"
    });
    const { status, customerProvinceCode, customerDistrictCode } = orderForm.watch();
    // Prevent item object reference
    const [orderItems, setOrderItems] = useState(props.orderItems.map(values => ({ ...values })) ?? []);
    // For logging old value of Order item quantity to compare
    const [orderItemQuantyMap, setOrderItemQuantyMap] = useState(props.orderItems.reduce((acc, cur) => {
        acc[cur.orderItemNo] = cur.quantity;
        return acc;
    }, {}));
    const [loading, setLoading] = useState(false);

    const loadDistrictByProvinceCode = useCallback(async () => {
        const masterDataClient = getMasterDataClient();
        const resp = await masterDataClient.getDistrictByProvinceCode(customerProvinceCode);
        if (resp.status !== "OK") {
            throw new Error(resp.message);
        }
        return resp.data;
    }, [customerProvinceCode]);

    const loadWardsByDistrictCode = useCallback(async () => {
        const masterDataClient = getMasterDataClient();
        const resp = await masterDataClient.getWardByDistrictCode(customerDistrictCode);
        if (resp.status !== "OK") {
            throw new Error(resp.message);
        }
        return resp.data;
    }, [customerDistrictCode]);

    const reloadOrder = useCallback(async (includeOderItems = false) => {
        const { message, order, orderItems } = await loadOrderFormDataClient(props.order.orderNo)
        if (message) {
            throw new Error(message)
        }
        orderForm.setValue("customerName", order.customerName)
        orderForm.setValue("customerPhone", order.customerPhone)
        orderForm.setValue("customerShippingAddress", order.customerShippingAddress)
        orderForm.setValue("customerProvinceCode", order.customerProvinceCode)
        orderForm.setValue("customerDistrictCode", order.customerDistrictCode)
        orderForm.setValue("customerWardCode", order.customerWardCode)
        orderForm.setValue("deliveryPlatform.name", order.deliveryPlatform.name)
        orderForm.setValue("paymentMethod.name", order.paymentMethod.name)
        orderForm.setValue("status", order.status)
        if (includeOderItems) {
            setOrderItems(orderItems);
            setOrderItemQuantyMap(orderItems.reduce((acc, cur) => {
                acc[cur.orderItemNo] = cur.quantity;
                return acc;
            }, {}));
        }
    }, [props.order.orderNo]);

    const updateOrderItem = ({ orderItemNo, quantity }) => {
        const orderClient = getOrderClient();
        const resp = orderClient.updateOrderItem({ orderItemNo, quantity });
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

    useEffect(() => {
        (async () => {
            try {
                if (
                    !customerProvinceCode ||
                    customerProvinceCode === props.order.customerProvinceCode
                )
                    return;
                const data = await loadDistrictByProvinceCode();
                setDistricts(data);
                orderForm.setValue("customerDistrictCode", null);
                orderForm.setValue("customerWardCode", null);
            } catch (e) {
                toast.error(e.message);
            }
        })();
    }, [customerProvinceCode]);

    useEffect(() => {
        (async () => {
            try {
                if (
                    !customerDistrictCode ||
                    customerDistrictCode === props.order.customerDistrictCode
                )
                    return;
                const data = await loadWardsByDistrictCode();
                setWards(data);
                orderForm.setValue("customerWardCode", null);
            } catch (e) {
                toast.error(e.message);
            }
        })();
    }, [customerDistrictCode]);

    const handleOrderItemQuantityChange = (orderItemNo, value) => {
        const arr = [...orderItems];
        const index = arr.findIndex(orderItem => orderItem.orderItemNo === orderItemNo);
        arr[index].quantity = value;
        setOrderItems(arr);
    }

    const handleOderItemQuantityUpdate = (orderItemNo, value) => {
        try {
            const orderItem = updateOrderItem({ orderItemNo, quantity: value });
            const arr = [...orderItems];
            const index = arr.findIndex(({ orderItemNo }) => orderItemNo === orderItemNo);
            arr[index] = orderItem;
            setOrderItems(arr);
            setOrderItemQuantyMap({ ...orderItemQuantyMap, [orderItemNo]: value });
        } catch (e) {
            toast.error(e.message);
        }
    }

    const handleSubmitOrder = async (formData) => {
        try {
            const data = {...formData};
            setLoading(true);
            data.orderNo = props.order.orderNo;
            await updateOrder(data);
            toast.success("Cập nhật đơn hàng thành công");
            reloadOrder();
        } catch (e) {
            toast.error(e.message ?? actionErrorText);
        }
        setLoading(false);
    }

    const getOrderItemQuantityStyle = useCallback(({ orderItemNo, quantity }) => {
        const oldValue = orderItemQuantyMap[orderItemNo];
        if (!oldValue) return "none";
        if (oldValue == quantity) return "none";
        else return "block";
    }, [orderItemQuantyMap])

    return (
        <MyCard>
            <MyCardHeader title={`Đơn hàng #${props.order?.orderId}`}>

            </MyCardHeader>
            <MyCardContent>
                <Grid container>
                    <Grid container spacing={3} item xs={12} md={8}>
                        <Grid item xs={12}>
                            <Typography className={`${styles.fieldLabel}`} >ID khách hàng: {props.order.customerID}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <Typography className={`${styles.fieldLabel} ${styles.required}`} >Tên khách hàng</Typography>
                            <TextField
                                id="customerName"
                                name="customerName"
                                variant="outlined"
                                size="small"
                                placeholder=""
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={!!orderForm.errors.customerName}
                                helperText={orderForm.errors.customerName?.message}
                                fullWidth
                                required
                                inputRef={orderForm.register}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3}>
                            <Typography className={`${styles.fieldLabel} ${styles.required}`} >Số điện thoại</Typography>
                            <TextField
                                id="customerPhone"
                                name="customerPhone"
                                variant="outlined"
                                size="small"
                                placeholder=""
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={!!orderForm.errors.customerPhone}
                                helperText={orderForm.errors.customerPhone?.message}
                                fullWidth
                                required
                                inputRef={orderForm.register}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={`${styles.fieldLabel} ${styles.required}`} >Địa chỉ</Typography>
                            <TextField
                                id="customerShippingAddress"
                                name="customerShippingAddress"
                                variant="outlined"
                                size="small"
                                placeholder=""
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={!!orderForm.errors.customerShippingAddress}
                                helperText={orderForm.errors.customerShippingAddress?.message}
                                fullWidth
                                required
                                inputRef={orderForm.register}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography className={`${styles.fieldLabel} ${styles.required}`} >Tỉnh/Thành phố</Typography>
                            <Controller
                                control={orderForm.control}
                                name="customerProvinceCode"
                                rules={OrderValidation.province}
                                as={
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        SelectProps={{
                                            displayEmpty: true,
                                        }}
                                        error={!!orderForm.errors.customerProvinceCode}
                                        helperText={orderForm.errors.customerProvinceCode?.message}
                                        fullWidth
                                        required
                                        select
                                    >
                                        <MenuItem value={null}>Chọn tỉnh/thành</MenuItem>
                                        {props.provinces.map(({ code, name }) => (
                                            <MenuItem key={`pv_${code}`} value={code}>{name}</MenuItem>
                                        ))}
                                    </TextField>
                                }
                            />

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography className={`${styles.fieldLabel} ${styles.required}`} >Quận/Huyện</Typography>
                            <Controller
                                control={orderForm.control}
                                name="customerDistrictCode"
                                rules={OrderValidation.district}
                                as={
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        SelectProps={{
                                            displayEmpty: true,
                                        }}
                                        error={customerProvinceCode && !!orderForm.errors.customerDistrictCode}
                                        helperText={customerProvinceCode ? orderForm.errors.customerDistrictCode?.message : ""}
                                        fullWidth
                                        required
                                        select
                                        disabled={!customerProvinceCode}
                                    >
                                        <MenuItem value={null}>Chọn quận/huyện</MenuItem>
                                        {districts.map(({ code, name }) => (
                                            <MenuItem key={`dt_${code}`} value={code}>{name}</MenuItem>
                                        ))}
                                    </TextField>
                                }
                            />

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography className={`${styles.fieldLabel} ${styles.required}`} >Phường/Xã</Typography>
                            <Controller
                                control={orderForm.control}
                                name="customerWardCode"
                                rules={OrderValidation.ward}
                                as={
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        SelectProps={{
                                            displayEmpty: true,
                                        }}
                                        error={customerDistrictCode && !!orderForm.errors.customerWardCode}
                                        helperText={customerDistrictCode ? orderForm.errors.customerWardCode?.message : ""}
                                        fullWidth
                                        required
                                        select
                                        disabled={!customerDistrictCode}
                                    >
                                        <MenuItem value={null}>Chọn phường/xã</MenuItem>
                                        {wards.map(({ code, name }) => (
                                            <MenuItem key={`dt_${code}`} value={code}>{name}</MenuItem>
                                        ))}
                                    </TextField>
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography className={`${styles.fieldLabel} ${styles.required}`} >Hình thức vận chuyển</Typography>
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
                                        {props.deliveryPlatforms.map(({ code, name }) => (
                                            <MenuItem key={`pv_${code}`} value={code}>{name}</MenuItem>
                                        ))}
                                    </TextField>
                                }
                            />

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography className={`${styles.fieldLabel} ${styles.required}`} >Phương thức thanh toán</Typography>
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
                        <Grid item xs={12} md={4}>
                            <Typography className={`${styles.fieldLabel} ${styles.required}`} >Trạng thái</Typography>
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
            </MyCardContent>
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
                            <col />
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Số thứ tự</TableCell>
                                <TableCell align="left">SKU</TableCell>
                                <TableCell align="left">Tên người bán</TableCell>
                                <TableCell align="left">Tên sản phẩm</TableCell>
                                <TableCell align="right">Số lượng</TableCell>
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
                                                            onClick={() => handleOderItemQuantityUpdate(row.orderItemNo, row.quantity)}
                                                        >
                                                            <SaveIcon fontSize="small" />
                                                        </IconButton>
                                                    )
                                                }}
                                                inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                                onChange={e => handleOrderItemQuantityChange(row.orderItemNo, +e.target.value)}
                                            />
                                        </TableCell>
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
                    onClick={orderForm.handleSubmit(handleSubmitOrder)}
                    disabled={status != 'WaitConfirm'}
                    style={{ margin: 8 }}
                >
                    {loading && <CircularProgress size={20} />}
                    Lưu
                </Button>
                <Link href={`/crm/order`}>
                    <Button variant="contained" color="default">Quay lại</Button>
                </Link>
            </MyCardActions>
        </MyCard>
    )
};
