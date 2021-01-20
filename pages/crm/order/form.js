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
    DialogContentText,
    DialogTitle,
    TableFooter
} from "@material-ui/core";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import { formatNumber , orderStatus } from "components/global"
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import EditIcon from "@material-ui/icons/Edit";
import Typography from "@material-ui/core/Typography";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getMasterDataClient } from "client/master-data";
import Head from "next/head";
import Link from "next/link";
import IconButton from "@material-ui/core/IconButton";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./order.module.css";
import { condUserType, statuses, scopes } from "components/global"
import { NotFound } from "components/components-global";
import { getOrderClient } from "client/order";
import MuiSingleAuto from "components/muiauto/single.js"
import zIndex from "@material-ui/core/styles/zIndex";

export async function loadData(ctx) {
    let data = {
        props: {
            status: "OK"
        }
    }

    let masterDataClient = getMasterDataClient(ctx, data)
    let resp = await masterDataClient.getProvince(0, 100, '')
    if (resp.status !== 'OK') {
        return data
    }
    data.props.provinces = resp.data

    let query = ctx.query
    let order_no = typeof (query.order_no) === "undefined" ? '' : query.order_no
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
        let masterDataClient = getMasterDataClient(ctx, data)
        let provinceResp = await masterDataClient.getProvinceByProvinceCode(order.provinceCode)
        let districtResp = await masterDataClient.getDistrictByDistrictCode(order.districtCode)
        let wardResp = await masterDataClient.getWardByWardCode(order.wardCode)

        data.props.province = provinceResp.status === 'OK' ? provinceResp.data[0] : {}
        data.props.district = districtResp.status === 'OK' ? districtResp.data[0] : {}
        data.props.ward = wardResp.status === 'OK' ? wardResp.data[0] : {}

        let districtsResp = await masterDataClient.getDistrictByProvinceCodeFromNextJs(order.provinceCode)
        let wardsResp = await masterDataClient.getWardByDistrictCodeFromNextJS(order.districtCode)

        data.props.districts = districtsResp.status === 'OK' ? districtsResp.data : []
        data.props.wards = wardsResp.status === 'OK' ? wardsResp.data : []

        //map to transform level -> value
        data.props.provinces = data.props.provinces.map(province => ({ ...province, value: province.code, label: province.name }))
        data.props.districts = data.props.districts.map(district => ({ ...district, value: districts.code, label: districts.name }))
        data.props.wards = data.props.wards.map(ward => ({ ...ward, value: ward.code, label: ward.name }))

        //get list order-item 
        let orderItemResp = await orderClient.getOrderItemByOrderNo(order_no)
        if (orderItemResp.status !== 'OK') {
            data.props.message = orderItemResp.message
            data.props.status = orderItemResp.status;
            return data
        }
        data.props.orderItem = orderItemResp.data
    }
    return data
}

