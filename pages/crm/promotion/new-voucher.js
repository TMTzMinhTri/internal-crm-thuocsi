import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-components/lib/login";
import {useToast} from "@thuocsi/nextjs-components/toast/useToast";
import {useRouter} from "next/router";
import AppCRM from "../../_layout";
import React, {useState} from "react";
import {MyCard, MyCardActions, MyCardContent, MyCardHeader} from "@thuocsi/nextjs-components/my-card/my-card";
import {Button, ButtonGroup, Grid, TextField} from "@material-ui/core";
import {useForm} from "react-hook-form";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {getPromoClient} from "../../../client/promo";
import VoucherCodeBody from "../../../components/component/promotion/voucher-code-body";
import {getVoucherClient} from "../../../client/voucher";
import {defaultPromotionType} from "../../../components/component/constant";

const useStyles = makeStyles(theme => ({
    root: {
        " .MuiTextField-root": {
            margin: theme.spacing(1)
        },
    },
    ".MuiInputBase-input": {
        fontWeight: "bold",
    },
}));

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return {props : {}}
    })
}

export default function NewPage(props) {
    return renderWithLoggedInUser(props,render)
}

export async function createVoucherCode(code,promotionId,expiredDate,type,maxUsage,maxUsagePerCustomer,appliedCustomers) {
    let data = {code,promotionId,type,maxUsage,maxUsagePerCustomer}
    if (appliedCustomers && appliedCustomers.length > 0) {
        data.appliedCustomers=appliedCustomers
    }
    if (expiredDate) {
        data.expiredDate = expiredDate + ":00.000Z"
    }
    console.log('data',data)
    return getVoucherClient().createVoucher(data)
}

function render(props) {
    const classes = useStyles()
    const toast = useToast();
    const router = useRouter();
    const {register, getValues, handleSubmit, setError, setValue, reset, errors,control} = useForm();
    const [showAutoComplete, setShowAutoComplete] = useState(false);
    const [listPromotionSearch,setListPromotionSearch] = useState([])
    const [dataProps, setDataprops] = useState({
        customerIds : [],
        type: "PUBLIC",
    })

    const onSubmit = async () => {
        let value = getValues()
        let {code,expiredDate,maxUsage,maxUsagePerCustomer,promotionId} = value
        let {type,customerIds} = dataProps
        let createVoucherResponse = await createVoucherCode(code,parseInt(promotionId.value),expiredDate,type,parseInt(maxUsage),parseInt(maxUsagePerCustomer),customerIds)
        if (createVoucherResponse && createVoucherResponse.status === "OK") {
            toast.success('Tạo mã khuyến mãi thành công')
            router.push(`/crm/promotion?type=${defaultPromotionType.VOUCHER_CODE}`)
        }else {
            toast.error(createVoucherResponse.message)
        }
    }

    const handleSetShowAutoComplete = (value) => {
        setShowAutoComplete(value)
    }

    const handleSetShowListAutoComplete = (value) => {
        setListPromotionSearch(value)
    }
    

    const handleChangeCustomer = (e,customers) => {
        let customerIds = []
        customers.forEach(c => customerIds.push(c.customerID))
        setDataprops({...dataProps,customerIds: customerIds || []})
    }

    const handleChangeType = (value) => {
        setDataprops({...dataProps,type:value})
    }

    return (
        <AppCRM select="/crm/promotion">
            <div>
                <title>Tạo mã khuyến mãi</title>
            </div>
            <MyCard>
                <MyCardHeader title="THÊM MỚI MÃ KHUYẾN MÃI"/>
                <MyCardContent style={{margin: "0 2rem"}}>
                    <VoucherCodeBody
                        errors={errors}
                        control={control}
                        promotion={[]}
                        onChangeCustomer={handleChangeCustomer}
                        dataProps={dataProps}
                        handleChangeType={handleChangeType}
                        register={register}
                    />
                </MyCardContent>
                <MyCardActions>
                    <ButtonGroup>
                        <Button variant="contained" color="primary" style={{margin: 8}}   onClick={handleSubmit(onSubmit)}>
                            THÊM MÃ KHUYẾN MÃI
                        </Button>
                    </ButtonGroup>
                </MyCardActions>
            </MyCard>
        </AppCRM>
    )
}

