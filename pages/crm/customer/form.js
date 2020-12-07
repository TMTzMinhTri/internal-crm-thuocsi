import { Box, Button, CardContent, FormGroup, Paper, TextField } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Head from "next/head";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AppCRM from "../../_layout";
import styles from "./customer.module.css";

const levels = [
    {
        value: "Infinity",
    },
    {
        value: "Diamond",
    },
    {
        value: "Platinum",
    },
    {
        value: "Gold",
    },
    {
        value: "Sliver",
    },
];

const statuses = [
    {
        value: "Status 1"
    },
    {
        value: "Status 2"
    },
    {
        value: "Status 3"
    },
]

export default function renderForm(props) {
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit, errors, control} = useForm();
    const onSubmit = async (formData) => {
        console.log(formData)
    }
    return (
        <AppCRM select="/crm/customer">
            <Head>
                <title>Thêm khách hàng</title>
            </Head>
            <Box component={Paper}>
                <FormGroup>
                    <form>
                        <Box className={styles.contentPadding}>
                            <Box style={{fontSize: 24}}>Thêm khách hàng</Box>
                            <CardContent>
                                <Grid spacing={3} container>
                                    <Grid item xs={12} sm={4} md={4}>
                                        <TextField
                                            id="name"
                                            name="name"
                                            label="Tên khách hàng"
                                            placeholder=""
                                            helperText={errors.name?.message}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{width: '100%'}}
                                            error={!!errors.name}
                                            required
                                            inputRef={
                                                register({
                                                    required: "Tên khách hàng không thể để trống",
                                                    maxLength: {
                                                        value: 250,
                                                        message: "Tên khách hàng có độ dài tối đa 250 kí tự"
                                                    },
                                                    minLength: {
                                                        value: 6,
                                                        message: "Tên khách hàng có độ dài tối thiểu 6 kí tự"
                                                    },
                                                    pattern: {
                                                        value: /[A-Za-z]/,
                                                        message: "Tên khách hàng phải có kí tự chữ"
                                                    }
                                                })
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4}>
                                        <TextField
                                            id="email"
                                            name="email"
                                            label="Email"
                                            placeholder=""
                                            type="email"
                                            helperText={errors.email?.message}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{width: '100%'}}
                                            error={!!errors.email}
                                            required
                                            inputRef={
                                                register({
                                                    required: "Email khách hàng không thể để trống",
                                                    pattern: {
                                                        value: /.+@.+[.].+/,
                                                        message: "Email không hợp lệ"
                                                    }
                                                })
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            id="phone"
                                            name="phone"
                                            label="Số điện thoại"
                                            placeholder=""
                                            type="number"
                                            helperText={errors.phone?.message}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{width: '100%'}}
                                            error={!!errors.phone}
                                            required
                                            inputRef={
                                                register({
                                                    required: "Số điện thoại không thể để trống",
                                                    maxLength: {
                                                        value: 12,
                                                        message: "Số điện thoại không hợp lệ"
                                                    },
                                                    pattern: {
                                                        value: /[0-9]{9,12}/,
                                                        message: "Số điện thoại không hợp lệ"
                                                    },
                                                })
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            id="address"
                                            name="address"
                                            label="Địa chỉ"
                                            placeholder=""
                                            helperText={errors.address?.message}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{width: '100%'}}
                                            error={!!errors.address}
                                            required
                                            inputRef={
                                                register({
                                                    required: "Địa chỉ không thể để trống",
                                                })
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            id="legalRepresentative"
                                            name="legalRepresentative"
                                            label="Người đại diện"
                                            placeholder=""
                                            helperText={errors.legalRepresentative?.message}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{width: '100%'}}
                                            error={!!errors.legalRepresentative}
                                            required
                                            inputRef={
                                                register({
                                                    required: "Người đại diện không thể để trống",
                                                })
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            id="mst"
                                            name="mst"
                                            label="Mã số thuế"
                                            placeholder=""
                                            helperText={errors.mst?.message}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{width: '100%'}}
                                            error={!!errors.mst}
                                            required
                                            inputRef={
                                                register({
                                                    required: "Mã số thuế không thể để trống",
                                                })
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Grid container spacing={0} alignItems="center" >
                                            <Grid item xs={10} sm={10} md={10}>
                                                <TextField
                                                    id="licenses"
                                                    name="licenses"
                                                    label="Tài liệu giấy phép"
                                                    disabled
                                                    placeholder=""
                                                    helperText={errors.licenses?.message}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    style={{width: '100%'}}
                                                    error={!!errors.licenses}
                                                    required
                                                    inputRef={
                                                        register({
                                                            required: "Mã số thuế không thể để trống",
                                                        })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={2} sm={2} md={2}>
                                                <label htmlFor="upload-photo" style={{marginBottom: 5}}>
                                                    <input  style={{ display: 'none' }}
                                                            id="upload-photo"
                                                        // onChange={handleFile}
                                                            name="upload-photo"
                                                            type="file"/>
                                                    <Button color="secondary" size="small" variant="contained" component="span">
                                                        <span>Chọn</span>
                                                    </Button>
                                                </label>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <FormControl style={{ width: '100%' }}>
                                            <InputLabel id="department-select-label">Trạng thái</InputLabel>
                                            <Controller
                                                name="status"
                                                control={control}
                                                defaultValue={statuses?statuses[0].value:''}
                                                rules={{required:true}}
                                                error={ !!errors.level }
                                                as={
                                                    <Select label="status">
                                                        {statuses.map(({value}) => (
                                                            <MenuItem value={value} key={value}>{value}</MenuItem>
                                                        ))}
                                                    </Select>
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <FormControl style={{ width: '100%' }}>
                                            <InputLabel id="department-select-label">Cấp độ</InputLabel>
                                            <Controller
                                                name="level"
                                                control={control}
                                                defaultValue={levels?levels[0].value:''}
                                                rules={{required:true}}
                                                error={ !!errors.level }
                                                as={
                                                    <Select label="level">
                                                        {levels.map(({value}) => (
                                                            <MenuItem value={value} key={value}>{value}</MenuItem>
                                                        ))}
                                                    </Select>
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <FormControl style={{ width: '100%' }}>
                                            <InputLabel id="department-select-label">Vai trò</InputLabel>
                                            <Autocomplete
                                                id="combo-box-demo"
                                                options={[{
                                                    title: "123",
                                                }]}
                                                getOptionLabel={(option) => option.title}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <FormControl style={{ width: '100%' }}>
                                            <InputLabel id="department-select-label">Trạng thái</InputLabel>
                                            <Controller
                                                name="status"
                                                control={control}
                                                defaultValue={statuses?statuses[0].value:''}
                                                rules={{required:true}}
                                                error={ !!errors.level }
                                                as={
                                                    <Select label="status">
                                                        {statuses.map(({value}) => (
                                                            <MenuItem value={value} key={value}>{value}</MenuItem>
                                                        ))}
                                                    </Select>
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <FormControl style={{ width: '100%' }}>
                                            <InputLabel id="department-select-label">Trạng thái</InputLabel>
                                            <Controller
                                                name="status"
                                                control={control}
                                                defaultValue={statuses?statuses[0].value:''}
                                                rules={{required:true}}
                                                error={ !!errors.level }
                                                as={
                                                    <Select label="status">
                                                        {statuses.map(({value}) => (
                                                            <MenuItem value={value} key={value}>{value}</MenuItem>
                                                        ))}
                                                    </Select>
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <FormControl style={{ width: '100%' }}>
                                            <InputLabel id="department-select-label">Trạng thái</InputLabel>
                                            <Controller
                                                name="status"
                                                control={control}
                                                defaultValue={statuses?statuses[0].value:''}
                                                rules={{required:true}}
                                                error={ !!errors.level }
                                                as={
                                                    <Select label="status">
                                                        {statuses.map(({value}) => (
                                                            <MenuItem value={value} key={value}>{value}</MenuItem>
                                                        ))}
                                                    </Select>
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Thông tin tài khoản
                                </Typography>
                            </CardContent>
                            <Divider/>
                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={loading}
                                    style={{margin: 8}}>
                                    {loading && <CircularProgress size={20}/>}
                                    Lưu
                                </Button>
                                <Button
                                    variant="contained"
                                    type="reset"
                                    style={{margin: 8}}
                                    disabled={loading}>
                                    {loading && <CircularProgress size={20}/>}
                                    Làm mới
                                </Button>
                            </Box>

                        </Box>
                    </form>
                </FormGroup>
            </Box>
        </AppCRM>
    )
}