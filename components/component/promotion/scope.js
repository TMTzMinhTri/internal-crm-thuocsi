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
  const { scopeObject, useForm, disabled } = props;

  const { register, errors, getValues } = useForm;

  return (
    <Paper
      elevation={3}
      style={{ padding: "0 30px 20px 30px", margin: "20px 0" }}
    >
      <Grid container direction="column" spacing={2}>
        <Grid item container>
          <h4>PHẠM VI ÁP DỤNG</h4>
        </Grid>
        <Grid item container spacing={4}>
          {scopeObject.map(
            ({ selectField }, index) =>
              selectField != "" && (
                <Grid
                  item
                  container
                  justify="space-between"
                  alignItems="flex-end"
                  xs={12}
                  key={index}
                >
                  <Grid item xs={6} container spacing={3}>
                    <Grid item xs={12}>
                      <AutoCompleteField
                        name={displayNameBasedOnScope(selectField)}
                        label={displayLabelBasedOnScope(selectField)}
                        placeholder=""
                        multiple
                        required
                        defaultValue={[]}
                        options={[{ name: "" }]}
                        type={selectField}
                        useForm={useForm}
                        disabled={disabled}
                      />
                    </Grid>
                  </Grid>
                  {selectField == defaultScope.customerLevel && (
                    <Grid
                      container
                      item
                      xs={6}
                      spacing={3}
                      justify="space-between"
                    >
                      <Grid item xs={6}>
                        <TextField
                          name={"registeredAfter"}
                          label="Được kích hoạt từ ngày"
                          placeholder=""
                          defaultValue=""
                          helperText={errors.registeredAfter?.message}
                          type="datetime-local"
                          {...textfieldProps}
                          InputProps={{
                            readOnly: disabled,
                          }}
                          fullWidth
                          error={!!errors.registeredAfter}
                          inputRef={register()}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          name={"registeredBefore"}
                          label="Được kích hoạt đến ngày"
                          placeholder=""
                          defaultValue=""
                          helperText={errors.registeredBefore?.message}
                          type="datetime-local"
                          {...textfieldProps}
                          InputProps={{
                            readOnly: disabled,
                          }}
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
                </Grid>
              )
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Scope;
