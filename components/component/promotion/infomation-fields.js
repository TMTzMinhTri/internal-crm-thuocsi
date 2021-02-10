import React, { useState } from "react";

import {
  CardContent,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  TextField,
} from "@material-ui/core";
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
    textField,
    errorTextField,
    getValues,
    control,
  } = props;

  const { handleChangeTextField } = props;

  const { promotionField, promotionTypeField } = textField;

  const { promotionError, promotionTypeError } = errorTextField;

  const [active, setActive] = useState(false);

  const switchActive = () => {
    setActive(!active);
  };

  console.log(getValues("startTime"), "startTime");

  return (
    <Paper
      elevation={3}
      style={{ padding: "0px 10px 20px 10px", margin: "10px" }}
    >
      <CardContent>
        <Grid spacing={2} container>
          <Grid item xs={6}>
            <SelectField
              name="promotionField"
              control={control}
              errors={errors}
              title="Bên tổ chức"
              value={promotionField}
              error={promotionError}
              options={promotions}
              handleChange={handleChangeTextField("promotionField")}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectField
              name="promotionTypeField"
              control={control}
              errors={errors}
              title="Hình thức áp dụng"
              value={promotionTypeField}
              error={promotionTypeError}
              options={promotionTypes}
              handleChange={handleChangeTextField("promotionTypeField")}
            />
          </Grid>
          <Grid item xs={6}>
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
          {/* <Grid item xs={6}>
            <p style={{ margin: "5px 0", fontSize: 12 }}>Trạng thái</p>
            <FormControlLabel
              control={
                <Switch checked={active} onChange={switchActive} name="gilad" />
              }
              label={active ? "Đang hoạt động" : "Chưa kích hoạt"}
            />
          </Grid> */}
          <Grid container item xs={6} spacing={1}>
            <Grid item xs={6}>
              <TextField
                name="startTime"
                id="startTime"
                label="Thời gian bắt đầu"
                placeholder=""
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
            <Grid item xs={6}>
              <TextField
                name="endTime"
                label="Thời gian kết thúc"
                placeholder=""
                type="datetime-local"
                helperText={errors.endTime?.message}
                error={!!errors.endTime}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                required
                inputRef={register({
                  required: "Vui lòng chọn thời gian kết thúc",
                  min: {
                    value: getValues("startTime"),
                    message:
                      "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
                  },
                })}
              />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Paper>
  );
};

export default InfomationFields;
