import {FormControl, Grid, InputAdornment, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import styles from "./pricing.module.css";
import {Controller} from "react-hook-form";
import {SellPrices} from "../../../components/global";
import React from "react";

export default function RenderPriceConfig({name, control, register, setValue, hidden, errors, index}){
    let arrName = name + `[${index}]`
    return (
        <div>
            {/* gia ban */}
            {
                name === 'retailPrice' ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography gutterBottom>
                                Loại cài đặt:
                            </Typography>
                            <FormControl className={styles.formControl} size="small" variant="outlined"
                                         style={{width: '100%'}}>
                                {/* <InputLabel id="department-select-label">Loại sản phẩm</InputLabel> */}
                                <Controller
                                    disa
                                    rules={{required: true}}
                                    control={control}
                                    size="small"
                                    defaultValue={SellPrices[0].value}
                                    name={`${name}.type`}
                                    variant="outlined"
                                    // error={!!errors.categoryID}
                                    as={
                                        <Select disabled={hidden}>
                                            {SellPrices.map((row) => (
                                                <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
                                            ))}
                                        </Select>
                                    }
                                />
                            </FormControl>

                        </Grid>
                        <Grid item xs={12} sm={12} md={12}/>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography gutterBottom>
                                Giá bán:
                            </Typography>
                            <TextField
                                id={`${name}.price`}
                                name={`${name}.price`}
                                variant="outlined"
                                size="small"
                                type="number"
                                disabled={hidden}
                                // label=""
                                placeholder=""
                                defaultValue={1000}
                                helperText={errors[name]?.price?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment
                                        position="end">đ</InputAdornment>,
                                }}
                                // onChange={(e) => setValue(tag, parseInt(e.target.value,10))}
                                style={{width: '100%'}}
                                error={!!errors[name]?.price}
                                required
                                inputRef={
                                    register({
                                        required: "Vui lòng nhập giá bán",
                                        valueAsNumber: true, // important
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography gutterBottom>
                                Loại cài đặt:
                            </Typography>
                            <FormControl className={styles.formControl} size="small" variant="outlined"
                                         style={{width: '100%'}}>
                                {/* <InputLabel id="department-select-label">Loại sản phẩm</InputLabel> */}
                                <Controller
                                    disa
                                    rules={{required: true}}
                                    control={control}
                                    size="small"
                                    defaultValue={SellPrices[0].value}
                                    name={`${arrName}.type`}
                                    variant="outlined"
                                    // error={!!errors.categoryID}
                                    as={
                                        <Select disabled={hidden}>
                                            {SellPrices.map((row) => (
                                                <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
                                            ))}
                                        </Select>
                                    }
                                />
                            </FormControl>

                        </Grid>
                        <Grid item xs={12} sm={12} md={12}/>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography gutterBottom>
                                Giá bán:
                            </Typography>
                            <TextField
                                id={`${arrName}.price`}
                                name={`${arrName}.price`}
                                variant="outlined"
                                size="small"
                                type="number"
                                disabled={hidden}
                                // label=""
                                placeholder=""
                                defaultValue={1000}
                                error={errors[name] ? !!errors[name][index]?.price : false}
                                helperText={errors[name] ? errors[name][index]?.price?.message: ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment
                                        position="end">đ</InputAdornment>,
                                }}
                                // onChange={(e) => setValue(tag, parseInt(e.target.value,10))}
                                style={{width: '100%'}}
                                // error={errors.name ? true : false}
                                required
                                inputRef={
                                    register({
                                        required: "Vui lòng nhập giá bán",
                                        valueAsNumber: true, // important
                                    })
                                }
                            />
                        </Grid>
                        {/* so luong ap dung */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography gutterBottom>
                                Số lượng tối thiểu áp dụng:
                            </Typography>
                            <TextField
                                id={`${arrName}.minNumber`}
                                name={`${arrName}.minNumber`}
                                variant="outlined"
                                size="small"
                                type="number"
                                disabled={hidden}
                                // label=""
                                placeholder=""
                                defaultValue={1}
                                error={errors[name] ? !!errors[name][index]?.minNumber : false}
                                helperText={errors[name] ? errors[name][index]?.minNumber?.message: ''}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                // onChange={(e) => setValue(tag, parseInt(e.target.value,10))}
                                style={{width: '100%'}}
                                // error={errors.name ? true : false}
                                required
                                inputRef={
                                    register({
                                        required: "Vui lòng nhập",
                                        valueAsNumber: true, // important
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}/>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography gutterBottom>
                                Ti lệ phần trăm giảm giá:
                            </Typography>
                            <TextField
                                id={`${arrName}.percentageDiscount`}
                                name={`${arrName}.percentageDiscount`}
                                variant="outlined"
                                size="small"
                                type="number"
                                disabled={hidden}
                                // label=""
                                placeholder=""
                                error={errors[name] ? !!errors[name][index]?.percentageDiscount : false}
                                helperText={errors[name] ? errors[name][index]?.percentageDiscount?.message: ''}
                                defaultValue={0}
                                // helperText={errors.name?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment
                                        position="end">%</InputAdornment>,
                                }}
                                // onChange={(e) => setValue(tag, parseInt(e.target.value,10))}
                                style={{width: '100%'}}
                                // error={errors.name ? true : false}
                                required
                                inputRef={
                                    register({
                                        required: "Vui lòng nhập",
                                        valueAsNumber: true, // important
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography gutterBottom>
                                Giảm giá tuyệt đối:
                            </Typography>
                            <TextField
                                id={`${arrName}.absoluteDiscount`}
                                name={`${arrName}.absoluteDiscount`}
                                variant="outlined"
                                size="small"
                                type="number"
                                disabled={hidden}
                                // label=""
                                placeholder=""
                                defaultValue={0}
                                // helperText={errors.name?.message}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment
                                        position="end">đ</InputAdornment>,
                                }}
                                // onChange={(e) => setValue(tag, parseInt(e.target.value,10))}
                                style={{width: '100%'}}
                                // error={errors.name ? true : false}
                                required
                                inputRef={
                                    register({
                                        required: "Vui lòng nhập",
                                        valueAsNumber: true, // important
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                )
            }
        </div>
    )
}
