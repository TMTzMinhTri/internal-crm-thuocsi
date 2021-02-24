import { IconButton, TableCell, TextField } from "@material-ui/core";
import { Done } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

export const TableQuantityValueCell = ({ watch, handleSubmit, index, orderNo, orderItemNo, initialQuantity, onUpdate, setError, errors, maxQuantity, clearErrors, defaultQuantity, onChange }) => {
    let arrName = `quantity[${index}]`
    const [quantity, setQuantity] = useState(initialQuantity);
    const [focused, setFocused] = useState(false);
    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);
    const submit = data => console.log(data)
    return (
        <TableCell>
            <TextField
                size="small"
                // id="quantity"
                // name="quantity"
                type="number"
                // disabled
                placeholder="..."
                variant="outlined"
                fullWidth
                InputProps={{
                    endAdornment: (
                        (focused || quantity != defaultQuantity) && (
                            < IconButton
                                size="small"
                                color="primary"
                                disabled={quantity == defaultQuantity || errors.quantity}
                                onClick={() => {
                                    onUpdate?.({ orderNo, orderItemNo, quantity });
                                    setFocused(false);
                                }}
                            >
                                <Done />
                            </IconButton>
                        )
                    ),
                }}
                error={!!errors.quantity}
                helperText={errors.quantity?.type == 'min' ? errors.quantity?.message : errors.quantity?.type == 'max' ? errors.quantity?.message : null}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={e => {
                    setQuantity(+e.target.value)
                    if (e.target.value < 1) {
                        setError(arrName, {
                            type: "min",
                            message: "Vui lòng nhập số lượng lớn hơn 0"
                        });
                    }
                    // else if (e.target.value > maxQuantity) {
                    //     setQuantity(maxQuantity)
                    //     setError("quantity", {
                    //         type: "max",
                    //         message: `Vui lòng nhập số lượng nhỏ hơn ${maxQuantity + 1}`
                    //     });
                    // }
                    else {
                        if (errors.quantity) clearErrors("quantity")
                    }
                    onChange(e.target.value)
                    console.log(watch())
                }}
                value={quantity}
            />
        </TableCell>
    )
}