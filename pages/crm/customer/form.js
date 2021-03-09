import { Box, Button, ButtonGroup, CardContent, FormGroup, Paper, TextField } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MyCard, MyCardActions, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { getCommonAPI } from 'client/common';
import { getCustomerClient } from "client/customer";
import { getMasterDataClient } from "client/master-data";
import { unknownErrorText } from "components/commonErrors";
import { NotFound } from "components/components-global";
import { scopes, statuses } from "components/global";
import MuiSingleAuto from "components/muiauto/single";
import { ConfirmApproveDialog } from "containers/crm/customer/ConfirmApproveDialog";
import { ConfirmLockDialog } from "containers/crm/customer/ConfirmLockDialog";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { customerValidation } from "view-models/customer";
import styles from "./customer.module.css";

export async function loadData(ctx) {
    let data = {
        props: {
            status: "OK"
        }
    };

    let masterDataClient = getMasterDataClient(ctx, data);
    let resp = await masterDataClient.getProvince(0, 100, '');
    if (resp.status !== 'OK') {
        return data;
    }
    data.props.provinces = resp.data;

    let query = ctx.query;
    let customerCode = typeof (query.customerCode) === "undefined" ? '' : query.customerCode;
    data.props.isUpdate = false;
    if (customerCode !== '') {
        data.props.isUpdate = true;
        let customerClient = getCustomerClient(ctx, data);
        let customerResp = await customerClient.getCustomerByCustomerCode(customerCode);
        if (customerResp.status !== 'OK') {
            data.props.message = customerResp.message;
            data.props.status = customerResp.status;
            return data;
        }
        let customer = customerResp.data[0];
        data.props.customer = customer;
        let masterDataClient = getMasterDataClient(ctx, data);
        let provinceResp = await masterDataClient.getProvinceByProvinceCode(customer.provinceCode);
        let districtResp = await masterDataClient.getDistrictByDistrictCode(customer.districtCode);
        let wardResp = await masterDataClient.getWardByWardCode(customer.wardCode);

        data.props.province = provinceResp.status === 'OK' ? provinceResp.data[0] : {};
        data.props.district = districtResp.status === 'OK' ? districtResp.data[0] : {};
        data.props.ward = wardResp.status === 'OK' ? wardResp.data[0] : {};

        let districtsResp = await masterDataClient.getDistrictByProvinceCodeFromNextJs(customer.provinceCode);
        let wardsResp = await masterDataClient.getWardByDistrictCodeFromNextJS(customer.districtCode);

        data.props.districts = districtsResp.status === 'OK' ? districtsResp.data : [];
        data.props.wards = wardsResp.status === 'OK' ? wardsResp.data : [];
    }

    // get list customer level
    const customerCommon = getCommonAPI(ctx, {});
    const resLevel = await customerCommon.getListLevelCustomers();
    data.props.condUserType = [];
    if (resLevel.status === 'OK') {
        data.props.condUserType = resLevel.data.map(item => { return { value: item.code, label: item.name }; });
    }
    return data;
}

const breadcrumbNew = [
    {
        name: "Trang chủ",
        link: "/crm"
    },
    {
        name: "Danh sách khách hàng",
        link: "/crm/customer",
    },
    {
        name: "Thêm khách hàng",
    },
];
const breadcrumbEdit = [
    {
        name: "Trang chủ",
        link: "/crm"
    },
    {
        name: "Danh sách khách hàng",
        link: "/crm/customer"
    },
    {
        name: "Cập nhật khách hàng",
    },
];

