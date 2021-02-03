import React from "react";

import { FormControl, InputLabel, NativeSelect } from "@material-ui/core";

const SelectField = (props) => {
  const { title, value, options, error } = props;

  const { handleChange } = props;
  return (
    <FormControl fullWidth required>
      <InputLabel shrink>{title}</InputLabel>
      <NativeSelect placeholder="" value={value} onChange={handleChange}>
        {options.map((o, index) => (
          <option key={index} value={o.value}>
            {o.label}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

export default SelectField;
