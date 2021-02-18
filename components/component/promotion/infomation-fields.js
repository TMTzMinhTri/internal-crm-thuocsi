import React, { useEffect, useState } from "react";

import {
  CardContent,
  FormControlLabel,
  Grid,
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
    getValues,
    control,
    edit = false,
    status,
    promotionId,
    setValue,
  } = props;

  const { handleChangeTextField, updateStatusPromotion } = props;

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
    setActive(edit ? value.status : true);
  }, [value.status]);

  console.log(active, "active");

  return (
    <Paper
      elevation={3}
      style={{ padding: "0px 10px 20px 10px", margin: "10px" }}
    >
      <CardContent>
        <Grid spacing={2} container>
          <Grid container item xs={6} spacing={2}>
            <Grid item xs={12}>
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
          </Grid>
          <Grid container item xs={6} spacing={2}>
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

          <Grid container item xs={12} spacing={2}>
            <Grid container item xs={6} spacing={1}>
              <Grid item xs={5}>
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
              <Grid item xs={5}>
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
            <Grid container item xs={6} spacing={1}>
              <Grid item xs={5}>
                <TextField
                  name="publicTime"
                  label="Thời gian cho phép hiển thị"
                  placeholder=""
                  type="datetime-local"
                  helperText={errors.publicTime?.message}
                  error={!!errors.publicTime}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
              <Grid item xs={5}>
                <p style={{ margin: "0px 5px", fontSize: 12 }}>Trạng thái</p>
                <Controller
                  name="status"
                  defaultValue={active}
                  control={control}
                  render={(props) => (
                    <FormControlLabel
                      control={
                        <Switch
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
