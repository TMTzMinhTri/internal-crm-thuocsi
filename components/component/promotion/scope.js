import {
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";

import React from "react";
import { Fragment } from "react";
import { defaultScope } from "../constant";
import { displayLabelBasedOnScope, displayNameBasedOnScope } from "../util";
import AutoCompleteField from "./autocomplete-field";
import { textfieldProps } from "./infomation-fields";

const Scope = (props) => {
  const { scopeObject, register, errors, getValues, control } = props;

  const { handleChangeScopeList } = props;

  console.log(scopeObject, "scopeObject");

  return (
    <Paper
      elevation={3}
      style={{ padding: "0 30px 20px 30px", margin: "20px 0" }}
    >
      <Grid container direction="column">
        <Grid item container>
          <h4>PHẠM VI ÁP DỤNG</h4>
        </Grid>
        <Grid item container xs={12} spacing={4} alignItems="flex-end">
          {scopeObject.map(
            ({ registeredBefore, registeredAfter, selectField, list }, index) =>
              selectField != "" && (
                <Fragment key={index}>
                  <Grid item container xs={6} spacing={3}>
                    <Grid item xs={12}>
                      <AutoCompleteField
                        control={control}
                        name={displayNameBasedOnScope(selectField)}
                        label={displayLabelBasedOnScope(selectField)}
                        required={false}
                        placeholder=""
                        defaultValue={list}
                        options={[{ name: "" }]}
                        type={selectField}
                        handleChange={handleChangeScopeList(index)}
                      />
                    </Grid>
                  </Grid>
                  {selectField == defaultScope.customerLevel && (
                    <Grid container item xs={6} spacing={3}>
                      <Grid item container xs={6}>
                        <TextField
                          id={"registeredAfter"}
                          name={"registeredAfter"}
                          label="Được kích hoạt từ ngày"
                          placeholder=""
                          defaultValue={registeredAfter}
                          helperText={errors.registeredAfter?.message}
                          type="datetime-local"
                          {...textfieldProps}
                          fullWidth
                          error={!!errors.registeredAfter}
                          inputRef={register()}
                        />
                      </Grid>
                      <Grid item container xs={6}>
                        <TextField
                          id={"registeredBefore"}
                          name={"registeredBefore"}
                          label="Được kích hoạt đến ngày"
                          placeholder=""
                          defaultValue={registeredBefore}
                          helperText={errors.registeredBefore?.message}
                          type="datetime-local"
                          {...textfieldProps}
                          fullWidth
                          error={!!errors.registeredBefore}
                          inputRef={register({
                            min: {
                              value: getValues("registeredAfter"),
                              message:
                                "Thời gian sau phải lớn hơn thời gian trước",
                            },
                          })}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Fragment>
              )
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Scope;
