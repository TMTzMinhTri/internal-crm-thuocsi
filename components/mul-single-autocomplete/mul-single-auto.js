import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useDebounce from "components/useDebounce";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { withStyles } from "@material-ui/core/styles";

/**
 *  deboudce - OK
    clear all - OK
    load info - OK
    search - OK
    validate required/...
    autofus - PENDINH
    default vaue ? - OK
    translate - OK 
    reset error - PENDING
 * @param {*} param0 
 */

const MulSingleAutocomplete = withStyles({
    tag: {
        height: 'auto',
        "& .MuiChip-label": {
            paddingBottom: '3px',
            paddingTop: '3px',
            whiteSpace: 'normal'
        }
    }
})(Autocomplete); // Fix CSS scroll page when pick long tag

export const SingleAuto = ({
    name, // NAME INPUT
    options,  // DATA OPTIONS label-value
    label,  // LABEL
    message, // CUSTOM MESSAGE ERROR
    onFieldChange, // HANDLE EVENT CHANGE
    control,  // REACT HOOK FORM CONTROL
    errors, width }) => { // REACT HOOK FORM ERRORS 

    // TODO

    const hasError = typeof errors[`${name}`] !== 'undefined';
    const [q, setQ] = useState("");
    const [qOptions, setQOptions] = useState(options);

    return (
        <div>
            <Controller
                render={({ onChange, ...props }) => (
                    <MulSingleAutocomplete
                        id={name}
                        options={qOptions}
                        filterSelectedOptions
                        getOptionLabel={(option) => option.label.toString()}
                        noOptionsText="Không có tùy chọn"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                                label={label}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={
                                    hasError ? message || "Vui lòng chọn giá trị" : ""
                                }
                                error={hasError}
                                placeholder=""
                                variant="outlined"
                                size="small"
                                style={{ width: width || "100%" }}
                                onChange={(e) => {
                                    if (typeof (onFieldChange) === 'function') {

                                        onFieldChange(e.target.value)
                                    }
                                    setQ(e.target.value)
                                }}
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
                        if (typeof d === "undefined" || d?.length == 0) {
                            return "Vui lòng nhập"
                        }
                    },
                    required: "Vui lòng nhập"
                }}
            />
        </div>
    )
}

export const MuiAuto = ({
    name, // NAME INPUT
    options,  // DATA OPTIONS label-value
    label,  // LABEL
    message, // CUSTOM MESSAGE ERROR
    onFieldChange, // HANDLE EVENT CHANGE
    control,  // REACT HOOK FORM CONTROL
    errors, width }) => { // REACT HOOK FORM ERRORS 

    // TODO

    const hasError = typeof errors[`${name}`] !== 'undefined';
    const [q, setQ] = useState("");
    const [qOptions, setQOptions] = useState(options);
    const debouncedSearch = useDebounce(q?.trim(), 200);

    useEffect(() => {
        if (typeof (onFieldChange) === 'function') {
            onFieldChange(debouncedSearch).then((res) => {
                if(res.status === "NOT_FOUND"){
                    setQOptions([])
                }
                setQOptions([...res.map((category) => {
                    return { label: category.name, name: category.name, value: category.code };
                })])
            })
        }
    }, [debouncedSearch, q]);
    return (
        <div>
            <Controller
                render={({ onChange, ...props }) => (
                    <MulSingleAutocomplete
                        id={name}
                        multiple
                        options={qOptions}
                        filterSelectedOptions
                        getOptionLabel={(option) => option.label.toString()}
                        getOptionSelected={(option, val) => option.value === val.value}
                        noOptionsText="Không có tùy chọn"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                                label={label}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={
                                    hasError ? message || "Vui lòng chọn giá trị" : ""
                                }
                                error={hasError}
                                placeholder=""
                                variant="outlined"
                                size="small"
                                onBlur={() => {
                                    setQ('')
                                }}
                                onChange={(e) => {
                                    setQ(e.target.value)
                                }}
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
                        if (typeof d === "undefined" || d?.length == 0) {
                            return "Vui lòng nhập"
                        }
                    },
                    required: "Vui lòng nhập"
                }}
            />
        </div>
    )
}

