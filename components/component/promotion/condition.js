import { Button, Grid, IconButton, Paper, TextField } from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import { conditions, defaultCondition } from "../constant";
import {
  displayLabelBasedOnCondition,
  displayNameBasedOnCondition,
} from "../util";
import AutoCompleteField from "./autocomplete-field";
import { textfieldProps } from "./infomation-fields";
import SelectField from "./select-field";

const Condition = (props) => {
  const { condition, useForm, disabled } = props;

  const {
    handleChangeConditionField,
    handleAddProductOfProductList,
    handleRemoveProductOfProductList,
  } = props;

  const { register, errors, control, getValues } = useForm;

  const { minOrderValue, productList, item, selectField, seller } = condition;

  let length = productList.length;

  return (
    <Paper
      elevation={3}
      style={{ padding: "0px 30px 20px 30px", margin: "20px 0" }}
    >
      <Grid container spacing={2}>
        <Grid item container>
          <h4>GIÁ TRỊ ĐƠN HÀNG</h4>
        </Grid>
        <Grid item container xs={5}>
          <TextField
            type="number"
            name="minOrderValue"
            label="Giá trị nhỏ nhất của đơn hàng"
            placeholder=""
            defaultValue={0}
            helperText={errors.minOrderValue?.message}
            {...textfieldProps}
            InputProps={{
              readOnly: disabled,
            }}
            fullWidth
            error={!!errors.minOrderValue}
            inputRef={register()}
          />
        </Grid>
        <Grid item container>
          <h4>ĐIỀU KIỆN THEO ĐƠN HÀNG</h4>
        </Grid>
        <Grid item container xs={5}>
          <SelectField
            name="condition"
            control={control}
            errors={errors}
            required={false}
            handleChange={handleChangeConditionField("selectField")}
            options={conditions}
            value={selectField}
            title="Loại điều kiện"
            disabled={disabled}
          />
        </Grid>
        {selectField != "" && selectField != defaultCondition.noRule && (
          <Grid item container xs={12} key={selectField}>
            {productList.map((o, index) => (
              <Paper
                key={index}
                variant="outlined"
                style={{ padding: 10, margin: "10px 0", width: "100%" }}
              >
                <Grid item container xs={12} spacing={2} alignItems="flex-end">
                  <Grid item container xs={4}>
                    <AutoCompleteField
                      useForm={useForm}
                      name={"seller" + index}
                      label="Người bán"
                      placeholder=""
                      required
                      multiple
                      defaultValue={[]}
                      options={[{ name: "" }]}
                      type="SELLER"
                      disabled={disabled}
                      condition
                      arr={productList}
                      index={index}
                    />
                  </Grid>
                  <Grid item container xs={3}>
                    <AutoCompleteField
                      name={displayNameBasedOnCondition(selectField) + index}
                      label={displayLabelBasedOnCondition(selectField)}
                      placeholder=""
                      required
                      defaultValue={[]}
                      options={[{ name: "" }]}
                      type={selectField}
                      useForm={useForm}
                      disabled={disabled}
                      condition
                      arr={productList}
                      index={index}
                    />
                  </Grid>
                  <Grid item container xs={2}>
                    <TextField
                      type="number"
                      name={"minQuantity" + index}
                      label="Số lượng yêu cầu"
                      placeholder=""
                      defaultValue=""
                      helperText={errors["minQuantity" + index]?.message}
                      {...textfieldProps}
                      InputProps={{
                        readOnly: disabled,
                      }}
                      fullWidth
                      error={!!errors["minQuantity" + index]}
                      required
                      inputRef={register({
                        min: {
                          value: 1,
                          message: "Số lượng tối thiểu 1",
                        },
                        required: "Số lượng không được trống",
                        validate: (value) => {
                          if (value % 1 != 0) return "Số lượng là số nguyên";
                        },
                      })}
                    />
                  </Grid>
                  <Grid item container xs={2}>
                    <TextField
                      type="number"
                      name={"minTotalValue" + index}
                      label="Giá trị yêu cầu"
                      placeholder=""
                      defaultValue=""
                      helperText={errors["minTotalValue" + index]?.message}
                      {...textfieldProps}
                      InputProps={{
                        readOnly: disabled,
                      }}
                      fullWidth
                      error={!!errors["minTotalValue" + index]}
                      inputRef={register()}
                    />
                  </Grid>{" "}
                  {length > 1 && (
                    <Grid item xs={1} container justify="center">
                      <IconButton
                        onClick={() => handleRemoveProductOfProductList(index)}
                      >
                        <Delete color="secondary" />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            ))}
            <Grid item container>
              <Button
                variant="contained"
                startIcon={<Add />}
                color="primary"
                onClick={handleAddProductOfProductList}
              >
                Thêm
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default Condition;
