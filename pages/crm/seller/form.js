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
import { getSellerClient } from "client/seller";
import { getMasterDataClient } from "client/master-data";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./seller.module.css";
import { statuses, scopes } from "components/global"
import { NotFound } from "components/components-global";

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
    let sellerCode = typeof (query.sellerCode) === "undefined" ? '' : query.sellerCode
    data.props.isUpdate = false
    if (sellerCode !== '') {
        data.props.isUpdate = true
        let sellerClient = getSellerClient(ctx, data)
        let sellerResp = await sellerClient.getSellerBySellerCode(sellerCode)
        if (sellerResp.status !== 'OK') {
            data.props.message = sellerResp.message
            data.props.status = sellerResp.status;
            return data
        }
        let seller = sellerResp.data[0]
        data.props.seller = seller
        let masterDataClient = getMasterDataClient(ctx, data)
        let provinceResp = await masterDataClient.getProvinceByProvinceCode(seller.provinceCode)
        let districtResp = await masterDataClient.getDistrictByDistrictCode(seller.districtCode)
        let wardResp = await masterDataClient.getWardByWardCode(seller.wardCode)

        data.props.province = provinceResp.status === 'OK' ? provinceResp.data[0] : {}
        data.props.district = districtResp.status === 'OK' ? districtResp.data[0] : {}
        data.props.ward = wardResp.status === 'OK' ? wardResp.data[0] : {}

        let districtsResp = await masterDataClient.getDistrictByProvinceCodeFromNextJs(seller.provinceCode)
        let wardsResp = await masterDataClient.getWardByDistrictCodeFromNextJS(seller.districtCode)

        data.props.districts = districtsResp.status === 'OK' ? districtsResp.data : []
        data.props.wards = wardsResp.status === 'OK' ? wardsResp.data : []
    }
    return data
}