export default function renderForm(props, toast) {
    const titlePage = "Cập nhật hóa đơn"
    if (props.status && props.status !== "OK") {
        return (
            <NotFound link='/crm/order' titlePage={titlePage} labelLink="hóa đơn" />
        )
    }
    let { error, success } = toast;
    let editObject = props.isUpdate ? props.order : {}
    const checkWardData = props.isUpdate ? (props.order.wardCode === '' ? {} : props.ward) : {};
    const [loading, setLoading] = useState(false);
    const [idxChangedItem, setIdxChangedItem] = useState()
    const [province, setProvince] = useState(props.province);
    const [orderItem, setOrderItem] = useState(props.orderItem)
    const [quantityItem, setQuantityItem] = useState(0)
    const [districts, setDistricts] = useState(props.districts || []);
    const [district, setDistrict] = useState(props.district || {});
    const [openChangeQuantityDialog, setOpenChangeQuantityDialog] = useState(false)
    const [wards, setWards] = useState(props.wards || []);
    const [ward, setWard] = useState(checkWardData);
    const isWard = ((props.ward === undefined) || (Object.keys(checkWardData).length === 0 && checkWardData.constructor === Object)) ? true : false;
    const isDistrict = ((props.province === undefined) || (Object.keys(props.province).length === 0 && props.province.constructor === Object)) ? true : false;
    const [isDisabledDistrict, setDisabledDistrict] = useState(isDistrict);
    const [isDisabledWard, setDisabledWard] = useState(isWard);
    const router = useRouter();
    const { register, handleSubmit, errors, control, getValues } = useForm({
        defaultValues:editObject,
        mode: "onSubmit"
    });

    const onSubmit = async (formData) => {
        if (formData.passwordConfirm !== formData.password) {
            error("Xác nhận mật khẩu không chính xác")
            errors.passwordConfirm = {}
            errors.passwordConfirm.message = "Mật khẩu xác nhận không chính xác"
            return
        }
        // formData.customerProvinceCode = formData.customerProvinceCode.value || ''
        // formData.customerDistrictCode = formData.customerDistrictCode.value || ''
        // formData.customerWardCode = formData.customerWardCode.value || ''

        if (props.isUpdate) {
            formData.orderNo = props.order.orderNo
            await updateOrder(formData)
            await updateOrderItem(orderItem)
        } else {

        }
    }

    async function updateOrder(formData) {
        let orderClient = getOrderClient()
        let resp = await orderClient.updateOrder(formData)
        if (resp.status !== 'OK') {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            success(titlePage + ' thành công')
        }
    }

    async function updateOrderItem(orderItem) {
        let orderClient = getOrderClient()
        let resp
        for (let i = 0; i < orderItem.length; i++) {
            resp = await orderClient.updateOrderItem({
                totalPrice: parseInt(orderItem[i].price * orderItem[i].quantity), orderNo: orderItem[i].orderNo, orderItemNo: orderItem[i].orderItemNo
                , quantity: parseInt(orderItem[i].quantity, 10)
            })
            if (resp.status !== 'OK') {
                error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
            }
        }
        if (resp.status !== 'OK') {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            success(titlePage + ' thành công')
        }
    }

    const RenderRow = ({ data, index }) => {
        return (
            <TableRow key={index}>
                <TableCell align="left">{data.image}</TableCell>
                <TableCell align="left">{data.name}</TableCell>
                <TableCell align="center">{formatNumber(data.price)}</TableCell>
                <TableCell align="center">{formatNumber(data.quantity)}</TableCell>
                <TableCell align="right">{formatNumber(data.totalPrice)}</TableCell>
                <TableCell align="center">
                    <IconButton onClick={() => { setIdxChangedItem(index); setOpenChangeQuantityDialog(true); }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    }


    const changeQuantityHandler = () => {
        let quantityItem = parseInt(getValues('quantityItem'), 10)
        let tmpOrderItem = orderItem.map((item, idx) => {
            if (idx == idxChangedItem) {
                return { ...item, quantity: quantityItem, totalPrice: quantityItem * item.price }
            }
            return item
        })
        // better performance
        props.order.totalPrice = props.order.totalPrice - orderItem[idxChangedItem].totalPrice + tmpOrderItem[idxChangedItem].totalPrice
        setOrderItem(tmpOrderItem)
        setOpenChangeQuantityDialog(false)
    }


    const ChangeQuantityDialog = () => (
        <div>
            <Dialog
                open={openChangeQuantityDialog}
                onClose={() => setOpenChangeQuantityDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Thay đổi số lượng sản phẩm"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        defaultValue={1}
                        style={{ margin: '0 auto', width: '100%' }}
                        // variant="outlined"
                        id="quantityItem"
                        name="quantityItem"
                        size="small"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder=""
                        onChange={event => {
                            if (event.target.value < 1) {
                                event.target.value = 1;
                            }
                            if(event.target.value > orderItem[idxChangedItem].maxQuantity) {
                                event.target.value = orderItem[idxChangedItem].maxQuantity;
                            }
                        }}
                        // error={!!errors.quantityItem}
                        // helperText={errors.quantityItem ? "Nhập số lượng lớn hơn 0" : null}
                        inputRef={register({
                            valueAsNumber: true,
                            min: 0
                        })}
                        label="Số lượng"
                    />

                    {errors.quantityItem && <p>This is required</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenChangeQuantityDialog(false)} color="primary">
                        Hủy bỏ
                    </Button>
                    {/* <Button onClick={(event) => changeQuantityHandler(event)} color="primary"  autoFocus> */}
                    <Button onClick={() => changeQuantityHandler()} color="primary" autoFocus>
                        Đồng ý
                     </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

    return (
        <AppCRM select="/crm/order">
            {
                <Box component={Paper} display="block">
                    <FormGroup>
                        <form>
                            {/* {openChangeQuantityDialog ? : null} */}
                            <ChangeQuantityDialog />
                            <Box className={styles.contentPadding}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" component="h6"
                                            style={{ marginBottom: '10px', fontSize: 18 }}>
                                            Thông tin đơn hàng
                                                </Typography>
                                        <Grid spacing={3} container>
                                            <Grid item xs={12} sm={4} md={4}>
                                                <TextField
                                                    id="customerName"
                                                    name="customerName"
                                                    variant="outlined"
                                                    size="small"
                                                    label="Tên khách hàng"
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
                                                    onChange={(e) => e.target.value = (e.target.value).replace(/\s\s+/g, ' ')}
                                                    inputRef={
                                                        register({
                                                            required: "Tên khách hàng không thể để trống",
                                                            maxLength: {
                                                                value: 50,
                                                                message: "Tên khách hàng có độ dài tối đa 50 kí tự"
                                                            },
                                                            minLength: {
                                                                value: 6,
                                                                message: "Tên khách hàng có độ dài tối thiểu 6 kí tự"
                                                            },
                                                            pattern: {
                                                                value: /^(?!.*[ ]{2})/,
                                                                message: "Tên không hợp lệ (không được dư khoảng trắng)."
                                                            }
                                                        })
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid spacing={3} container>
                                            <Grid item xs={12} sm={3} md={3}>
                                                <TextField
                                                    id="customerPhone"
                                                    name="customerPhone"
                                                    label="Số điện thoại"
                                                    variant="outlined"
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
                                                    onChange={(e) => e.target.value = (e.target.value).replace(/\s\s+/g, ' ')}
                                                    inputRef={
                                                        register({
                                                            required: "Số điện thoại không thể để trống",
                                                            maxLength: {
                                                                value: 12,
                                                                message: "Số điện thoại không hợp lệ"
                                                            },
                                                            pattern: {
                                                                value: /[0-9]{9,12}/,
                                                                message: "Số điện thoại không hợp lệ"
                                                            },
                                                        })
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid spacing={3} container>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <TextField
                                                    id="customerShippingAddress"
                                                    name="customerShippingAddress"
                                                    variant="outlined"
                                                    size="small"
                                                    label="Địa chỉ"
                                                    inputProps={{
                                                        readOnly: true,
                                                        disabled: true,
                                                    }}
                                                    onChange={(e) => e.target.value = (e.target.value).replace(/\s\s+/g, ' ')}
                                                    placeholder=""
                                                    helperText={errors.customerShippingAddress?.message}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    style={{ width: '100%' }}
                                                    error={!!errors.customerShippingAddress}
                                                    required
                                                    inputRef={
                                                        register({
                                                            required: "Địa chỉ không thể để trống",
                                                        })
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid spacing={3} container>
                                            <Grid item xs={12} sm={3} md={3}>
                                                <TextField
                                                    id="customerProvinceCode"
                                                    name="customerProvinceCode"
                                                    variant="outlined"
                                                    size="small"
                                                    label="Tỉnh/Thành Phố"
                                                    inputProps={{
                                                        readOnly: true,
                                                        disabled: true,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    style={{ width: '100%' }}
                                                />
                                                {/* <MuiSingleAuto
                                                    id="customerProvinceCode"
                                                    name="customerProvinceCode" // NAME INPUT
                                                    options={props.provinces}  // DATA OPTIONS label-value
                                                    label="Tỉnh/Thành phố"  // LABEL
                                                    placeholder="Chọn"
                                                    required={true} // boolean
                                                    message="Tỉnh/ Thành phố không thể để trống" // CUSTOM MESSAGE ERROR
                                                    onNotSearchFieldChange={onProvinceChange} // HANDLE EVENT CHANGE
                                                    control={control} // REACT HOOK FORM CONTROL
                                                    readOnly={true}
                                                    errors={errors} /> */}
                                            </Grid>
                                            <Grid item xs={12} sm={3} md={3}>
                                                <TextField
                                                    id="customerDistrictCode"
                                                    name="customerDistrictCode"
                                                    variant="outlined"
                                                    size="small"
                                                    label="Quận/Huyện"
                                                    inputProps={{
                                                        readOnly: true,
                                                        disabled: true,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    style={{ width: '100%' }}
                                                />
                                                {/* <MuiSingleAuto
                                                    id="customerDistrictCode"
                                                    name="customerDistrictCode" // NAME INPUT
                                                    options={districts}  // DATA OPTIONS label-value
                                                    label="Quận/Huyện"  // LABEL
                                                    placeholder="Chọn"
                                                    
                                                    required={true} // boolean
                                                    message="Quận/huyện thể để trống" // CUSTOM MESSAGE ERROR
                                                    onNotSearchFieldChange={onDistrictChange} // HANDLE EVENT CHANGE
                                                    control={control} // REACT HOOK FORM CONTROL
                                                    errors={errors} /> */}

                                            </Grid>
                                            <Grid item xs={12} sm={3} md={3}>
                                                <TextField
                                                    id="customerWardCode"
                                                    name="customerWardCode"
                                                    variant="outlined"
                                                    size="small"
                                                    label="Phường/Xã"
                                                    inputProps={{
                                                        readOnly: true,
                                                        disabled: true,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    style={{ width: '100%' }}
                                                />
                                                {/* <MuiSingleAuto
                                                    id="customerWardCode"
                                                    name="customerWardCode" // NAME INPUT
                                                    options={wards}  // DATA OPTIONS label-value
                                                    label="Phường/Xã"
                                                    placeholder="Chon"
                                                    required={true} // boolean
                                                    message="Phường xã không thể để trống" // CUSTOM MESSAGE ERROR
                                                    onNotSearchFieldChange={onWardChange} // HANDLE EVENT CHANGE
                                                    control={control} // REACT HOOK FORM CONTROL
                                                    errors={errors} /> */}
                                            </Grid>
                                        </Grid>
                                        <Grid spacing={3} container>

                                            <Grid item xs={12} sm={3} md={3}>
                                                <TextField
                                                    id="deliveryPlatform"
                                                    name="deliveryPlatform"
                                                    variant="outlined"
                                                    size="small"
                                                    label="Hình thức vận chuyển"
                                                    inputProps={{
                                                        readOnly: true,
                                                        disabled: true,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    style={{ width: '100%' }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3} md={3}>
                                                <TextField
                                                    id="paymentMethod"
                                                    name="paymentMethod"
                                                    variant="outlined"
                                                    size="small"
                                                    label="Phương thức thanh toán"
                                                    inputProps={{
                                                        readOnly: true,
                                                        disabled: true,
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    style={{ width: '100%' }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3} md={3}>
                                                <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                                                    <InputLabel id="department-select-label">Trạng thái</InputLabel>
                                                    <Controller
                                                        name="status"
                                                        control={control}
                                                        defaultValue={orderStatus ? orderStatus[0].value : ''}
                                                        rules={{ required: true }}
                                                        error={!!errors.status}
                                                        as={
                                                            <Select label="Trạng thái">
                                                                {orderStatus?.map(({ value, label }) => (
                                                                    <MenuItem value={value} key={value}>{label}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        }
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                                <TableContainer component={Paper}>
                                    <Table size="small" aria-label="a dense table">
                                        <colgroup>
                                            <col width="20%" />
                                            <col width="20%" />
                                            <col width="15%" />
                                            <col width="10%" />
                                            <col width="15%" />
                                            <col width="20%" />
                                        </colgroup>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Hình ảnh</TableCell>
                                                <TableCell align="left">Tên sản phẩm</TableCell>
                                                <TableCell align="center">Giá</TableCell>
                                                <TableCell align="center">Số lượng</TableCell>
                                                <TableCell align="right">Thành tiền</TableCell>
                                                <TableCell align="center">Thay đổi số lượng</TableCell>
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
                                                        <TableCell colSpan={3} align="left">{props.orderItem.message}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            )}
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left">Phí vận chuyển</TableCell>
                                                <TableCell align="center">{props.order.shippingFee}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left">Giảm giá</TableCell>
                                                <TableCell align="center">{props.order.totalDiscount}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left" style={{ fontWeight: 'bold', color: 'black',fontSize:'20px' }}>Tổng tiền</TableCell>
                                                <TableCell align="center" style={{ fontWeight: 'bold', color: 'black',fontSize:'20px' }} >{formatNumber(props.order.totalPrice)}</TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>


                                <Divider />

                                <Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit(onSubmit)}
                                        disabled={loading}
                                        style={{ margin: 8 }}>
                                        {loading && <CircularProgress size={20} />}
                                    Lưu
                                    </Button>
                                    <Link href={`/crm/order`}>
                                        <ButtonGroup color="primary" aria-label="contained primary button group">
                                            <Button variant="contained" color="default">Quay lại</Button>
                                        </ButtonGroup>
                                    </Link>
                                </Box>

                            </Box>
                        </form>
                    </FormGroup>
                </Box>
            }

        </AppCRM >
    )
}