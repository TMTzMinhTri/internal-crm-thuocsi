import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from "@material-ui/core";
import { useForm } from "react-hook-form";

import AppCMS from "pages/_layout";
import {
    doWithLoggedInUser,
    renderWithLoggedInUser,
} from "@thuocsi/nextjs-components/lib/login";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";

import { FeeType, feeTypeOptions, feeValidation } from "view-models/fee";
import { getFeeClient } from "client/fee";
import { actionErrorText, unknownErrorText } from "components/commonErrors";
import { useRouter } from "next/router";

const defaultFeeType = FeeType.FIXED_REVENUE;

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return {}
    })
}

function render() {
    const router = useRouter();
    const { error, warn, info, success } = useToast();
    const [loading, setLoading] = useState(false);
    const { register, errors, handleSubmit, setValue } = useForm({
        defaultValues: {
            name: '',
            type: defaultFeeType,
            formula: '',
        },
        mode: "onChange",
    })
    /**
     * Register hook form
     */
    useEffect(() => {
        register({ name: "type" })
    }, [])

    async function createFee(feeCreatorData) {
        try {
            const feeClient = getFeeClient();
            const res = await feeClient.createFee(feeCreatorData);
            if (res.status === "OK") {
                success("Tạo phí dịch vụ thành công");
                router.push(`/crm/fee/edit?feeCode=${res.data[0].code}`);
            } else {
                error(res.message ?? actionErrorText);
            }
        } catch (error) {
            error(error.message ?? unknownErrorText)
        }
    }

    function onSubmit(formData) {
        setLoading(true);
        createFee(formData);
        setLoading(false);
    }

    return (
        <AppCMS select="/crm/fee">
            <Head>
                <title>Phí dịch vụ và giá bán</title>
            </Head>
            <Box component={Paper} display="block">
                <Box padding={2} pb={0}>
                    <Typography variant="h5">Phí dịch vụ</Typography>
                </Box>
                <Box margin={3}>
                    <form noValidate>
                        <Grid container spacing={4} md={6}>
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
                                    onBlur={e => setValue('name', e.target.value?.trim?.())}
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
                                    defaultValue={defaultFeeType}
                                    onChange={e => setValue('type', e.target.value)}
                                >
                                    {feeTypeOptions.map(({ value, label }, i) => (<MenuItem key={i} value={value}>{label}</MenuItem>))}
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
                                    onBlur={e => setValue('formula', e.target.value?.trim?.())}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    {loading && <CircularProgress size={20} />}
                                    Lưu
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Box>
        </AppCMS>
    )
}

export default function FeePage(props) {
    return renderWithLoggedInUser(props, render)
}