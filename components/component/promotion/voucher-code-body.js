import {Grid, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import cssStyle from "./promotion.module.css";
import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {getPromoClient} from "../../../client/promo";
import {getCustomerClient} from "../../../client/customer";
import MuiSingleAuto from "@thuocsi/nextjs-components/muiauto/single";
import {Controller} from "react-hook-form";


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


export async function searchPromotion(promotionName){
    return getPromoClient().getPromotionFromClient(promotionName)
}

export async function searchCustomer(customerName) {
    return getCustomerClient().getCustomerFromClient(0,10,customerName)
}

export default function VoucherCodeBody(props) {
    const classes = useStyles()
    const {
        errors,
        dataProps,
        handleChangeType,
        appliedCustomers,
        promotion,
        control,
        edit,
        onChangeCustomer,
        register,
    }=props


    const [showAutoComplete, setShowAutoComplete] = useState(false);
    const [listPromotionSearch,setListPromotionSearch] = useState(promotion || [])
    const [listCustomer, setListCustomer] = useState(appliedCustomers || [])
    const hasError = typeof errors[`promotionName`] !== 'undefined';



    const handleSearchPromotion = async (value) => {
        let listPromationResponse = await searchPromotion(value)
        if (listPromationResponse && listPromationResponse.status === "OK") {
            setListPromotionSearch(listPromationResponse.data)
            return listPromationResponse.data.map((item) => {
                return {label: item.promotionName, value: item.promotionId}
            })
        }else {
            setListPromotionSearch([])
            return []
        }
    }

    const handleSearchCustomer = async (value) => {
        let listCustomerResponse = await searchCustomer(value)
        if (listCustomerResponse && listCustomerResponse.status === "OK") {
            setListCustomer(listCustomerResponse.data)
        }else {
            setListCustomer([])
        }
    }

    const validateNumber = (number,message) => {
        if (number < 0) {
            return message
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={4}>
                <h5 className={cssStyle.titleLabel}>Mã khuyến mãi<span style={{color : 'red'}}> *</span></h5>
                <TextField
                    id="code"
                    name="code"
                    disabled={edit}
                    helperText={errors.code?.message}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    error={!!errors.code}
                    placeholder="Nhập mã khuyến mãi"
                    style={{width: "100%"}}
                    required
                    inputRef={register({
                        required: "Mã khuyến mãi không được để trống"
                    })}
                />
            </Grid>
            <Grid item xs={12} sm={1} md={1}>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
                <h5 className={cssStyle.titleLabel}>Chương trình khuyến mãi áp dụng<span style={{color : 'red'}}> *</span></h5>
                <MuiSingleAuto
                    id="promotionId"
                    options={
                        listPromotionSearch.map((item) => {
                            return {label: item.promotionName, value: item.promotionId}
                        })
                    }
                    name="promotionId"
                    variant="standard"
                    onFieldChange={handleSearchPromotion}
                    placeholder="Chọn chương trình khuyến mãi áp dụng"
                    control={control}
                    errors={errors}
                    message="Vui lòng chọn chương trình khuyến mãi áp dụng"
                    required={true}
                />
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
                <h5 className={cssStyle.titleLabel}>Hạn sử dụng mã khuyến mãi</h5>
                <TextField
                    id="expiredDate"
                    name="expiredDate"
                    helperText={errors.expiredDate?.message}
                    error={!!errors.expiredDate}
                    label="Hạn sử dụng mã khuyến mãi"
                    placeholder=""
                    type="datetime-local"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    style={{width: "100%"}}
                    inputRef={register({
                    })}
                />
            </Grid>
            <Grid item xs={12} sm={1} md={1}>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
                <h5 className={cssStyle.titleLabel}>Loại mã</h5>
                <Select
                    id="type"
                    name="type"
                    placeholder="chọn loại mã"
                    value={dataProps.type}
                    onChange={event => handleChangeType(event.target.value)}
                    labelId="select-type"
                    style={{width: "100%"}}>
                    <MenuItem value="PUBLIC">
                        <div style={{fontSize : 16, fontWeight : 'bold'}}>Public</div>
                    </MenuItem>
                    <MenuItem value="PRIVATE">
                        <div style={{fontSize : 16, fontWeight : 'bold'}}>Private</div>
                    </MenuItem>
                </Select>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
                <h5 className={cssStyle.titleLabel}>Tổng số lần sử dụng toàn hệ thống</h5>
                <TextField
                    id="maxUsage"
                    name="maxUsage"
                    type="number"
                    InputProps={{
                        className: classes[".MuiInputBase-input"]
                    }}
                    helperText={errors.maxUsage?.message}
                    error={!!errors.maxUsage}
                    defaultValue={0}
                    placeholder="Tổng số lần sử dụng toàn hệ thống"
                    style={{width: "100%", fontWeight : 'normal'}}
                    inputRef={register({
                        required: "Tổng số lần sử dụng toàn hệ thống không được để trống",
                        validate: (value) => validateNumber(value,"Tổng số lần sử dụng toàn hệ thống không được âm")
                    })}
                    required
                />
                <div className={cssStyle.textItalic}>Nhập = 0 là không giới hạn</div>
            </Grid>
            <Grid item xs={12} sm={1} md={1}>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
                <h5 className={cssStyle.titleLabel}>Số lần áp dụng tối đa cho mỗi khách hàng</h5>
                <TextField
                    id="maxUsagePerCustomer"
                    name="maxUsagePerCustomer"
                    type="number"
                    InputProps={{
                        className: classes[".MuiInputBase-input"]
                    }}
                    helperText={errors.maxUsagePerCustomer?.message}
                    error={!!errors.maxUsagePerCustomer}
                    defaultValue={0}
                    placeholder="Số lần áp dụng tối đa cho mỗi khách hàng"
                    style={{width: "100%", fontWeight : 'normal'}}
                    inputRef={register({
                        required: "Số lần áp dụng tối đa cho mỗi khách hàng không được để trống",
                        validate: (value) => validateNumber(value,"Số lần áp dụng tối đa cho mỗi khách hàng không được âm")
                    })}
                    required
                />
                <div className={cssStyle.textItalic}>Nhập = 0 là không giới hạn</div>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
                <h5 className={cssStyle.titleLabel}>Danh sách khách hàng được sử dụng</h5>
                <Autocomplete
                    fullWidth
                    multiple
                    id="appliedCustomers"
                    name="appliedCustomers"
                    options={listCustomer}
                    defaultValue={appliedCustomers}
                    loading={showAutoComplete}
                    loadingText="Không tìm thấy danh sách khách hàng được sử dụng"
                    onOpen={() => {
                        setShowAutoComplete(true);
                    }}
                    onClose={() => {
                        setShowAutoComplete(false);
                    }}
                    getOptionLabel={(option) => option.name }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            name="appliedCustomers"
                            placeholder="Danh sách khách hàng được sử dụng"
                            required
                            onChange={(e) => handleSearchCustomer(e.target.value)}
                        />
                    )}
                    onChange={(e, value) => onChangeCustomer(e, value)}
                />
                <div className={cssStyle.textItalic}>Nếu nhập vào đây, thì chỉ có khách hàng thuộc danh sách này mới được xài khuyến mãi</div>
            </Grid>
        </Grid>
    )
}
