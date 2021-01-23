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
    Typography,
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

const ConditionFields = (props) => {
    const {state, errors, register, getValues, setError, edit = false} = props;
    const {
        handleChangeStatus,
        handleRemoveCodePercent,
        handleChange,
        handleAddCodePercent,
    } = props;

    const {
        promotionOption,
        promotionTypeRule,
        promotionRulesLine,
        conditions,
    } = state;

    const [promotionOptionDefault, setPromotionOptionDefault] = useState(
        promotionOption
    );

    const [promotionTypeRulesDefault, setPromotionTypeRulesDefault] = useState(
        promotionTypeRule
    );

    const [open, setOpen] = useState({
        openModalGift: false,
        openModalProductGift: false,
        openModalProductScopePromotion: false,
    });

    const textError = (type) => {
        switch (type) {
            case defaultRulePromotion.MIN_ORDER_VALUE:
                return "Giá trị ";
            case defaultRulePromotion.MIN_QUANTITY:
                return "Số lượng ";
            default:
                return "";
        }
    };

    const   isExistValue = (order, arr) => {
        let bool = false;
        arr.forEach((o, index) => {
            if (order !== index && getValues(
                    displayNameRule(
                        promotionOption,
                        defaultNameRulesValue.priceMinValue,
                        index
                    )
                ) ===
                getValues(
                    displayNameRule(
                        promotionOption,
                        defaultNameRulesValue.priceMinValue,
                        order
                    )
                )
            ) {
                setError(
                    displayNameRule(
                        promotionOption,
                        defaultNameRulesValue.priceMinValue,
                        order
                    ),
                    {
                        type: "manual",
                        message: "Giá trị đã tồn tại",
                    }
                );

                bool = true;
                return;
            }
        });

        return bool;
    };

    const textFieldProps = {
        placeholder: "",
        type: "number",
        variant: "filled",
        size: "small",
        fullWidth: true,
        required: true,
        InputLabelProps: {
            shrink: true,
        },
    };

    return (
        <CardContent>
            <Typography color="textSecondary" gutterBottom>
                Điều kiện
            </Typography>
            <Grid spacing={3} container  direction="row" style={{marginLeft: "1rem"}}>
                <RadioGroup
                    aria-label="quiz"
                    name="promotionOption"
                    className={styles.radioButton}
                    value={promotionOption}
                    onChange={handleChangeStatus}>
                    <Grid spacing={3} xs={12} item container justify="space-around" alignItems="center">
                        <Grid item xs={12} sm={6} md={6}>
                            <FormControlLabel
                                value={defaultRulePromotion.MIN_ORDER_VALUE}
                                control={<Radio color="primary"/>}
                                label="Giảm giá theo giá trị đơn hàng"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <FormControlLabel
                                value={defaultRulePromotion.MIN_QUANTITY}
                                control={<Radio color="primary"/>}
                                label="Giảm giá theo số lượng sản phẩm"
                            />
                        </Grid>
                    </Grid>
                </RadioGroup>
            </Grid>
            <Card style={{marginTop: "1rem"}}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Loại
                    </Typography>
                    <RadioGroup
                        aria-label="quiz"
                        name="promotionTypeRule"
                        value={promotionTypeRule}
                        onChange={handleChangeStatus}>
                        <Grid
                            spacing={1}
                            container
                            justify="space-around"
                            alignItems="center"
                        >
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControlLabel
                                    value={defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE}
                                    control={<Radio style={{color: "blue"}}/>}
                                    label="Giảm tiền"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControlLabel
                                    value={defaultTypeConditionsRule.DISCOUNT_PERCENT}
                                    control={<Radio style={{color: "blue"}}/>}
                                    label="Giảm % giá sản phẩm"
                                />
                            </Grid>
                        </Grid>
                    </RadioGroup>
                </CardContent>
            </Card>
            {promotionTypeRule === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE ? (
                <Card style={{marginTop: "10px"}}>
                    <List component="nav" aria-label="mailbox folders">
                        {promotionRulesLine.map((code, index) => (
                            <ListItem
                                key={defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE + "_" + code.id + promotionOption}
                                button>
                                <Grid spacing={1} container alignItems="center">
                                    <Grid item xs={5} sm={5} md={5}>
                                        <TextField
                                            {...textFieldProps}
                                            id={displayNameRule(promotionOption, defaultNameRulesValue.priceMinValue, index)}
                                            name={displayNameRule(promotionOption, defaultNameRulesValue.priceMinValue, index)}
                                            label={promotionOption === defaultRulePromotion.MIN_ORDER_VALUE
                                                    ? "Giá trị đơn hàng"
                                                    : "Số lượng sản phẩm"
                                            }
                                            defaultValue={edit && promotionOptionDefault === promotionOption && promotionTypeRulesDefault === promotionTypeRule
                                                    ? parseConditionValue(
                                                    conditions,
                                                    promotionOption,
                                                    promotionTypeRule,
                                                    displayNameRule(promotionOption,defaultNameRulesValue.priceMinValue, index), index)
                                                    : ""
                                            }
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {promotionOption ===
                                                        defaultRulePromotion.MIN_ORDER_VALUE
                                                            ? "VND"
                                                            : ""}
                                                    </InputAdornment>
                                                ),
                                            }}
                                            helperText={
                                                errors[
                                                    displayNameRule(promotionOption, defaultNameRulesValue.priceMinValue, index)
                                                    ]?.type === "validate"
                                                    ? "Giá trị đã tồn tại"
                                                    : errors[displayNameRule(promotionOption, defaultNameRulesValue.priceMinValue, index)]?.message
                                            }
                                            error={
                                                !!errors[
                                                    displayNameRule(
                                                        promotionOption,
                                                        defaultNameRulesValue.priceMinValue,
                                                        index
                                                    )
                                                    ]
                                            }
                                            inputRef={register({
                                                validate: (value) =>
                                                    !isExistValue(index, promotionRulesLine),
                                                required:
                                                    textError(promotionOption) +
                                                    " đơn hàng không được đế trống",
                                                maxLength: {
                                                    value: 10,
                                                    message:
                                                        textError(promotionOption) +
                                                        " đơn hàng không được vượt quá 10 kí tự",
                                                },
                                            })}
                                        />
                                    </Grid>
                                    <Grid item xs={5} sm={5} md={5}>
                                        <TextField
                                            {...textFieldProps}
                                            id={displayNameRule(
                                                promotionOption,
                                                defaultNameRulesValue.priceDiscountValue,
                                                index
                                            )}
                                            name={displayNameRule(
                                                promotionOption,
                                                defaultNameRulesValue.priceDiscountValue,
                                                index
                                            )}
                                            label="Số tiền giảm"
                                            defaultValue={
                                                edit && promotionOptionDefault === promotionOption
                                                    ? parseConditionValue(
                                                    conditions,
                                                    promotionOption,
                                                    promotionTypeRule,
                                                    displayNameRule(
                                                        promotionOption,
                                                        defaultNameRulesValue.priceDiscountValue,
                                                        index
                                                    ),
                                                    index
                                                    )
                                                    : ""
                                            }
                                            helperText={
                                                errors[
                                                    displayNameRule(
                                                        promotionOption,
                                                        defaultNameRulesValue.priceDiscountValue,
                                                        index
                                                    )
                                                    ]?.message
                                            }
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">VND</InputAdornment>
                                                ),
                                            }}
                                            error={
                                                !!errors[
                                                    displayNameRule(
                                                        promotionOption,
                                                        defaultNameRulesValue.priceDiscountValue,
                                                        index
                                                    )
                                                    ]
                                            }
                                            inputRef={register({
                                                required: "Số tiền giảm không được để trống",
                                                maxLength: {
                                                    value: 250,
                                                    message: "Số tiền giảm không được vượt quá 250 kí tự",
                                                },
                                                minLength: {
                                                    value: 4,
                                                    message: "Số tiền giảm phải lớn hơn 1000",
                                                },
                                            })}
                                        />
                                    </Grid>
                                    <Grid item xs={2} sm={2} md={2}>
                                        <Grid spacing={2} container alignItems="center">
                                            <Grid item xs={6} sm={4} md={2}>
                                                {promotionRulesLine.length !== 1 ? (
                                                    <IconButton
                                                        color="secondary"
                                                        component="span"
                                                        onClick={() => handleRemoveCodePercent(code.id)}
                                                    >
                                                        <HighlightOffOutlinedIcon/>
                                                    </IconButton>
                                                ) : (
                                                    <div/>
                                                )}
                                            </Grid>
                                            {index + 1 === promotionRulesLine.length ? (
                                                <Grid item xs={6} sm={4} md={2}>
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleAddCodePercent(code.id)}
                                                        aria-label="upload picture"
                                                        component="span"
                                                    >
                                                        <AddCircleOutlineOutlinedIcon/>
                                                    </IconButton>
                                                </Grid>
                                            ) : (
                                                <div/>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))}
                    </List>
                </Card>
            ) : promotionTypeRule === defaultTypeConditionsRule.DISCOUNT_PERCENT ? (
                <Card style={{marginTop: "10px"}}>
                    <List component="nav" aria-label="mailbox folders">
                        {promotionRulesLine.map((code, index) => (
                            <ListItem
                                key={
                                    defaultTypeConditionsRule.DISCOUNT_PERCENT +
                                    "_" +
                                    code.id +
                                    promotionOption
                                }
                                button
                            >
                                <Grid spacing={1} container alignItems="center">
                                    <Grid item xs={4} sm={4} md={4}>
                                        <TextField
                                            {...textFieldProps}
                                            id={displayNameRule(
                                                promotionOption,
                                                defaultNameRulesValue.priceMinValuePercent,
                                                index
                                            )}
                                            name={displayNameRule(
                                                promotionOption,
                                                defaultNameRulesValue.priceMinValuePercent,
                                                index
                                            )}
                                            label={
                                                promotionOption === defaultRulePromotion.MIN_ORDER_VALUE
                                                    ? "Giá trị đơn hàng"
                                                    : "Số lượng sản phẩm"
                                            }
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {promotionOption ===
                                                        defaultRulePromotion.MIN_ORDER_VALUE
                                                            ? "VND"
                                                            : ""}
                                                    </InputAdornment>
                                                ),
                                            }}
                                            defaultValue={
                                                edit
                                                    ? parseConditionValue(
                                                    conditions,
                                                    promotionOption,
                                                    promotionTypeRule,
                                                    displayNameRule(
                                                        promotionOption,
                                                        defaultNameRulesValue.priceMinValuePercent,
                                                        index
                                                    ),
                                                    index
                                                    )
                                                    : ""
                                            }
                                            helperText={
                                                errors[
                                                    displayNameRule(
                                                        promotionOption,
                                                        defaultNameRulesValue.priceMinValuePercent,
                                                        index
                                                    )
                                                    ]?.message
                                            }
                                            error={
                                                !!errors[
                                                    displayNameRule(
                                                        promotionOption,
                                                        defaultNameRulesValue.priceMinValuePercent,
                                                        index
                                                    )
                                                    ]
                                            }
                                            inputRef={register({
                                                required:
                                                    textError(promotionOption) + " không được để trống",
                                                maxLength: {
                                                    value: 10,
                                                    message:
                                                        textError(promotionOption) +
                                                        " không được vượt quá 10 kí tự",
                                                },
                                            })}
                                        />
                                    </Grid>
                                    <Grid item xs={2} sm={2} md={2}>
                                        <TextField
                                            {...textFieldProps}
                                            id={displayNameRule(
                                                promotionOption,
                                                defaultNameRulesValue.percentValue,
                                                index
                                            )}
                                            name={displayNameRule(
                                                promotionOption,
                                                defaultNameRulesValue.percentValue,
                                                index
                                            )}
                                            label="Số % giảm"
                                            defaultValue={
                                                edit && promotionOptionDefault == promotionOption
                                                    ? parseConditionValue(
                                                    conditions,
                                                    promotionOption,
                                                    promotionTypeRule,
                                                    displayNameRule(
                                                        promotionOption,
                                                        defaultNameRulesValue.percentValue,
                                                        index
                                                    ),
                                                    index
                                                    )
                                                    : ""
                                            }
                                            helperText={
                                                errors[
                                                    displayNameRule(
                                                        promotionOption,
                                                        defaultNameRulesValue.percentValue,
                                                        index
                                                    )
                                                    ]?.message
                                            }
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">%</InputAdornment>
                                                ),
                                            }}
                                            error={
                                                !!errors[
                                                    displayNameRule(
                                                        promotionOption,
                                                        defaultNameRulesValue.percentValue,
                                                        index
                                                    )
                                                    ]
                                            }
                                            inputRef={register({
                                                required: "% giảm không được để trống",
                                                validate: (value) => {
                                                    if (value > 100) {
                                                        return "Không được vượt quá 100%";
                                                    }

                                                    if (value <= 0) {
                                                        return "% Giảm không được nhỏ hơn 1%";
                                                    }
                                                },
                                                minLength: {
                                                    value: 1,
                                                    message: "Độ dài lớn hơn 1 kí tự",
                                                },
                                                pattern: {
                                                    value: /[0-9]/,
                                                    message: "Chỉ chấp nhận kí tự là số",
                                                },
                                            })}
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={4} md={4}>
                                        <TextField
                                            {...textFieldProps}
                                            id={displayNameRule(
                                                promotionOption,
                                                defaultNameRulesValue.priceMaxDiscountValue,
                                                index
                                            )}
                                            name={displayNameRule(
                                                promotionOption,
                                                defaultNameRulesValue.priceMaxDiscountValue,
                                                index
                                            )}
                                            label="Số tiền giảm tối đa"
                                            defaultValue={
                                                edit && promotionOptionDefault == promotionOption
                                                    ? parseConditionValue(
                                                    conditions,
                                                    promotionOption,
                                                    promotionTypeRule,
                                                    displayNameRule(
                                                        promotionOption,
                                                        defaultNameRulesValue.priceMaxDiscountValue,
                                                        index
                                                    ),
                                                    index
                                                    )
                                                    : ""
                                            }
                                            helperText={
                                                errors[
                                                    displayNameRule(
                                                        promotionOption,
                                                        defaultNameRulesValue.priceMaxDiscountValue,
                                                        index
                                                    )
                                                    ]?.message
                                            }
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">VND</InputAdornment>
                                                ),
                                            }}
                                            error={
                                                !!errors[
                                                    displayNameRule(
                                                        promotionOption,
                                                        defaultNameRulesValue.priceMaxDiscountValue,
                                                        index
                                                    )
                                                    ]
                                            }
                                            inputRef={register({
                                                required: "Số tiền giảm tối đa không được để trống",
                                                maxLength: {
                                                    value: 250,
                                                    message:
                                                        "Số tiền giảm tối đa không đượt vượt quá 250 kí tự",
                                                },
                                                minLength: {
                                                    value: 4,
                                                    message:
                                                        "Số tiền giảm tối đa phải có độ dài lớn hơn 4 kí tự",
                                                },
                                                pattern: {
                                                    value: /[0-9]/,
                                                    message: "Chỉ chấp nhận kí tự là số",
                                                },
                                            })}
                                        />
                                    </Grid>
                                    <Grid item xs={2} sm={2} md={2}>
                                        <Grid spacing={2} container alignItems="center">
                                            <Grid item xs={6} sm={4} md={2}>
                                                {promotionRulesLine.length !== 1 ? (
                                                    <IconButton
                                                        color="secondary"
                                                        component="span"
                                                        onClick={() => handleRemoveCodePercent(code.id)}
                                                    >
                                                        <HighlightOffOutlinedIcon/>
                                                    </IconButton>
                                                ) : (
                                                    <div/>
                                                )}
                                            </Grid>
                                            {index + 1 === promotionRulesLine.length ? (
                                                <Grid item xs={6} sm={4} md={2}>
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleAddCodePercent(code.id)}
                                                        aria-label="upload picture"
                                                        component="span"
                                                    >
                                                        <AddCircleOutlineOutlinedIcon/>
                                                    </IconButton>
                                                </Grid>
                                            ) : (
                                                <div/>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))}
                    </List>
                </Card>
            ) : promotionTypeRule === defaultTypeConditionsRule.GIFT ? (
                <RenderTableGift
                    handleClickOpen={() => setOpen({...open, openModalGift: true})}
                    handleClose={() => setOpen({...open, openModalGift: false})}
                    open={open.openModalGift}
                    register={register}
                    state={state}
                    handleRemoveCodePercent={handleRemoveCodePercent}
                    handleChange={handleChange}
                />
            ) : promotionTypeRule === defaultTypeConditionsRule.PRODUCT_GIFT ? (
                <RenderTableProductGift
                    handleClickOpen={() =>
                        setOpen({...open, openModalProductGift: true})
                    }
                    handleClose={() => setOpen({...open, openModalProductGift: false})}
                    open={open.openModalProductGift}
                    register={register}
                    state={state}
                    handleRemoveCodePercent={handleRemoveCodePercent}
                    handleChange={handleChange}
                />
            ) : (
                <div/>
            )}
        </CardContent>
    );
};

export default ConditionFields;