export default function renderForm(props, toast) {
    if (props.status && props.status !== "OK") {
        return (
            <NotFound link='/crm/seller' titlePage="Cập nhật nhà bán hàng" labelLink="nhà bán hàng" />
        )
    }
    let { error, success } = toast;
    let editObject = props.isUpdate ? props.seller : {}
    const checkWardData = props.isUpdate ? (props.seller.wardCode === '' ? {} : props.ward) : {};
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
            formData.sellerID = props.seller.sellerID
            formData.id = props.seller.id
            formData.code = props.seller.code
            await updateSeller(formData)
        } else {
            await createSeller(formData)
        }
    }

    async function createSeller(formData) {
        let sellerClient = getSellerClient()
        let resp = await sellerClient.createNewSeller(formData)
        if (resp.status !== 'OK') {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            success('Thêm khách hàng thành công')
            router.push(`/crm/seller`)
        }
    }

    async function updateSeller(formData) {
        let sellerClient = getSellerClient()
        let resp = await sellerClient.updateSeller(formData)
        if (resp.status !== 'OK') {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            success('Cập nhật khách hàng thành công')
        }
    }

    return (
        <AppCRM select="/crm/seller">
            <Head>
                <title>{props.isUpdate ? 'Cập nhật nhà bán hàng' : 'Thêm khách hàng'}</title>
            </Head>
            {
                props.isUpdate && typeof props.seller === 'undefined' ? (
                    <div>
                        <Box component={Paper} display="block">
                            <FormGroup>
                                <form>
                                    <Grid container spacing={3} direction="row"
                                        justify="space-between"
                                        alignItems="flex-start" className={styles.contentPadding}>
                                        <Grid item xs={12} md={12} sm={12}>
                                            <Box style={{ fontSize: 24 }}>Cập nhật khách hàng</Box>
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
                                        <Box style={{ fontSize: 24, marginBottom: '10px' }}>{props.isUpdate ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}</Box>
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
                                                            inputProps={{
                                                                readOnly: true,
                                                                disabled: true,
                                                            }}
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
                                                                        value: 250,
                                                                        message: "Tên khách hàng có độ dài tối đa 250 kí tự"
                                                                    },
                                                                    minLength: {
                                                                        value: 6,
                                                                        message: "Tên khách hàng có độ dài tối thiểu 6 kí tự"
                                                                    },
                                                                    pattern: {
                                                                        value: /[A-Za-z]/,
                                                                        message: "Tên khách hàng phải có kí tự chữ"
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
                                                            inputProps={{
                                                                readOnly: true,
                                                                disabled: true,
                                                            }}
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
                                                                        value: /.+@.+[.].+/,
                                                                        message: "Email không hợp lệ"
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
                                                            inputProps={{
                                                                readOnly: true,
                                                                disabled: true,
                                                            }}
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
                                                            inputProps={{
                                                                readOnly: true,
                                                                disabled: true,
                                                            }}
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
                                                                })
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid spacing={3} container>
                                                    <Grid item xs={12} sm={3} md={3}>
                                                        <Autocomplete
                                                            options={props.provinces}
                                                            size="small"
                                                            value={province}
                                                            onChange={onProvinceChange}
                                                            getOptionLabel={(option) => option.name}
                                                            disabled
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
                                                                    inputRef={
                                                                        register({
                                                                            // required: "Phường xã không thể để trống",
                                                                        })
                                                                    }
                                                                    style={{ width: '100%' }}
                                                                    error={!!errors.provinceCode}
                                                                    {...params} />}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={3} md={3}>
                                                        <Autocomplete
                                                            options={districts}
                                                            size="small"
                                                            getOptionLabel={(option) => option.name}
                                                            value={district}
                                                            onChange={onDistrictChange}
                                                            disabled
                                                            renderInput={(params) =>
                                                                <TextField
                                                                    id="districtCode"
                                                                    name="districtCode"
                                                                    variant="outlined"
                                                                    inputProps={{
                                                                        readOnly: true,
                                                                        disabled: true,
                                                                    }}
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
                                                            getOptionLabel={(option) => option.name}
                                                            renderInput={(params) =>
                                                                <TextField
                                                                    id="wardCode"
                                                                    name="wardCode"
                                                                    variant="outlined"
                                                                    label="Phường/Xã"
                                                                    inputProps={{
                                                                        readOnly: true,
                                                                        disabled: true,
                                                                    }}
                                                                    // helperText={errors.wardCode?.message}
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    style={{ width: '100%' }}
                                                                    // error={!!errors.wardCode}
                                                                    // required
                                                                    inputRef={
                                                                        register({
                                                                            // required: "Phường xã không thể để trống",
                                                                        })
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
                                                    Thông tin tài khoản
                                    </Typography>
                                                <Grid spacing={3} container>
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
                                                                    <Select label="Trạng thái" disabled>
                                                                        {statuses.map(({ value, label }) => (
                                                                            <MenuItem value={value} key={value}>{label}</MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                }
                                                            />
                                                        </FormControl>
                                                    </Grid>
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
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        style={{ width: '100%' }}
                                                                        error={!!errors.password}
                                                                        required
                                                                        inputRef={
                                                                            register({
                                                                                required: "Mật khẩu không thể để trống",
                                                                                maxLength: {
                                                                                    value: 12,
                                                                                    message: "Mật khẩu có độ dài tối đa 12 kí tự"
                                                                                },
                                                                                minLength: {
                                                                                    value: 6,
                                                                                    message: "Mật khẩu có độ dài tối thiểu 6 kí tự"
                                                                                },
                                                                                pattern: {
                                                                                    value: /[A-Za-z]/,
                                                                                    message: "Mật khẩu phải có kí tự chữ"
                                                                                },
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
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        style={{ width: '100%' }}
                                                                        error={!!errors.passwordConfirm}
                                                                        required
                                                                        inputRef={
                                                                            register({
                                                                                required: "Mật khẩu không thể để trống",
                                                                                maxLength: {
                                                                                    value: 12,
                                                                                    message: "Mật khẩu có độ dài tối đa 12 kí tự"
                                                                                },
                                                                                minLength: {
                                                                                    value: 6,
                                                                                    message: "Mật khẩu có độ dài tối thiểu 6 kí tự"
                                                                                },
                                                                                pattern: {
                                                                                    value: /[A-Za-z]/,
                                                                                    message: "Mật khẩu phải có kí tự chữ"
                                                                                },
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
                                    </Box>
                                </form>
                            </FormGroup>
                        </Box>
                    )
            }

        </AppCRM>
    )
}