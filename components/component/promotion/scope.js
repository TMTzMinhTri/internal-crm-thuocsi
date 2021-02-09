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
import { displayLabelBasedOnScope, displayNameBasedOnScope } from "../until";
import AutoCompleteField from "./autocomplete-field";

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
        <Grid item container xs={12} spacing={2} alignItems="flex-end">
          {scopeObject.map(
            ({ registeredBefore, registeredAfter, selectField, list }, index) =>
              selectField != "" && (
                <Fragment key={index}>
                  <Grid item container xs={6}>
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
                  {selectField == defaultScope.customerLevel && (
                    <>
                      <Grid item container xs={3}>
                        <TextField
                          id={"registeredBefore"}
                          name={"registeredBefore"}
                          label="Được kích hoạt từ ngày"
                          placeholder=""
                          defaultValue={registeredBefore}
                          helperText={errors.registeredBefore?.message}
                          type="datetime-local"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          error={!!errors.registeredBefore}
                          inputRef={register({
                            required: "Vui lòng chọn thời gian",
                          })}
                        />
                      </Grid>
                      <Grid item container xs={3}>
                        <TextField
                          id={"registeredAfter"}
                          name={"registeredAfter"}
                          label="Được kích hoạt đến ngày"
                          placeholder=""
                          defaultValue={registeredAfter}
                          helperText={errors.registeredAfter?.message}
                          type="datetime-local"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          error={!!errors.registeredAfter}
                          inputRef={register({
                            required: "Vui lòng chọn thời gian",
                            min: {
                              value: getValues("registeredBefore"),
                              message:
                                "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
                            },
                          })}
                        />
                      </Grid>
                    </>
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
