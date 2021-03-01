import {
    IconButton,
    TableCell,
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
                                    }}
                                >
                                    <Done />
                                </IconButton>
                            </>
                        )
                    ),
                }}
                inputProps={{ step: 0.5, min: 0, style: { textAlign: "right" } }}
                onChange={e => setDeliveryTime(+e.target.value)}
                value={deliveryTime}
                {...TextFieldProps}
            />
        </TableCell>
    );
};