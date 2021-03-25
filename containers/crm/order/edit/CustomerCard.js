import {
    Card,
    CardContent,
    Grid,
    MenuItem,
    TextField,
    Typography
} from "@material-ui/core";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getMasterDataClient } from "client/master-data";
import { useFormStyles } from "components/MuiStyles";
import React, { useCallback, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { OrderValidation } from "view-models/order";
import { useStyles } from "./Styles";

export const CustomerCard = (props) => {
    const { orderForm, readOnly = false } = props;
    const toast = useToast();
    const formStyles = useFormStyles();
    const styles = useStyles();
    const { customerProvinceCode, customerDistrictCode } = orderForm.watch();
    const [districts, setDistricts] = useState(props.districts);
    const [wards, setWards] = useState(props.wards);

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

    return (
        <Card className={styles.section1} variant="outlined">
            <CardContent>
                <Grid container spacing={3}>
                    <Grid container spacing={1} item xs={12}>
                        <Grid item xs={12} md={2}>
                            <Typography className={`${formStyles.fieldLabel}`}>ID khách hàng:</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography className={`${formStyles.fieldLabel}`} >{props.order.customerID}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item xs={12}>
                        <Grid item xs={12} md={2}>
                            <Typography className={`${formStyles.fieldLabel}`}>Mã khách hàng:</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography className={`${formStyles.fieldLabel}`} >{props.order.customerCode}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item xs={12}>
                        <Grid item xs={12} md={2}>
                            <Typography className={`${formStyles.fieldLabel} ${formStyles.required}`} >Tên khách hàng</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="customerName"
                                name="customerName"
                                variant="outlined"
                                size="small"
                                placeholder=""
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    readOnly,
                                }}
                                error={!!orderForm.errors.customerName}
                                helperText={orderForm.errors.customerName?.message}
                                fullWidth
                                inputRef={orderForm.register(OrderValidation.customerName)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item xs={12}>
                        <Grid item xs={12} md={2}>
                            <Typography className={`${formStyles.fieldLabel} ${formStyles.required}`} >Số điện thoại</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
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
                                InputProps={{
                                    readOnly,
                                }}
                                error={!!orderForm.errors.customerPhone}
                                helperText={orderForm.errors.customerPhone?.message}
                                fullWidth
                                inputRef={orderForm.register(OrderValidation.customerPhone)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item xs={12}>
                        <Grid item xs={12} md={2}>
                            <Typography className={`${formStyles.fieldLabel} ${formStyles.required}`} >Địa chỉ</Typography>
                        </Grid>
                        <Grid container spacing={3} item xs={12} md={10}>
                            <Grid item xs={12}>
                                <TextField
                                    id="customerShippingAddress"
                                    name="customerShippingAddress"
                                    variant="outlined"
                                    size="small"
                                    placeholder=""
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        readOnly,
                                    }}
                                    error={!!orderForm.errors.customerShippingAddress}
                                    helperText={orderForm.errors.customerShippingAddress?.message}
                                    fullWidth
                                    inputRef={orderForm.register(OrderValidation.customerShippingAddress)}
                                />
                            </Grid>
                            <Grid item xs={4}>
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
                                                readOnly,
                                            }}
                                            error={!!orderForm.errors.customerProvinceCode}
                                            helperText={orderForm.errors.customerProvinceCode?.message}
                                            fullWidth
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
                            <Grid item xs={4}>
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
                                                readOnly
                                            }}
                                            error={customerProvinceCode && !!orderForm.errors.customerDistrictCode}
                                            helperText={customerProvinceCode ? orderForm.errors.customerDistrictCode?.message : ""}
                                            fullWidth
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
                            <Grid item xs={4}>
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
                                                readOnly,
                                            }}
                                            error={customerDistrictCode && !!orderForm.errors.customerWardCode}
                                            helperText={customerDistrictCode ? orderForm.errors.customerWardCode?.message : ""}
                                            fullWidth
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
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
