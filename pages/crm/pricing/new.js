import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Divider,
    FormControl,
    Grid,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HelpOutlinedIcon from '@material-ui/icons/HelpOutlined';
import Autocomplete from "@material-ui/lab/Autocomplete";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { useToast } from '@thuocsi/nextjs-components/toast/useToast';
import { getPriceClient } from "client/price";
import { getProductClient } from "client/product";
import { SellPrices } from "components/global";
import Head from "next/head";
import AppCRM from "pages/_layout";
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styles from "./pricing.module.css";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadListProduct(ctx)
    })
}

export async function loadListProduct(ctx) {
    let data = {props: {}}
    let _client = getProductClient(ctx, {})
    data.props.products = []
    let products = await _client.getListProduct({})

    if (products.status !== "OK") {
        data.props.products = []
    } else {
        data.props.products = products?.data
    }

    return data
}

export default function NewFromPage(props) {
    return renderWithLoggedInUser(props, render)
}

const RenderPriceConfig = ({name, control, register, setValue, hidden, errors, index}) => {
    let arrName = name + `[${index}]`
    console.log(errors)
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
                        <Grid item xs={12} sm={6} md={4}>
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
                        <Grid item xs={12} sm={6} md={4}>
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
                        <Grid item xs={12} sm={6} md={4}>
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
                        <Grid item xs={12} sm={6} md={4}>
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
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography gutterBottom>
                                Giảm giá tuyệt đối:
                            </Typography>
                            <TextField
                                id={`${name}.absoluteDiscount`}
                                name={`${name}.absoluteDiscount`}
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

function render(props) {
    const {register, handleSubmit, errors, reset, watch, control, getValues, setValue} = useForm({mode: 'onChange'});
    const [loading, setLoading] = useState(false);
    const {error, warn, info, success} = useToast();
    const [ids, setIds] = useState([]);
    const [idDeleteds, setIdDeleteds] = useState([]);
    const [expanded, setExpanded] = React.useState(false);
    let sellerCode = "MedX"

    // func onSubmit used because useForm not working with some fields
    async function createNewPricing(formData) {
        // TODO
        console.log(formData)
        setLoading(true);
        let _client = getPriceClient()
        let result = await _client.createNewPricing(formData)
        setLoading(false);
        if (result.status === "OK") {
            success(result.message ? 'Thao tác thành công' : 'Thông báo không xác định')
        } else {
            error(result.message || 'Thao tác không thành công, vui lòng thử lại sau')
        }
    }

    // func submit data
    async function onSubmit(formData) {
        try {
            formData.sellerCode = sellerCode
            await createNewPricing(formData)
        } catch (err) {
            setLoading(false);
            error(err.message || err.toString())
        }
    }

    const handleChangeSetting = (event) => {
        setValue("condSettingType", event.target.value);
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    let lstOptions = props?.products

    return (
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Thêm cài đặt giá</title>
            </Head>
            <Box component={Paper} display="block">
                <form noValidate>
                    <Box className={styles.contentPadding}>
                        <Box style={{fontSize: 24, margin: 10}}>Thông tin cài đặt giá</Box>
                        <Grid container spacing={3} className={styles.resetMargin}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography gutterBottom>
                                    Sản phẩm:
                                </Typography>
                                <Controller
                                    render={({onChange, ...props}) => (
                                        <Autocomplete
                                            id="productCode"
                                            options={lstOptions}
                                            getOptionLabel={option => option.name}
                                            noOptionsText={'Không tìm thấy kết quả phù hợp'}
                                            renderInput={params => (
                                                <TextField
                                                    {...params}
                                                    error={!!errors.code}
                                                    helperText={errors.code ? "Vui lòng chọn sản phẩm" : ""}
                                                    placeholder="Chọn sản phẩm"
                                                    variant="outlined"
                                                    size="small"
                                                    // onChange={e => setSearchTerm(e.target.value)}
                                                />
                                            )}
                                            onChange={(e, data) => onChange(data.code)}
                                            {...props}
                                        />
                                    )}

                                    name="productCode"
                                    control={control}
                                    onChange={([, {id}]) => id}
                                    rules={{
                                        validate: d => {
                                            return typeof (d) != 'undefined';
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <Typography gutterBottom variant={'h6'}>
                                    Cài đặt giá bán lẻ:
                                    <Tooltip title="Cài đặt bán lẻ, bắt buộc nhập" placement="right-start">
                                        <HelpOutlinedIcon fontSize="small"/>
                                    </Tooltip>
                                </Typography>
                                {/* Setup gia ban le */}
                                {/* <pre>z{JSON.stringify(getValues().productCode?true:false )}</pre> */}
                                <RenderPriceConfig name={'retailPrice'} control={control} register={register}
                                                   hidden={!getValues().productCode} errors={errors} index={0}/>

                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <Typography gutterBottom>
                                    Cài đặt giá bán buôn:
                                    <Tooltip title="Danh sách cài đặt bán buôn (bán sỉ)" placement="right-start">
                                        <HelpOutlinedIcon fontSize="small"/>
                                    </Tooltip>
                                </Typography>
                                {
                                    ids.map((num, idx) => (
                                        <Accordion expanded={expanded === `panel${idx}`} key={idx} onChange={handleChange(`panel${idx}`)}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon/>}
                                                aria-controls="panel1bh-content"
                                                onClick={(e) => e.stopPropagation()}
                                                id="panel1bh-header"
                                            >
                                                <Typography color="textSecondary">
                                                    Cài đặt giá bán buôn (bán sỉ) thứ {idx + 1}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <RenderPriceConfig name={`wholesalePrice`} control={control}
                                                                   register={register} errors={errors} index={idx}/>
                                            </AccordionDetails>
                                            <AccordionActions>
                                                <Button size="small" color="secondary" variant="contained"
                                                        startIcon={<DeleteIcon/>}
                                                        // onClick={() => setIds(ids.filter(id => id !== num))}>Xóa</Button>
                                                        onClick={() => setIdDeleteds([...idDeleteds, num])}>Xóa</Button>
                                            </AccordionActions>
                                        </Accordion>
                                    ))
                                }
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    disabled={!getValues().productCode}
                                    style={{marginTop: '10px'}}
                                    onClick={() => {
                                        setIds([...ids, ids.length + 1])
                                        setExpanded(`panel${ids.length}`)
                                    }}
                                    startIcon={<AddIcon/>}
                                >
                                    Thêm giá bán buôn
                                </Button>
                            </Grid>
                        </Grid>
                        <Divider style={{margin: '10px'}}/>
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={(!getValues().productCode)}
                                onClick={handleSubmit(onSubmit)}
                                style={{margin: 8}}>
                                Lưu
                            </Button>
                            <Button variant="contained" type="reset" style={{margin: 8}}>Làm mới</Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </AppCRM>
    )
}
