import { Button, Grid, IconButton, Paper, TextField } from "@material-ui/core";
import { Add, Delete, Remove, RemoveOutlined } from "@material-ui/icons";
import React, { useEffect } from "react";
import { conditions, defaultScope, scopes } from "../constant";
import { displayLabelBasedOnScope } from "../until";
import AutoCompleteField from "./autocomplete-field";
import SelectField from "./select-field";

const Condition = (props) => {
  const { condition, register, errors, scope, setValue } = props;

  const {
    handleChangeConditionField,
    handleAddProductOfProductList,
    handleRemoveProductOfProductList,
  } = props;

  const { minValue, productList, selectField } = condition;

  return (
    <>
      <Grid item container xs={6}>
        <SelectField
          handleChange={handleChangeConditionField("selectField")}
          options={conditions}
          value={selectField}
          title="Loại điều kiện áp dụng"
          option="condition"
        />
      </Grid>
      {selectField != "" &&
        (selectField == "ORDER_VALUE" ? (
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
                required: "Giá trị không được trống",
              })}
            />
          </Grid>
        ) : (
          <>
            {productList.map((o, index) => (
              <Paper
                Paper
                variant="outlined"
                style={{ padding: 10, margin: "10px 0" }}
              >
                <Grid item container spacing={2} alignItems="center">
                  <Grid item container xs={4}>
                    <TextField
                      id={"productName" + index}
                      name={"productName" + index}
                      label="Tên sản phẩm"
                      placeholder=""
                      defaultValue={o.product?.name}
                      helperText={errors["productName" + index]?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      error={!!errors["productName" + index]}
                      required
                      inputRef={register({
                        required: "Tên sản phẩm không được trống",
                      })}
                    />
                  </Grid>
                  <Grid item container xs={3}>
                    <TextField
                      type="number"
                      id={"productNumber" + index}
                      name={"productNumber" + index}
                      label="Số lượng sản phẩm yêu cầu"
                      placeholder=""
                      defaultValue={o.productNumber}
                      helperText={errors["productNumber" + index]?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      error={!!errors["productNumber" + index]}
                      required
                      inputRef={register({
                        required: "Số lượng không được trống",
                      })}
                    />
                  </Grid>
                  <Grid item container xs={4}>
                    <TextField
                      type="number"
                      id={"productValue" + index}
                      name={"productValue" + index}
                      label="Giá trị sản phẩm yêu cầu"
                      placeholder=""
                      defaultValue={o.productValue}
                      helperText={errors["productValue" + index]?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      error={!!errors["productValue" + index]}
                      required
                      inputRef={register({
                        required: "Giá trị không được trống",
                      })}
                    />
                  </Grid>{" "}
                  <Grid xs={1}>
                    <IconButton
                      onClick={() => handleRemoveProductOfProductList(index)}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            <Grid item container>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddProductOfProductList}
                startIcon={<Add />}
              >
                Thêm
              </Button>
            </Grid>
          </>
        ))}
    </>
  );
};

export default Condition;
