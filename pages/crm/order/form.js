import { Box, Button, ButtonGroup, CardContent, FormGroup, Paper, TextField } from "@material-ui/core";
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
import { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./order.module.css";
import { condUserType, statuses, scopes } from "components/global"
import { NotFound } from "components/components-global";
import { getOrderClient } from "client/order";
import MuiSingleAuto from "components/muiauto/single.js"

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
        data.props.provinces=data.props.provinces.map(province=>({...province,value:province.code}))
        data.props.districts=data.props.districts.map(district=>({...district,value:districts.code}))
        data.props.wards=data.props.wards.map(ward=>({...ward,value:ward.code}))
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
    const [province, setProvince] = useState(props.province);
    const [districts, setDistricts] = useState(props.districts || []);
    const [district, setDistrict] = useState(props.district || {});
    const [wards, setWards] = useState(props.wards || []);
    const [ward, setWard] = useState(checkWardData);
    const isWard = ((props.ward === undefined) || (Object.keys(checkWardData).length === 0 && checkWardData.constructor === Object)) ? true : false;
    const isDistrict = ((props.province === undefined) || (Object.keys(props.province).length === 0 && props.province.constructor === Object)) ? true : false;
    const [isDisabledDistrict, setDisabledDistrict] = useState(isDistrict);
    const [isDisabledWard, setDisabledWard] = useState(isWard);
    const router = useRouter();
    const { register, handleSubmit, errors, control } = useForm({
        defaultValues: editObject,
        mode: "onChange"
    });
   console.log(props.provinces)
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
        formData.provinceCode = province.code || ''
        formData.districtCode = district.code || ''
        formData.wardCode = ward.code || ''

        if (props.isUpdate) {
            formData.orderNo = props.order.orderNo
            formData.customerDistrictCode = formData.districtCode
            await updateOrder(formData)
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

    return (
        <AppCRM select="/crm/order">
            {
                <Box component={Paper} display="block">
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
                                                    helperText={errors.phone?.message}
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
                                                    helperText={errors.address?.message}
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
                                                {/* <Autocomplete
                                                    options={props.provinces}
                                                    size="small"
                                                    value={province}
                                                    onChange={onProvinceChange}
                                                    noOptionsText={noOptionsText}
                                                    getOptionLabel={(option) => option.name}

                                                    renderInput={(params) =>
                                                        <TextField
                                                            id="provinceCode"
                                                            name="provinceCode"
                                                            variant="outlined"
                                                            label="Tỉnh/Thành phố"
                                                            helperText={errors.provinceCode?.message}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            style={{ width: '100%' }}
                                                            error={!!errors.provinceCode}
                                                            required
                                                            inputRef={
                                                                register({
                                                                    required: "Tỉnh/ Thành phố không thể để trống",
                                                                })
                                                            }
                                                            {...params} />}
                                                /> */}
                                                <MuiSingleAuto 
                                                id="provinceCode"
                                                name="provinceCode" // NAME INPUT
                                                    options={props.provinces}  // DATA OPTIONS label-value
                                                    label="Tỉnh/Thành phố"  // LABEL
                                                    placeholder="Chon"
                                                    required={true} // boolean
                                                    message="Tỉnh/ Thành phố không thể để trống" // CUSTOM MESSAGE ERROR
                                                    onFieldChange={onProvinceChange} // HANDLE EVENT CHANGE
                                                    control={control} // REACT HOOK FORM CONTROL
                                                    errors={errors} />

                                            </Grid>
                                            <Grid item xs={12} sm={3} md={3}>
                                                <Autocomplete
                                                    options={districts}
                                                    size="small"
                                                    getOptionLabel={(option) => option.name}
                                                    value={district}
                                                    onChange={onDistrictChange}
                                                    noOptionsText={noOptionsText}
                                                    disabled={isDisabledDistrict}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            id="customerDistrictCode"
                                                            name="customerDistrictCode"
                                                            variant="outlined"
                                                            label="Quận/Huyện"
                                                            // helperText={errors.districtCode?.message}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            style={{ width: '100%' }}
                                                            // error={!!errors.districtCode}
                                                            // required
                                                            inputRef={
                                                                register({
                                                                    // required: "Quận/huyện thể để trống",
                                                                })
                                                            }
                                                            {...params} />}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3} md={3}>
                                                <Autocomplete
                                                    size="small"
                                                    options={wards}
                                                    name={"ward"}
                                                    value={ward}
                                                    disabled={isDisabledWard}
                                                    onChange={onWardChange}
                                                    noOptionsText={noOptionsText}
                                                    getOptionLabel={(option) => option.name}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            id="customerWardCode"
                                                            name="customerWardCode"
                                                            variant="outlined"
                                                            label="Phường/Xã"
                                                            helperText={errors.customerWardCode?.message}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            style={{ width: '100%' }}
                                                            error={!!errors.customerWardCode}
                                                            required
                                                            inputRef={
                                                                register({
                                                                    required: "Phường xã không thể để trống",
                                                                })
                                                            }
                                                            {...params} />}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
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

        </AppCRM>
    )
}