import {FormControlLabel} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import React from "react";

export const FormSwitch = ({name, value, register, control, defaultValue,setValue,labelSuccess,labelError,getValue}) => {
    return (
        <FormControlLabel
            control={<Switch defaultChecked={defaultValue} color={"primary"} onChange={(event, checked) => {
                setValue(name,checked)
            }} />}
            name={name}
            inputRef={register}
            label={getValue()[name] === true ? labelSuccess : labelError}
        />
    );
};
