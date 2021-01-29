import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-components/lib/login";
import {useToast} from "@thuocsi/nextjs-components/toast/useToast";
import {useRouter} from "next/router";
import AppCRM from "../../_layout";
import React, {useState} from "react";
import {MyCard, MyCardActions, MyCardContent, MyCardHeader} from "@thuocsi/nextjs-components/my-card/my-card";
import {Button, ButtonGroup, Grid, TextField} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import {useForm} from "react-hook-form";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import cssStyle from "./promotion.module.css"
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {getPromoClient} from "../../../client/promo";
import VoucherCodeBody from "../../../components/component/promotion/voucher-code-body";

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

export async function searchPromotion(promotionName){
    return getPromoClient().getPromotionFromClient(promotionName)
}

function render(props) {
    const classes = useStyles()
    const toast = useToast();
    const router = useRouter();
    const {register, getValues, handleSubmit, setError, setValue, reset, errors,control} = useForm();
    const [showAutoComplete, setShowAutoComplete] = useState(false);
    const [listPromotionSearch,setListPromotionSearch] = useState([])

    const onSubmit = () => {

    }

    const handleSetShowAutoComplete = (value) => {
        setShowAutoComplete(value)
    }

    const handleSetShowListAutoComplete = (value) => {
        setListPromotionSearch(value)
    }

    return (
        <AppCRM select="/crm/promotion">
            <head>
                <title>Tạo mã khuyến mãi</title>
            </head>
            <MyCard>
                <MyCardHeader title="THÊM MỚI MÃ KHUYẾN MÃI"/>
                <MyCardContent style={{margin: "0 2rem"}}>
                    <VoucherCodeBody
                        errors={errors}
                        control={control}
                        register={register}
                    />
                </MyCardContent>
                <MyCardActions>
                    <ButtonGroup>
                        <Button variant="contained" color="primary" style={{margin: 8}}   onClick={handleSubmit(onSubmit)}>
                            THÊM MÃ KHUYẾN MÃI
                        </Button>
                        <Button variant="contained" style={{margin: 8}} onClick={() => router.reload()}>
                           LÀM MỚI
                        </Button>
                    </ButtonGroup>
                </MyCardActions>
            </MyCard>
        </AppCRM>
    )
}

