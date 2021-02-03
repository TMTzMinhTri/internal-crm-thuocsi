import React from "react";
import { CardContent, Grid } from "@material-ui/core";

import styles from "./promotion.module.css";

import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import makeStyles from "@material-ui/core/styles/makeStyles";

import Scope from "./scope";
import Condition from "./condition";
import Reward from "./reward";

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

  const { errors, register, object, textField, setValue, control } = props;

  const {
    handleChangeProductListOfCondition,
    handleChangeTextField,
    handleChangeScopeList,
    handleChangeScopeField,
    handleAddScopeSelect,
    handleChangeConditionField,
    handleChangeRewardField,
    handleChangeListReward,
    handleAddProductOfProductList,
    handleRemoveProductOfProductList,
    handleAddAttachedProduct,
    handleRemoveAttachedProduct,
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
              <Grid container>
                <h4>PHẠM VI ÁP DỤNG</h4>
              </Grid>
              <Scope
                register={register}
                errors={errors}
                handleAddScopeSelect={handleAddScopeSelect}
                handleChangeScopeField={handleChangeScopeField}
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
              <Grid container>
                <h4>ĐIỀU KIỆN ÁP DỤNG KHUYẾN MÃI</h4>
              </Grid>
              <Condition
                control={control}
                register={register}
                errors={errors}
                handleChangeProductListOfCondition={
                  handleChangeProductListOfCondition
                }
                handleAddProductOfProductList={handleAddProductOfProductList}
                handleRemoveProductOfProductList={
                  handleRemoveProductOfProductList
                }
                handleChangeConditionField={handleChangeConditionField}
                scope={scopeObject}
                setValue={setValue}
                condition={conditionObject}
              />
            </Grid>
            <Grid
              container
              className={styles.marginLine}
              spacing={2}
              direction="column"
            >
              <Grid container>
                <h4>GIÁ TRỊ KHUYẾN MÃI</h4>
              </Grid>
              <Reward
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
              <TextareaAutosize
                className={classess.textarea}
                rowsMin={20}
                rowsMax={20}
                style={{ width: "100% !important" }}
                aria-label="maximum height"
                placeholder="Nhập mô tả"
                value={descriptionField}
                onChange={handleChangeTextField("descriptionField")}
              />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};

export default ConditionFields;
