import makeStyles from "@material-ui/core/styles/makeStyles";
import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-components/lib/login";
import {useToast} from "@thuocsi/nextjs-components/toast/useToast";
import {useRouter} from "next/router";
import AppCRM from "../../_layout";
import React, {useState} from "react";
import {MyCard, MyCardActions, MyCardContent, MyCardHeader} from "@thuocsi/nextjs-components/my-card/my-card";
import {Button, ButtonGroup} from "@material-ui/core";
import {useForm} from "react-hook-form";
import VoucherCodeBody from "../../../components/component/promotion/voucher-code-body";
import Link from "@material-ui/core/Link";
import {getVoucherClient} from "../../../client/voucher";
import {getPromoClient} from "../../../client/promo";
import {getCustomerClient} from "../../../client/customer";
import {createVoucherCode} from "./new-voucher";

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
        return loadVoucherCode(ctx)
    })
}

export async function loadVoucherCode(ctx) {
    let returnObject = {props: {}}
    let voucherId = ctx.query.voucherId
    let voucherResponse = await getVoucherClient(ctx,{}).getVoucherById(parseInt(voucherId))
    if (voucherResponse && voucherResponse.status === "OK") {
        returnObject.props.voucher = voucherResponse.data[0]
        returnObject.props.voucher.expiredDate =  voucherResponse.data[0].expiredDate.slice(0,voucherResponse.data[0].expiredDate.length - 4)
        let promotionResponse = await getPromoClient(ctx,{}).getPromotionByID(parseInt(voucherResponse.data[0].promotionId))
        if (promotionResponse && promotionResponse.status === "OK") {
            returnObject.props.promotion = promotionResponse.data
        }else {
            returnObject.props.promotion = []
        }
        let listCustomerResponse = await getCustomerClient(ctx,{}).getCustomerByIDs(voucherResponse.data[0].appliedCustomers)
        if (listCustomerResponse && listCustomerResponse.status === "OK") {
            returnObject.props.customers = listCustomerResponse.data
        }else {
            returnObject.props.customers = []
        }
    }

    return returnObject
}

export default function NewPage(props) {
    return renderWithLoggedInUser(props,render)
}

export async function updateVoucher(voucherId,promotionId,expiredDate,type,maxUsage,maxUsagePerCustomer,appliedCustomers) {
    expiredDate = expiredDate + ":00.000Z"
    let data = {voucherId,promotionId,expiredDate,type,maxUsage,maxUsagePerCustomer}
    if (appliedCustomers && appliedCustomers.length > 0) {
        data.appliedCustomers=appliedCustomers
    }
    return getVoucherClient().updateVoucher(data)
}

function render(props) {
    const classes = useStyles()
    const toast = useToast();
    const router = useRouter();

    let voucher = props.voucher

    const {register, getValues, handleSubmit, setError, setValue, reset, errors,control} = useForm({defaultValues: voucher,mode: "onChange"});
    const [showAutoComplete, setShowAutoComplete] = useState(false);
    const [listPromotionSearch,setListPromotionSearch] = useState([])
    const [dataProps, setDataprops] = useState({
        promotionId: voucher.promotionId,
        customerIds : voucher.appliedCustomers,
        type: voucher.type,
    })

    const onSubmit = async () => {
        let value = getValues()
        let {code,expiredDate,maxUsage,maxUsagePerCustomer} = value
        let {promotionId,type,customerIds} = dataProps
        let createVoucherResponse = await updateVoucher(voucher.voucherId,parseInt(promotionId),expiredDate,type,parseInt(maxUsage),parseInt(maxUsagePerCustomer),customerIds)
        if (createVoucherResponse && createVoucherResponse.status === "OK") {
            toast.success('Cập nhật mã khuyến mãi thành công')
        }else {
            return toast.error(createVoucherResponse.message)
        }
        await router.push('/crm/promotion?type=VOUCHERCODE')
    }

    const handleSetShowAutoComplete = (value) => {
        setShowAutoComplete(value)
    }

    const handleSetShowListAutoComplete = (value) => {
        setListPromotionSearch(value)
    }

    const handleChangePromotion = (e,promotion) => {
        setDataprops({...dataProps,promotionId: promotion.promotionId})
    }

    const handleChangeCustomer = (e,customers) => {
        let customerIds = []
        customers.forEach(c => customerIds.push(c.customerID))
        setDataprops({...dataProps,customerIds: customerIds})
    }

    const handleChangeType = (value) => {
        setDataprops({...dataProps,type:value})
    }

    return (
        <AppCRM select="/crm/promotion">
            <div>
                <title>Chỉnh sửa mã khuyến mãi</title>
            </div>
            <MyCard>
                <MyCardHeader title="CHỈNH SỬA MÃ KHUYẾN MÃI"/>
                <MyCardContent style={{margin: "0 2rem"}}>
                    <VoucherCodeBody
                        errors={errors}
                        promotion={props.promotion}
                        control={control}
                        handleChangeType={handleChangeType}
                        dataProps={dataProps}
                        edit={true}
                        appliedCustomers={props.customers}
                        onChangeCustomer={handleChangeCustomer}
                        onChangePromotion={handleChangePromotion}
                        listPromotionSearch={listPromotionSearch}
                        showAutoComplete={showAutoComplete}
                        setListPromotionSearch={setListPromotionSearch}
                        register={register}
                    />
                </MyCardContent>
                <MyCardActions>
                    <ButtonGroup>
                        <Button variant="contained" color="primary" style={{margin: 8}}   onClick={handleSubmit(onSubmit)}>
                            XÁC NHẬN
                        </Button>
                        <Link href='/crm/promotion'>
                            <Button variant="contained" style={{margin: 8}}>
                                TRỞ VỀ
                            </Button>
                        </Link>
                    </ButtonGroup>
                </MyCardActions>
            </MyCard>
        </AppCRM>
    )
}

