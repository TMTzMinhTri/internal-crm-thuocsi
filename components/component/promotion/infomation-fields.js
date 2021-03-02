import React, { useEffect, useState } from "react";

import {
  CardContent,
  FormControlLabel,
  Grid,
  makeStyles,
  Paper,
  Switch,
  TextField,
} from "@material-ui/core";
import {
  defaultPromotionStatus,
  promotions,
  promotionTypes,
} from "../constant";
import SelectField from "./select-field";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { Controller } from "react-hook-form";
import { formatUTCTime } from "../util";

export const textfieldProps = {
  InputLabelProps: {
    shrink: true,
    style: {
      color: "#353434",
      fontSize: "20px",
    },
  },
  InputProps: {
    style: {
      marginTop: "30px",
    },
  },
};

const useStyles = makeStyles({
  root: {
    marginTop: 10,
  },
});

const InfomationFields = (props) => {
  const classes = useStyles();

  const { useForm, textField, disabled } = props;

  const { handleChangeTextField } = props;

  const { errors, register, getValues, control, setValue } = useForm;

  let value = getValues();

  const { promotionOrganizer, promotionType } = textField;

  const [active, setActive] = useState(value.status ? value.status : false);

  const switchActive = async () => {
    setActive(!active);
    setValue("status", !active);
  };

  useEffect(() => {
    setActive(value.status ? value.status : false);
  }, [value.status]);

  return (
    <Paper
      elevation={3}
      style={{ padding: "0px 10px 0px 10px", margin: "10px" }}
    >
      <CardContent>
        <Grid spacing={4} container>
          <Grid container item xs={12} justify="space-between">
            <Grid container item xs={6} spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="promotionName"
                  label="Tên khuyến mãi"
                  placeholder="Nhập tên chương trình"
                  defaultValue=""
                  helperText={errors.promotionName?.message}
                  {...textfieldProps}
                  InputProps={{
                    readOnly: disabled,
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
                    // pattern: {
                    //   value: /[A-Za-z]/,
                    //   message: "Tên khuyến mãi phải có kí tự là chứ số",
                    // },
                  })}
                />
              </Grid>
            </Grid>
            <Grid container item xs={6} spacing={3}>
              <Grid item xs={6}>
                <SelectField
                  name="promotionOrganizer"
                  disabled={disabled}
                  control={control}
                  errors={errors}
                  title="Bên tổ chức"
                  value={promotionOrganizer}
                  options={promotions}
                  handleChange={handleChangeTextField("promotionOrganizer")}
                />
              </Grid>
              <Grid item xs={6}>
                <SelectField
                  name="promotionType"
                  control={control}
                  disabled={disabled}
                  errors={errors}
                  title="Hình thức áp dụng"
                  value={promotionType}
                  options={promotionTypes}
                  handleChange={handleChangeTextField("promotionType")}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid container item xs={12} justify="space-between">
            <Grid container item xs={6} spacing={3} justify="space-between">
              <Grid item xs={6}>
                <TextField
                  name="startTime"
                  id="startTime"
                  label="Thời gian bắt đầu"
                  placeholder=""
                  helperText={errors.startTime?.message}
                  {...textfieldProps}
                  InputProps={{
                    readOnly: disabled,
                  }}
                  type="datetime-local"
                  fullWidth
                  error={!!errors.startTime}
                  required
                  inputRef={register({
                    min: {
                      value: disabled ? null : formatUTCTime(new Date()),
                      message:
                        "Thời gian bắt đầu phải lớn hơn thời gian hiện tại",
                    },
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
                  {...textfieldProps}
                  InputProps={{
                    readOnly: disabled,
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
            <Grid container item xs={6} spacing={3}>
              <Grid item xs={6}>
                <TextField
                  name="publicTime"
                  label="Thời gian cho phép hiển thị"
                  placeholder=""
                  type="datetime-local"
                  helperText={errors.publicTime?.message}
                  error={!!errors.publicTime}
                  {...textfieldProps}
                  InputProps={{
                    readOnly: disabled,
                  }}
                  fullWidth
                  required
                  inputRef={register({
                    required: "Vui lòng chọn thời gian hiển thị",
                    min: {
                      value: disabled ? null : formatUTCTime(new Date()),
                      message:
                        "Thời gian hiển thị phải lớn hơn thời gian hiện tại",
                    },
                    max: {
                      value: disabled ? null : getValues("startTime"),
                      message:
                        "Thời gian hiển thị phải nhỏ hơn hoặc bằng thời gian bắt đầu",
                    },
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                <p style={{ margin: "0px 5px", fontSize: 15 }}>Trạng thái</p>
                <Controller
                  name="status"
                  defaultValue={active}
                  control={control}
                  render={(props) => (
                    <FormControlLabel
                      classes={{
                        label: classes.root,
                      }}
                      control={
                        <Switch
                          color="primary"
                          classes={{
                            root: classes.root,
                          }}
                          color={"primary"}
                          checked={active}
                          onChange={switchActive}
                          name="gilad"
                        />
                      }
                      label={active ? "Đang hoạt động" : "Ngưng hoạt động"}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Paper>
  );
};

export default InfomationFields;
