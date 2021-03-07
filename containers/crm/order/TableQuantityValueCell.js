import { IconButton, TableCell, TextField } from "@material-ui/core";
import { Done } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const TableQuantityValueCell = ({ disabled, orderNo, orderItemNo, initialQuantity, onUpdate, maxQuantity, defaultQuantity, onChange }) => {

    const [quantity, setQuantity] = useState(initialQuantity);
    const [focused, setFocused] = useState(false);
    const { watch, register, handleSubmit, errors, control, getValues, setError, clearErrors } = useForm({
        mode: "onChange",
        defaultValues: {
            quantity: quantity
        }
    });

    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);

    return (
        <TableCell>
            <form >
                <TextField
                    size="small"
                    id="quantity"
                    name="quantity"
                    type="number"
                    onKeyPress={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault()
                        }
                    }}
                    disabled={disabled}
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
                    helperText={errors.quantity?.message}
                    inputRef={register(
                        {
                            required: "Vui lòng nhập số lượng",
                            min: {
                                value: 1,
                                message: "Vui lòng nhập số lượng lớn hơn bằng 1"
                            },
                            max: {
                                value: maxQuantity,
                                message: `Vui lòng nhập số lượng bé hơn bằng ${maxQuantity}`
                            }
                        },

                    )}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={e => {
                        setQuantity(+e.target.value)
                        onChange(e.target.value)
                    }}
                />
            </form>
        </TableCell>
    )
}
