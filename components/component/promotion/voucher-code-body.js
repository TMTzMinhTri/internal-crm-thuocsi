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


export async function searchPromotion(prmotionCode){
    return getPromoClient().getPromotionFromClient(prmotionCode)
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
        edit,
        onChangePromotion,
        onChangeCustomer,
        register,
    }=props


    const [showAutoComplete, setShowAutoComplete] = useState(false);
    const [listPromotionSearch,setListPromotionSearch] = useState(promotion || [])
    const [listCustomer, setListCustomer] = useState(appliedCustomers || [])



    const handleSearchPromotion = async (value) => {
        let listPromationResponse = await searchPromotion(value)
        if (listPromationResponse && listPromationResponse.status === "OK") {
            setListPromotionSearch(listPromationResponse.data)
        }else {
            setListPromotionSearch([])
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

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={4}>
                <h5 className={cssStyle.titleLabel}>Mã khuyến mãi</h5>
                <TextField
                    id="code"
                    name="code"
                    label="Nhập mã khuyến mãi"
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
                        required: "Mã khuyến mãi không được để trống",
                        pattern: {
                            value: /[A-Za-z]/,
                            message: "Mã khuyến mãi phải có kí tự là chứ số",
                        },
                    })}
                />
            </Grid>
            <Grid item xs={12} sm={1} md={1}>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
                <h5 className={cssStyle.titleLabel}>Chương trình khuyến mãi áp dụng</h5>
                <Autocomplete
                    fullWidth
                    id="promotionId"
                    name="promotionId"
                    options={listPromotionSearch}
                    loading={showAutoComplete}
                    defaultValue={promotion[0]}
                    loadingText="Không tìm thấy chương trình khuyến mãi"
                    onOpen={() => {
                        setShowAutoComplete(true);
                    }}
                    onClose={() => {
                        setShowAutoComplete(false);
                    }}
                    getOptionLabel={(option) => option.promotionName }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chương trình khuyến mãi áp dụng"
                            name="promotionName"
                            placeholder="Chương trình khuyến mãi áp dụng"
                            required
                            inputRef={register({
                                required: "Vui lòng chọn chương trình khuyến mãi áp dụng",
                            })}
                            onChange={(e) => handleSearchPromotion(e.target.value)}
                        />
                    )}
                    onChange={(e, value) => onChangePromotion(e, value)}
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
                        required: "Vui lòng chọn hạn sử dụng mã khuyến mãi",
                    })}
                />
            </Grid>
            <Grid item xs={12} sm={1} md={1}>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
                <h5 className={cssStyle.titleLabel}>Loại mã</h5>
                <InputLabel htmlFor="select-type">Loại mã *</InputLabel>
                <Select
                    id="type"
                    name="type"
                    placeholder="chọn loại mã"
                    value={dataProps.type}
                    onChange={event => handleChangeType(event.target.value)}
                    labelId="select-type"
                    style={{width: "100%"}}>
                    <MenuItem  value="PUBLIC">
                        <div style={{fontWeight: "bold"}}>PUBLIC</div>
                    </MenuItem>
                    <MenuItem  value="PRIVATE">
                        <div style={{fontWeight: "bold"}} >PRIVATE</div>
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
                    defaultValue={0}
                    label="Tổng số lần sử dụng toàn hệ thống"
                    placeholder="Tổng số lần sử dụng toàn hệ thống"
                    style={{width: "100%"}}
                    inputRef={register}
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
                    defaultValue={0}
                    label="Số lần áp dụng tối đa cho mỗi khách hàng"
                    placeholder="Số lần áp dụng tối đa cho mỗi khách hàng"
                    style={{width: "100%"}}
                    inputRef={register}
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
                            label="Danh sách khách hàng được sử dụng"
                            name="appliedCustomers"
                            placeholder="Danh sách khách hàng được sử dụng"
                            required
                            onChange={(e) => handleSearchCustomer(e.target.value)}
                        />
                    )}
                    onChange={(e, value) => onChangeCustomer(e, value)}
                />
                <div className={cssStyle.textItalic}> ** LƯU Ý: Nếu nhập vào đây, thì chỉ có khách hàng thuộc danh sách này mới được xài khuyến mãi</div>
            </Grid>
        </Grid>
    )
}
