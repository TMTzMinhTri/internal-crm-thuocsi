import React, { useEffect, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { Box, Button, Grid, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import { MyCardActions } from '@thuocsi/nextjs-components/my-card/my-card';
import MuiSingleAuto from '@thuocsi/nextjs-components/muiauto/single';

import { SellPrices } from 'components/global';
import { customerValidation } from 'view-models/customer';
import { getProductClient } from "client/product";

const useStyles = makeStyles(theme => ({
    title: {
        fontWeight: "bold",
    },
    textField: {
        background: theme.palette.background.paper,
    }
}));
const defaultValues = {
    q: "",
    sku: "",
    productCode: "",
    type: "",
    priceFrom: null,
    priceTo: null,
    status: "",
};
export const SkuActiveFilter = ({ open, q = "", onFilterChange, onClose }) => {
    const styles = useStyles();
    const filterForm = useForm({
        defaultValues: {
            ...defaultValues,
            q,
        },
        mode: "onChange"
    });
    const [productOptions, setProductOptions] = useState([]);
    const typeController = useController({
        name: "type",
        control: filterForm.control,
        defaultValue: defaultValues.type
    });
    const { ref: typeRef, ...typeProps } = typeController.field;

    const searchProduct = async (q = "") => {
        const productClient = getProductClient();
        const productResp = await productClient.searchProductsFromClient({ q, limit: 10, offset: 0 });
        setProductOptions(productResp.data?.map(({ name, code }) => ({ label: name, value: code })) ?? []);
    };

    useEffect(() => {
        filterForm.register({ name: "type" });
        filterForm.register({ name: "status" });
        searchProduct();
    }, []);
    useEffect(() => {
        filterForm.setValue('q', q);
    }, [q]);
    useEffect(() => {
        if (!open) onClose?.(filterForm.getValues());
    }, [open]);

    const applyFilter = async (formData) => {
        const { priceFrom, priceTo, productCode, ...others } = formData;
        await onFilterChange?.({
            price: {
                from: priceFrom,
                to: priceTo,
            },
            productCode: productCode?.value,
            ...others
        });
    };

    const handleReset = () => {
        filterForm.reset(defaultValues);
        filterForm.setValue("level", defaultValues.level);
        filterForm.setValue("status", defaultValues.status);
    };
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
                            placeholder="Nhập Tên sản phẩm, mã sku, tên nhà bán hàng,..."
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
                            Mã sku
                        </Typography>
                        <TextField
                            className={styles.textField}
                            id="sku"
                            name="sku"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập mã sku"
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
                            Tên sản phẩm
                        </Typography>
                        <Box className={styles.textField}>
                            <MuiSingleAuto
                                name="productCode"
                                placeholder="Nhập tên sản phẩm"
                                onFieldChange={searchProduct}
                                options={productOptions}
                                control={filterForm.control}
                                errors={filterForm.errors}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            className={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Loại
                        </Typography>
                        <TextField
                            className={styles.textField}
                            id="type"
                            name="type"
                            variant="outlined"
                            size="small"
                            placeholder="Chọn cấp độ"
                            select
                            SelectProps={{
                                displayEmpty: true
                            }}
                            fullWidth
                            {...typeProps}
                            inputRef={typeRef}
                        >
                            <MenuItem value={""}>Tất cả</MenuItem>
                            {SellPrices?.map(({ value, label }) => (
                                <MenuItem key={value} value={value}>{label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid container item xs={12} sm={6} md={3}>
                        <Typography
                            className={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Giá bán lẻ
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    className={styles.textField}
                                    id="priceFrom"
                                    name="priceFrom"
                                    variant="outlined"
                                    size="small"
                                    placeholder="Giá bán lẻ từ"
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
                                    placeholder="Giá bán lẻ đến"
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
    );
};
