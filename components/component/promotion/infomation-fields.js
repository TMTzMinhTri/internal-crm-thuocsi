import React from "react";

import { CardContent, Grid, TextField } from "@material-ui/core";
import { promotions, promotionTypes } from "../constant";
import SelectField from "./select-field";

const InfomationFields = (props) => {
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
    register,
    edit = false,
    textField,
    errorTextField,
  } = props;

  const { handleChangeTextField } = props;

  const { promotionField, promotionTypeField, startTime, endTime } = textField;

  const { promotionError, promotionTypeError } = errorTextField;

  console.log(startTime, "startTime");
  return (
    <>
      <CardContent>
        <Grid spacing={2} container>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              name="promotionName"
              label="Tên khuyến mãi"
              placeholder=""
              defaultValue={dataRender.promotionName}
              helperText={errors.promotionName?.message}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              error={!!errors.promotionName}
              required
              inputRef={register({
                required: "Tên khuyến mãi không được để trống",
                maxLength: {
                  value: 250,
                  message: "Tên khuyến mãi không được vượt quá 250 kí tự",
                },
                minLength: {
                  value: 6,
                  message: "Tên khuyến mãi phải có độ dài lớn hơn 6 kí tự",
                },
                pattern: {
                  value: /[A-Za-z]/,
                  message: "Tên khuyến mãi phải có kí tự là chứ số",
                },
              })}
            />
          </Grid>
          <Grid item xs={12} sm={1} md={1}></Grid>
          <Grid item xs={12} sm={4} md={4}>
            <SelectField
              title="Bên tổ chức"
              value={promotionField}
              error={promotionError}
              options={promotions}
              handleChange={handleChangeTextField("promotionField")}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={3}></Grid>
          <Grid item xs={12} sm={4} md={4}>
            <SelectField
              title="Hình thức áp dụng"
              value={promotionTypeField}
              error={promotionTypeError}
              options={promotionTypes}
              handleChange={handleChangeTextField("promotionTypeField")}
            />
          </Grid>
          <Grid item xs={12} sm={1} md={1}></Grid>
          <Grid container item xs={4}>
            <Grid item xs={5}>
              <TextField
                name="startTime"
                id="startTime"
                label="Thời gian bắt đầu"
                placeholder=""
                defaultValue={startTime}
                helperText={errors.startTime?.message}
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                error={!!errors.startTime}
                required
                inputRef={register({
                  required: "Vui lòng chọn thời gian bắt đầu",
                })}
              />
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={5}>
              <TextField
                name="endTime"
                label="Thời gian kết thúc"
                placeholder=""
                type="datetime-local"
                defaultValue={endTime}
                helperText={errors.endTime?.message}
                error={!!errors.endTime}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                required
                inputRef={register({
                  required: "Vui lòng chọn thời gian kết thúc",
                })}
              />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};

export default InfomationFields;
