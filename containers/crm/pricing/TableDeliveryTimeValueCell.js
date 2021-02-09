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
export const TableDeliveryTimeValueCell = ({
    code,
    initialDeliveryTime,
    onUpdate,
    TextFieldProps,
    ...others
}) => {
    const [deliveryTime, setDeliveryTime] = useState(initialDeliveryTime);
    const [focused, setFocused] = useState(false);
    useEffect(() => {
        setDeliveryTime(initialDeliveryTime);
    }, [initialDeliveryTime]);
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
                        // (focused || deliveryTime != initialDeliveryTime) &&
                        (
                            <>
                                <div>ngày</div>
                                < IconButton
                                    size="small"
                                    color="primary"
                                    disabled={deliveryTime == initialDeliveryTime}
                                    onClick={() => {
                                        onUpdate?.({ code, deliveryTime });
                                        setFocused(false);
                                    }}
                                >
                                    <Done />
                                </IconButton>
                            </>
                        )
                    ),
                }}
                inputProps={{ step: 0.5, min: 0, style: { textAlign: 'right' } }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={e => setDeliveryTime(+e.target.value)}
                value={deliveryTime}
                {...TextFieldProps}
            />
        </TableCell>
    )
}