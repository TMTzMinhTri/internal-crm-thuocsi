import React from "react";

import { FormControl, InputLabel, NativeSelect } from "@material-ui/core";

const SelectField = (props) => {
  const {
    title = "Theo loại chương trình",
    value = "",
    options = [
      {
        value: "",
        label: "None",
      },
      {
        value: 10,
        label: "Ten",
      },
    ],
    option,
  } = props;

  console.log(value, "value");

  const { handleChange } = props;
  return (
    <FormControl fullWidth required>
      <InputLabel shrink>{title}</InputLabel>
      <NativeSelect
        placeholder="12312"
        value={value}
        onChange={handleChange(option)}
      >
        {options.map((o) => (
          <option value={o.value}>{o.label}</option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

export default SelectField;
