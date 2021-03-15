import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import MuiMultipleAuto from "@thuocsi/nextjs-components/muiauto/multiple";
import { MyCard, MyCardContent, MyCardActions, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getVoucherClient } from "client/voucher";
import Head from "next/head";
import { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./gift.module.css";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadGiftData(ctx);
    });
}

export default function NewPage(props) {
    return renderWithLoggedInUser(props, render);
}

export async function loadGiftData(ctx) {
    let data = {
        props: {}
    }

    // get list voucher
    const voucherClient = getVoucherClient(ctx, {})
    const voucherResp = await voucherClient.getVoucherCode("", 20, 0, true);
    if (voucherResp.status === "OK") {
        data.props.listVoucher = voucherResp.data.map(voucher => ({ value: voucher.code, label: voucher.promotionName }))
    }

    // get gift setting
    const giftResp = await voucherClient.getGiftSetting()
    if (giftResp.status === "OK") {
        let listVoucherCodes = []
        let listVouchers = []
        listVoucherCodes = [...listVoucherCodes, ...giftResp.data[0].customerGift || "", ...giftResp.data[0].friendGift?.invitePerson || ""
            , ...giftResp.data[0].friendGift?.invitedPerson || ""]
        let listVouchersResp = await voucherClient.getListVouchersByCodes(listVoucherCodes)
        if (listVouchersResp.status === "OK") {
            listVouchers = listVouchersResp.data
        }
        let customerGift = []
        let invitedPersonGift = []
        let invitePersonGift = []
        giftResp.data[0].customerGift?.map(code => {
            let index = listVouchers.findIndex(voucher => voucher.code == code)
            if (index != -1) {
                customerGift.push({ value: code, label: listVouchers[index].promotionName })
            }
        })
        giftResp.data[0].friendGift?.invitePerson?.map(code => {
            let index = listVouchers.findIndex(voucher => voucher.code == code)
            if (index != -1) {
                invitePersonGift.push({ value: code, label: listVouchers[index].promotionName })
            }
        })
        giftResp.data[0].friendGift?.invitedPerson?.map(code => {
            let index = listVouchers.findIndex(voucher => voucher.code == code)
            if (index != -1) {
                invitedPersonGift.push({ value: code, label: listVouchers[index].promotionName })
            }
        })
        data.props.customerGift = { customerGift }
        data.props.friendGift = {
            orderQuantity: giftResp.data[0].friendGift?.orderQuantity || "",
            invitedPersonGift: invitedPersonGift,
            invitePersonGift: invitePersonGift,
        }
    }

    return data
}

