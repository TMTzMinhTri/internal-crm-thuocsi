import { IconButton, TableCell, TextField } from "@material-ui/core";
import { Done } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

export const TableQuantityCell = ({ code, initialQuantity, onUpdate }) => {
    const [quantity, setQuantity] = useState(initialQuantity);
    const [focused, setFocused] = useState(false);
    useEffect(() => {
        setFee(setQuantity);
    }, [initialQuantity]);
    return (
        <TableCell>
            <TextField
                size="small"
                type="number"
                placeholder="..."
                variant="outlined"
                fullWidth
                InputProps={{
                    endAdornment: (
                        (focused || quantity != initialQuantity) && (
                            < IconButton
                                size="small"
                                color="primary"
                                disabled={quantity == initialQuantity}
                                onClick={() => {
                                    onUpdate?.({ code, quantity });
                                    setFocused(false);
                                }}
                            >
                                <Done />
                            </IconButton>
                        )
                    ),
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={e => setFee(+e.target.value)}
                value={quantity}
            />
        </TableCell>
    )
}
