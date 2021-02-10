import { Button, Grid, IconButton, Paper, TextField } from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import { conditions, defaultCondition } from "../constant";
import {
  displayLabelBasedOnCondition,
  displayNameBasedOnCondition,
} from "../util";
import AutoCompleteField from "./autocomplete-field";
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

  const { minValue, productList, list, selectField, seller } = condition;

  return (
    <Paper
      elevation={3}
      style={{ padding: "0px 30px 20px 30px", margin: "20px 0" }}
    >
      <Grid container spacing={2}>
        <Grid item container>
          <h4>GIÁ TRỊ ĐƠN HÀNG</h4>
        </Grid>
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
            inputRef={register()}
          />
        </Grid>
        <Grid item container>
          <h4>ĐIỀU KIỆN THEO ĐƠN HÀNG</h4>
        </Grid>
        <Grid item container xs={6}>
          <SelectField
            name="condition"
            control={control}
            errors={errors}
            required={false}
            handleChange={handleChangeConditionField("selectField")}
            options={conditions}
            value={selectField}
            title="Loại điều kiện"
            option="condition"
          />
        </Grid>
        {selectField != "" && (
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
                    <Grid item container xs={3}>
                      <AutoCompleteField
                        control={control}
                        name={"seller" + index}
                        label="Người bán"
                        placeholder=""
                        defaultValue={o.seller ? o.seller : []}
                        options={[{ name: "" }]}
                        type="SELLER"
                        handleChange={handleChangeProductListOfCondition(
                          index,
                          "SELLER"
                        )}
                      />
                    </Grid>
                    <Grid item container xs={2}>
                      <AutoCompleteField
                        control={control}
                        name={displayNameBasedOnCondition(selectField) + index}
                        label={displayLabelBasedOnCondition(selectField)}
                        placeholder=""
                        multiple={false}
                        defaultValue={o.product ? o.product : []}
                        options={[{ name: "" }]}
                        type={selectField}
                        handleChange={handleChangeProductListOfCondition(
                          index,
                          "PRODUCT"
                        )}
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
                    <Grid item container xs={3}>
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
                    <Grid item xs={1}>
                      <IconButton
                        onClick={() => handleRemoveProductOfProductList(index)}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))
            ) : (
              <Grid item container spacing={2} alignItems="center">
                <Grid item container xs={4}>
                  <AutoCompleteField
                    control={control}
                    name={"seller"}
                    label="Người bán"
                    placeholder=""
                    defaultValue={seller}
                    options={[{ name: "" }]}
                    type="SELLER"
                    handleChange={handleChangeConditionSeller}
                  />
                </Grid>
                <Grid item container xs={4}>
                  <AutoCompleteField
                    name={displayNameBasedOnCondition(selectField)}
                    control={control}
                    label={displayLabelBasedOnCondition(selectField)}
                    placeholder=""
                    multiple={false}
                    defaultValue={list}
                    options={[{ name: "" }]}
                    type={selectField}
                    handleChange={handleChangeConditionList}
                  />
                </Grid>
                <Grid item container xs={3}>
                  <TextField
                    type="number"
                    id={"conditionNumber"}
                    name={"conditionNumber"}
                    label="Số lượng sản phẩm yêu cầu"
                    placeholder=""
                    helperText={errors["conditionNumber"]?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    error={!!errors["conditionNumber"]}
                    required
                    inputRef={register({
                      required: "Số lượng không được trống",
                    })}
                  />
                </Grid>
                <Grid item container xs={3}>
                  <TextField
                    type="number"
                    id={"conditionValue"}
                    name={"conditionValue"}
                    label="Giá trị sản phẩm yêu cầu"
                    placeholder=""
                    helperText={errors["conditionValue"]?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    error={!!errors["conditionValue"]}
                    required
                    inputRef={register({
                      required: "Giá trị không được trống",
                    })}
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
