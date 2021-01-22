import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Box, Button, CircularProgress, Grid, MenuItem, Paper, TextField, Typography } from "@material-ui/core";
import { useForm } from "react-hook-form";

import AppCMS from "pages/_layout";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";

import styles from "./fee.module.css";
import { FeeType, feeTypeOptions, feeValidation } from "view-models/fee";
import { getFeeClient } from "client/fee";

import globalStyles from "components/css-global.module.css";

const defaultFeeType = FeeType.FIXED_REVENUE;

async function loadFeeData(ctx) {
    const query = ctx.query;
    const { feeCode } = query;
    const feeClient = getFeeClient(ctx);
    const res = await feeClient.getFeeByCode(feeCode);
    if (res.status !== 'OK') {
        return {
            status: res.status,
            message: (() => {
                switch (res.status) {
                    case 'NOT_FOUND':
                        return "Không tìm thấy phí dịch vụ";
                    default:
                        return res.message;
                }
            })()
        }
    }
    return { data: res.data[0] }

}

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, async () => {
        return {
            props: {
                data: await loadFeeData(ctx),
            },
        };
    });
}

function FeeNotFound({ message = "Không tìm thấy kết quả phù hợp" }) {
    return (<AppCMS select="/crm/fee">
        <Head>
            <title>Phí dịch vụ và giá bán</title>
        </Head>
        <div className={globalStyles.height404}>
            <div>
                <span>{message} | </span>
                <Link href={`/crm/fee`}>
                    Quay lại trang danh sách phí dịch vụ.
            </Link>
            </div>
        </div>
    </AppCMS>)
}

const defaultFormValues = {
    code: '',
    name: '',
    type: defaultFeeType,
    formula: '',
}

function render({ data: { data, status, message } }) {
    if (status === 'NOT_FOUND') return <FeeNotFound message={message} />

    const { error, success } = useToast();
    const [loading, setLoading] = useState(false);
    console.log(data);
    const { register, errors, handleSubmit, setValue } = useForm({
        defaultValues: data ?? defaultFormValues,
        mode: "onChange",
    })
    /**
     * Register hook form
     */
    useEffect(() => {
        register({ name: "type" })
    }, [])

    async function updateFee(feeUpdateData) {
        const feeClient = getFeeClient();
        feeUpdateData.code = data.code;
        const res = await feeClient.updateFee(feeUpdateData);
        if (res.status === "OK") {
            success("Cập nhật phí dịch vụ thành công");
        } else {
            error(
                res.message || "Thao tác không thành công, vui lòng thử lại sau"
            );
        }
    }

    function onSubmit(formData) {
        setLoading(true);
        updateFee(formData);
        setLoading(false);
    }

    return (
        <AppCMS select="/cms/fee">
            <Head>
                <title>Phí dịch vụ và giá bán</title>
            </Head>
            <Box component={Paper} display="block">
                <Box className={styles.contentPadding}>
                    <Typography variant="h5">Phí dịch vụ</Typography>
                </Box>
                <Box padding={3} pt={0}>
                    <form noValidate>
                        <Grid container spacing={6} md={6}>
                            <Grid item xs={12}>
                                <TextField
                                    id="code"
                                    name="code"
                                    variant="outlined"
                                    label="Mã phí"
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    disabled
                                    inputRef={register(feeValidation.name)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>

                                <TextField
                                    id="name"
                                    name="name"
                                    variant="outlined"
                                    label="Tên phí"
                                    size="small"
                                    helperText={errors.name?.message}
                                    error={!!errors.name}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    fullWidth
                                    inputRef={register(feeValidation.name)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="type"
                                    name="type"
                                    variant="outlined"
                                    label="Loại công thức áp dụng"
                                    size="small"
                                    helperText={errors.type?.message}
                                    error={!!errors.type}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    fullWidth
                                    inputRef={register}
                                    select
                                    defaultValue={data.type}
                                    onChange={e => setValue("type", e.target.value)}
                                >
                                    {feeTypeOptions.map(({ value, label }) => (<MenuItem value={value}>{label}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="formula"
                                    name="formula"
                                    variant="outlined"
                                    label="Công thức tính"
                                    size="small"
                                    helperText={errors.formula?.message}
                                    error={!!errors.formula}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    fullWidth
                                    inputRef={register(feeValidation.formula)}
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                        </Grid>
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ margin: 8 }}
                                disabled={loading}
                                onClick={handleSubmit(onSubmit)}
                            >
                                {loading && <CircularProgress size={20} />}
                            Lưu
                        </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </AppCMS>
    )
}

export default function FeePage(props) {
    return renderWithLoggedInUser(props, render)
}