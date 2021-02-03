import { Button, Grid, Paper, TextField } from "@material-ui/core";
import { Add } from "@material-ui/icons";

import React from "react";
import { scopes } from "../constant";
import { displayLabelBasedOnScope } from "../until";
import AutoCompleteField from "./autocomplete-field";
import SelectField from "./select-field";

const Scope = (props) => {
  const { scopeObject, register, errors } = props;

  const {
    handleChangeScopeField,
    handleChangeScopeList,
    handleAddScopeSelect,
  } = props;

  return (
    <>
      {scopeObject.map(
        ({ registeredBefore, registeredAfter, selectField, list }, index) => (
          <Paper variant="outlined" style={{ padding: 10, margin: "10px 0" }}>
            <Grid container spacing={2} direction="column">
              <Grid item container xs={6}>
                <SelectField
                  handleChange={handleChangeScopeField(index, "selectField")}
                  options={scopes}
                  value={selectField}
                  title="Loại chương trình"
                  option="scope"
                />
              </Grid>
              {selectField != "" && (
                <>
                  <Grid item container xs={6}>
                    <AutoCompleteField
                      label={`Danh sách ${displayLabelBasedOnScope(
                        selectField
                      )}`}
                      placeholder=""
                      defaultValue={list}
                      options={[{ name: "" }]}
                      type={selectField}
                      handleChange={handleChangeScopeList(index)}
                    />
                  </Grid>
                  {selectField == "CUSTOMER" && (
                    <Grid item container spacing={2}>
                      <Grid item container xs={6}>
                        <TextField
                          id={"registeredBefore" + index}
                          name={"registeredBefore" + index}
                          label="Đăng kí trước ngày"
                          placeholder=""
                          defaultValue={registeredBefore}
                          helperText={errors.registeredBefore?.message}
                          type="datetime-local"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          error={!!errors.registeredBefore}
                        />
                      </Grid>
                      <Grid item container xs={6}>
                        <TextField
                          id={"registeredAfter" + index}
                          name={"registeredAfter" + index}
                          label="Đăng kí sau ngày"
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
                            required: "Vui lòng chọn thời gian kết thúc",
                          })}
                        />
                      </Grid>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Paper>
        )
      )}
      <Grid>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddScopeSelect}
        ></Button>
      </Grid>
    </>
  );
};

export default Scope;
