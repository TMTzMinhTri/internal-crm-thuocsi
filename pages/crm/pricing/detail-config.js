import Head from "next/head";
import React, { useEffect, useState } from 'react';

import {
    Box, Button, FormControl, Grid, Paper, TextField
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";

import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import styles from "./pricing.module.css";
import AppCRM from "pages/_layout";
import { getPricingClient } from 'client/pricing';

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadConfigPriceData(ctx)
    })
}

export async function loadConfigPriceData(ctx) {
    let data = { props: {} }
    const _client = getPricingClient(ctx, {})
    return data;
}

export default function ConfigPriceDetailPage(props) {
    return renderWithLoggedInUser(props, render)
}

function render(props) {
    const { register, handleSubmit, errors } = useForm();
    return (
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Thông tin chi tiết của 1 Gen config price</title>
            </Head>
            <Box component={Paper} className={`${styles.gridPadding}`}>
                <Grid container spacing={3} direction="row" alignItems="center">
                    <Grid item xs={12} sm={12} md={12}>
                        <Box style={{ fontSize: 24 }}>Thông tin chi tiết Gen config</Box>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            id="name"
                            name="name"
                            value={state.name}
                            label="Tên sản phẩm"
                            placeholder=""
                            helperText={errors.name?.message}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{ margin: 12, width: '25%' }}
                            onChange={({ target: { value, name } }) => {
                                setState({ ...state, [name]: value })
                            }}
                            error={errors.name ? true : false}
                            required
                            inputRef={
                                register
                            }
                        />
                    </Grid>
                </Grid>
            </Box>
        </AppCRM>
    )
}