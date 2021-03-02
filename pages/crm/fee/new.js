import {
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    TextField
} from "@material-ui/core";
import {
    doWithLoggedInUser,
    renderWithLoggedInUser
} from "@thuocsi/nextjs-components/lib/login";
import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getFeeClient } from "client/fee";
import { actionErrorText, unknownErrorText } from "components/commonErrors";
import Head from "next/head";
import { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FeeType, feeTypeOptions, feeValidation } from "view-models/fee";


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
                success("Tạo công thức phí thành công");
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

    let breadcrumb = [
        {
            name: "Trang chủ",
            link: "/crm"
        },
        {
            name: "Danh sách công thức phí",
            link: "/crm/fee"
        },
        {
            name: "Thêm mới công thức phí"
        }
    ]

    return (
        <AppCRM select="/crm/fee" breadcrumb={breadcrumb}>
            <Head>
                <title>Thêm mới công thức phí</title>
            </Head>
            <MyCard>
                <MyCardHeader title="Thêm mới công thức phí"/>
            </MyCard>
            <MyCard>
                <form noValidate>
                    <MyCardContent>
                        <Grid container spacing={4} md={6} style={{marginTop: '5px'}}>
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
                    </MyCardContent>
                </form>
            </MyCard>
        </AppCRM>
    )
}

export default function FeePage(props) {
    return renderWithLoggedInUser(props, render)
}