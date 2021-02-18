import React from "react";
import Head from "next/head";
import { Box, Button, CircularProgress, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { useForm } from "react-hook-form";

import AppCRM from "pages/_layout";
import Link from "next/link";
import { getPriceLevelClient } from "client/price-level";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { unknownErrorText } from "components/commonErrors";
import { PriceLevelValidator } from "view-models/pricing";
import { useRouter } from "next/router";
import { NotFound } from "components/components-global";
import { MoneyToText } from "components/global";

const loadPriceLevelData = async (ctx, { code }) => {
    const priceLevelClient = getPriceLevelClient(ctx);
    return priceLevelClient.getPriceLevelByCode(code);
}

export async function getServerSideProps(ctx) {
    return doWithLoggedInUser(ctx, async () => {
        const props = {};
        const { priceLevelCode } = ctx.query;
        if (!priceLevelCode) {
            props.status = 'NOT_FOUND';
            props.message = 'Không tìm thấy kết quả phù hợp'
            return { props }
        }
        const priceLevelData = await loadPriceLevelData(ctx, { code: priceLevelCode });
        if (priceLevelData.status != 'OK') {
            props.status = priceLevelData.status;
            props.message = priceLevelData.message;
            return { props }
        } else {
            props.priceLevelData = priceLevelData;
            return { props }
        }
    })
}

const render = ({ priceLevelData, message, status }) => {
    if (status === 'NOT_FOUND') return <NotFound  link="/crm/pricing?v=price-level" message={message} />
    console.log(priceLevelData?.data?.[0]);
    const router = useRouter();
    const toast = useToast();
    const { register, handleSubmit, errors, watch, formState: { isDirty, isValid, isSubmitting } } = useForm({
        defaultValues: priceLevelData?.data?.[0],
        mode: 'onChange',
    });
    const { fromPrice, toPrice } = watch();
    // Keep this to handle on any onChange (force re-render)
    const formValid = isDirty && isValid;

    const createNewPriceLevel = async (formData) => {
        try {
            const priceLevelClient = getPriceLevelClient();
            const resp = await priceLevelClient.updatePriceLevel(formData);
            if (resp.status === 'OK') {
                toast.success("Cập nhật cài đặt thành công")
                router.push(`/crm/pricing/price-level/edit?priceLevelCode=${resp.data?.[0]?.code}`)
            } else {
                toast.error(resp.message || "Cập nhật cài đặt không thành công")
            }
        } catch (e) {
            toast.error(e.message || unknownErrorText)
        }

    }

    return (
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Chỉnh sửa cài đặt ngưỡng giá mới</title>
            </Head>
            <Box
                component={Paper}
                padding={3}
                display="block"
            >
                <form onSubmit={handleSubmit(createNewPriceLevel)}>
                    <Grid container>
                        <Grid container spacing={3} xs={12} md={6}>
                            <Grid item xs={12}>
                                <Typography variant="h5">Chỉnh sửa cài đặt ngưỡng giá</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="code"
                                    name="code"
                                    variant="outlined"
                                    label="Mã cài đặt"
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    helperText={errors.code?.message}
                                    error={!!errors.code}
                                    disabled
                                    inputRef={register}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="name"
                                    name="name"
                                    variant="outlined"
                                    label="Tên cài đặt"
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    fullWidth
                                    helperText={errors.name?.message}
                                    error={!!errors.name}
                                    inputRef={register(PriceLevelValidator.name)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="fromPrice"
                                    name="fromPrice"
                                    variant="outlined"
                                    label="Giá mua từ"
                                    size="small"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    fullWidth
                                    helperText={errors.fromPrice?.message ?? `${MoneyToText.convert(fromPrice)} đồng`}
                                    error={!!errors.fromPrice}
                                    inputRef={register({
                                        ...PriceLevelValidator.fromPrice,
                                        valueAsNumber: true,
                                        validate: price => {
                                            if (!toPrice) return true;
                                            if (toPrice <= price) {
                                                return "Khoảng giá mua trên không được nhỏ hơn khoảng giá mua dưới."
                                            }
                                        }
                                    })}
                                    inputProps={{
                                        min: 0
                                    }}
                                    InputProps={{
                                        endAdornment: 'đ',
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="toPrice"
                                    name="toPrice"
                                    variant="outlined"
                                    label="Giá mua đến"
                                    size="small"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    fullWidth
                                    helperText={errors.toPrice?.message ?? `${MoneyToText.convert(toPrice)} đồng`}
                                    error={!!errors.toPrice}
                                    inputRef={register({
                                        ...PriceLevelValidator.toPrice,
                                        valueAsNumber: true,
                                        validate: price => {
                                            if (!fromPrice) return true;
                                            if (fromPrice >= price) {
                                                return "Khoảng giá mua trên không được nhỏ hơn khoảng giá mua dưới."
                                            }
                                        }
                                    })}
                                    inputProps={{
                                        min: 0
                                    }}
                                    InputProps={{
                                        endAdornment: 'đ',
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="description"
                                    name="description"
                                    variant="outlined"
                                    label="Mô tả"
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    inputRef={register}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="feeValue"
                                    name="feeValue"
                                    variant="outlined"
                                    label="Giá trị tính phí"
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    type="number"
                                    fullWidth
                                    helperText={errors.feeValue?.message}
                                    error={!!errors.feeValue}
                                    inputRef={register({
                                        ...PriceLevelValidator.feeValue,
                                        valueAsNumber: true,
                                    })}
                                    inputProps={{
                                        min: 0
                                    }}
                                />
                            </Grid>
                            <Grid container item xs={12} spacing={1}>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!formValid}
                                    >
                                        {isSubmitting && <CircularProgress size={20} />}
                                        Lưu
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Link href="/crm/pricing">
                                        <Button variant="contained" >Quay lại</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </AppCRM>
    )
};

export default function EditPriceLevelPage(props) {
    return renderWithLoggedInUser(props, render);
}