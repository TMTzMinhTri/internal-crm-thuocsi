import {
  Button,
  Fab,
  Grid,
  IconButton,
  ListItem,
  Paper,
  TextField,
} from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import React from "react";
import { defaultReward, rewards } from "../constant";
import { displayNameBasedOnReward } from "../until";

import AutoCompleteField from "./autocomplete-field";
import SelectField from "./select-field";

const Reward = (props) => {
  const { reward, register, errors, control } = props;

  const {
    handleChangeRewardField,
    handleChangeListReward,
    handleAddAttachedProduct,
    handleRemoveAttachedProduct,
  } = props;

  const {
    percentageDiscount,
    maxDiscount,
    absoluteDiscount,
    number,
    pointValue,
    selectField,
    attachedProduct,
  } = reward;

  return (
    <Paper
      elevation={3}
      style={{ padding: "0px 30px 20px 30px", margin: "20px 0" }}
    >
      <Grid container spacing={2} direction="column">
        <Grid item container>
          <h4>GIÁ TRỊ KHUYẾN MÃI</h4>
        </Grid>
        <Grid item container xs={6}>
          <SelectField
            control={control}
            errors={errors}
            name="reward"
            handleChange={handleChangeRewardField("selectField")}
            options={rewards}
            value={selectField}
            title="Loại điều kiện áp dụng"
            option="reward"
          />
        </Grid>
        {selectField != "" &&
          (selectField == "ABSOLUTE" || selectField == "POINT" ? (
            <>
              <Grid item container xs={6} key={selectField}>
                <TextField
                  type="number"
                  id={
                    selectField == "ABSOLUTE"
                      ? "absoluteDiscount"
                      : "pointValue"
                  }
                  name={
                    selectField == "ABSOLUTE"
                      ? "absoluteDiscount"
                      : "pointValue"
                  }
                  label={
                    selectField == "ABSOLUTE"
                      ? "Giá trị giảm tuyệt đối"
                      : "Số điểm tặng"
                  }
                  placeholder=""
                  defaultValue={
                    selectField == "ABSOLUTE" ? absoluteDiscount : pointValue
                  }
                  helperText={
                    selectField == "ABSOLUTE"
                      ? errors.absoluteDiscount?.message
                      : errors.pointValue?.message
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  error={
                    selectField == "ABSOLUTE"
                      ? !!errors.absoluteDiscount
                      : !!errors.pointValue
                  }
                  required
                  inputRef={register({
                    required:
                      selectField == "ABSOLUTE"
                        ? "Giá trị không được trống"
                        : "Số điểm tặng không được trống",
                  })}
                />
              </Grid>
            </>
          ) : (
            <>
              {selectField == "PERCENTAGE" ? (
                <Grid item container spacing={2}>
                  <Grid item container xs={6}>
                    <TextField
                      type="number"
                      id={"percentageDiscount"}
                      name={"percentageDiscount"}
                      label={"Giá trị giảm giá theo %"}
                      placeholder=""
                      helperText={errors.percentageDiscount?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      defaultValue={percentageDiscount}
                      error={!!errors.percentageDiscount}
                      required
                      inputRef={register({
                        required: "Giá trị giảm giá không được trống",
                        max: {
                          value: 100,
                          message: "Giá trị lớn nhất là 100",
                        },
                        min: {
                          value: 0,
                          message: "Giá trị nhỏ nhất là 0",
                        },
                      })}
                    />
                  </Grid>
                  <Grid item container xs={6}>
                    <TextField
                      type="number"
                      id={"maxDiscount"}
                      name={"maxDiscount"}
                      label={"Giá trị giảm tối đa"}
                      placeholder=""
                      helperText={errors.maxDiscount?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      defaultValue={maxDiscount}
                      fullWidth
                      error={!!errors.maxDiscount}
                      required
                      inputRef={register({
                        required: "Vui lòng chọn thời gian kết thúc",
                      })}
                    />
                  </Grid>
                </Grid>
              ) : (
                <>
                  {attachedProduct.map((o, index) => (
                    <Grid item container spacing={2} key={selectField}>
                      <Grid item container xs={6}>
                        <AutoCompleteField
                          name={"gift" + index}
                          control={control}
                          label="Sản phẩm tặng kèm"
                          placeholder=""
                          multiple={false}
                          defaultValue={o.product ? o.product : []}
                          options={[{ name: "" }]}
                          handleChange={handleChangeListReward(index)}
                          type={selectField}
                        />
                      </Grid>
                      <Grid item container xs={5}>
                        <TextField
                          type="number"
                          name={"number" + index}
                          label={"Số lượng được tặng"}
                          placeholder=""
                          defaultValue={o.number}
                          helperText={errors["number" + index]?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          error={!!errors["number" + index]}
                          required
                          inputRef={register({
                            required: "Vui lòng chọn thời gian kết thúc",
                          })}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton
                          onClick={() => handleRemoveAttachedProduct(index)}
                        >
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid item xs={2}>
                    <Fab
                      color="primary"
                      size="small"
                      onClick={handleAddAttachedProduct}
                    >
                      <Add />
                    </Fab>
                  </Grid>
                </>
              )}
            </>
          ))}
      </Grid>
    </Paper>
  );
};

export default Reward;
