import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useDebounce from "components/useDebounce";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

const MuiMultipleAutocomplete = withStyles({
    tag: {
        height: 'auto',
        "& .MuiChip-label": {
            paddingBottom: '3px',
            paddingTop: '3px',
            whiteSpace: 'normal',
            overflowWrap: 'anywhere'
        }
    }
})(Autocomplete);

/**
 * @param {object} props
 * @param {string} props.name - field name
 * @param {any[]} props.options - autocomplete options
 * @param {string} props.label - label
 * @param {string} props.placeholder - placeholder
 * @param {boolean} props.required - required option
 * @param {string} props.message - error message
 * @param {Function} props.onFieldChange
 * @param {object} props.control
 * @param {boolean} props.disabled
 * @param {object} props.errors
 * @param {string} props.variant
 */
const MuiMultipleAuto = ({
    name,
    options,
    label,
    placeholder,
    required = false,
    message,
    onFieldChange,
    control,
    disabled = false,
    errors,
    variant = 'outlined'
}) => {

    const hasError = typeof errors[`${name}`] !== 'undefined';
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);
    const [qOptions, setQOptions] = useState(options);
    const debouncedSearch = useDebounce(q?.trim(), 200);

    useEffect(() => {
        if (debouncedSearch || open == true) {
            if (typeof onFieldChange !== 'undefined') {
                onFieldChange(debouncedSearch).then((results) => {
                    setQOptions(results)
                })
            }
        }
    }, [debouncedSearch, q, open]);

    return (
        <div>
            <Controller
                render={({ onChange, ...props }) => (
                    <MuiMultipleAutocomplete
                        id={name}
                        multiple
                        options={qOptions}
                        filterSelectedOptions
                        getOptionLabel={(option) => option.label?.toString()}
                        getOptionSelected={(option, val) => option.value === val.value}
                        noOptionsText="Không tìm thấy kết quả phù hợp"
                        disabled={disabled}
                        onOpen={() => { setQ(''); setOpen(true) }}
                        onClose={() => setOpen(false)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required={required}
                                label={label}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={
                                    hasError ? message : ""
                                }
                                error={hasError}
                                placeholder={placeholder}
                                variant={variant}
                                size="small"
                                onChange={(e) => setQ(e.target.value)}
                            />
                        )}
                        onChange={(e, data) => onChange(data)}
                        {...props}
                    />
                )}
                name={name}
                control={control}
                onChange={([, { id }]) => id}
                rules={{
                    validate: (d) => {
                        if (required && required == true) {
                            console.log("debug with d: ", d)
                            if (typeof d === "undefined" || d?.length == 0) {
                                return "Vui lòng nhập"
                            }
                        }
                    }
                }}
            />
        </div>
    )
}

export default MuiMultipleAuto;
