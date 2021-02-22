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
  const { condition, register, errors, control, getValues } = props;

  const {
    handleChangeConditionField,
    handleAddProductOfProductList,
    handleRemoveProductOfProductList,
    handleChangeProductListOfCondition,
    handleChangeConditionList,
    handleChangeConditionSeller,
  } = props;

  const { minValue, productList, item, selectField, seller } = condition;

  let value = getValues();

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
            id="minValue"
            name="minValue"
            label="Giá trị nhỏ nhất của đơn hàng"
            placeholder=""
            defaultValue={minValue}
            helperText={errors.minValue?.message}
            {...textfieldProps}
            fullWidth
            error={!!errors.minValue}
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
          />
        </Grid>
        {selectField != "" && selectField != defaultCondition.noRule && (
          <Grid item container xs={12}>
            {selectField == defaultCondition.product ? (
              productList.map((o, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  style={{ padding: 10, margin: "10px 0", width: "100%" }}
                >
                  <Grid
                    item
                    container
                    xs={12}
                    spacing={2}
                    alignItems="flex-end"
                  >
                    <Grid item container xs={4}>
                      <AutoCompleteField
                        control={control}
                        name={"seller" + index}
                        label="Người bán"
                        placeholder=""
                        defaultValue={o.seller ? o.seller : []}
                        options={[{ name: "" }]}
                        type="SELLER"
                        errors={errors}
                        handleChange={handleChangeProductListOfCondition(
                          index,
                          "SELLER"
                        )}
                      />
                    </Grid>
                    <Grid item container xs={3}>
                      <AutoCompleteField
                        control={control}
                        name={displayNameBasedOnCondition(selectField) + index}
                        label={displayLabelBasedOnCondition(selectField)}
                        placeholder=""
                        multiple={false}
                        defaultValue={o.product ? o.product : []}
                        options={[{ name: "" }]}
                        type={selectField}
                        errors={errors}
                        handleChange={handleChangeProductListOfCondition(
                          index,
                          "PRODUCT"
                        )}
                      />
                    </Grid>
                    <Grid item container xs={2}>
                      <TextField
                        type="number"
                        name={"minQuantity" + index}
                        label="Số lượng sản phẩm yêu cầu"
                        placeholder=""
                        defaultValue={o.minQuantity}
                        helperText={errors["minQuantity" + index]?.message}
                        {...textfieldProps}
                        fullWidth
                        error={!!errors["minQuantity" + index]}
                        required
                        inputRef={register({
                          required: "Số lượng không được trống",
                        })}
                      />
                    </Grid>
                    <Grid item container xs={2}>
                      <TextField
                        type="number"
                        name={"minTotalValue" + index}
                        label="Giá trị sản phẩm yêu cầu"
                        placeholder=""
                        defaultValue={o.minTotalValue}
                        helperText={errors["minTotalValue" + index]?.message}
                        {...textfieldProps}
                        fullWidth
                        error={!!errors["minTotalValue" + index]}
                        inputRef={register()}
                      />
                    </Grid>{" "}
                    <Grid item xs={1} container justify="center">
                      <IconButton
                        onClick={() => handleRemoveProductOfProductList(index)}
                      >
                        <Delete color="secondary" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))
            ) : (
              <Grid
                key={selectField}
                item
                container
                spacing={2}
                alignItems="flex-end"
              >
                <Grid item container xs={5}>
                  <AutoCompleteField
                    control={control}
                    name="seller0"
                    label="Người bán"
                    placeholder=""
                    defaultValue={seller}
                    options={[{ name: "" }]}
                    type="SELLER"
                    errors={errors}
                    handleChange={handleChangeConditionSeller}
                  />
                </Grid>
                <Grid item container xs={3}>
                  <AutoCompleteField
                    name={displayNameBasedOnCondition(selectField)}
                    control={control}
                    label={displayLabelBasedOnCondition(selectField)}
                    placeholder=""
                    multiple={false}
                    defaultValue={item}
                    options={[{ name: "" }]}
                    type={selectField}
                    errors={errors}
                    handleChange={handleChangeConditionList}
                  />
                </Grid>
                <Grid item container xs={2}>
                  <TextField
                    type="number"
                    name="minQuantity"
                    label="Số lượng sản phẩm yêu cầu"
                    placeholder=""
                    helperText={errors.minQuantity?.message}
                    {...textfieldProps}
                    fullWidth
                    error={!!errors.minQuantity}
                    required
                    inputRef={register({
                      required: "Số lượng không được trống",
                    })}
                  />
                </Grid>
                <Grid item container xs={2}>
                  <TextField
                    type="number"
                    name="minTotalValue"
                    label="Giá trị sản phẩm yêu cầu"
                    placeholder=""
                    helperText={errors.minTotalValue?.message}
                    {...textfieldProps}
                    fullWidth
                    error={!!errors.minTotalValue}
                    inputRef={register()}
                  />
                </Grid>
              </Grid>
            )}
            {selectField == defaultCondition.product && (
              <Grid item container>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  color="primary"
                  onClick={handleAddProductOfProductList}
                >
                  Thêm sản phẩm
                </Button>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default Condition;
