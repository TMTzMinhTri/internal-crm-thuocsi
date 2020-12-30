import AppCRM from "../../_layout";
import Head from "next/head";
import {Box, Button, ButtonGroup, CardContent, FormGroup, Paper, TextField} from "@material-ui/core";
import styles from "./customer.module.css";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import React, {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Card from "@material-ui/core/Card";
import {getMasterDataClient} from "../../../client/master-data";
import {getCustomerClient} from "../../../client/customer";
import {useToast} from '@thuocsi/nextjs-components/toast/useToast';
import Link from "next/link";

const levels = [
    {
        value: "Infinity",
        label: "Không giới hạn"
    },
    {
        value: "Diamond",
        label: "Kim cương",
    },
    {
        value: "Platinum",
        label: "Bạch kim",
    },
    {
        value: "Gold",
        label: "Vàng",
    },
    {
        value: "Sliver",
        label: "Bạc",
    },
];

const statuses = [
    {
        value: "ACTIVE",
        label: "Đang hoạt động",
    },
    {
        value: "DRAFT",
        label: "Nháp",
    },
    {
        value: "NEW",
        label: "Mới",
    },
    {
        value: "GUEST",
        label: "Khách",
    },
]

const scopes = [
    {
        value: "PHARMACY",
        label: "Tiệm thuốc"
    },
    {
        value: "CLINIC",
        label: "Phòng khám"
    },
    {
        value: "DRUGSTORE",
        label: "Nhà thuốc"
    },
]

export async function loadData(ctx) {
    let data = {props: {}}

    let masterDataClient = getMasterDataClient(ctx, data)
    let resp = await masterDataClient.getProvince(0, 100, '')
    if (resp.status !== 'OK') {
        return data
    }
    data.props.provinces = resp.data

    let query = ctx.query
    let customerID = typeof(query.customerID) === "undefined" ? '' : query.customerID
    data.props.isUpdate = false
    if (customerID !== '') {
        let customerClient = getCustomerClient(ctx, data)
        let customerResp = await customerClient.getCustomerByCustomerID(customerID)
        if (resp.status !== 'OK') {
            return data
        }
        let customer = customerResp.data[0]
        data.props.customer = customer
        data.props.isUpdate = true

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
    return data
}

export default function renderForm(props, toast) {
    let {error, success} = toast;
    let editObject = props.isUpdate ? props.customer : {}
    const [loading, setLoading] = useState(false);
    const [province, setProvince] = useState(props.province);
    const [districts, setDistricts] = useState(props.districts);
    const [district, setDistrict] = useState(props.district);
    const [wards, setWards] = useState(props.wards);
    const [ward, setWard] = useState(props.ward);
    const {register, handleSubmit, errors, control} = useForm({
        defaultValues: editObject
    });

    const onProvinceChange = async (event, val) => {
        setProvince(val)
        setDistricts([])
        setDistrict({})
        setWard({})
        let masterDataClient = getMasterDataClient()
        let res = await masterDataClient.getDistrictByProvinceCode(val.code)
        if (res.status !== 'OK') {
            error(res.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            setDistricts(res.data)
        }
    }

    const onDistrictChange = async (event, val) => {
        setWards([])
        setDistrict(val)
        setWard({})
        let masterDataClient = getMasterDataClient()
        let res = await masterDataClient.getWardByDistrictCode(val.code)
        if (res.status !== 'OK') {
            error(res.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            setWards(res.data)
        }
    }

    const onWardChange = async (event, val) => {
        setWard(val)
    }

    const onSubmit = async (formData) => {
        formData.provinceCode = province.code
        formData.districtCode = district.code
        formData.wardCode = ward.code
        if (props.isUpdate) {
            formData.customerID = props.customer.customerID
            formData.id = props.customer.id
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
            success(resp.message || 'Thêm khách hàng thành công')
        }
    }

    async function updateCustomer(formData) {
        let customerClient = getCustomerClient()
        let resp = await customerClient.updateCustomer(formData)
        if (resp.status !== 'OK') {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau')
        } else {
            success(resp.message || 'Cập nhật khách hàng thành công')
        }
    }

    return (
        <AppCRM select="/crm/customer">
            <Head>
                <title>{props.isUpdate ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}</title>
            </Head>
            <Box component={Paper} display="block">
                <FormGroup>
                    <form>
                        <Box className={styles.contentPadding}>
                            <Box style={{fontSize: 24, marginBottom: '10px'}}>{props.isUpdate ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}</Box>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" component="h6"
                                                style={{marginBottom: '10px', fontSize: 18}}>
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
                                                style={{width: '100%'}}
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
                                                placeholder=""
                                                type="email"
                                                helperText={errors.email?.message}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                style={{width: '100%'}}
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
                                                placeholder=""
                                                type="number"
                                                helperText={errors.phone?.message}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                style={{width: '100%'}}
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
                                                style={{width: '100%'}}
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
                                                renderInput={(params) =>
                                                    <TextField
                                                        id="provinceCode"
                                                        name="provinceCode"
                                                        variant="outlined"
                                                        label="Tỉnh/ Thành phố"
                                                        helperText={errors.provinceCode?.message}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        style={{width: '100%'}}
                                                        error={!!errors.provinceCode}
                                                        required
                                                        inputRef={
                                                            register({
                                                                required: "Tỉnh/ Thành phố không thể để trống",
                                                            })
                                                        }
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
                                                renderInput={(params) =>
                                                    <TextField
                                                        id="districtCode"
                                                        name="districtCode"
                                                        variant="outlined"
                                                        label="Quận/ Huyện"
                                                        helperText={errors.districtCode?.message}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        style={{width: '100%'}}
                                                        error={!!errors.districtCode}
                                                        required
                                                        inputRef={
                                                            register({
                                                                required: "Quận/huyện thể để trống",
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
                                                onChange={onWardChange}
                                                getOptionLabel={(option) => option.name}
                                                renderInput={(params) =>
                                                    <TextField
                                                        id="wardCode"
                                                        name="wardCode"
                                                        variant="outlined"
                                                        label="Phường/ Xã"
                                                        helperText={errors.wardCode?.message}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        style={{width: '100%'}}
                                                        error={!!errors.wardCode}
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
                            <Card variant="outlined" style={{marginTop: '10px'}}>
                                <CardContent>
                                    <Typography variant="h6" component="h6"
                                                style={{marginBottom: '10px', fontSize: 18}}>
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
                                                style={{width: '100%'}}
                                                error={!!errors.legalRepresentative}
                                                required
                                                inputRef={
                                                    register({
                                                        required: "Người đại diện không thể để trống",
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
                                                style={{width: '100%'}}
                                                error={!!errors.mst}
                                                required
                                                inputRef={
                                                    register({
                                                        required: "Mã số thuế không thể để trống",
                                                    })
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid spacing={3} container>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Grid container spacing={1} alignItems="center" justify="space-between">
                                                <Grid item xs={10} sm={10} md={10}>
                                                    <TextField
                                                        id="licenses"
                                                        name="licenses"
                                                        variant="outlined"
                                                        size="small"
                                                        label="Tài liệu giấy phép"
                                                        defaultValue="abc.doc"
                                                        disabled
                                                        placeholder=""
                                                        helperText={errors.licenses?.message}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        style={{width: '100%'}}
                                                        error={!!errors.licenses}
                                                        required
                                                        inputRef={
                                                            register({
                                                                required: "Mã số thuế không thể để trống",
                                                            })
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={2} sm={2} md={2}>
                                                    <label htmlFor="upload-photo" style={{marginBottom: 5}}>
                                                        <input style={{display: 'none'}}
                                                               id="upload-photo"
                                                            // onChange={handleFile}
                                                               name="upload-photo"
                                                               type="file"/>
                                                        <Button color="secondary" variant="contained"
                                                                component="span">
                                                            <span>Chọn</span>
                                                        </Button>
                                                    </label>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                            <Card variant="outlined" style={{marginTop: '10px'}}>
                                <CardContent>
                                    <Typography variant="h6" component="h6"
                                                style={{marginBottom: '10px', fontSize: 18}}>
                                        Thông tin tài khoản
                                    </Typography>
                                    <Grid spacing={3} container>
                                        <Grid item xs={12} sm={3} md={3}>
                                            <FormControl style={{width: '100%'}} size="small" variant="outlined">
                                                <InputLabel id="department-select-label" sise="small">Vai trò</InputLabel>
                                                <Controller
                                                    name="scope"
                                                    control={control}
                                                    lable="Vai trò"
                                                    defaultValue={scopes ? scopes[0].value : ''}
                                                    rules={{required: true}}
                                                    error={!!errors.scope}
                                                    as={
                                                        <Select label="Vai trò">
                                                            {scopes.map(({value, label}) => (
                                                                <MenuItem value={value} key={value}>{label}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    }
                                                />
                                            </FormControl>

                                        </Grid>
                                        <Grid item xs={12} sm={3} md={3}>
                                            <FormControl style={{width: '100%'}} size="small" variant="outlined">
                                                <InputLabel id="department-select-label" sise="small">Cấp độ</InputLabel>
                                                <Controller
                                                    name="level"
                                                    control={control}
                                                    lable="Cấp độ"
                                                    defaultValue={levels ? levels[0].value : ''}
                                                    rules={{required: true}}
                                                    error={!!errors.level}
                                                    as={
                                                        <Select label="Cấp độ">
                                                            {levels.map(({value, label}) => (
                                                                <MenuItem value={value} key={value}>{label}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    }
                                                />
                                            </FormControl>

                                        </Grid>
                                        <Grid item xs={12} sm={3} md={3}>
                                            <FormControl style={{width: '100%'}} size="small" variant="outlined">
                                                <InputLabel id="department-select-label">Trạng thái</InputLabel>
                                                <Controller
                                                    name="status"
                                                    control={control}
                                                    defaultValue={statuses ? statuses[0].value : ''}
                                                    rules={{required: true}}
                                                    error={!!errors.status}
                                                    as={
                                                        <Select label="Trạng thái">
                                                            {statuses.map(({value, label}) => (
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
                                            <div/>
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
                                                        style={{width: '100%'}}
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
                                                        style={{width: '100%'}}
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
                            <Divider/>
                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={loading}
                                    style={{margin: 8}}>
                                    {loading && <CircularProgress size={20}/>}
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
                                            style={{margin: 8}}
                                            disabled={loading}>
                                            {loading && <CircularProgress size={20}/>}
                                            Làm mới
                                        </Button>
                                    )
                                }

                            </Box>

                        </Box>
                    </form>
                </FormGroup>
            </Box>
        </AppCRM>
    )
}