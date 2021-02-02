import { Grid, ListItem, TextField } from "@material-ui/core";
import React from "react";
import { defaultReward, rewards } from "../constant";

import AutoCompleteField from "./autocomplete-field";
import SelectField from "./select-field";

const Reward = (props) => {
  const { reward, register, errors } = props;

  const { handleChangeRewardField, handleChangeListReward } = props;

  const {
    percentageDiscount,
    maxDiscount,
    absoluteDiscount,
    number,
    pointValue,
    selectField,
  } = reward;

  const top100Films = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "The Godfather", year: 1972 },
    { title: "The Godfather: Part II", year: 1974 },
    { title: "The Dark Knight", year: 2008 },
  ];

  console.log(reward, "reward");

  return (
    <>
      <Grid item container xs={6}>
        <SelectField
          handleChange={handleChangeRewardField("selectField")}
          options={rewards}
          value={selectField}
          title="Loại điều kiện áp dụng"
          option="reward"
        />
      </Grid>
      {selectField != "" &&
        (selectField == "ABSOLUTE" || selectField == defaultReward.point ? (
          <>
            <Grid item container xs={6} key={selectField}>
              <TextField
                type="number"
                id={
                  selectField == "ABSOLUTE" ? "absoluteDiscount" : "pointValue"
                }
                name={
                  selectField == "ABSOLUTE" ? "absoluteDiscount" : "pointValue"
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
            <Grid item container spacing={2} key={selectField}>
              {selectField == defaultReward.precentage ? (
                <Grid item container xs={6}>
                  <TextField
                    type="number"
                    id={
                      selectField == "PERCENTAGE"
                        ? "percentageDiscount"
                        : "number"
                    }
                    name={
                      selectField == "PERCENTAGE"
                        ? "percentageDiscount"
                        : "number"
                    }
                    label={
                      selectField == "PERCENTAGE"
                        ? "Giá trị giảm giá theo %"
                        : "Số lượng sản phẩm tặng kèm"
                    }
                    placeholder=""
                    defaultValue={
                      selectField == "PERCENTAGE" ? percentageDiscount : number
                    }
                    helperText={
                      selectField == "PERCENTAGE"
                        ? errors.percentageDiscount?.message
                        : errors.number?.message
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    error={
                      selectField == "PERCENTAGE"
                        ? !!errors.percentageDiscount
                        : !!errors.number
                    }
                    required
                    inputRef={register({
                      required:
                        selectField == "PERCENTAGE"
                          ? "Giá trị giảm giá không được trống"
                          : "Số lượng không được trống",
                      max: {
                        value: selectField == "PERCENTAGE" && 100,
                        message: "Giá trị lớn nhất là 100",
                      },
                      min: {
                        value: 0,
                        message: "Giá trị nhỏ nhất là 0",
                      },
                    })}
                  />
                </Grid>
              ) : (
                <Grid item container xs={6}>
                  <AutoCompleteField
                    label="Sản phẩm tặng kèm"
                    placeholder=""
                    defaultValue={[]}
                    options={[{ name: "" }]}
                    handleChange={handleChangeListReward}
                    type={selectField}
                  />
                </Grid>
              )}
              <Grid item container xs={6}>
                <TextField
                  type="number"
                  id={
                    selectField == "PERCENTAGE" ? "maxDiscount" : "pointValue"
                  }
                  name={
                    selectField == "PERCENTAGE" ? "maxDiscount" : "pointValue"
                  }
                  label={
                    selectField == "PERCENTAGE"
                      ? "Giá trị giảm tối đa"
                      : "Số lượng được tặng"
                  }
                  placeholder=""
                  defaultValue={
                    selectField == "PERCENTAGE" ? maxDiscount : pointValue
                  }
                  helperText={
                    selectField == "PERCENTAGE"
                      ? errors.maxDiscount?.message
                      : errors.pointValue?.message
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  error={
                    selectField == "PERCENTAGE"
                      ? !!errors.maxDiscount
                      : !!errors.pointValue
                  }
                  required
                  inputRef={register({
                    required: "Vui lòng chọn thời gian kết thúc",
                  })}
                />
              </Grid>{" "}
            </Grid>
          </>
        ))}
    </>
  );
};

export default Reward;
