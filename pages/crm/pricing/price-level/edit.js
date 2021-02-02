import React from "react";
import Head from "next/head";
import { Box, Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { useForm } from "react-hook-form";

import AppCRM from "pages/_layout";
import Link from "next/link";
import { getPriceLevelClient } from "client/price-level";
import { useRouter } from "next/router";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { unknownErrorText } from "components/commonErrors";

const loadPriceLevelData = async (ctx, { code }) => {

    const priceLevelClient = getPriceLevelClient(ctx);
    return priceLevelClient.getPriceLevelByCode(code);
}

export async function getServerSideProps(ctx) {
    return doWithLoggedInUser(ctx, async () => {
        const props = {};
        const { code } = ctx.query;
        if (!code) {
            props.status = 'NOT_FOUND';
            props.message = 'Không tìm thấy kết quả phù hợp'
            return { props }
        }
        const priceLevelData = await loadPriceLevelData(ctx, { code })
        if (priceLevelData.status != 'OK') {
            props.message = priceLevelData.massage;
            return { props }
        } else {
            props.priceLevelData = priceLevelData;
            return { props }
        }
    })
}

const render = (props) => {
    const router = useRouter();
    const toast = useToast();
    const { register, handleSubmit } = useForm({
        defaultValues: props.priceLevelData.data[0]
    });

    const createNewPriceLevel = async (formData) => {
        try {
            const priceLevelClient = getPriceLevelClient();
            const resp = await priceLevelClient.createPriceLevel(formData);
            if (resp.status === 'OK') {
                toast.success("Tạo cài đặt thành công")
                router.push(`/crm/pricing/price-level/edit?priceLevelCode=${resp.data?.[0]?.code}`)
            } else {
                toast.error(resp.message || "Tạo cài đặt không thành công")
            }
        } catch (e) {
            toast.error(e.message || unknownErrorText)
        }

    }

    return (
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Thêm cài đặt ngưỡng giá mới</title>
            </Head>
            <Box
                component={Paper}
                padding={3}
                display="block"
            >
                <form noValidate>
                    <Grid container>
                        <Grid container spacing={3} xs={12} md={6}>
                            <Grid item xs={12}>
                                <Typography variant="h5">Thêm cài đặt ngưỡng giá</Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    id="name"
                                    name="name"
                                    variant="outlined"
                                    label="Tên cài dặt"
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    fullWidth
                                    inputRef={register}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="fromPrice"
                                    name="fromPrice"
                                    variant="outlined"
                                    label="Giá mua từ"
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    fullWidth
                                    inputRef={register}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="toPrice"
                                    name="toPrice"
                                    variant="outlined"
                                    label="Giá mua đến"
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    fullWidth
                                    inputRef={register}
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
                                    inputRef={register}
                                />
                            </Grid>
                            <Grid container item xs={12} spacing={1}>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit(createNewPriceLevel)}
                                    >
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
