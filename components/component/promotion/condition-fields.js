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
  const { errors, register, selectFields, object } = props;

  const { handleChangeSelectField, handleChangeList } = props;

  const { scope, condition, reward } = selectFields;

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
                <h3>PHẠM VI ÁP DỤNG</h3>
              </Grid>
              <Scope
                register={register}
                errors={errors}
                handleChangeSelectField={handleChangeSelectField}
                handleChangeList={handleChangeList}
                scope={scope}
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
                <h3>ĐIỀU KIỆN ÁP DỤNG KHUYẾN MÃI</h3>
              </Grid>
              <Condition
                register={register}
                errors={errors}
                handleChangeSelectField={handleChangeSelectField}
                handleChangeList={handleChangeList}
                condition={condition}
                conditionObject={conditionObject}
              />
            </Grid>
            <Grid
              container
              className={styles.marginLine}
              spacing={2}
              direction="column"
            >
              <Grid container>
                <h3>GIÁ TRỊ KHUYẾN MÃI</h3>
              </Grid>
              <Reward
                register={register}
                errors={errors}
                handleChangeSelectField={handleChangeSelectField}
                handleChangeList={handleChangeList}
                reward={reward}
                rewardObject={rewardObject}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <h4>Mô tả</h4>
            <TextareaAutosize
              className={classess.textarea}
              rowsMin={20}
              rowsMax={20}
              style={{ width: "100% !important" }}
              aria-label="maximum height"
              placeholder="Nhập mô tả"
            />
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};

export default ConditionFields;
