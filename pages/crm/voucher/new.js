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
import {getCustomerClient} from "../../../client/customer";
import {formatUTCTime} from "../../../components/component/util";

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
        return loadDataPromotion(ctx)
    })
}

export async function loadDataPromotion(ctx) {
    let returnObject = {props : {}}
    let promtoionId = ctx.query.promotionId

    let listCustomerDefaultReponse = await getCustomerClient(ctx,{}).getCustomer(0,5,"")
    if (listCustomerDefaultReponse && listCustomerDefaultReponse.status === "OK") {
        returnObject.props.listCustomerDefault = listCustomerDefaultReponse.data
    }

    let promotionDefaultResponse =  await getPromoClient(ctx,{}).getPromotion('',5,0,false)
    if (promotionDefaultResponse && promotionDefaultResponse.status === "OK") {
        returnObject.props.listPromotionDefault = promotionDefaultResponse.data
    }

    if (promtoionId) {
        let promotionResponse =  await getPromoClient(ctx,{}).getPromotionByID(promtoionId)
        if (promotionResponse && promotionResponse.status === "OK") {
            returnObject.props.promotion = promotionResponse.data
        }
    }
    return returnObject
}

export default function NewPage(props) {
    return renderWithLoggedInUser(props,render)
}

export async function createVoucherCode(code,promotionId,startTime,endTime,publicTime,type,maxUsage,maxUsagePerCustomer,appliedCustomers) {
    let data = {code,promotionId,type,maxUsage,maxUsagePerCustomer}
    if (appliedCustomers && appliedCustomers.length > 0) {
        data.appliedCustomers=appliedCustomers
    }
    if (startTime) {
        data.startTime = new Date(startTime).toISOString()
    }
    if (endTime) {
        data.endTime = new Date(endTime).toISOString()
    }
    if (publicTime) {
        data.publicTime = new Date(publicTime).toISOString()
    }
    return getVoucherClient().createVoucher(data)
}

function render(props) {
    const classes = useStyles()
    const toast = useToast();
    const router = useRouter();

    const {register, getValues, handleSubmit, setError, setValue, reset, errors,control} = useForm(
        {defaultValues : {startTime: router.query.promotionId ? formatUTCTime(props.promotion[0].startTime) : "",endTime: router.query.promotionId ? formatUTCTime(props.promotion[0].endTime) : "",promotionId: !!router.query.promotionId ? props.promotion?.map((item) => {return {label: item.promotionName, value: item.promotionId}})[0] : {}},mode: "onChange"}
    );
    const [showAutoComplete, setShowAutoComplete] = useState(false);
    const [listPromotionSearch,setListPromotionSearch] = useState([])
    const [dataProps, setDataprops] = useState({
        customerIds : [],
        type: "PUBLIC",
    })

    const onSubmit = async () => {
        let value = getValues()
        let {code,maxUsage,maxUsagePerCustomer,promotionId,startTime,endTime,publicTime} = value
        let {type,customerIds} = dataProps
        let createVoucherResponse = await createVoucherCode(code,parseInt(promotionId.value),startTime,endTime,publicTime,type,parseInt(maxUsage),parseInt(maxUsagePerCustomer),customerIds)
        if (createVoucherResponse && createVoucherResponse.status === "OK") {
            toast.success('Tạo mã khuyến mãi thành công')
            router.push(`/crm/voucher`)
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
        <AppCRM select="/crm/voucher">
            <div>
                <title>Tạo mã khuyến mãi</title>
            </div>
            <MyCard>
                <MyCardHeader title="THÊM MỚI MÃ KHUYẾN MÃI"/>
                <MyCardContent style={{margin: "0 3rem 3rem 3rem"}}>
                    <VoucherCodeBody
                        errors={errors}
                        control={control}
                        setValue={setValue}
                        listPromotionDefault={props.listPromotionDefault || []}
                        onChangeCustomer={handleChangeCustomer}
                        showPromotionPublic={!!router.query.promotionId}
                        promotion={props.promotion || []}
                        dataProps={dataProps}
                        listCustomerDefault={props.listCustomerDefault || []}
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

