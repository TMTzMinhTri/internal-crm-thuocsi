import {Grid, TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import cssStyle from "../../../pages/crm/promotion/promotion.module.css";
import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {getPromoClient} from "../../../client/promo";


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

export default function VoucherCodeBody(props) {
    const classes = useStyles()
    const [showAutoComplete, setShowAutoComplete] = useState(false);
    const [listPromotionSearch,setListPromotionSearch] = useState([])

    const {
        errors,
        dataProps,
        handleChangeType,
        onChangePromotion,
        register,
    }=props

    const handleSearchPromotion = async (value) => {
        let listPromontionResponse = await searchPromotion(value)
        console.log('list',listPromontionResponse)
        if (listPromontionResponse && listPromontionResponse.status === "OK") {
            setListPromotionSearch(listPromontionResponse.data)
        }else {
            setListPromotionSearch([])
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
                <h5>Mã khuyến mãi</h5>
                <TextField
                    id="code"
                    name="code"
                    label="Nhập mã khuyến mãi"
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
            <Grid item xs={12} sm={6} md={6}>
                <h5>Chương trình khuyến mãi áp dụng</h5>
                <Autocomplete
                    fullWidth
                    id="promotionCode"
                    name="promotionCode"
                    options={listPromotionSearch}
                    loading={showAutoComplete}
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
                            name="promotionCode"
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
            <Grid item xs={12} sm={6} md={6}>
                <h5>Hạn sử dụng mã khuyến mãi</h5>
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
            <Grid item xs={12} sm={6} md={6}>
                <h5>Loại mã</h5>
                <InputLabel htmlFor="select-type">Loại mã *</InputLabel>
                <Select
                    id="type"
                    name="type"
                    placeholder="chọn loại mã"
                    value={dataProps.type}
                    onChange={(e,v) => handleChangeType(v)}
                    labelId="select-type"
                    style={{width: "100%"}}>
                    <MenuItem  value="PUBLIC">
                        <div style={{fontWeight: "bold"}}>PUBLIC</div>
                    </MenuItem>
                    <MenuItem  value="PRIVATE ">
                        <div style={{fontWeight: "bold"}} >PRIVATE</div>
                    </MenuItem>
                </Select>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
                <h5>Tổng số lần sử dụng toàn hệ thống</h5>
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
                    required
                />
                <div className={cssStyle.textItalic}>Nhập = 0 là không giới hạn</div>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
                <h5>Số lần áp dụng tối đa cho mỗi khách hàng</h5>
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
                    required
                />
                <div className={cssStyle.textItalic}>Nhập = 0 là không giới hạn</div>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
                <h5>Danh sách khách hàng được sử dụng</h5>
                <TextField
                    id="appliedCustomers"
                    name="appliedCustomers"
                    label="Danh sách khách hàng được sử dụng"
                    placeholder=""
                    style={{width: "100%"}}
                    required
                />
                <div className={cssStyle.textItalic}> ** LƯU Ý: Nếu nhập vào đây, thì chỉ có khách hàng thuộc danh sách này mới được xài khuyến mãi</div>
            </Grid>
        </Grid>
    )
}
