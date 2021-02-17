import React from "react";
import { CardContent, Grid } from "@material-ui/core";

import styles from "./promotion.module.css";

import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import makeStyles from "@material-ui/core/styles/makeStyles";

import Scope from "./scope";
import Condition from "./condition";
import Reward from "./reward";
import { Controller } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  root: {
    " .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  textarea: {
    width: "100%",
  },
}));

const ConditionFields = (props) => {
  const classess = useStyles();

  const { errors, register, object, textField, getValues, control } = props;

  const {
    handleChangeProductListOfCondition,
    handleChangeConditionSeller,
    handleChangeScopeList,
    handleChangeConditionField,
    handleChangeRewardField,
    handleChangeListReward,
    handleAddProductOfProductList,
    handleRemoveProductOfProductList,
    handleAddAttachedProduct,
    handleRemoveAttachedProduct,
    handleChangeConditionList,
  } = props;
  const { descriptionField } = textField;

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
                control={control}
                getValues={getValues}
                register={register}
                errors={errors}
                handleChangeScopeList={handleChangeScopeList}
                scopeObject={scopeObject}
              />
            </Grid>
            <Grid
              container
              className={styles.marginLine}
              spacing={2}
              direction="column"
            >
              <Condition
                control={control}
                register={register}
                errors={errors}
                getValues={getValues}
                condition={conditionObject}
                handleChangeConditionSeller={handleChangeConditionSeller}
                handleChangeConditionList={handleChangeConditionList}
                handleChangeProductListOfCondition={
                  handleChangeProductListOfCondition
                }
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
                control={control}
                register={register}
                errors={errors}
                handleChangeRewardField={handleChangeRewardField}
                handleChangeListReward={handleChangeListReward}
                handleAddAttachedProduct={handleAddAttachedProduct}
                handleRemoveAttachedProduct={handleRemoveAttachedProduct}
                reward={rewardObject}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <h4>Mô tả</h4>
            <Grid item xs={6}>
              <Controller
                name="description"
                control={control}
                render={(props) => (
                  <TextareaAutosize
                    style={{
                      borderColor: errors.description ? "red" : "black",
                    }}
                    className={classess.textarea}
                    rowsMin={20}
                    rowsMax={20}
                    placeholder="Nhập mô tả"
                    value={props.value}
                    onChange={props.onChange}
                  />
                )}
              />
              {errors.description && (
                <p style={{ color: "red" }}>{errors.description.message}</p>
              )}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};

export default ConditionFields;
