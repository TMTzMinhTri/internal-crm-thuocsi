import React, { useEffect } from 'react'
import { useController, useForm } from 'react-hook-form'
import { Box, Button, Grid, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core'
import { MyCardActions } from '@thuocsi/nextjs-components/my-card/my-card'

import { sellerStatuses } from 'components/global'

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
    code: "",
    name: "",
    email: "",
    phone: "",
    status: "",
};
export const SellerFilter = ({ open, q = "", onFilterChange, onClose }) => {
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
        if (!open) onClose?.(filterForm.getValues());
    }, [open]);

    const applyFilter = async (formData) => {
        await onFilterChange?.(formData);
    }

    const handleReset = () => {
        filterForm.reset(defaultValues);
        filterForm.setValue("level", defaultValues.level);
        filterForm.setValue("status", defaultValues.status);
    }
    return (
        <Box style={{
            display: open ? "block" : "none"
        }}>
            <MyCardActions>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
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
                            placeholder="Nhập Tên nhà bán hàng"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            className={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Mã nhà bán hàng
                        </Typography>
                        <TextField
                            className={styles.textField}
                            id="code"
                            name="code"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập mã nhà bán hàng"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            className={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Tên nhà bán hàng
                        </Typography>
                        <TextField
                            className={styles.textField}
                            id="name"
                            name="name"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập tên nhà bán hàng"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            className={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Email
                        </Typography>
                        <TextField
                            className={styles.textField}
                            id="email"
                            name="email"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập email"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            className={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Số điện thoại
                        </Typography>
                        <TextField
                            className={styles.textField}
                            id="phone"
                            name="phone"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập số điện thoại"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            className={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Trạng thái
                            </Typography>
                        <TextField
                            className={styles.textField}
                            id="phone"
                            name="phone"
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
                            {sellerStatuses?.map(({ value, label }) => (
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
