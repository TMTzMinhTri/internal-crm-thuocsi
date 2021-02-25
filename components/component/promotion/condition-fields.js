import React from "react";
import { CardContent, Grid, Paper, TextField } from "@material-ui/core";

import styles from "./promotion.module.css";

import Scope from "./scope";
import Condition from "./condition";
import Reward from "./reward";

const ConditionFields = (props) => {
  const { object, useForm, disabled } = props;

  const {
    handleChangeConditionField,
    handleChangeRewardField,
    handleAddProductOfProductList,
    handleRemoveProductOfProductList,
    handleAddAttachedProduct,
    handleRemoveAttachedProduct,
  } = props;

  const { errors, register } = useForm;

  const { scopeObject, conditionObject, rewardObject } = object;

  return (
    <>
      <CardContent>
        <Grid container spacing={2} direction="column">
          <Grid item xs={12}>
            <Grid
              container
              className={styles.marginLine}
              spacing={2}
              direction="column"
            >
              <Scope
                scopeObject={scopeObject}
                disabled={disabled}
                useForm={useForm}
              />
            </Grid>
            <Grid
              container
              className={styles.marginLine}
              spacing={2}
              direction="column"
            >
              <Condition
                condition={conditionObject}
                disabled={disabled}
                useForm={useForm}
                handleAddProductOfProductList={handleAddProductOfProductList}
                handleRemoveProductOfProductList={
                  handleRemoveProductOfProductList
                }
                handleChangeConditionField={handleChangeConditionField}
              />
            </Grid>
            <Grid
              container
              className={styles.marginLine}
              spacing={2}
              direction="column"
            >
              <Reward
                reward={rewardObject}
                disabled={disabled}
                useForm={useForm}
                handleChangeRewardField={handleChangeRewardField}
                handleAddAttachedProduct={handleAddAttachedProduct}
                handleRemoveAttachedProduct={handleRemoveAttachedProduct}
              />
            </Grid>

            <Grid
              container
              spacing={2}
              className={styles.marginLine}
              direction="column"
            >
              <Paper
                elevation={3}
                style={{ padding: "0px 30px 30px 30px", margin: "20px 0" }}
              >
                <Grid container direction="column">
                  <Grid item>
                    <h4>
                      Mô tả<span style={{ color: "red" }}> *</span>
                    </h4>
                  </Grid>
                  <Grid item>
                    <TextField
                      name="description"
                      required
                      multiline
                      rows={4}
                      placeholder="Nhập mô tả"
                      defaultValue=""
                      InputProps={{
                        readOnly: disabled,
                      }}
                      variant="outlined"
                      helperText={errors.description?.message}
                      fullWidth
                      error={!!errors.description}
                      inputRef={register({
                        required: "Mô tả không được trống",
                      })}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};

export default ConditionFields;
