import { Button, CircularProgress, Grid, MenuItem, TextField } from "@material-ui/core";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getFeeClient } from "client/fee";
import globalStyles from "components/css-global.module.css";
import Head from "next/head";
import Link from "next/link";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FeeType, feeTypeOptions, feeValidation } from "view-models/fee";


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
    return (<AppCRM select="/crm/fee">
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
    </AppCRM>)
}

const defaultFormValues = {
    code: '',
    name: '',
    type: defaultFeeType,
    formula: '',
}

function render({ data: { data, status, message } }) {
    if (status === 'NOT_FOUND') return <FeeNotFound message={message} />

    const toast = useToast();
    const [loading, setLoading] = useState(false);
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
            toast.success("Cập nhật phí dịch vụ thành công");
        } else {
            toast.error(
                res.message || "Thao tác không thành công, vui lòng thử lại sau"
            );
        }
    }

    function onSubmit(formData) {
        setLoading(true);
        updateFee(formData);
        setLoading(false);
    }

    let breadcrumb = [
        {
            name: "Trang chủ",
            link: "/crm"
        },
        {
            name: "Phí dịch vụ",
            link: "/crm/fee"
        },
        {
            name: "Cập nhật phí dịch vụ"
        }
    ]

    return (
        <AppCRM select="/crm/fee" breadcrumb={breadcrumb}>
            <Head>
                <title>Phí dịch vụ và giá bán</title>
            </Head>
            <MyCard>
                <MyCardHeader title={'Công thức phí #' + data.code }/>
            </MyCard>
            <MyCard>
                <form noValidate>
                    <MyCardContent>
                        <Grid container>
                            <Grid container spacing={4} md={6}
                                style={{marginRight: '10px', marginBottom: '10px'}}
                            >
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
                                        defaultValue={data.type}
                                        onChange={e => setValue("type", e.target.value)}
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
                                        helperText={errors.formula? errors.formula?.message: 'Vui lòng công thức chỉ chứa số và phép tính. Lưu ý : Kí tự % nên chuyển sang số, ví dụ 15% -> 0.15'}
                                        error={!!errors.formula}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        requiredhaha
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
                            <Grid container spacing={1} md={6}
                                style={{background: "#f6f6f6", borderRadius: "1rem", height: 'max-content' }}>
                                    <div style={{ padding: "1rem 1rem 1rem 2rem" }}>
                                        <span><b>Công thức tính bao gồm các hệ số sau:</b></span>
                                        <ul>
                                            <li><b>PRICE</b>: Giá trị thể hiển giá gốc của SKU</li>
                                            <li><b>CUSTOMER_LEVEL</b>: Giá trị đại diện cho hệ số cấp bật khách hàng</li>
                                            <li><b>DELIVERY_REGION</b>: Giá trị đại diện cho hệ số của vùng hoặc tỉnh thành</li>
                                        </ul>

                                        <span>Ví dụ : PRICE*0.2 + CUSTOMER_LEVEL</span>
                                        <p>Giá sản phẩm A (SKU-A) là 10,000 (PRICE=10,000)</p>
                                        <p>Hệ số khách hàng bật kim cương là 5,000 (CUSTOMER_LEVEL=5,000)</p>
                                        <p>Kết quả phép tính cho phí dịch vụ: <b>PRICE*0.2 + CUSTOMER_LEVEL = 10,000*0.2 + 5,000 = 7,000</b></p>
                                        <p>Giá sản phẩm đăng bán cuối cùng là <b>PRICE + 7,000 = 17,000</b></p>
                                    </div>
                            </Grid>
                        </Grid>
                    </MyCardContent>
                </form>
            </MyCard>
        </AppCRM>
    )
}

export default function FeePage(props) {
    return renderWithLoggedInUser(props, render)
}