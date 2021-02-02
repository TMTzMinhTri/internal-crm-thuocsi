import {
  Button,
  Grid,
  IconButton,
  ListItem,
  TextField,
} from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import React from "react";
import { defaultReward, rewards } from "../constant";

import AutoCompleteField from "./autocomplete-field";
import SelectField from "./select-field";

const Reward = (props) => {
  const { reward, register, errors } = props;

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
            {selectField == defaultReward.precentage ? (
              <Grid item container spacing={2} key={selectField}>
                <Grid item container xs={6}>
                  <TextField
                    type="number"
                    id={"percentageDiscount"}
                    name={"percentageDiscount"}
                    label={"Giá trị giảm giá theo %"}
                    placeholder=""
                    defaultValue={percentageDiscount}
                    helperText={errors.percentageDiscount?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
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
                    defaultValue={maxDiscount}
                    helperText={errors.maxDiscount?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
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
                        label="Sản phẩm tặng kèm"
                        placeholder=""
                        multiple={false}
                        defaultValue={[]}
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
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleAddAttachedProduct}
                  >
                    Thêm
                  </Button>
                </Grid>
              </>
            )}
          </>
        ))}
    </>
  );
};

export default Reward;