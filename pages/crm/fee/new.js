import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Box, Button, Grid, MenuItem, Paper, TextField, Typography } from "@material-ui/core";
import { useForm } from "react-hook-form";

import AppCMS from "pages/_layout";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";

import styles from "./fee.module.css";
import { FeeType, feeTypeOptions, feeValidation } from "view-models/fee";

const defaultFeeType = FeeType.FIXED_REVENUE;

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return {}
    })
}

function render({ }) {
    const { error, warn, info, success } = useToast();
    const [loading, setLoading] = useState(false);
    const { register, errors, handleSubmit } = useForm({
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

    function onSubmit(formData) {
        console.log({ formData });
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
                        <Grid container spacing={6}>
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
                                    defaultValue={defaultFeeType}
                                >
                                    {feeTypeOptions.map(({ value, label }) => (<MenuItem value={value}>{label}</MenuItem>))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
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