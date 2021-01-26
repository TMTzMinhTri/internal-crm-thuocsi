import { Box, IconButton, TableCell, TextField } from "@material-ui/core";
import { Done } from "@material-ui/icons";
import React, { useState } from "react";

const defaultProps = {
    bgcolor: 'background.paper',
    borderColor: 'text.primary',
    m: 1,
    border: 1,
    padding: 1,
};

export const TableFeeValueCell = ({ code, initialFee, onUpdate }) => {
    const [fee, setFee] = useState(initialFee);
    const [focused, setFocused] = useState(false);
    return (
        <TableCell>
            <Box borderRadius="borderRadius" {...defaultProps}>
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
                    ),
                    disableUnderline: true      
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={e => setFee(+e.target.value)}
                value={fee}
            />
            </Box>
        </TableCell>
    )
}