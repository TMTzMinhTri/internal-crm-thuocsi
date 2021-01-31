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
    return returnObject
}

export default function NewPage(props) {
    return renderWithLoggedInUser(props,render)
}

function render(props) {
    const classes = useStyles()
    const toast = useToast();
    const router = useRouter();

    let {voucherCode} = props

    const {register, getValues, handleSubmit, setError, setValue, reset, errors,control} = useForm({defaultValues: voucherCode,mode: "onChange"});
    const [showAutoComplete, setShowAutoComplete] = useState(false);
    const [listPromotionSearch,setListPromotionSearch] = useState([])

    const onSubmit = () => {

    }


    return (
        <AppCRM select="/crm/promotion">
            <head>
                <title>Chỉnh sửa mã khuyến mãi</title>
            </head>
            <MyCard>
                <MyCardHeader title="CHỈNH SỬA MÃ KHUYẾN MÃI"/>
                <MyCardContent style={{margin: "0 2rem"}}>
                    <VoucherCodeBody
                        errors={errors}
                        control={control}
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

