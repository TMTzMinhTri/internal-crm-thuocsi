import React, {useState} from "react";
import {
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Card,
    List,
    ListItem,
    InputAdornment,
    IconButton,
    Grid,
    Typography, Select,
} from "@material-ui/core";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import styles from "./promotion.module.css"
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";

import {
    defaultNameRulesValue,
    defaultRulePromotion,
    defaultTypeConditionsRule,
} from "../constant";
import {displayNameRule, parseConditionValue} from "../until";
import RenderTableGift from "./modal-gift";
import RenderTableProductGift from "./modal-product-gift";
import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    root: {
        " .MuiTextField-root": {
            margin: theme.spacing(1)
        }
    },
    textarea: {
        width: "100%",
    }
}));

const ConditionFields = (props) => {
    const classess = useStyles()
    const {
        dataRender = {
            promotionName: "",
            totalCode: "",
            applyPerUser: 1,
            promotionCode: "",
            totalUsed: 0,
            totalCollect: 0,
        },
        errors,
        promotionType,
        endTime = new Date(),
        startTime = new Date(),
        register,
        edit = false,
    } = props;

    return (
        <>
            <CardContent>
                <Grid container spacing={2} direction={"row"}>
                    <Grid item xs={12} sm={6} md={6}>
                        <Grid className={styles.marginLine}>
                            <h3>PHẠM VI ÁP DỤNG</h3>
                            <InputLabel htmlFor="select-promotionScope">Loại chương trình *</InputLabel>
                            <Select
                                id="promotionScope"
                                name="promotionScope"
                                placeholder="chọn loại phạm vi"
                                labelId="select-promotionScope"
                                style={{width: "100%"}}>
                                <MenuItem disabled value="">
                                    <em>chọn loại phạm vi</em>
                                </MenuItem>
                            </Select>
                        </Grid>
                        <Grid className={styles.marginLine}>
                            <h3>ĐIỀU KIỆN ÁP DỤNG KHUYẾN MÃI</h3>
                            <InputLabel id="select-promotionCondition">Loại điều kiện *</InputLabel>
                            <Select
                                id="promotionCondition"
                                name="promotionCondition"
                                label="Loại điều kiện"
                                labelId="select-promotionCondition"
                                placeholder="chọn loại điều kiện"
                                helperText={errors?.totalCode?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{width: "100%"}}
                                error={!!errors?.totalCode}
                                required
                                inputRef={register({
                                    required: "Số lượng khuyến mãi không được để trống",
                                    pattern: {
                                        value: /[0-9]/,
                                        message: "Chỉ chấp nhận kí tự là số",
                                    },
                                })}
                            />
                        </Grid>
                        <Grid className={styles.marginLine}>
                            <h3>GIÁ TRỊ KHUYẾN MÃI</h3>
                            <InputLabel id="select-promotionRule">Loại khuyến mãi *</InputLabel>
                            <Select
                                id="promotionRule"
                                name="promotionRule"
                                label="Loại khuyến mãi"
                                placeholder="chọn loại khuyến mãi"
                                labelId="select-promotionRule"
                                helperText={errors?.totalCode?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{width: "100%"}}
                                error={!!errors?.totalCode}
                                required
                                inputRef={register({
                                    required: "Số lượng khuyến mãi không được để trống",
                                    pattern: {
                                        value: /[0-9]/,
                                        message: "Chỉ chấp nhận kí tự là số",
                                    },
                                })}
                            />
                        </Grid>
                    </Grid>
                    <Grid  item xs={12} sm={6} md={6}>
                        <h4>Mô tả</h4>
                        <TextareaAutosize
                            className={classess.textarea}
                            rowsMin={20}
                            rowsMax={20}
                            style={{width: "100% !important"}}
                            aria-label="maximum height"
                            placeholder="Nhập mô tả"
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </>
    );
};

export default ConditionFields;
