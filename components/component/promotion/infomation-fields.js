import React from "react";

import { CardContent, CardHeader, Grid, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";

const InfomationFields = (props) => {
  const { dataRender, errors, endTime, startTime } = props;
  const { handleChange } = props;
  const { register } = useForm();
  return (
    <>
      <CardHeader subheader="Thông tin khuyến mãi" />
      <CardContent>
        <Grid spacing={3} container>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              id="promotionName"
              name="promotionName"
              label="Tên khuyến mãi"
              placeholder=""
              defaultValue={dataRender.promotionName}
              helperText={errors.promotionName?.message}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ width: "100%" }}
              error={errors.promotionName ? true : false}
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
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              id="totalCode"
              name="totalCode"
              label="Số lần áp dụng"
              type="number"
              defaultValue={dataRender.totalCode}
              helperText={errors.totalCode?.message}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ width: "100%" }}
              error={errors.totalCode ? true : false}
              required
              inputRef={register({
                required: "Số lần áp dụng không được để trống",
                pattern: {
                  value: /[0-9]/,
                  message: "Chỉ chấp nhận kí tự là số",
                },
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              id="totalApply"
              name="totalApply"
              label="Số lần áp dụng tối đa"
              type="number"
              defaultValue={dataRender.applyPerUser}
              helperText={errors.totalApply?.message}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ width: "100%" }}
              error={errors.totalApply ? true : false}
              required
              inputRef={register({
                required: "Số lần áp dụng tối đa không được để trống",
                pattern: {
                  value: /[0-9]/,
                  message: "Chỉ chấp nhận kí tự là số",
                },
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              id="startTime"
              name="startTime"
              label="Thời gian bắt đầu"
              placeholder=""
              defaultValue={startTime}
              helperText={errors.startTime?.message}
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              style={{ width: "100%" }}
              error={errors.startTime ? true : false}
              required
              inputRef={register({
                required: "Vui lòng chọn thời gian bắt đầu",
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              id="endTime"
              name="endTime"
              label="Thời gian kết thúc"
              placeholder=""
              type="datetime-local"
              defaultValue={endTime}
              helperText={errors.endTime?.message}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ width: "100%" }}
              onChange={handleChange}
              error={errors.endTime ? true : false}
              required
              inputRef={register({
                required: "Vui lòng chọn ngày kêt thúc",
              })}
            />
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};

export default InfomationFields;
