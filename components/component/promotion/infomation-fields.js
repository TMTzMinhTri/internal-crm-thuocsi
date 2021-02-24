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
  const { useForm, textField, edit, promotionId } = props;

  const { handleChangeTextField, updateStatusPromotion } = props;

  const { errors, register, getValues, control, setValue } = useForm;

  const toast = useToast();

  let value = getValues();

  const { promotionOrganizer, promotionType } = textField;

  const [active, setActive] = useState(true);

  const switchActive = async () => {
    if (edit) {
      let res = await updateStatusPromotion(
        promotionId,
        active ? defaultPromotionStatus.EXPIRED : defaultPromotionStatus.ACTIVE
      );
      if (res?.status == "OK") setActive(!active);
      else toast.error(res.message);
    } else {
      setActive(!active);
      setValue("status", !active);
    }
  };

  useEffect(() => {
    setActive(edit ? (value.status ? value.status : false) : true);
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
                  placeholder=""
                  defaultValue=""
                  helperText={errors.promotionName?.message}
                  {...textfieldProps}
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
            </Grid>
            <Grid container item xs={6} spacing={3}>
              <Grid item xs={6}>
                <SelectField
                  name="promotionOrganizer"
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
                  type="datetime-local"
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
                  {...textfieldProps}
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
                  fullWidth
                  required
                  inputRef={register({
                    required: "Vui lòng chọn thời gian hiển thị",
                    min: {
                      value: getValues("startTime"),
                      message:
                        "Thời gian hiển thị phải lớn hơn thời gian bắt đầu",
                    },
                    max: {
                      value: getValues("endTime"),
                      message:
                        "Thời gian hiển thị phải nhỏ hơn thời gian kết thúc",
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
                          classes={{
                            root: classes.root,
                          }}
                          checked={active}
                          onChange={switchActive}
                          name="gilad"
                        />
                      }
                      label={active ? "Đang hoạt động" : "Chưa kích hoạt"}
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
