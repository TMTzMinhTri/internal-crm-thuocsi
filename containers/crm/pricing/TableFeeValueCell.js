import React, { useState } from "react";
import { IconButton, TableCell, TextField } from "@material-ui/core";
import { Done } from "@material-ui/icons";

export const TableFeeValueCell = ({ code, initialFee, onUpdate }) => {
    const [fee, setFee] = useState(initialFee);
    const [focused, setFocused] = useState(false);
    return (
        <TableCell>
            <TextField
                size="small"
                type="number"
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
                    )
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={e => setFee(+e.target.value)}
                value={fee}
            />
        </TableCell>
    )
}