function render(props) {
    const { register, handleSubmit, errors, control } = useForm({
        mode: "onChange", defaultValues: props.friendGift || {}
    });
    const { register: register2, handleSubmit: handleSubmit2, errors: errors2, control: control2 } = useForm({
        mode: "onChange", defaultValues: props.customerGift || {}
    });
  
    const _client = getVoucherClient()
    const { error, warn, info, success } = useToast();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function createCustomerGift(formData) {
        setLoading(true);
        formData.customerGift = formData.customerGift.map(gift => gift.value)
        const result = await _client.createGift(formData);
        setLoading(false);
        if (result.status === "OK") {
            success("Áp dụng mã quà tặng cho khách hàng mới thành công")
        } else {
            error(result.message || 'Thao tác không thành công, vui lòng thử lại sau')
        }
    }

    async function createFriendGift(formData) {
        setLoading(true);
        let friendGift = {
            orderQuantity: +formData.orderQuantity,
            invitePerson: formData.invitePersonGift?.map(gift => gift.value),
            invitedPerson: formData.invitedPersonGift?.map(gift => gift.value),
        }
        const result = await _client.createGift({ friendGift });
        setLoading(false);
        if (result.status === "OK") {
            success("Áp dụng mã quà tặng khi giới thiệu bạn bè thành công")
        } else {
            error(result.message || 'Thao tác không thành công, vui lòng thử lại sau')
        }
    }

    async function onSubmit(formData) {
        try {
            await createFriendGift(formData);
        } catch (err) {
            setLoading(false);
            error(err.message || err.toString());
        }
    }

    async function onSubmit2(formData) {
        try {
            await createCustomerGift(formData);
        } catch (err) {
            setLoading(false);
            error(err.message || err.toString());
        }
    }

    const onSearchVoucher = async (search) => {
        let data = []
        const voucherClient = getVoucherClient()
        const voucherResp = await voucherClient.getVoucherFromClient(search, 20, 0, true);
        if (voucherResp.status === "OK") {
            data = voucherResp.data.map(voucher => ({ value: voucher.code, label: voucher.promotionName }))
        }
        return data
    }

    let breadcrumb = [
        {
            name: "Trang chủ",
            link: "/crm"
        },
        {
            name: "Danh sách gift",
            link: "/crm/gift",
        },
        {
            name: "Thêm gift mới",
        },
    ];

    return (
        <AppCRM select="/crm/gift" breadcrumb={breadcrumb}>
            <Head>
                <title>Thêm gift mới</title>
            </Head>
            <MyCard>
                <Grid container direction="column" xs={12} sm={12} md={12} spacing={1}>
                    <Grid item xs={12} sm={12} md={12}>
                        <MyCardHeader title="Mã quà tặng khi giới thiệu bạn bè" />
                        <form>
                            <MyCardContent>
                                <Grid container spacing={2} direction="row" className={styles.contentPadding}>
                                    <Grid item container xs={12} sm={12} md={6}>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <Typography>
                                                Số đơn đặt hàng thành công
                                           </Typography>
                                            <TextField
                                                name="orderQuantity"
                                                size="small"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                required
                                                fullWidth
                                                error={!!errors.orderQuantity}
                                                helperText={errors.orderQuantity?.message}
                                                inputRef={register({
                                                    required: "Vui lòng nhập số lượng đơn hàng"
                                                })}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} />
                                    <Grid item container xs={12} sm={12} md={6} spacing={3}>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Typography>
                                                Quà tặng cho người giới thiệu
                                           </Typography>
                                            <MuiMultipleAuto
                                                options={props.listVoucher}
                                                onFieldChange={onSearchVoucher}
                                                name="invitePersonGift"
                                                placeholder="Chọn"
                                                control={control}
                                                register={register}
                                                errors={errors}
                                                message="Vui lòng chọn"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Typography>
                                                Quà tặng cho người được giới thiệu
                                           </Typography>
                                            <MuiMultipleAuto
                                                options={props.listVoucher}
                                                onFieldChange={onSearchVoucher}
                                                name="invitedPersonGift"
                                                placeholder="Chọn"
                                                register={register}
                                                control={control}
                                                errors={errors}
                                                message="Vui lòng chọn"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)} style={{ margin: 8 }}>
                                            ÁP DỤNG
                                      </Button>
                                    </Grid>
                                </Grid>
                            </MyCardContent>
                        </form>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <MyCardHeader title="Mã quà tặng cho khách hàng mới" />
                        <form>
                            <MyCardContent>
                                <Grid container spacing={3} direction="row" className={styles.contentPadding}>
                                    <Grid item container xs={12} sm={12} md={6} spacing={3}>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <Typography>
                                                Quà tặng cho khách hàng mới
                                           </Typography>
                                            <MuiMultipleAuto
                                                options={props.listVoucher}
                                                onFieldChange={onSearchVoucher}
                                                name="customerGift"
                                                placeholder="Chọn"
                                                register2={register2}
                                                control={control2}
                                                errors={errors2}
                                                message="Vui lòng chọn"
                                            />
                                        </Grid>

                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <Button variant="contained" color="primary" onClick={handleSubmit2(onSubmit2)} style={{ margin: 8 }}>
                                            ÁP DỤNG
                                      </Button>
                                    </Grid>
                                </Grid>
                            </MyCardContent>
                        </form>
                    </Grid>
                </Grid>
            </MyCard>
        </AppCRM>
    );
}
