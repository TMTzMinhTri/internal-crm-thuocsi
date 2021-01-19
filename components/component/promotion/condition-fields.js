import React, { useState } from "react";
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
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";

import {
  defaultNameRulesValue,
  defaultRulePromotion,
  defaultTypeConditionsRule,
} from "../constant";
import { displayNameRule, parseConditionValue } from "../until";
import RenderTableGift from "./modal-gift";
import RenderTableProductGift from "./modal-product-gift";

const ConditionFields = (props) => {
  const { state, errors, register, getValues, setError, edit = false } = props;
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

  const isExistValue = (order, arr) => {
    let bool = false;
    arr.forEach((o, index) => {
      if (
        order != index &&
        getValues(
          displayNameRule(
            promotionOption,
            defaultNameRulesValue.priceMinValue,
            index
          )
        ) ==
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

  return (
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        Điều kiện
      </Typography>
      <RadioGroup
        aria-label="quiz"
        name="promotionOption"
        value={promotionOption}
        onChange={handleChangeStatus}
      >
        <Grid spacing={3} container justify="space-around" alignItems="center">
          <Grid item xs={12} sm={6} md={6}>
            <FormControlLabel
              value={defaultRulePromotion.MIN_ORDER_VALUE}
              control={<Radio color="primary" />}
              label="Giảm giá theo giá trị đơn hàng"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControlLabel
              value={defaultRulePromotion.MIN_QUANTITY}
              control={<Radio color="primary" />}
              label="Giảm giá theo số lượng sản phẩm"
            />
          </Grid>
        </Grid>
      </RadioGroup>
      <Card variant="outlined">
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Loại
          </Typography>
          <RadioGroup
            aria-label="quiz"
            name="promotionTypeRule"
            value={promotionTypeRule}
            onChange={handleChangeStatus}
          >
            <Grid
              spacing={1}
              container
              justify="space-around"
              alignItems="center"
            >
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  value={defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE}
                  control={<Radio style={{ color: "blue" }} />}
                  label="Giảm tiền"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  value={defaultTypeConditionsRule.DISCOUNT_PERCENT}
                  control={<Radio style={{ color: "blue" }} />}
                  label="Giảm % giá sản phẩm"
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  value={defaultTypeConditionsRule.GIFT}
                  control={<Radio style={{ color: "blue" }} />}
                  label="Quà"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  value={defaultTypeConditionsRule.PRODUCT_GIFT}
                  control={<Radio style={{ color: "blue" }} />}
                  label="Tặng sản phẩm"
                />
              </Grid> */}
            </Grid>
          </RadioGroup>
        </CardContent>
      </Card>
      {promotionTypeRule === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE ? (
        <Card variant="outlined" style={{ marginTop: "10px" }}>
          <List component="nav" aria-label="mailbox folders">
            {promotionRulesLine.map((code, index) => (
              <ListItem
                key={
                  defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE + "_" + code.id
                }
                button
              >
                <Grid spacing={1} container alignItems="center">
                  <Grid item xs={5} sm={5} md={5}>
                    <TextField
                      id={displayNameRule(
                        promotionOption,
                        defaultNameRulesValue.priceMinValue,
                        index
                      )}
                      name={displayNameRule(
                        promotionOption,
                        defaultNameRulesValue.priceMinValue,
                        index
                      )}
                      label={
                        promotionOption === defaultRulePromotion.MIN_ORDER_VALUE
                          ? "Giá trị đơn hàng"
                          : "Số lượng sản phẩm"
                      }
                      placeholder=""
                      type="number"
                      variant="outlined"
                      defaultValue={
                        edit
                          ? parseConditionValue(
                              conditions,
                              promotionOption,
                              promotionTypeRule,
                              displayNameRule(
                                promotionOption,
                                defaultNameRulesValue.priceMinValue,
                                index
                              ),
                              index
                            )
                          : ""
                      }
                      size="small"
                      helperText={
                        errors[
                          displayNameRule(
                            promotionOption,
                            defaultNameRulesValue.priceMinValue,
                            index
                          )
                        ]?.type == "validate"
                          ? "Giá trị đã tồn tại"
                          : errors[
                              displayNameRule(
                                promotionOption,
                                defaultNameRulesValue.priceMinValue,
                                index
                              )
                            ]?.message
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ width: "100%" }}
                      error={
                        !!errors[
                          displayNameRule(
                            promotionOption,
                            defaultNameRulesValue.priceMinValue,
                            index
                          )
                        ]
                      }
                      required
                      inputRef={register({
                        validate: (value) =>
                          !isExistValue(index, promotionRulesLine),
                        required:
                          textError(promotionOption) +
                          " đơn hàng không được bỏ trống",
                        maxLength: {
                          value: 10,
                          message:
                            textError(promotionOption) +
                            " đơn hàng không được vượt quá 10 kí tự",
                        },
                        minLength: {
                          value:
                            promotionOption ===
                            defaultRulePromotion.MIN_ORDER_VALUE
                              ? 6
                              : 2,
                          message:
                            textError(promotionOption) +
                            " đơn hàng phải lớn hơn 6 kí tự",
                        },
                      })}
                    />
                  </Grid>
                  <Grid item xs={5} sm={5} md={5}>
                    <TextField
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
                      type="number"
                      label="Số tiền giảm"
                      placeholder=""
                      variant="outlined"
                      defaultValue={
                        edit
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
                      size="small"
                      helperText={
                        errors[
                          displayNameRule(
                            promotionOption,
                            defaultNameRulesValue.priceDiscountValue,
                            index
                          )
                        ]?.message
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">đ</InputAdornment>
                        ),
                      }}
                      style={{ width: "100%" }}
                      error={
                        errors[
                          displayNameRule(
                            promotionOption,
                            defaultNameRulesValue.priceDiscountValue,
                            index
                          )
                        ]
                          ? true
                          : false
                      }
                      required
                      inputRef={register({
                        required: "Số tiền giảm không được bỏ trống",
                        maxLength: {
                          value: 250,
                          message: "Số tiền giảm không được vượt quá 250 kí tự",
                        },
                        minLength: {
                          value: 4,
                          message: "Giá trị sản phẩm phải lớn hơn 1000",
                        },
                      })}
                    />
                  </Grid>
                  <Grid item xs={2} sm={2} md={2}>
                    <Grid spacing={1} container alignItems="center">
                      <Grid item xs={6} sm={4} md={2}>
                        {promotionRulesLine.length !== 1 ? (
                          <IconButton
                            color="secondary"
                            component="span"
                            onClick={() => handleRemoveCodePercent(code.id)}
                          >
                            <HighlightOffOutlinedIcon />
                          </IconButton>
                        ) : (
                          <div />
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
                            <AddCircleOutlineOutlinedIcon />
                          </IconButton>
                        </Grid>
                      ) : (
                        <div />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        </Card>
      ) : promotionTypeRule === defaultTypeConditionsRule.DISCOUNT_PERCENT ? (
        <Card variant="outlined" style={{ marginTop: "10px" }}>
          <List component="nav" aria-label="mailbox folders">
            {promotionRulesLine.map((code, index) => (
              <ListItem
                key={defaultTypeConditionsRule.DISCOUNT_PERCENT + "_" + code.id}
                button
              >
                <Grid spacing={1} container alignItems="center">
                  <Grid item xs={4} sm={4} md={4}>
                    <TextField
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
                      placeholder=""
                      type="number"
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
                      variant="outlined"
                      size="small"
                      helperText={
                        errors[
                          displayNameRule(
                            promotionOption,
                            defaultNameRulesValue.priceMinValuePercent,
                            index
                          )
                        ]?.message
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ width: "100%" }}
                      error={
                        !!errors[
                          displayNameRule(
                            promotionOption,
                            defaultNameRulesValue.priceMinValuePercent,
                            index
                          )
                        ]
                      }
                      required
                      inputRef={register({
                        required:
                          textError(promotionOption) + " không được bỏ trống",
                        maxLength: {
                          value: 10,
                          message:
                            textError(promotionOption) +
                            " không được vượt quá 10 kí tự",
                        },
                        minLength: {
                          value:
                            promotionOption ===
                            defaultRulePromotion.MIN_ORDER_VALUE
                              ? 6
                              : 2,
                          message:
                            textError(promotionOption) +
                            " phải lớn hơn 6 kí tự",
                        },
                      })}
                    />
                  </Grid>
                  <Grid item xs={2} sm={2} md={2}>
                    <TextField
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
                      type="number"
                      label="Số % giảm"
                      placeholder=""
                      variant="outlined"
                      defaultValue={
                        edit
                          ? edit
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
                          : ""
                      }
                      size="small"
                      helperText={
                        errors[
                          displayNameRule(
                            promotionOption,
                            defaultNameRulesValue.percentValue,
                            index
                          )
                        ]?.message
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      style={{ width: "100%" }}
                      error={
                        errors[
                          displayNameRule(
                            promotionOption,
                            defaultNameRulesValue.percentValue,
                            index
                          )
                        ]
                          ? true
                          : false
                      }
                      required
                      inputRef={register({
                        required: "Không được để trống",
                        maxLength: {
                          value: 3,
                          message: "Không quá 3 kí tự",
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
                      type="number"
                      label="Số tiền giảm tối đa"
                      placeholder=""
                      variant="outlined"
                      defaultValue={
                        edit
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
                      size="small"
                      helperText={
                        errors[
                          displayNameRule(
                            promotionOption,
                            defaultNameRulesValue.priceMaxDiscountValue,
                            index
                          )
                        ]?.message
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">đ</InputAdornment>
                        ),
                      }}
                      style={{ width: "100%" }}
                      error={
                        errors[
                          displayNameRule(
                            promotionOption,
                            defaultNameRulesValue.priceMaxDiscountValue,
                            index
                          )
                        ]
                          ? true
                          : false
                      }
                      required
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
                    <Grid spacing={1} container alignItems="center">
                      <Grid item xs={6} sm={4} md={2}>
                        {promotionRulesLine.length !== 1 ? (
                          <IconButton
                            color="secondary"
                            component="span"
                            onClick={() => handleRemoveCodePercent(code.id)}
                          >
                            <HighlightOffOutlinedIcon />
                          </IconButton>
                        ) : (
                          <div />
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
                            <AddCircleOutlineOutlinedIcon />
                          </IconButton>
                        </Grid>
                      ) : (
                        <div />
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
          handleClickOpen={() => setOpen({ ...open, openModalGift: true })}
          handleClose={() => setOpen({ ...open, openModalGift: false })}
          open={open.openModalGift}
          register={register}
          state={state}
          handleRemoveCodePercent={handleRemoveCodePercent}
          handleChange={handleChange}
        />
      ) : promotionTypeRule === defaultTypeConditionsRule.PRODUCT_GIFT ? (
        <RenderTableProductGift
          handleClickOpen={() =>
            setOpen({ ...open, openModalProductGift: true })
          }
          handleClose={() => setOpen({ ...open, openModalProductGift: false })}
          open={open.openModalProductGift}
          register={register}
          state={state}
          handleRemoveCodePercent={handleRemoveCodePercent}
          handleChange={handleChange}
        />
      ) : (
        <div />
      )}
    </CardContent>
  );
};

export default ConditionFields;
