
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useDebounce from "components/useDebounce";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

const MuiSingleAutocomplete = withStyles({
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
 * @param {Function} props.onNotSearchFieldChange
 * @param {object} props.control
 * @param {boolean} props.disabled
 * @param {object} props.errors
 * @param {string} props.variant
 */
const MuiSingleAuto = ({
    name,
    options,
    label,
    placeholder,
    required,
    message,
    onFieldChange,
    onNotSearchFieldChange,
    control,
    disabled,
    variant,
    errors }) => { // REACT HOOK FORM ERRORS 

    // TODO

    const hasError = typeof errors[`${name}`] !== 'undefined';
    const [q, setQ] = useState("");
    const [qOptions, setQOptions] = useState(options);
    const debouncedSearch = useDebounce(q?.trim(), 200);

    if (typeof required === 'undefined') {
        required = false
    }
    useEffect(() => {
        if (debouncedSearch) {
            if (typeof onFieldChange !== 'undefined') {
                onFieldChange(debouncedSearch).then((results) => {
                    setQOptions(results)
                })
            }
        }
    }, [debouncedSearch, q]);

    useEffect(() => {
        setQOptions(options)
    }, [options])

    // useEffect(() => {
    //   setQOptions(options)
    // },[options]);

    return (
        <div>
            <Controller
                render={({ onChange, ...props }) => (
                    <MuiSingleAutocomplete
                        id={name}
                        options={qOptions}
                        filterSelectedOptions
                        getOptionLabel={(option) => option.label?.toString()}
                        getOptionSelected={(option, val) => option.value === val.value}
                        noOptionsText="Không tìm thấy kết quả phù hợp"
                        disabled={disabled}
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
                                variant={"outlined"}
                                style={{ width: "100%", minWidth: "250px" }}
                                size="small"
                                onBlur={() => {
                                    setQ('')
                                }}
                                onChange={(e) => setQ(e.target.value)}
                            />
                        )}
                        onChange={(e, data) => {
                            onChange(data);
                            if (typeof (onNotSearchFieldChange) === 'function') {
                                onNotSearchFieldChange(e, data)
                            }
                        }}
                        {...props}
                    />
                )}
                name={name}
                control={control}
                onChange={([, { id }]) => id}
                rules={{
                    validate: (d) => {
                        if (required && required === true) {
                            console.log("debug with d: ", d)
                            if (typeof d === "undefined" || d === null || d?.length === 0) {
                                return "Vui lòng nhập"
                            }
                        }
                    }
                }}
            />
        </div>
    )
}

export default MuiSingleAuto;
