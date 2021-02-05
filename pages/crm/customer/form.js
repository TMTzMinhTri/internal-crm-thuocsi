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
import { getCustomerClient } from "client/customer";
import { getMasterDataClient } from "client/master-data";
import { NotFound } from "components/components-global";
import { scopes, statuses } from "components/global";
import MuiSingleAuto from "components/muiauto/single";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./customer.module.css";
import { getCommonAPI } from 'client/common';

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
    let customerCode = typeof (query.customerCode) === "undefined" ? '' : query.customerCode
    data.props.isUpdate = false
    if (customerCode !== '') {
        data.props.isUpdate = true
        let customerClient = getCustomerClient(ctx, data)
        let customerResp = await customerClient.getCustomerByCustomerCode(customerCode)
        if (customerResp.status !== 'OK') {
            data.props.message = customerResp.message
            data.props.status = customerResp.status;
            return data
        }
        let customer = customerResp.data[0]
        data.props.customer = customer
        let masterDataClient = getMasterDataClient(ctx, data)
        let provinceResp = await masterDataClient.getProvinceByProvinceCode(customer.provinceCode)
        let districtResp = await masterDataClient.getDistrictByDistrictCode(customer.districtCode)
        let wardResp = await masterDataClient.getWardByWardCode(customer.wardCode)

        data.props.province = provinceResp.status === 'OK' ? provinceResp.data[0] : {}
        data.props.district = districtResp.status === 'OK' ? districtResp.data[0] : {}
        data.props.ward = wardResp.status === 'OK' ? wardResp.data[0] : {}

        let districtsResp = await masterDataClient.getDistrictByProvinceCodeFromNextJs(customer.provinceCode)
        let wardsResp = await masterDataClient.getWardByDistrictCodeFromNextJS(customer.districtCode)

        data.props.districts = districtsResp.status === 'OK' ? districtsResp.data : []
        data.props.wards = wardsResp.status === 'OK' ? wardsResp.data : []
    }

    // get list customer level
    const customerCommon = getCommonAPI(ctx, {})
    const resLevel = await customerCommon.getListLevelCustomers()
    data.props.condUserType = []
    if (resLevel.status === 'OK') {
        data.props.condUserType = resLevel.data.map(item => { return { value: item.code, label: item.name } })
    }
    return data
}

