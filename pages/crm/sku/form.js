import {
    Accordion, AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box, Button, ButtonGroup, Divider,
    FormControl, Grid,
    InputAdornment, MenuItem, Paper,
    Select, TextField, Card, CardContent,
    Tooltip,
    Typography
} from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HelpOutlinedIcon from "@material-ui/icons/HelpOutlined";
import { getPriceClient } from "client/price";
import { NotFound } from "components/components-global";
import { Brand, SellPrices } from "components/global";
import MuiMultipleAuto from "components/muiauto/multiple";
import MuiSingleAuto from "components/muiauto/single";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./pricing.module.css";

const RenderPriceConfig = ({ name, control, register, clearErrors, hidden, errors, index, getValues, defaultIds, setValue, maxQuantity, absoluteDiscount, setAbsoluteDiscount ,minQuantitys}) => {

    let arrName = name + `[${index}]`
    if (typeof hidden === 'undefined') {
        hidden = false
    }

    let currentIdx = defaultIds.indexOf(index)

    let downIdx = -1
    let upIdx = -1
    if (currentIdx > 0) {
        downIdx = defaultIds[currentIdx - 1]
    }
    if (currentIdx < defaultIds.length - 1) {
        upIdx = defaultIds[currentIdx + 1]
    }


    return (
        <div style={{ width: '100%' }}>
            {
                name === 'retailPrice' ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography gutterBottom>
                                <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                Loại cài đặt<span style={{color: 'red'}}>*</span>:
                                </FormLabel>
                            </Typography>
                            <FormControl className={styles.formControl} size="small"
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
                                    Giá bán<span style={{color: 'red'}}>*</span>:
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
                                onChange={(e)=>{setAbsoluteDiscount(parseInt(e.target.value, 0) / 2)}}
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
                                    Loại cài đặt<span style={{color: 'red'}}>*</span>:
                                    </FormLabel>
                                </Typography>
                                <FormControl className={styles.formControl} size="small"
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
                                        Giá bán<span style={{color: 'red'}}>*</span>:
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
                                    Số lượng tối thiểu áp dụng<span style={{color: 'red'}}>*</span>:
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
                                                message: "Vui lòng nhập số lượng tối thiểu lớn hơn 2"
                                            },
                                            max: {
                                                value: maxQuantity,
                                                message: "Vui lòng nhập số lượng tối thiểu nhỏ hơn hoặc bằng " + maxQuantity
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
                                    helperText={errors.name?.message}
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
    )
}

export default function renderForm(props, toast) {
    if (props.status && props.status !== "OK") {
        return (
            <NotFound link='/crm/sku' titlePage="Thông tin cài đặt giá" labelLink="sản phẩm" />
        )
    }

    const { register, handleSubmit, errors, reset, control, getValues, setValue, clearErrors, setError } = useForm({
        mode: 'onSubmit', defaultValues: props.price || {
            productCode: [],
            tagsName: [],
            brand: "LOCAL"
        }
    });
    const [, setLoading] = useState(false);
    const { error, success } = toast;
    const [defaultIds, setDefaultIds] = useState(props.price?.wholesalePrice?.map((value, ind) => ind) || [])
    const [ids] = useState([]);
    const [idDeleteds] = useState([]);
    const [expandeds, setExpandeds] = useState(props.price?.wholesalePrice?.map(() => true) || []);
    const [listTag] = useState(props.listTag);
    const [brand, setBrand] = useState(getValues('brand') || 'LOCAL');
    const [categoryCode, setCategoryCode] = useState(props.product?.categoryCodes || []);
    const [limitQty] = useState(2);
    const [hidden, setHidden] = useState(true);
    const [maxQuantity, setMaxQuantity] = useState(props.price?.maxQuantity || 10);
    const [absoluteDiscount, setAbsoluteDiscount] = useState((props.price?.retailPrice.price) / 2 || 500);
    const [minQuantitys, setMinQuantitys] = useState(props.price?.wholesalePrice?.map(v => {v.minNumber})|| [])
    const router = useRouter();
    let sellerCode = "MedX";
    // tamnt
    const [incrId, setIncrId] = useState(0);

    // func onSubmit used because useForm not working with some fields
    async function createNewPricing(formData) {
        let code = formData.productCode?.value.code
        setLoading(true);
        formData.sellerCode = props.sellerCode
        formData.productCode = code
        formData.tags = [];
        formData.tagsName?.forEach((tag) => {
            formData.tags.push(tag.value)
        })
        let wholesale = formData.wholesalePrice?.filter((item) => item && item.type !== "")
        formData.wholesalePrice = wholesale

        let _client = getPriceClient()

        let result = await _client.createNewPricing(formData)
        setLoading(false);
        if (result.status === "OK") {
            success(result.message ? 'Thao tác thành công' : 'Thông báo không xác định')
            router.push(`/crm/sku`)
        } else {
            error(result.message || 'Thao tác không thành công, vui lòng thử lại sau')
        }
    }

    async function updatePricing(formData) {
        formData.sellPriceId = props.price?.sellPriceId
        formData.sellerCode = props.price?.sellerCode
        formData.productCode = props.product?.code
        formData.categoryCodes = categoryCode;
        formData.tags = [];
        formData.tagsName?.forEach((tag) => {
            formData.tags.push(tag.value)
        })

        let wholesale = formData.wholesalePrice?.filter((item) => item && item.type !== "")
        formData.wholesalePrice = wholesale
        setLoading(true);
        let _client = getPriceClient()
        let result = await _client.updatePrice(formData)
        setLoading(false);
        if (result.status === "OK") {
            success(result.message ? 'Cập nhật thông tin thành công' : 'Có lỗi xảy ra')
        } else {
            error(result.message || 'Cập nhật thông tin không thành công')
        }
    }

    // func submit data
    async function onSubmit(formData) {

        try {
            formData.categoryCodes = categoryCode;
            formData.sellerCode = sellerCode;
            if (typeof props.product === "undefined") {
                await createNewPricing(formData)
            } else {
                await updatePricing(formData)
            }
        } catch (err) {
            setLoading(false);
            error(err.message || err.toString())
        }
    }
    let lstOptions = props?.products
    function updateCategoryCode(data) {
        if (data && data.value && data.value.categoryCodes) {
            setCategoryCode(data.value.categoryCodes);
            setHidden(false)
            return
        }
        setHidden(true);
    }

    return (
        <AppCRM select="/crm/sku">
            <Head>
                <title>{typeof props.product === "undefined" ? 'Thêm cài đặt giá' : 'Cập nhật cài đặt giá'}</title>
            </Head>
            <Box component={Paper} display="block">
                <form noValidate>
                    <Box className={styles.contentPadding}>
                        <Box style={{ fontSize: 30, margin: 5 }}>
                            Thông tin cài đặt giá
                        </Box>
                        <Box style={{ margin: 10 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={6}>
                                    {
                                        props.isUpdate === true ? (
                                            // Case 1: Product can not change
                                            <Typography gutterBottom>
                                                Sản phẩm: <b>{props.product?.name}</b>
                                            </Typography>
                                        ) : (
                                                // Case 2: Select product
                                                <div>
                                                   <FormControl style={{width: '100%'}} size="small">
                                                        <Typography gutterBottom>
                                                            <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                                                Sản phẩm<span style={{color: 'red'}}>*</span>:
                                                            </FormLabel>
                                                        </Typography>
                                                        <MuiSingleAuto
                                                            name="productCode"
                                                            control={control}
                                                            errors={errors}
                                                            message="Vui lòng chọn sản phẩm"
                                                            placeholder="Chọn sản phẩm"
                                                            options={lstOptions}
                                                            onValueChange={updateCategoryCode}
                                                        />
                                                    </FormControl>
                                                </div>
                                            )
                                        }
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <FormControl style={{width: '100%'}} size="small">
                                            <Typography gutterBottom>
                                                <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                                    Tag:
                                                </FormLabel>
                                            </Typography>
                                            <MuiMultipleAuto
                                                name="tagsName"
                                                control={control}
                                                errors={errors}
                                                message="Vui lòng nhập"
                                                placeholder="Chọn"
                                                options={listTag}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <FormControl style={{width: '100%'}} size="small">
                                            <Typography gutterBottom>
                                                <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                                    Brand<span style={{color: 'red'}}>*</span>:
                                                </FormLabel>
                                            </Typography>
                                            <Controller
                                                rules={{ required: true }}
                                                control={control}
                                                defaultValue={brand}
                                                name="brand"
                                                as={
                                                    <RadioGroup
                                                        aria-label="brand"
                                                        value={brand}
                                                        onChange={(e) => setBrand(e.target.value)}
                                                        className={styles.displayFlex}
                                                    >
                                                        <FormControlLabel
                                                            value="LOCAL"
                                                            control={<Radio color="primary" />}
                                                            label={Brand.LOCAL.value}
                                                        />
                                                        <FormControlLabel
                                                            value="FOREIGN"
                                                            control={<Radio color="primary" />}
                                                            label={Brand.FOREIGN.value}
                                                        />
                                                    </RadioGroup>
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={3}>
                                        <FormControl style={{width: '100%'}} size="small">
                                            <Typography gutterBottom>
                                                <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                                    Số lượng tối đa<span style={{color: 'red'}}>*</span>:
                                                </FormLabel>
                                            </Typography>
                                            <TextField
                                                id="maxQuantity"
                                                name="maxQuantity"
                                                variant="outlined"
                                                size="small"
                                                type="number"
                                                placeholder=""
                                                disabled={hidden === true && !props.isUpdate}
                                                defaultValue={maxQuantity}
                                                onChange={(e)=>{setMaxQuantity(e.target.value)}}
                                                helperText={errors?.maxQuantity ? "Vui lòng nhập" : null}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                style={{ width: '100%' }}
                                                error={!!errors.maxQuantity}
                                                required
                                                inputRef={
                                                    register({
                                                        required: true,
                                                        min: {
                                                            value: 2,
                                                            message: "Vui lòng nhập số lượng tối đa áp dụng lớn hơn hoặc bằng 2"
                                                        },
                                                        valueAsNumber: true, // important,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <Typography gutterBottom variant={'h6'} style={{ fontWeight: 'bold', color: 'black' }}>
                                            Cài đặt giá bán lẻ:
                                        <Tooltip title="Cài đặt bán lẻ, bắt buộc nhập" placement="right-start">
                                            <HelpOutlinedIcon fontSize="small" />
                                        </Tooltip>
                                    </Typography>
                                    <Card>
                                        <CardContent>
                                            <RenderPriceConfig name={'retailPrice'} control={control} register={register} clearErrors={clearErrors} setValue={setValue} maxQuantity={maxQuantity} setAbsoluteDiscount={setAbsoluteDiscount}
                                            hidden={hidden === true && !props.isUpdate} errors={errors} index={0} getValues={getValues} limitQty={limitQty} ids={ids} defaultIds={defaultIds} idDeleteds={idDeleteds} />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} style={{ marginTop: '10px' }}>
                                    <Typography gutterBottom variant={'h6'} style={{ fontWeight: 'bold', color: 'black' }}>
                                        Cài đặt giá bán buôn:
                                        <Tooltip title="Danh sách cài đặt bán buôn (bán sỉ)" placement="right-start">
                                            <HelpOutlinedIcon fontSize="small" />
                                        </Tooltip>
                                    </Typography>
                                    {
                                        defaultIds.length > 0 ? defaultIds.map((num, idx) => (
                                            <div key={num} style={{ marginTop: 10 }}>
                                                <Accordion style={{ backgroundColor: '#f8faf8', paddingTop: '5px' }} expanded={expandeds ? expandeds[idx] : false} onChange={() => {
                                                    {
                                                        let tmpExpandeds = [...expandeds]
                                                        tmpExpandeds[idx] = !tmpExpandeds[idx]
                                                        setExpandeds(tmpExpandeds)
                                                    };
                                                }}>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1bh-content"
                                                        onClick={(e) => e.stopPropagation()}
                                                        id="panel1bh-header"
                                                    >
                                                        <Typography gutterBottom>
                                                            <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                                            Cài đặt giá bán buôn (bán sỉ) thứ {idx + 1}
                                                            </FormLabel>
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <RenderPriceConfig name={`wholesalePrice`} control={control} clearErrors={clearErrors} setValue={setValue}
                                                         maxQuantity={maxQuantity} absoluteDiscount={absoluteDiscount} minQuantitys={minQuantitys}
                                                            register={register} errors={errors} index={num} getValues={getValues} limitQty={limitQty} ids={ids} defaultIds={defaultIds} idDeleteds={idDeleteds} />
                                                    </AccordionDetails>
                                                    <AccordionActions>
                                                        <Button size="small" color="secondary" variant="contained"
                                                            startIcon={<DeleteIcon />}
                                                            onClick={() => {
                                                                setIncrId(incrId + 1)
                                                                setDefaultIds(defaultIds.filter((_id) => _id !== num))
                                                                setExpandeds(expandeds.filter((val, index) => index !== idx))
                                                            }}>Xóa</Button>
                                                    </AccordionActions>
                                                </Accordion>
                                            </div>
                                        )) :
                                            <div />
                                    }
                                    {/* edit */}
                                    {props.isUpdate ? <Button
                                        color="primary"
                                        disabled={(typeof props.product === "undefined" && !getValues().productCode) || (defaultIds.length === 5)}
                                        style={{ marginTop: '10px', display: defaultIds.length === 5 ? 'none' : '' }}
                                        onClick={() => {
                                            let mId = defaultIds.length - 1 <= 0 ? incrId + defaultIds.length : defaultIds.length + incrId + 1
                                            setDefaultIds([...defaultIds, mId + 1]);
                                            setExpandeds([...expandeds, true])
                                        }}
                                        startIcon={<AddIcon />}
                                    >
                                        Thêm giá bán buôn
                                    </Button> :
                                        <Button
                                            color="primary"
                                            disabled={(hidden === true) || (defaultIds.length === 5)}
                                            style={{ marginTop: '10px' }}
                                            onClick={() => {
                                                let mId = defaultIds.length - 1 <= 0 ? incrId + defaultIds.length : defaultIds.length + incrId + 1
                                                setDefaultIds([...defaultIds, mId + 1]);
                                                setExpandeds([...expandeds, true])
                                            }}
                                            startIcon={<AddIcon />}
                                        >
                                            Thêm giá bán buôn
                                    </Button>
                                    }

                                </Grid>
                            </Grid>
                        </Box>
                        <Divider style={{ margin: '10px' }} />
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={(typeof props.product === "undefined" && !getValues().productCode) || (hidden === true && !props.isUpdate)}
                                onClick={handleSubmit(onSubmit)}
                                style={{ margin: 8 }}>
                                Lưu
                            </Button>
                            {
                                typeof props.product === "undefined" ? (
                                    <Button variant="contained" type="reset" onClick={() => reset()} style={{ margin: 8 }}>Làm mới</Button>
                                ) : (
                                        <Link href="/crm/sku">
                                            <ButtonGroup>
                                                <Button variant="contained">Quay lại</Button>
                                            </ButtonGroup>
                                        </Link>
                                    )
                            }
                        </Box>
                    </Box>
                </form>
            </Box>
        </AppCRM>
    )
}
