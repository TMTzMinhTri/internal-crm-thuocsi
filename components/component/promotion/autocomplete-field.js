import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";

const AutoCompleteField = (props) => {
  const { label, options, defaultValue, placeholder } = props;

  const { handleChange } = props;
  return (
    <Autocomplete
      fullWidth
      multiple
      options={options}
      onChange={handleChange}
      getOptionLabel={(option) => option.title}
      defaultValue={defaultValue}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          required
          {...params}
          variant="standard"
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
};

export default AutoCompleteField;