export default function renderForm(props, toast) {
    const titlePage = "Cập nhật khách hàng"
    if (props.status && props.status !== "OK") {
        return (
            <NotFound link='/crm/customer' titlePage={titlePage} labelLink="khách hàng" />
        )
    }
    let { error, success } = toast;
    let editObject = props.isUpdate ? props.customer : {}

    props.isUpdate ? props.customer.provinceCode = { value: props.province?.code, label: props.province?.name, code: props.province?.code } : ''

    const checkWardData = props.isUpdate ? (props.customer.wardCode === '' ? {} : props.ward) : {};
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
    const { register, handleSubmit, errors, control, watch } = useForm({
        defaultValues: editObject,
        mode: "onChange"
    });

    const noOptionsText = "Không có tùy chọn";

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
            formData.customerID = props.customer.customerID
            formData.id = props.customer.id
            formData.code = props.customer.code
            await updateCustomer(formData)
        } else {
            await createCustomer(formData)
        }
    }

    async function createCustomer(formData) {
        let customerClient = getCustomerClient()
        let resp = await customerClient.createNewCustomer(formData)
        if (resp.status !== 'OK') {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            success('Thêm khách hàng thành công')
            router.push(`/crm/customer`)
        }
    }

    async function updateCustomer(formData) {
        let customerClient = getCustomerClient()
        let resp = await customerClient.updateCustomer(formData)
        if (resp.status !== 'OK') {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            success(titlePage + ' thành công')
        }
    }

    return (
        <AppCRM select="/crm/customer">
            <Head>
                <title>{props.isUpdate ? titlePage : 'Thêm khách hàng'}</title>
            </Head>
            {
                props.isUpdate && typeof props.customer === 'undefined' ? (
                    <div>
                        <Box component={Paper} display="block">
                            <FormGroup>
                                <form>
                                    <Grid container spacing={3} direction="row"
                                        justify="space-between"
                                        alignItems="flex-start" className={styles.contentPadding}>
                                        <Grid item xs={12} md={12} sm={12}>
                                            <Box style={{ fontSize: 24 }}>{titlePage}</Box>
                                        </Grid>
                                        <Grid item xs={12} md={12} sm={12}>
                                            <span>{props.message}</span>
                                        </Grid>
                                    </Grid>
                                </form>
                            </FormGroup>
                        </Box>
                    </div>
                )
                    : (
                        <Box component={Paper} display="block">
                            <FormGroup>
                                <form>
                                    <Box className={styles.contentPadding}>
                                        <Box style={{ fontSize: 24, marginBottom: '10px' }}>{props.isUpdate ? titlePage : 'Thêm khách hàng'}</Box>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="h6" component="h6"
                                                    style={{ marginBottom: '10px', fontSize: 18 }}>
                                                    Thông tin cơ bản
                                                </Typography>
                                                <Grid spacing={3} container>
                                                    <Grid item xs={12} sm={4} md={4}>
                                                        <TextField
                                                            id="name"
                                                            name="name"
                                                            variant="outlined"
                                                            size="small"
                                                            label="Tên khách hàng"
                                                            placeholder=""
                                                            helperText={errors.name?.message}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            style={{ width: '100%' }}
                                                            error={!!errors.name}
                                                            required
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
                                                    <Grid item xs={12} sm={4} md={4}>
                                                        <TextField
                                                            id="email"
                                                            name="email"
                                                            label="Email"
                                                            variant="outlined"
                                                            size="small"
                                                            placeholder=""
                                                            type="email"
                                                            helperText={errors.email?.message}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            style={{ width: '100%' }}
                                                            error={!!errors.email}
                                                            required
                                                            inputRef={
                                                                register({
                                                                    required: "Email khách hàng không thể để trống",
                                                                    pattern: {
                                                                        value: /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
                                                                        message: "Email không hợp lệ",
                                                                    }
                                                                })
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid spacing={3} container>
                                                    <Grid item xs={12} sm={3} md={3}>
                                                        <TextField
                                                            id="phone"
                                                            name="phone"
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
                                                            error={!!errors.phone}
                                                            required
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
                                                            id="address"
                                                            name="address"
                                                            variant="outlined"
                                                            size="small"
                                                            label="Địa chỉ"
                                                            placeholder=""
                                                            helperText={errors.address?.message}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            style={{ width: '100%' }}
                                                            error={!!errors.address}
                                                            required
                                                            inputRef={
                                                                register({
                                                                    required: "Địa chỉ không thể để trống",
                                                                    maxLength: {
                                                                        value: 250,
                                                                        message: "Địa chỉ có độ dài tối đa 250 kí tự"
                                                                    },
                                                                    minLength: {
                                                                        value: 1,
                                                                        message: "Địa chỉ có độ dài tối thiểu 1 kí tự"
                                                                    },
                                                                    pattern: {
                                                                        value: /^(?!.*[ ]{2})/,
                                                                        message: "Địa chỉ không hợp lệ (không được dư khoảng trắng)."
                                                                    }
                                                                })
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid spacing={3} container>
                                                    <Grid item xs={12} sm={3} md={3}>
                                                        <MuiSingleAuto
                                                            id="provinceCode"
                                                            name="provinceCode"
                                                            noOptionsText={noOptionsText}
                                                            options={typeof props.provinces !== 'undefined' ? [...props.provinces.map(province => { return { value: province.code, label: province.name, code: province.code } }
                                                            )] : []}
                                                            onNotSearchFieldChange={onProvinceChange}
                                                            required={true}
                                                            label="Tỉnh/Thành phố"
                                                            control={control}
                                                            errors={errors}
                                                            message={'Vui lòng chọn tỉnh thành'}
                                                        />
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
                                                                    id="districtCode"
                                                                    name="districtCode"
                                                                    variant="outlined"
                                                                    label="Quận/Huyện"
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    style={{ width: '100%' }}
                                                                    inputRef={
                                                                        register
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
                                                                    id="wardCode"
                                                                    name="wardCode"
                                                                    variant="outlined"
                                                                    label="Phường/Xã"
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    style={{ width: '100%' }}
                                                                    inputRef={
                                                                        register
                                                                    }
                                                                    {...params} />}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                        <Card variant="outlined" style={{ marginTop: '10px' }}>
                                            <CardContent>
                                                <Typography variant="h6" component="h6"
                                                    style={{ marginBottom: '10px', fontSize: 18 }}>
                                                    Thông tin pháp lý
                                    </Typography>
                                                <Grid spacing={3} container>
                                                    <Grid item xs={12} sm={4} md={4}>
                                                        <TextField
                                                            id="legalRepresentative"
                                                            name="legalRepresentative"
                                                            label="Người đại diện"
                                                            variant="outlined"
                                                            size="small"
                                                            placeholder=""
                                                            helperText={errors.legalRepresentative?.message}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            style={{ width: '100%' }}
                                                            error={!!errors.legalRepresentative}
                                                            required
                                                            inputRef={
                                                                register({
                                                                    required: "Người đại diện không thể để trống",
                                                                    maxLength: {
                                                                        value: 100,
                                                                        message: "Người đại diện có độ dài tối đa 100 kí tự"
                                                                    },
                                                                    minLength: {
                                                                        value: 1,
                                                                        message: "Người đại diện có độ dài tối thiểu 1 kí tự"
                                                                    },
                                                                    pattern: {
                                                                        value: /^(?!.*[ ]{2})/,
                                                                        message: "Người đại diện không hợp lệ (không được dư khoảng trắng)."
                                                                    }
                                                                })
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={3} md={3}>
                                                        <TextField
                                                            id="mst"
                                                            name="mst"
                                                            label="Mã số thuế"
                                                            variant="outlined"
                                                            size="small"
                                                            placeholder=""
                                                            helperText={errors.mst?.message}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            style={{ width: '100%' }}
                                                            error={!!errors.mst}
                                                            required
                                                            inputRef={
                                                                register({
                                                                    required: "Mã số thuế không thể để trống",
                                                                    maxLength: {
                                                                        value: 50,
                                                                        message: "Mã số thuế có độ dài tối đa 50 kí tự"
                                                                    },
                                                                    minLength: {
                                                                        value: 1,
                                                                        message: "Mã số thuế có độ dài tối thiểu 1 kí tự"
                                                                    },
                                                                    pattern: {
                                                                        value: /^(?!.*[ ]{2})/,
                                                                        message: "Mã số thuế không hợp lệ (không được dư khoảng trắng)."
                                                                    }
                                                                })
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                        <Card variant="outlined" style={{ marginTop: '10px' }}>
                                            <CardContent>
                                                <Typography variant="h6" component="h6"
                                                    style={{ marginBottom: '10px', fontSize: 18 }}>
                                                    Thông tin tài khoản
                                    </Typography>
                                                <Grid spacing={3} container>
                                                    <Grid item xs={12} sm={3} md={3}>
                                                        <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                                                            <InputLabel id="department-select-label" sise="small">Vai trò</InputLabel>
                                                            <Controller
                                                                name="scope"
                                                                control={control}
                                                                lable="Vai trò"
                                                                defaultValue={scopes ? scopes[0].value : ''}
                                                                rules={{ required: true }}
                                                                error={!!errors.scope}
                                                                as={
                                                                    <Select label="Vai trò">
                                                                        {scopes?.map(({ value, label }) => (
                                                                            <MenuItem value={value} key={value}>{label}</MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                }
                                                            />
                                                        </FormControl>

                                                    </Grid>
                                                    <Grid item xs={12} sm={3} md={3}>
                                                        <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                                                            <InputLabel id="department-select-label" sise="small">Cấp độ</InputLabel>
                                                            <Controller
                                                                name="level"
                                                                control={control}
                                                                lable="Cấp độ"
                                                                defaultValue={props.condUserType ? props.condUserType[0].value : ''}
                                                                rules={{ required: true }}
                                                                error={!!errors.level}
                                                                as={
                                                                    <Select label="Cấp độ">
                                                                        {props.condUserType?.map(({ value, label }) => (
                                                                            <MenuItem value={value} key={value}>{label}</MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                }
                                                            />
                                                        </FormControl>

                                                    </Grid>
                                                    {
                                                        props.isUpdate ? (
                                                            <Grid item xs={12} sm={3} md={3}>
                                                                <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                                                                    <InputLabel id="department-select-label">Trạng thái</InputLabel>
                                                                    <Controller
                                                                        name="status"
                                                                        control={control}
                                                                        defaultValue={statuses ? statuses[0].value : ''}
                                                                        rules={{ required: true }}
                                                                        error={!!errors.status}
                                                                        as={
                                                                            <Select label="Trạng thái">
                                                                                {statuses?.map(({ value, label }) => (
                                                                                    <MenuItem value={value} key={value}>{label}</MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        }
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                        ) : ''
                                                    }

                                                </Grid>
                                                {
                                                    props.isUpdate ? (
                                                        <div />
                                                    ) : (
                                                            <Grid spacing={3} container>
                                                                <Grid item xs={12} sm={3} md={3}>
                                                                    <TextField
                                                                        id="password"
                                                                        name="password"
                                                                        label="Mật khẩu đăng nhập"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        placeholder=""
                                                                        type="password"
                                                                        helperText={errors.password?.message}
                                                                        inputProps={{
                                                                            autoComplete: 'new-password'
                                                                        }}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        style={{ width: '100%' }}
                                                                        error={!!errors.password}
                                                                        required
                                                                        inputRef={
                                                                            register({
                                                                                required: "Mật khẩu không thể để trống",
                                                                                pattern: {
                                                                                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,12}$/,
                                                                                    message: "Mật khẩu có độ dài từ 8 đến 12 kí tự, phải có ít nhất 1 chữ thường, 1 chữ hoa và 1 số"
                                                                                }
                                                                            })
                                                                        }
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={3} md={3}>
                                                                    <TextField
                                                                        id="passwordConfirm"
                                                                        name="passwordConfirm"
                                                                        label="Xác nhận mật khẩu"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        type="password"
                                                                        placeholder=""
                                                                        helperText={errors.passwordConfirm?.message}
                                                                        InputProps={{
                                                                            autocomplete: 'off'
                                                                        }}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        style={{ width: '100%' }}
                                                                        error={!!errors.passwordConfirm}
                                                                        required
                                                                        inputRef={
                                                                            register({
                                                                                validate: (value) => value === watch('password') || "Mật khẩu không khớp, vui lòng nhập lại."
                                                                            })
                                                                        }
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        )
                                                }
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
                                            {
                                                props.isUpdate ? (
                                                    <Link href={`/crm/customer`}>
                                                        <ButtonGroup color="primary" aria-label="contained primary button group">
                                                            <Button variant="contained" color="default">Quay lại</Button>
                                                        </ButtonGroup>
                                                    </Link>
                                                ) : (
                                                        <Button
                                                            variant="contained"
                                                            type="reset"
                                                            style={{ margin: 8 }}
                                                            disabled={loading}>
                                                            {loading && <CircularProgress size={20} />}
                                                            Làm mới
                                                        </Button>
                                                    )
                                            }
                                        </Box>
                                    </Box>
                                </form>
                            </FormGroup>
                        </Box>
                    )
            }
        </AppCRM>
    )
}