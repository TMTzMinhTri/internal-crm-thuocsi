import { Grid, TextField } from "@material-ui/core";
import React from "react";
import { scopes } from "../constant";
import { displayLabelBasedOnScope } from "../until";
import AutoCompleteField from "./autocomplete-field";
import SelectField from "./select-field";

const Scope = (props) => {
  const { scope, scopeObject, register, errors } = props;

  const { handleChangeSelectField, handleChangeList } = props;

  const { list, startTime, endTime } = scopeObject;

  const top100Films = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "The Godfather", year: 1972 },
    { title: "The Godfather: Part II", year: 1974 },
    { title: "The Dark Knight", year: 2008 },
  ];

  return (
    <>
      <Grid item container xs={6}>
        <SelectField
          handleChange={handleChangeSelectField}
          options={scopes}
          value={scope}
          title="Loại chương trình"
          option="scope"
        />
      </Grid>
      <Grid item container xs={6}>
        <AutoCompleteField
          label={`Danh sách ${displayLabelBasedOnScope(scope)}`}
          placeholder=""
          defaultValue={[]}
          options={top100Films}
          handleChange={handleChangeList("scope")}
        />
      </Grid>
      {scope == "CUSTOMER" && (
        <Grid item container spacing={2}>
          <Grid item container xs={6}>
            <TextField
              id="startTime"
              name="startTime"
              label="Thời gian bắt đầu"
              placeholder=""
              defaultValue={startTime}
              helperText={errors.startTime?.message}
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              error={!!errors.startTime}
              required
              inputRef={register({
                required: "Vui lòng chọn thời gian bắt đầu",
              })}
            />
          </Grid>
          <Grid item container xs={6}>
            <TextField
              id="endTime"
              name="endTime"
              label="Thời gian kết thúc"
              placeholder=""
              defaultValue={endTime}
              helperText={errors.endTime?.message}
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              error={!!errors.endTime}
              required
              inputRef={register({
                required: "Vui lòng chọn thời gian kết thúc",
              })}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Scope;
