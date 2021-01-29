import React from "react";

import { FormControl, InputLabel, NativeSelect } from "@material-ui/core";

const SelectField = (props) => {
  const {
    title = "Theo loại chương trình",
    value = "",
    data = [
      {
        value: "",
        label: "None",
      },
      {
        value: 10,
        label: "Ten",
      },
    ],
  } = props;

  const { handleChange } = props;
  return (
    <FormControl required style={{ minWidth: 200, margin: 10 }}>
      <InputLabel shrink>{title}</InputLabel>
      <NativeSelect value={value} onChange={handleChange} defaultValue="">
        {data.map((o) => (
          <option value={o.value}>{o.label}</option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};

export default SelectField;
