import { Grid, TextField } from "@material-ui/core";
import React from "react";
import { conditions, scopes } from "../constant";
import { displayLabelBasedOnScope } from "../until";
import AutoCompleteField from "./autocomplete-field";
import SelectField from "./select-field";

const Condition = (props) => {
  const { condition, conditionObject, register, errors } = props;

  const { handleChangeSelectField } = props;

  const { minValue, productQuantity, productValue } = conditionObject;

  return (
    <>
      <Grid item container xs={6}>
        <SelectField
          handleChange={handleChangeSelectField}
          options={conditions}
          value={condition}
          title="Loại điều kiện áp dụng"
          option="condition"
        />
      </Grid>
      {condition != "" &&
        (condition == "ORDER_VALUE" ? (
          <Grid item container xs={6}>
            <TextField
              type="number"
              id="minValue"
              name="minValue"
              label="Giá trị nhỏ nhất của đơn hàng"
              placeholder=""
              defaultValue={minValue}
              helperText={errors.minValue?.message}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              error={!!errors.minValue}
              required
              inputRef={register({
                required: "Vui lòng chọn thời gian kết thúc",
              })}
            />
          </Grid>
        ) : (
          <Grid item container spacing={2}>
            <Grid item container xs={6}>
              <TextField
                type="number"
                id="productQuantity"
                name="productQuantity"
                label="Số lượng sản phẩm yêu cầu"
                placeholder=""
                defaultValue={productQuantity}
                helperText={errors.productQuantity?.message}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                error={!!errors.productQuantity}
                required
                inputRef={register({
                  required: "Vui lòng chọn thời gian kết thúc",
                })}
              />
            </Grid>
            <Grid item container xs={6}>
              <TextField
                type="number"
                id="productValue"
                name="productValue"
                label="Giá trị sản phẩm yêu cầu"
                placeholder=""
                defaultValue={productValue}
                helperText={errors.productValue?.message}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                error={!!errors.productValue}
                required
                inputRef={register({
                  required: "Vui lòng chọn thời gian kết thúc",
                })}
              />
            </Grid>{" "}
          </Grid>
        ))}
    </>
  );
};

export default Condition;
