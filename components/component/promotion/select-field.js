import React from "react";

import {
  FormControl,
  FormHelperText,
  InputLabel,
  NativeSelect,
} from "@material-ui/core";
import { Controller } from "react-hook-form";

const SelectField = (props) => {
  const {
    title,
    value,
    options,
    name,
    control,
    errors,
    required = true,
  } = props;

  const { handleChange } = props;

  return (
    <FormControl
      fullWidth
      required={required}
      error={errors[name] && !!errors[name]}
    >
      <InputLabel shrink>{title}</InputLabel>
      <Controller
        render={(props) => (
          <NativeSelect
            placeholder=""
            value={props.value}
            onChange={(event) => {
              handleChange(event);
              props.onChange(event);
            }}
          >
            {options.map((o, index) => (
              <option key={index} value={o.value}>
                {o.label}
              </option>
            ))}
          </NativeSelect>
        )}
        name={name}
        control={control}
        defaultValue={value}
      />
      <FormHelperText>{errors[name]?.message}</FormHelperText>
    </FormControl>
  );
};

export default SelectField;
