import {
    FormControl,
    Grid,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@material-ui/core";
import FormLabel from "@material-ui/core/FormLabel";
import { SellPrices } from "components/global";
import React from "react";
import { Controller } from "react-hook-form";

export const RenderPriceConfig = ({
    name,
    control,
    register,
    hidden,
    errors,
    index,
    defaultIds,
    maxQuantity,
    absoluteDiscount,
    setAbsoluteDiscount
}) => {
    let arrName = name + `[${index}]`;
    if (typeof hidden === 'undefined') {
        hidden = false;
    }

    return (
        <div style={{ width: '100%' }}>
            {
                name === 'retailPrice' ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography gutterBottom>
                                <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                    Loại cài đặt<span style={{ color: 'red' }}>*</span>:
                                </FormLabel>
                            </Typography>
                            <FormControl size="small"
                                style={{ width: '100%' }}>
                                <Controller
                                    rules={{ required: true }}
                                    control={control}
                                    variant="outlined"
                                    size="small"
                                    defaultValue={SellPrices[0]?.value}
                                    name={`${name}.type`}
                                    as={
                                        <Select disabled={hidden}>
                                            {SellPrices?.map((row) => (
                                                <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
                                            ))}
                                        </Select>
                                    }
                                />
                            </FormControl>

                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography gutterBottom>
                                <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                    Giá bán<span style={{ color: 'red' }}>*</span>:
                                </FormLabel>
                            </Typography>
                            <TextField
                                id={`${name}.price`}
                                name={`${name}.price`}
                                size="small"
                                variant="outlined"
                                type="number"
                                disabled={hidden}
                                placeholder=""
                                defaultValue={1000}
                                onChange={(e) => { setAbsoluteDiscount(parseInt(e.target.value, 0) / 2); }}
                                helperText={errors[name] ? errors[name]?.price?.message : ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment
                                        position="end">đ</InputAdornment>,
                                }}
                                style={{ width: '100%' }}
                                error={!!errors[name]?.price}
                                required
                                inputRef={
                                    register({
                                        required: "Vui lòng nhập",
                                        min: {
                                            value: 1,
                                            message: "Vui lòng nhập giá trị giá bán lớn hơn hoặc bằng 1"
                                        },
                                        max: {
                                            value: 100000000,
                                            message: "Vui lòng nhập giá trị giá bán nhỏ hơn hoặc bằng 100000000"
                                        },
                                        valueAsNumber: true, // important

                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                ) : (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography gutterBottom>
                                    <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                        Loại cài đặt<span style={{ color: 'red' }}>*</span>:
                                    </FormLabel>
                                </Typography>
                                <FormControl size="small"
                                    style={{ width: '100%' }}>
                                    <Controller
                                        rules={{ required: true }}
                                        control={control}
                                        size="small"
                                        variant="outlined"
                                        defaultValue={SellPrices[0]?.value}
                                        name={`${arrName}.type`}
                                        as={
                                            <Select disabled={hidden}>
                                                {SellPrices?.map((row) => (
                                                    <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
                                                ))}
                                            </Select>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} />
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography gutterBottom>
                                    <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                        Giá bán<span style={{ color: 'red' }}>*</span>:
                                    </FormLabel>
                                </Typography>
                                <TextField
                                    id={`${arrName}.price`}
                                    name={`${arrName}.price`}
                                    size="small"
                                    type="number"
                                    variant="outlined"
                                    disabled={hidden}
                                    placeholder=""
                                    defaultValue={1000}
                                    error={errors[name] ? !!errors[name][index]?.price : false}
                                    helperText={errors[name] ? errors[name][index]?.price?.message : ''}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment
                                            position="end">đ</InputAdornment>,
                                    }}
                                    style={{ width: '100%' }}
                                    required
                                    inputRef={
                                        register({
                                            required: "Vui lòng nhập",
                                            min: {
                                                value: 1,
                                                message: "Vui lòng nhập giá trị giá bán lớn hơn hoặc bằng 1"
                                            },
                                            max: {
                                                value: 100000000,
                                                message: "Vui lòng nhập giá trị giá bán nhỏ hơn hoặc bằng 100000000"
                                            },
                                            valueAsNumber: true, // important

                                        })
                                    }
                                />
                            </Grid>
                            {/* so luong ap dung */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography gutterBottom>
                                    <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                        Số lượng đặt tối thiểu trên một đơn hàng<span style={{ color: 'red' }}>*</span>:
                                    </FormLabel>
                                </Typography>
                                <TextField
                                    id={`${arrName}.minNumber`}
                                    name={`${arrName}.minNumber`}
                                    size="small"
                                    type="number"
                                    variant="outlined"
                                    disabled={hidden}
                                    placeholder=""
                                    defaultValue={maxQuantity}
                                    error={errors[name] ? !!errors[name][index]?.minNumber : false}
                                    helperText={errors[name] ? errors[name][index]?.minNumber?.message : ''}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{ width: '100%' }}
                                    required
                                    inputRef={
                                        register({
                                            required: "Vui lòng nhập",
                                            min: {
                                                value: 2,
                                                message: "Vui lòng nhập số lượng đặt tối thiểu lớn hơn 2"
                                            },
                                            max: {
                                                value: maxQuantity,
                                                message: "Vui lòng nhập số lượng đặt tối thiểu nhỏ hơn hoặc bằng " + maxQuantity
                                            },
                                            // validate: value => {
                                            //     if (minQuantitys.includes(value)) {
                                            //         return "Số lượng tối thiểu này đã tồn tại"
                                            //     }},
                                            valueAsNumber: true, // important
                                        })
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} />
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography gutterBottom>
                                    <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                        Tỉ lệ phần trăm giảm giá:
                                    </FormLabel>
                                </Typography>
                                <TextField
                                    id={`${arrName}.percentageDiscount`}
                                    name={`${arrName}.percentageDiscount`}
                                    size="small"
                                    type="number"
                                    variant="outlined"
                                    disabled={hidden}
                                    placeholder=""
                                    error={errors[name] ? !!errors[name][index]?.percentageDiscount : false}
                                    helperText={errors[name] ? errors[name][index]?.percentageDiscount?.message : ''}
                                    defaultValue={5}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment
                                            position="end">%</InputAdornment>,
                                    }}
                                    style={{ width: '100%' }}
                                    inputRef={
                                        register({
                                            min: {
                                                value: 0,
                                                message: "Vui lòng nhập tỉ lệ phần trăm giá bán lớn hơn hoặc bằng 0"
                                            },
                                            max: {
                                                value: 50,
                                                message: "Vui lòng nhập tỉ lệ phần trăm giá bán nhỏ hơn hoặc bằng 50"
                                            },
                                            valueAsNumber: true, // important
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography gutterBottom>
                                    <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                        Giảm giá tuyệt đối:
                                    </FormLabel>
                                </Typography>

                                <TextField
                                    id={`${arrName}.absoluteDiscount`}
                                    name={`${arrName}.absoluteDiscount`}
                                    size="small"
                                    variant="outlined"
                                    type="number"
                                    disabled={hidden}
                                    placeholder=""
                                    defaultValue={500}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment
                                            position="end">đ</InputAdornment>,
                                    }}
                                    style={{ width: '100%' }}
                                    error={errors[name] ? !!errors[name][index]?.absoluteDiscount : false}
                                    helperText={errors[name] ? errors[name][index]?.absoluteDiscount?.message : ''}
                                    inputRef={
                                        register({
                                            min: {
                                                value: 0,
                                                message: "Vui lòng nhập giá trị giảm giá tuyệt đối lớn hơn 0 hoặc bằng 0"
                                            },
                                            max: {
                                                value: absoluteDiscount,
                                                message: "Vui lòng nhập giá trị giảm giá tuyệt đối nhỏ hơn hoặc bằng " + absoluteDiscount
                                            },
                                            valueAsNumber: true, // important
                                        })
                                    }
                                />
                            </Grid>
                        </Grid>
                    )
            }
        </div>
    );
};