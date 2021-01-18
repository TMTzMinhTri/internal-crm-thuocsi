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
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getMasterDataClient } from "client/master-data";
import Head from "next/head";
import Link from "next/link";
import IconButton from "@material-ui/core/IconButton";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
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
        // let orderItemResp = await orderClient.getOrderItemByOrderNo(order_no)
        // if (orderItemResp.status !== 'OK') {
        //     data.props.message = orderItemResp.message
        //     data.props.status = orderItemResp.status;
        //     return data
        // }
        // data.props.orderItem = orderItemResp.data[0]
   
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
    const [quantityItem,setQuantityItem] = useState(1)
    const [idxChangedItem,setIdxChangedItem] = useState()
    const [province, setProvince] = useState(props.province);
    // const [orderItem,setOrderItem] = useState(props.orderItem.data)
    const [districts, setDistricts] = useState(props.districts || []);
    const [district, setDistrict] = useState(props.district || {});
    const [openChangeQuantityDialog,setOpenChangeQuantityDialog] = useState(false)
    const [wards, setWards] = useState(props.wards || []);
    const [ward, setWard] = useState(checkWardData);
    const isWard = ((props.ward === undefined) || (Object.keys(checkWardData).length === 0 && checkWardData.constructor === Object)) ? true : false;
    const isDistrict = ((props.province === undefined) || (Object.keys(props.province).length === 0 && props.province.constructor === Object)) ? true : false;
    const [isDisabledDistrict, setDisabledDistrict] = useState(isDistrict);
    const [isDisabledWard, setDisabledWard] = useState(isWard);
    const router = useRouter();
    const { register, handleSubmit, errors, control } = useForm({
        defaultValues: editObject,
        mode: "onSubmit"
    });

    const noOptionsText = "Không có tùy chọn!";

    const onProvinceChange = async (event, val) => {
        setProvince()
        setDistricts([])
        setDistrict({})
        setWards([])
        setWard({})
        setDisabledDistrict(true)
        setDisabledWard(true)
        let masterDataClient = getMasterDataClient()
        if (val) {
            setProvince(val)
            let res = await masterDataClient.getDistrictByProvinceCode(val?.code)
            if (res.status !== 'OK') {
                error(res.message || 'Thao tác không thành công, vui lòng thử lại sau');
            } else {
                res.data = res.data.map(district => ({ ...district, value: district.code, label: district.name }))
                setDistricts(res.data)
                setDisabledDistrict(false)
            }
        }
    }

    const onDistrictChange = async (event, val) => {
        setDistrict('')
        setWards([])
        setWard('')
        setDisabledWard(true)
        let masterDataClient = getMasterDataClient()
        if (val) {
            setDistrict(val)
            let res = await masterDataClient.getWardByDistrictCode(val.code)
            if (res.status !== 'OK') {
                error(res.message || 'Thao tác không thành công, vui lòng thử lại sau')
            } else {
                res.data = res.data.map(ward => ({ ...ward, value: ward.code, label: ward.name }))
                setWards(res.data)
                setDisabledWard(false)
            }
        }
    }

    const onWardChange = async (event, val) => {
        setWard()
        if (val) {
            setWard(val)
        } else {
            setWard({})
        }
    }

    const onSubmit = async (formData) => {
        if (formData.passwordConfirm !== formData.password) {
            error("Xác nhận mật khẩu không chính xác")
            errors.passwordConfirm = {}
            errors.passwordConfirm.message = "Mật khẩu xác nhận không chính xác"
            return
        }
        formData.customerProvinceCode = formData.customerProvinceCode.value || ''
        formData.customerDistrictCode = formData.customerDistrictCode.value || ''
        formData.customerWardCode = formData.customerWardCode.value || ''

        if (props.isUpdate) {
            formData.orderNo = props.order.orderNo
            console.log(formData)
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
        for(let i=0;i<orderItem.length;i++) {
            console.log(orderItem[i])
            resp = await orderClient.updateOrderItem(orderItem[i])
        }
        if (resp.status !== 'OK') {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            success(titlePage + ' thành công')
        }
    }

    const RenderRow = ({data,index}) => {
        return  (
            <TableRow key={index}>
                <TableCell align="left">{data.image}</TableCell>
                <TableCell align="left">{data.name}</TableCell>
                <TableCell align="left">{data.price}</TableCell>
                <TableCell align="left">{data.quantity}</TableCell>
                <TableCell align="left">{data.totalPrice}</TableCell>
                <TableCell align="left">
                 <IconButton onClick={() => {setIdxChangedItem(index); setOpenChangeQuantityDialog(true);}}>
                        <LockOpenIcon fontSize="small" />
                </IconButton>
                </TableCell>
            </TableRow>
        );
    }
    

    const changeQuantityHandler = () => {
        console.log("thay doi")
        console.log(idxChangedItem)
        let tmpOrderItem = orderItem.map((item,idx)=> {
            if(idx==idxChangedItem) {
                return {...item,quantity:quantityItem,totalPrice:quantityItem*item.price}
            }
            return item
        })
        console.log(tmpOrderItem)
        setOrderItem(tmpOrderItem)
        setOpenChangeQuantityDialog(false)
    }

    const ChangeQuantityDialog = () => (
        <div>
            <Dialog
                open={true}
                onClose={() => setOpenChangeQuantityDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Thay đổi số lượng sản phẩm"}
                </DialogTitle>
               <DialogContent>
               <TextField
                    defaultValue={quantityItem}
                    style={{margin:'0 auto',width:'50%'}}
                    variant="outlined"
                    size="small"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label="Số lượng"
                    onChange={event=>{setQuantityItem(event.target.value)}}
                />
               </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenChangeQuantityDialog(false)} color="primary">
                        Hủy bỏ
                    </Button>
                    <Button onClick={(event)=>changeQuantityHandler(event)} color="primary" autoFocus>
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
                    { openChangeQuantityDialog ? <ChangeQuantityDialog /> : null }
                    <FormGroup>
                        <form>
                            <Box className={styles.contentPadding}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" component="h6"
                                            style={{ marginBottom: '10px', fontSize: 18 }}>
                                            Thông tin cơ bản
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
                                                <MuiSingleAuto
                                                    id="customerProvinceCode"
                                                    name="customerProvinceCode" // NAME INPUT
                                                    options={props.provinces}  // DATA OPTIONS label-value
                                                    label="Tỉnh/Thành phố"  // LABEL
                                                    placeholder="Chọn"
                                                    required={true} // boolean
                                                    message="Tỉnh/ Thành phố không thể để trống" // CUSTOM MESSAGE ERROR
                                                    onNotSearchFieldChange={onProvinceChange} // HANDLE EVENT CHANGE
                                                    control={control} // REACT HOOK FORM CONTROL
                                                    errors={errors} />
                                            </Grid>
                                            <Grid item xs={12} sm={3} md={3}>
                                                <MuiSingleAuto
                                                    id="customerDistrictCode"
                                                    name="customerDistrictCode" // NAME INPUT
                                                    options={districts}  // DATA OPTIONS label-value
                                                    label="Quận/Huyện"  // LABEL
                                                    placeholder="Chọn"
                                                    
                                                    required={true} // boolean
                                                    message="Quận/huyện thể để trống" // CUSTOM MESSAGE ERROR
                                                    onNotSearchFieldChange={onDistrictChange} // HANDLE EVENT CHANGE
                                                    control={control} // REACT HOOK FORM CONTROL
                                                    errors={errors} />

                                            </Grid>
                                            <Grid item xs={12} sm={3} md={3}>
                                                <MuiSingleAuto
                                                    id="customerWardCode"
                                                    name="customerWardCode" // NAME INPUT
                                                    options={wards}  // DATA OPTIONS label-value
                                                    label="Phường/Xã"
                                                    placeholder="Chon"
                                                    required={true} // boolean
                                                    message="Phường xã không thể để trống" // CUSTOM MESSAGE ERROR
                                                    onNotSearchFieldChange={onWardChange} // HANDLE EVENT CHANGE
                                                    control={control} // REACT HOOK FORM CONTROL
                                                    errors={errors} />
                                            </Grid>
                                        </Grid>
                                    </CardContent>

                                </Card>
                                <TableContainer component={Paper}>
                                    <Table size="small" aria-label="a dense table">
                                        <colgroup>
                                            <col width="25%" />
                                            <col width="20%" />
                                            <col width="20%" />
                                            <col width="15%" />
                                            <col width="20%" />
                                        </colgroup>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Hình ảnh</TableCell>
                                                <TableCell align="left">Tên sản phẩm</TableCell>
                                                <TableCell align="left">Giá</TableCell>
                                                <TableCell align="left">Số lượng</TableCell>
                                                <TableCell align="left">Thành tiền</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {/* {orderItem && orderItem.length > 0 ? (
                                            <TableBody>
                                                {orderItem.map((row, i) => (
                                                    <RenderRow data={row} key={i} index={i}/>
                                                ))}
                                            </TableBody>
                                        ) : (
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell colSpan={3} align="left">{props.orderItem.message}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            )} */}
                                    </Table>
                                </TableContainer>
                                <Grid container style={{ margin: '20px' }}>
                                    <Grid item xs={12} sm={9} md={9}></Grid>
                                    <Grid item xs={12} sm={2} md={2}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography color="textSecondary" gutterBottom>

                                                </Typography>
                                                <Typography variant="body2" component="p">
                                                    Giảm giá : {props.order.totalDiscount}
                                                </Typography>
                                                <Typography variant="body2" component="p">
                                                    Tổng tiền : {props.order.totalPrice}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

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