export default function renderForm(props, toast) {
    const pageTitle = props.isUpdate ? "Cập nhật khách hàng" : "Thêm khách hàng";
    if (props.status && props.status !== "OK") {
        return (
            <NotFound link='/crm/customer' titlePage={pageTitle} labelLink="khách hàng" />
        );
    }
    let { error, success } = toast;
    let editObject = props.isUpdate ? props.customer : {};

    props.isUpdate ? props.customer.provinceCode = { value: props.province?.code, label: props.province?.name, code: props.province?.code } : '';

    const checkWardData = props.isUpdate ? (props.customer.wardCode === '' ? {} : props.ward) : {};
    const [loading] = useState(false);
    const [province, setProvince] = useState(props.province);
    const [districts, setDistricts] = useState(props.districts || []);
    const [openLockAccountDialog, setOpenLockAccountDialog] = useState(false);
    const [openApproveAccountDialog, setOpenApproveAccountDialog] = useState(false);
    const [district, setDistrict] = useState(props.district || {});
    const [wards, setWards] = useState(props.wards || []);
    const [ward, setWard] = useState(checkWardData);
    const isWard = ((props.ward === undefined) || (Object.keys(checkWardData).length === 0 && checkWardData.constructor === Object)) ? true : false;
    const isDistrict = ((props.province === undefined) || (Object.keys(props.province).length === 0 && props.province.constructor === Object)) ? true : false;
    const [isDisabledDistrict, setDisabledDistrict] = useState(isDistrict);
    const [isDisabledWard, setDisabledWard] = useState(isWard);
    // const [isDisableStatus, setIsDisableStatus] = useState(editObject.status == 'ACTIVE');
    const router = useRouter();
    const { register, handleSubmit, errors, control, getValues, reset, watch } = useForm({
        defaultValues: editObject,
        mode: "onChange"
    });

    const noOptionsText = "Không có tùy chọn";

    const onProvinceChange = async (event, val) => {
        setProvince();
        setDistricts([]);
        setDistrict({});
        setWards([]);
        setWard({});
        setDisabledDistrict(true);
        setDisabledWard(true);
        let masterDataClient = getMasterDataClient();
        if (val) {
            setProvince(val);
            let res = await masterDataClient.getDistrictByProvinceCode(val?.code);
            if (res.status !== 'OK') {
                error(res.message || 'Thao tác không thành công, vui lòng thử lại sau');
            } else {
                setDistricts(res.data);
                setDisabledDistrict(false);
            }
        }
    };

    const onDistrictChange = async (event, val) => {
        setDistrict('');
        setWards([]);
        setWard('');
        setDisabledWard(true);
        let masterDataClient = getMasterDataClient();
        if (val) {
            setDistrict(val);
            let res = await masterDataClient.getWardByDistrictCode(val.code);
            if (res.status !== 'OK') {
                error(res.message || 'Thao tác không thành công, vui lòng thử lại sau');
            } else {
                setWards(res.data);
                setDisabledWard(false);
            }
        }
    };

    const onWardChange = async (event, val) => {
        setWard();
        if (val) {
            setWard(val);
        } else {
            setWard({});
        }
    };

    const onSubmit = async (formData) => {
        if (formData.passwordConfirm !== formData.password) {
            error("Xác nhận mật khẩu không chính xác");
            errors.passwordConfirm = {};
            errors.passwordConfirm.message = "Mật khẩu xác nhận không chính xác";
            return;
        }
        formData.provinceCode = province.code || '';
        formData.districtCode = district.code || '';
        formData.wardCode = ward.code || '';

        if (props.isUpdate) {
            formData.customerID = props.customer.customerID;
            formData.id = props.customer.id;
            formData.code = props.customer.code;
            await updateCustomer(formData);
        } else {
            await createCustomer(formData);
        }
    };

    async function lockAccount() {
        const _client = getCustomerClient();
        setOpenLockAccountDialog(false);
        const resp = await _client.lockAccount({ code: props.customer.code, isActive: -1 });
        if (resp.status !== "OK") {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau');
        } else {
            success("Khóa tài khoản thành công");
            window.location.reload();
        }
    }

    async function approveAccount() {
        const _client = getCustomerClient();
        setOpenApproveAccountDialog(false);
        const resp = await _client.approveAccount({ code: props.customer.code, isActive: 1 });
        if (resp.status !== "OK") {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau');
        } else {
            success("Mở khoá tài khoản thành công");
            window.location.reload();
        }
    }

    async function createCustomer(formData) {
        try {
            let customerClient = getCustomerClient();
            let resp = await customerClient.createNewCustomer(formData);
            if (resp.status !== 'OK') {
                error(resp.message ?? unknownErrorText);
            } else {
                success('Thêm khách hàng thành công');
                router.push(`/crm/customer`);
            }
        } catch (err) {
            error(err ?? unknownErrorText);
        }
    }

    async function updateCustomer(formData) {
        try {
            let customerClient = getCustomerClient();
            let resp = await customerClient.updateCustomer(formData);
            if (resp.status !== 'OK') {
                error(resp.message ?? unknownErrorText);
            } else {
                // setIsDisableStatus(formData.status == 'ACTIVE' ? true : false);
                success(pageTitle + ' thành công');
            }
        } catch (err) {
            error(err ?? unknownErrorText);
        }
    }

    if (props.isUpdate && typeof props.customer === 'undefined') return (
        <AppCRM select="/crm/customer">
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <Box component={Paper} display="block">
                <FormGroup>
                    <form>
                        <Grid container spacing={3} direction="row"
                            justify="space-between"
                            alignItems="flex-start" className={styles.contentPadding}>
                            <Grid item xs={12} md={12} sm={12}>
                                <Box style={{ fontSize: 24 }}>{pageTitle}</Box>
                            </Grid>
                            <Grid item xs={12} md={12} sm={12}>
                                <span>{props.message}</span>
                            </Grid>
                        </Grid>
                    </form>
                </FormGroup>
            </Box>
        </AppCRM>
    );

    return (
        <AppCRM select="/crm/customer" breadcrumb={props.isUpdate ? breadcrumbEdit : breadcrumbNew}>
            <Head>
                <title>{pageTitle}</title>
            </Head>
            <ConfirmApproveDialog
                open={openApproveAccountDialog}
                onClose={() => setOpenApproveAccountDialog(false)}
                onConfirm={() => approveAccount()}
            />
            <ConfirmLockDialog
                open={openLockAccountDialog}
                onClose={() => setOpenLockAccountDialog(false)}
                onConfirm={() => lockAccount()}
            />
            <MyCard>
                <form>
                    <MyCardHeader title={props.isUpdate ? `Khách hàng #${props.customer.code}` : pageTitle} />
                    <MyCardContent>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" style={{ marginBottom: '10px' }}>
                                    Thông tin cơ bản
                                    </Typography>
                                <Grid spacing={3} container>
                                    <Grid item xs={12} md={3}>
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
                                            fullWidth
                                            error={!!errors.name}
                                            required
                                            inputRef={
                                                register(customerValidation.name)
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
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
                                            fullWidth
                                            error={!!errors.email}
                                            required
                                            inputRef={
                                                register(customerValidation.email)
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <Grid spacing={3} container>
                                    <Grid item xs={12} md={3}>
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
                                            fullWidth
                                            error={!!errors.phone}
                                            required
                                            inputRef={
                                                register(customerValidation.phone)
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
                                            fullWidth
                                            error={!!errors.address}
                                            required
                                            inputRef={
                                                register(customerValidation.address)
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <Grid spacing={3} container>
                                    <Grid item xs={12} md={3}>
                                        <MuiSingleAuto
                                            id="provinceCode"
                                            name="provinceCode"
                                            noOptionsText={noOptionsText}
                                            options={props.provinces?.map(province => ({ value: province.code, label: province.name, code: province.code })) ?? []}
                                            onNotSearchFieldChange={onProvinceChange}
                                            required={true}
                                            label="Tỉnh/Thành phố"
                                            control={control}
                                            errors={errors}
                                            message={'Vui lòng chọn tỉnh thành'}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
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
                                                    fullWidth
                                                    inputRef={
                                                        register
                                                    }
                                                    {...params} />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Autocomplete
                                            size="small"
                                            options={wards}
                                            name={"ward"}
                                            value={ward}
                                            disabled={isDisabledWard}
                                            onChange={onWardChange}
                                            noOptionsText={noOptionsText}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextField
                                                    id="wardCode"
                                                    name="wardCode"
                                                    variant="outlined"
                                                    label="Phường/Xã"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    fullWidth
                                                    inputRef={
                                                        register
                                                    }
                                                    {...params}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Card variant="outlined" style={{ marginTop: '10px' }}>
                            <CardContent>
                                <Typography variant="h6" style={{ marginBottom: '10px' }}>
                                    Thông tin pháp lý
                                    </Typography>
                                <Grid spacing={3} container>
                                    <Grid item xs={12} md={3}>
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
                                            fullWidth
                                            error={!!errors.legalRepresentative}
                                            required
                                            inputRef={
                                                register(customerValidation.legalRepresentative)
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
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
                                            fullWidth
                                            error={!!errors.mst}
                                            required
                                            inputRef={
                                                register(customerValidation.mst)
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            id="companyName"
                                            name="companyName"
                                            label="Tên công ty"
                                            variant="outlined"
                                            size="small"
                                            placeholder="Nhập tên công ty"
                                            error={!!errors.companyName}
                                            helperText={errors.companyName?.message}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            autoComplete={false}
                                            inputRef={register}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            id="companyAddress"
                                            name="companyAddress"
                                            label="Địa chỉ công ty"
                                            variant="outlined"
                                            size="small"
                                            placeholder="Nhập địa chỉ công ty"
                                            error={!!errors.companyAddress}
                                            helperText={errors.companyAddress?.message}
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            autoComplete={false}
                                            inputRef={register}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Card variant="outlined" style={{ marginTop: '10px' }}>
                            <CardContent>
                                <Typography variant="h6" style={{ marginBottom: '10px' }}>
                                    Thông tin tài khoản
                                    </Typography>
                                <Grid spacing={3} container>
                                    <Grid item xs={12} md={3}>
                                        <FormControl fullWidth size="small" variant="outlined">
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
                                    <Grid item xs={12} md={3}>
                                        <FormControl fullWidth size="small" variant="outlined">
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
                                    {props.isUpdate && (
                                        <Grid item xs={12} md={3}>
                                            <FormControl fullWidth size="small" variant="outlined">
                                                <InputLabel id="department-select-label">Trạng thái</InputLabel>
                                                <Controller
                                                    name="status"
                                                    control={control}
                                                    // disabled={isDisableStatus}
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
                                    )}
                                </Grid>
                                {!props.isUpdate && (
                                    <Grid spacing={3} container>
                                        <Grid item xs={12} md={3}>
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
                                                    autoComplete: 'new-password',
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                fullWidth
                                                error={!!errors.password}
                                                required
                                                inputRef={
                                                    register(customerValidation.password)
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
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
                                                fullWidth
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
                                )}
                            </CardContent>
                        </Card>
                    </MyCardContent>
                    <MyCardActions>
                        {props.isUpdate ? (
                            <Link href={`/crm/customer`}>
                                <ButtonGroup color="primary" aria-label="contained primary button group">
                                    <Button variant="contained" color="default">Quay lại</Button>
                                </ButtonGroup>
                            </Link>
                        ) : (
                                <Button
                                    variant="contained"
                                    disabled={loading}
                                    onClick={() => {
                                        reset({});
                                        console.log(getValues());
                                    }}
                                >
                                    {loading && <CircularProgress size={20} />}
                            Làm mới
                                </Button>
                            )}
                        {/* <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setOpenLockAccountDialog(true)}
                            style={{ display: props.isUpdate && props.customer.isActive == 1 ? null : 'none' }}
                        >
                            Khóa
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setOpenApproveAccountDialog(true)}
                            style={{ display: props.isUpdate && props.customer.status != 'DRAFT' && props.customer.isActive != 1 ? null : 'none' }}
                        >
                            Mở khoá
                        </Button> */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit(onSubmit)}
                            disabled={loading}
                        >
                            {loading && <CircularProgress size={20} />}
                            Lưu
                        </Button>
                    </MyCardActions>
                </form>
            </MyCard>
        </AppCRM >
    );
}