import {
    IconButton,
    TableCell,
    // eslint-disable-next-line no-unused-vars
    TableCellProps,
    TextField,
    // eslint-disable-next-line no-unused-vars
    TextFieldProps,
} from "@material-ui/core";
import { Done } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
/**
 * 
 * @param {object} props 
 * @param {string} props.code
 * @param {number} props.initialFee
 * @param {Function} props.onUpdate
 * @param {TextFieldProps} props.TextFieldProps
 */
export const TableFeeValueCell = ({
    code,
    initialFee,
    onUpdate,
    TextFieldProps,
    ...others
}) => {
    const [fee, setFee] = useState(initialFee);
    const [focused, setFocused] = useState(false);
    useEffect(() => {
        setFee(initialFee);
    }, [initialFee]);
    return (
        <TableCell {...others}>
            <TextField
                size="small"
                type="number"
                placeholder="..."
                variant="outlined"
                fullWidth
                InputProps={{
                    endAdornment: (
                        (focused || fee != initialFee) && (
                            < IconButton
                                size="small"
                                color="primary"
                                disabled={fee == initialFee}
                                onClick={() => {
                                    onUpdate?.({ code, fee });
                                    setFocused(false);
                                }}
                            >
                                <Done />
                            </IconButton>
                        )
                    ),
                }}
                inputProps={{
                    min: 0
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={e => setFee(+e.target.value)}
                value={fee}
                {...TextFieldProps}
            />
        </TableCell>
    )
}