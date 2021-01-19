
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useDebounce from "components/useDebounce";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

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
})(Autocomplete); // Fix CSS scroll page when pick long tag

const MuiSingleAuto = ({
    name, // NAME INPUT
    options,  // DATA OPTIONS label-value
    label,  // LABEL
    placeholder,
    required, // boolean
    message, // CUSTOM MESSAGE ERROR
    onFieldChange, // HANDLE EVENT CHANGE
    onNotSearchFieldChange,
    control,  // REACT HOOK FORM CONTROL
    errors})=>{ // REACT HOOK FORM ERRORS 
        
    // TODO

    const hasError =  typeof errors[`${name}`] !== 'undefined';
    const [q, setQ] = useState("");
    const [qOptions, setQOptions] = useState(options);
    const debouncedSearch = useDebounce(q?.trim(), 200);

    if(typeof required === 'undefined') {
        required = false
    }
    useEffect(() => {
        if(debouncedSearch) {
            if (typeof onFieldChange !== 'undefined') {
                onFieldChange(debouncedSearch).then((results) => {
                    setQOptions(results)
                })
            }
        }
    },[debouncedSearch,q]);
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
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required={required}
                                label={label}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                helperText={
                                    hasError?message:""
                                }
                                error={hasError}
                                placeholder={placeholder}
                                variant="outlined"
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
                            if(typeof(onNotSearchFieldChange) === 'function'){
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
                        if (required && required == true) {
                            console.log("debug with d: ", d)
                            if (typeof d === "undefined" || d === null || d?.length == 0) {
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