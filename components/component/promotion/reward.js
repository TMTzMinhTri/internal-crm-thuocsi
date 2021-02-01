import { Grid, ListItem, TextField } from "@material-ui/core";
import React from "react";
import { conditions, defaultReward, rewards, scopes } from "../constant";

import AutoCompleteField from "./autocomplete-field";
import SelectField from "./select-field";

const Reward = (props) => {
  const { reward, rewardObject, register, errors } = props;

  const { handleChangeSelectField, handleChangeList } = props;

  const {
    discountValuePercent,
    maxDiscountValue,
    absoluteDiscount,
    giftQuantity,
    point,
  } = rewardObject;

  const top100Films = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "The Godfather", year: 1972 },
    { title: "The Godfather: Part II", year: 1974 },
    { title: "The Dark Knight", year: 2008 },
  ];

  return (
    <>
      <Grid item container xs={6}>
        <SelectField
          handleChange={handleChangeSelectField}
          options={rewards}
          value={reward}
          title="Loại điều kiện áp dụng"
          option="reward"
        />
      </Grid>
      {reward != "" &&
        (reward == "ABSOLUTE" || reward == defaultReward.point ? (
          <>
            <Grid item container xs={6} key={reward}>
              <TextField
                type="number"
                id={reward == "ABSOLUTE" ? "absoluteDiscount" : "point"}
                name={reward == "ABSOLUTE" ? "absoluteDiscount" : "point"}
                label={
                  reward == "ABSOLUTE"
                    ? "Giá trị giảm tuyệt đối"
                    : "Số điểm tặng"
                }
                placeholder=""
                defaultValue={reward == "ABSOLUTE" ? absoluteDiscount : point}
                helperText={
                  reward == "ABSOLUTE"
                    ? errors.absoluteDiscount?.message
                    : errors.point?.message
                }
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                error={
                  reward == "ABSOLUTE"
                    ? !!errors.absoluteDiscount
                    : !!errors.point
                }
                required
                inputRef={register({
                  required: "Vui lòng chọn thời gian kết thúc",
                })}
              />
            </Grid>
          </>
        ) : (
          <>
            {reward == "GIFT" && (
              <Grid item container xs={6}>
                <AutoCompleteField
                  label="Sản phẩm tặng kèm"
                  placeholder=""
                  defaultValue={[]}
                  options={{ name: "" }}
                  handleChange={handleChangeList("reward")}
                />
              </Grid>
            )}
            <Grid item container spacing={2} key={reward}>
              <Grid item container xs={6}>
                <TextField
                  type="number"
                  id={
                    reward == "PERCENTAGE"
                      ? "discountValuePercent"
                      : "giftQuantity"
                  }
                  name={
                    reward == "PERCENTAGE"
                      ? "discountValuePercent"
                      : "giftQuantity"
                  }
                  label={
                    reward == "PERCENTAGE"
                      ? "Giá trị giảm giá theo %"
                      : "Số lượng sản phẩm tặng kèm"
                  }
                  placeholder=""
                  defaultValue={
                    reward == "PERCENTAGE" ? discountValuePercent : giftQuantity
                  }
                  helperText={
                    reward == "PERCENTAGE"
                      ? errors.discountValuePercent?.message
                      : errors.giftQuantity?.message
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  error={
                    reward == "PERCENTAGE"
                      ? !!errors.discountValuePercent
                      : !!errors.giftQuantity
                  }
                  required
                  inputRef={register({
                    required: "Vui lòng chọn thời gian kết thúc",
                  })}
                />
              </Grid>
              <Grid item container xs={6}>
                <TextField
                  type="number"
                  id={reward == "PERCENTAGE" ? "maxDiscountValue" : "point"}
                  name={reward == "PERCENTAGE" ? "maxDiscountValue" : "point"}
                  label="Giá trị sản phẩm yêu cầu"
                  placeholder=""
                  defaultValue={
                    reward == "PERCENTAGE" ? maxDiscountValue : point
                  }
                  helperText={
                    reward == "PERCENTAGE"
                      ? errors.maxDiscountValue?.message
                      : errors.point?.message
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  error={
                    reward == "PERCENTAGE"
                      ? !!errors.maxDiscountValue
                      : !!errors.point
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
