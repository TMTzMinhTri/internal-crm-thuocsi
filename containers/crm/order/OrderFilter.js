import React, { useEffect } from 'react'
import { useController, useForm } from 'react-hook-form'
import { Box, Button, Grid, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core'
import { MyCardActions } from '@thuocsi/nextjs-components/my-card/my-card'

import { orderStatus } from 'components/global'
import { customerValidation } from 'view-models/customer'

const useStyles = makeStyles(theme => ({
    title: {
        fontWeight: "bold",
    },
    textField: {
        background: theme.palette.background.paper,
    }
}))
const defaultValues = {
    q: "",
    orderNo: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerShippingAddress: "",
    priceFrom: null,
    priceTo: null,
    status: "",
};
export const OrderFilter = ({ open, q = "", onFilterChange, onClose }) => {
    const styles = useStyles();
    const filterForm = useForm({
        defaultValues: {
            ...defaultValues,
            q,
        },
        mode: "onChange"
    })

    const statusController = useController({
        name: "status",
        control: filterForm.control,
        defaultValue: defaultValues.status
    })
    const { ref: statusRef, ...statusProps } = statusController.field;

    useEffect(() => {
        filterForm.register({ name: "status" });
    }, []);
    useEffect(() => {
        filterForm.setValue('q', q);
    }, [q]);
    useEffect(() => {
        if (!open) onClose?.(filterForm.getValues);
    }, [open]);

    const applyFilter = async (formData) => {
        const { priceFrom, priceTo, ...others } = formData;
        await onFilterChange?.({
            price: {
                from: priceFrom,
                to: priceTo,
            },
            ...others
        });
    }

    const handleReset = () => {
        filterForm.reset(defaultValues);
    }
    return (
        <Box style={{
            display: open ? "block" : "none"
        }}>
            <MyCardActions>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Typography
                            className={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Tìm kiếm
                        </Typography>
                        <TextField
                            className={styles.textField}
                            id="q"
                            name="q"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập mã đơn hàng"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Typography
                            className={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Mã đơn hàng
                        </Typography>
                        <TextField
                            className={styles.textField}
                            id="orderNo"
                            name="orderNo"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập mã đơn hàng"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Typography
                            className={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Tên khách hàng
                        </Typography>
                        <TextField
                            className={styles.textField}
                            id="customerName"
                            name="customerName"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập tên khách hàng"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Typography
                            className={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Số điện thoại
                        </Typography>
                        <TextField
                            className={styles.textField}
                            id="customerPhone"
                            name="customerPhone"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập số điện thoại"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Typography
                            className={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Email khách hàng
                        </Typography>
                        <TextField
                            className={styles.textField}
                            id="customerEmail"
                            name="customerEmail"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập email khách hàng"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid container item xs={12} sm={6} md={4} lg={3}>
                        <Typography
                            className={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Tổng tiền
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    className={styles.textField}
                                    id="priceFrom"
                                    name="priceFrom"
                                    variant="outlined"
                                    size="small"
                                    placeholder="Tổng tiền từ"
                                    fullWidth
                                    type="number"
                                    inputProps={{
                                        min: 0,
                                    }}
                                    error={!!filterForm.errors.priceFrom}
                                    helperText={filterForm.errors.priceFrom?.message}
                                    inputRef={filterForm.register({ ...customerValidation.point, valueAsNumber: true })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    className={styles.textField}
                                    id="priceTo"
                                    name="priceTo"
                                    variant="outlined"
                                    size="small"
                                    placeholder="Tổng tiền đến"
                                    fullWidth
                                    type="number"
                                    inputProps={{
                                        min: 0,
                                    }}
                                    error={!!filterForm.errors.priceTo}
                                    helperText={filterForm.errors.priceTo?.message}
                                    inputRef={filterForm.register({ ...customerValidation.point, valueAsNumber: true })}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Typography
                            className={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Trạng thái
                            </Typography>
                        <TextField
                            className={styles.textField}
                            id="status"
                            name="status"
                            variant="outlined"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            select
                            SelectProps={{
                                displayEmpty: true
                            }}
                            fullWidth
                            {...statusProps}
                            inputRef={statusRef}
                        >
                            <MenuItem value={""}>Tất cả</MenuItem>
                            {orderStatus?.map(({ value, label }) => (
                                <MenuItem key={value} value={value}>{label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item container xs={12} justify="flex-end" spacing={1}>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="default"
                                disabled={filterForm.formState.isSubmitting}
                                onClick={handleReset}
                            >
                                Làm mới
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={filterForm.formState.isSubmitting}
                                onClick={filterForm.handleSubmit(applyFilter)}
                            >
                                Áp dụng
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </MyCardActions>
        </Box>
    )
}
