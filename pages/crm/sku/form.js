import {
    Accordion, AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box, Button, ButtonGroup, Divider,
    FormControl, Grid,
    InputAdornment, MenuItem, Paper,
    Select, TextField,
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
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getPriceClient } from "client/price";
import { SellPrices, noOptionsText, Brand } from "components/global";
import { NotFound } from "components/components-global";
import Head from "next/head";
import Link from "next/link";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./pricing.module.css";

const RenderPriceConfig = ({ name, control, register, setValue, hidden, errors, index, getValues, limitQty, ids, defaultIds, idDeleteds }) => {

    let arrName = name + `[${index}]`
    return (
        <div style={{ width: '100%' }}>
            {/* gia ban */}
            {
                name === 'retailPrice' ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography gutterBottom>
                                Loại cài đặt:
                            </Typography>
                            <FormControl className={styles.formControl} size="small"
                                style={{ width: '100%' }}>
                                <Controller
                                    disa
                                    rules={{ required: true }}
                                    control={control}
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
                        <Grid item xs={12} sm={12} md={12} />
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography gutterBottom>
                                Giá bán:
                            </Typography>
                            <TextField
                                id={`${name}.price`}
                                name={`${name}.price`}
                                size="small"
                                type="number"
                                disabled={hidden}
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
                                style={{ width: '100%' }}
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
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography gutterBottom>
                                Số lượng tối đa áp dụng:
                            </Typography>
                            <TextField
                                id={`${name}.maxQuantity`}
                                name={`${name}.maxQuantity`}

                                size="small"
                                type="number"
                                disabled={hidden}
                                // label=""
                                placeholder=""
                                defaultValue={10}
                                helperText={errors[name]?.maxQuantity.type === 'required' ? "Vui lòng nhập" : errors[name]?.maxQuantity.type === 'max' ?
                                    "Vui lòng số lượng tối đa thấp hơn giá bán buôn" : null}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                // InputProps={{
                                //     endAdornment: <InputAdornment
                                //         position="end">đ</InputAdornment>,
                                // }}
                                // onChange={(e) => setValue(tag, parseInt(e.target.value,10))}
                                style={{ width: '100%' }}
                                error={!!errors[name]?.maxQuantity}
                                required
                                inputRef={
                                    register({
                                        required: true,
                                        valueAsNumber: true, // important,
                                        max: getValues().wholesalePrice ? getValues().wholesalePrice[0]?.maxQuantity - 1 : null
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
                                <FormControl className={styles.formControl} size="small"
                                    style={{ width: '100%' }}>
                                    {/* <InputLabel id="department-select-label">Loại sản phẩm</InputLabel> */}
                                    <Controller
                                        disa
                                        rules={{ required: true }}
                                        control={control}
                                        size="small"
                                        defaultValue={SellPrices[0]?.value}
                                        name={`${arrName}.type`}

                                        // error={!!errors.categoryID}
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
                                    Giá bán:
                            </Typography>
                                <TextField
                                    id={`${arrName}.price`}
                                    name={`${arrName}.price`}

                                    size="small"
                                    type="number"
                                    disabled={hidden}
                                    // label=""
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
                                    // onChange={(e) => setValue(tag, parseInt(e.target.value,10))}
                                    style={{ width: '100%' }}
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

                                    size="small"
                                    type="number"
                                    disabled={hidden}
                                    // label=""
                                    placeholder=""
                                    defaultValue={5}
                                    error={errors[name] ? !!errors[name][index]?.minNumber : false}
                                    helperText={errors[name] ? errors[name][index]?.minNumber?.message : ''}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    // onChange={(e) => setValue(tag, parseInt(e.target.value,10))}
                                    style={{ width: '100%' }}
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
                                    Số lượng tối đa áp dụng:
                            </Typography>
                                <TextField
                                    id={`${arrName}.maxQuantity`}
                                    name={`${arrName}.maxQuantity`}

                                    size="small"
                                    type="number"
                                    disabled={hidden}
                                    // label=""
                                    placeholder=""
                                    defaultValue={10}
                                    error={errors[name] ? !!errors[name][index]?.maxQuantity : false}
                                    helperText={errors[name] && errors[name][index]?.maxQuantity.type === 'required' ? "Vui lòng nhập" :
                                        errors[name] && errors[name][index]?.maxQuantity.type === 'min' && index == 0 ? "Vui lòng nhập tối đa lớn hơn bán lẻ" :
                                            errors[name] && errors[name][index]?.maxQuantity.type === 'min' ? "Vui lòng nhập số lượng tối đa lớn hơn số lượng tối đa của bán buôn trước" :
                                                errors[name] && errors[name][index]?.maxQuantity.type === 'max' ? "Vui lòng nhập số lượng tối đa bé hơn số lượng tối đa của bán buôn sau" : null}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    // onChange={(e) => setValue(tag, parseInt(e.target.value,10))}
                                    style={{ width: '100%' }}
                                    // error={errors.name ? true : false}
                                    required
                                    inputRef={
                                        register({
                                            required: true,
                                            valueAsNumber: true, // important
                                            min: index === 0 ? getValues().retailPrice?.maxQuantity + 1 : getValues().wholesalePrice ? getValues().wholesalePrice[index - 1]?.maxQuantity + 1 : 0,
                                            max: (index === ids.length - idDeleteds.length - 1 || index === defaultIds.length - idDeleteds.length - 1) ? null :
                                                getValues().wholesalePrice ? getValues().wholesalePrice[index + 1]?.maxQuantity - 1 : null
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} />
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography gutterBottom>
                                    Tỉ lệ phần trăm giảm giá:
                            </Typography>
                                <TextField
                                    id={`${arrName}.percentageDiscount`}
                                    name={`${arrName}.percentageDiscount`}

                                    size="small"
                                    type="number"
                                    disabled={hidden}
                                    // label=""
                                    placeholder=""
                                    error={errors[name] ? !!errors[name][index]?.percentageDiscount : false}
                                    helperText={errors[name] ? errors[name][index]?.percentageDiscount?.message : ''}
                                    defaultValue={5}
                                    // helperText={errors.name?.message}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment
                                            position="end">%</InputAdornment>,
                                    }}
                                    // onChange={(e) => setValue(tag, parseInt(e.target.value,10))}
                                    style={{ width: '100%' }}
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
                                    size="small"
                                    type="number"
                                    disabled={hidden}
                                    // label=""
                                    placeholder=""
                                    defaultValue={5000}
                                    helperText={errors.name?.message}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        endAdornment: <InputAdornment
                                            position="end">đ</InputAdornment>,
                                    }}
                                    // onChange={(e) => setValue(tag, parseInt(e.target.value,10))}
                                    style={{ width: '100%' }}
                                    error={errors[name] ? !!errors[name][index]?.absoluteDiscount : false}
                                    helperText={errors[name] ? errors[name][index]?.absoluteDiscount?.message : ''}
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

export default function renderForm(props, toast) {
    if (props.status && props.status !== "OK") {
        return (
            <NotFound link='/crm/sku' titlePage="Thông tin cài đặt giá" labelLink="sản phẩm" />
        )
    }
    const { register, handleSubmit, errors, reset, watch, control, getValues, setValue } = useForm({ mode: 'onChange', defaultValues: props.price });
    const [loading, setLoading] = useState(false);
    const { error, warn, info, success } = toast;
    const [defaultIds, setDefaultIds] = useState(props.price?.wholesalePrice?.map((value, ind) => ind + 1) || [])
    const [ids, setIds] = useState(defaultIds);
    const [idDeleteds, setIdDeleteds] = useState([]);
    const [expandeds, setExpandeds] = useState(props.price?.wholesalePrice?.map((value, ind) => true) || []);
    const [expanded, setExpanded] = React.useState(false);
    const [listTag, setListTag] = useState(props.listTag);
    const [brand, setBrand] = useState(getValues('brand') || 'LOCAL');
    const [categoryCode, setCategoryCode] = useState(props.price?.categoryCodes || []);
    const [limitQty, setLimitQty] = useState(2)
    let sellerCode = "MedX";
    // func onSubmit used because useForm not working with some fields
    async function createNewPricing(formData) {
        idDeleteds.sort(function (a, b) { return b - a });
        idDeleteds.forEach((val, index) => formData.wholesalePrice?.splice(val - 1, 1))
        setLoading(true);
        let _client = getPriceClient()
        formData.tags = [...formData.tagsName] || [];
        let result = await _client.createNewPricing(formData)
        setLoading(false);
        if (result.status === "OK") {
            success(result.message ? 'Thao tác thành công' : 'Thông báo không xác định')
        } else {
            error(result.message || 'Thao tác không thành công, vui lòng thử lại sau')
        }
    }

    async function updatePricing(formData) {
        formData.sellPriceId = props.price?.sellPriceId
        formData.sellerCode = props.price?.sellerCode
        formData.productCode = props.product?.code
        formData.categoryCodes = categoryCode;
        formData.tags = [...formData.tagsName] || [];
        idDeleteds.sort(function (a, b) { return b - a });
        idDeleteds.forEach((val, index) => formData.wholesalePrice?.splice(val - 1, 1))
        setLoading(true);
        let _client = getPriceClient()
        let result = await _client.updatePrice(formData)
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

    const handleChangeSetting = (event) => {
        setValue("condSettingType", event.target.value);
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    let lstOptions = props?.products

    return (
        <AppCRM select="/crm/sku">
            <Head>
                <title>{typeof props.product === "undefined" ? 'Thêm cài đặt giá' : 'Cập nhật cài đặt giá'}</title>
            </Head>
            <Box component={Paper} display="block">
                <form noValidate>
                    <Box className={styles.contentPadding}>
                        <Box style={{ fontSize: 30, margin: 5 }}>Thông tin cài đặt giá</Box>
                        <Box style={{ margin: 10 }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Typography gutterBottom>
                                        Sản phẩm: <b>{props.product?.name}</b>
                                    </Typography>
                                    {
                                        typeof lstOptions !== "undefined" ? (
                                            <Controller
                                                render={({ onChange, ...props }) => (
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

                                                                size="small"
                                                            // onChange={e => setSearchTerm(e.target.value)}
                                                            />
                                                        )}
                                                        onChange={(e, data) => {
                                                            onChange(data.code);
                                                            setCategoryCode(data.categoryCodes)
                                                        }}
                                                        {...props}
                                                    />
                                                )}
                                                noOptionsText={noOptionsText}
                                                name="productCode"
                                                control={control}
                                                onChange={([, { id }]) => id}
                                                rules={{
                                                    validate: d => {
                                                        return typeof (d) != 'undefined';
                                                    }
                                                }}
                                            />
                                        ) : (
                                                <div />
                                            )
                                    }
                                </Grid>
                                <Grid item xs={12} md={12} sm={12} />
                                <Grid item xs={12} sm={12} md={6}>
                                    <Controller
                                        render={({ onChange, ...props }) => (
                                            <Autocomplete
                                                id="tagsName"
                                                multiple
                                                size="small"
                                                options={listTag?.map(tag => tag.name)}
                                                // options={listSearchCategory.map(
                                                // 	(category) => category.label
                                                // )}
                                                noOptionsText={noOptionsText}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                filterSelectedOptions
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Nhập tag"
                                                        error={!!errors.tagsName}
                                                        placeholder=""

                                                        size="small"
                                                    // onChange={(e) => setSearchCategory(e.target.value)}
                                                    />
                                                )}
                                                onChange={(e, data) => onChange(data)}
                                                {...props}
                                            />
                                        )}
                                        name="tagsName"
                                        control={control}
                                    // onChange={([, { id }]) => id}
                                    // rules={{
                                    //     validate: (d) => {
                                    //         return typeof d != "undefined";
                                    //     },
                                    // }}
                                    />
                                    <Grid item xs={12} md={12} sm={12} /></Grid>

                                <Grid item xs={12} sm={12} md={12}>
                                    <FormControl component="fieldset" className={styles.marginTopBottom}>
                                        <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>Nơi bán</FormLabel>
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
                                <Grid item xs={12} sm={12} md={12}>
                                    <Typography gutterBottom variant={'h6'}>
                                        Cài đặt giá bán lẻ:
                                    <Tooltip title="Cài đặt bán lẻ, bắt buộc nhập" placement="right-start">
                                            <HelpOutlinedIcon fontSize="small" />
                                        </Tooltip>
                                    </Typography>
                                    {/* Setup gia ban le */}
                                    {/* <pre>z{JSON.stringify(getValues().productCode?true:false )}</pre> */}
                                    <RenderPriceConfig name={'retailPrice'} control={control} register={register}
                                        hidden={typeof props.product === "undefined" && !getValues().productCode} errors={errors} index={0} getValues={getValues} limitQty={limitQty} ids={ids} defaultIds={defaultIds} idDeleteds={idDeleteds} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} style={{ marginTop: '10px' }}>
                                    <Typography gutterBottom style={{ fontSize: '1.25rem' }}>
                                        Cài đặt giá bán buôn:
                                    <Tooltip title="Danh sách cài đặt bán buôn (bán sỉ)" placement="right-start">
                                            <HelpOutlinedIcon fontSize="small" />
                                        </Tooltip>
                                    </Typography>
                                    {
                                        defaultIds.length > 0 ? defaultIds.map((num, idx) => (
                                            <>
                                                <Accordion expanded={expandeds ? expandeds[idx] : false} style={{ display: idDeleteds.includes(num) ? 'none' : '' }} onChange={() => {
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
                                                        <Typography color="textSecondary">
                                                            Cài đặt giá bán buôn (bán sỉ) thứ {num - idDeleteds.filter(item => item < num).length}
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <RenderPriceConfig name={`wholesalePrice`} control={control}
                                                            register={register} errors={errors} index={idx} getValues={getValues} limitQty={limitQty} ids={ids} defaultIds={defaultIds} idDeleteds={idDeleteds} />
                                                    </AccordionDetails>
                                                    <AccordionActions>
                                                        <Button size="small" color="secondary" variant="contained"
                                                            startIcon={<DeleteIcon />}
                                                            // onClick={() => setIds(ids.filter(id => id !== num))}>Xóa</Button>
                                                            onClick={() => setIdDeleteds([...idDeleteds, num])}>Xóa</Button>
                                                    </AccordionActions>
                                                </Accordion>
                                            </>
                                        )) :
                                            ids.map((num, idx) => (
                                                <>
                                                    <Accordion expanded={expanded === `panel${idx}`} style={{ display: idDeleteds.includes(num) ? 'none' : '' }} onChange={handleChange(`panel${idx}`)}>
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="panel1bh-content"
                                                            onClick={(e) => e.stopPropagation()}
                                                            id="panel1bh-header"
                                                        >
                                                            <Typography color="textSecondary">
                                                                Cài đặt giá bán buôn (bán sỉ) thứ {num - idDeleteds.filter(item => item < num).length}
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <RenderPriceConfig name={`wholesalePrice`} control={control}
                                                                register={register} errors={errors} index={idx} getValues={getValues} limitQty={limitQty} ids={ids} defaultIds={defaultIds} idDeleteds={idDeleteds} />
                                                        </AccordionDetails>
                                                        <AccordionActions>
                                                            <Button size="small" color="secondary" variant="contained"
                                                                startIcon={<DeleteIcon />}
                                                                // onClick={() => setIds(ids.filter(id => id !== num))}>Xóa</Button>
                                                                onClick={() => setIdDeleteds([...idDeleteds, num])}>Xóa</Button>
                                                        </AccordionActions>
                                                    </Accordion>
                                                </>
                                            ))
                                    }
                                    {defaultIds.length > 0 ? <Button
                                        color="primary"
                                        disabled={(typeof props.product === "undefined" && !getValues().productCode) || (defaultIds.length - idDeleteds.length === 5)}
                                        style={{ marginTop: '10px' }}
                                        onClick={() => {
                                            setDefaultIds([...defaultIds, defaultIds.length + 1]);
                                            setExpandeds(prevState=>[...prevState,true])
                                        }}
                                        startIcon={<AddIcon />}
                                    >
                                        Thêm giá bán buôn
                                    </Button> :
                                        <Button
                                            color="primary"
                                            disabled={(typeof props.product === "undefined" && !getValues().productCode) || (ids.length - idDeleteds.length === 5)}
                                            style={{ marginTop: '10px' }}
                                            onClick={() => {
                                                setIds([...ids, ids.length + 1])
                                                setExpanded(`panel${ids.length}`)
                                            }}
                                            startIcon={<AddIcon />}
                                        >
                                            Thêm giá bán buôn
                                    </Button>}

                                </Grid>
                            </Grid>
                        </Box>
                        <Divider style={{ margin: '10px' }} />
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={(typeof props.product === "undefined" && !getValues().productCode)}
                                onClick={handleSubmit(onSubmit)}
                                style={{ margin: 8 }}>
                                Lưu
                            </Button>
                            {
                                typeof props.product === "undefined" ? (
                                    <Button variant="contained" type="reset" style={{ margin: 8 }}>Làm mới</Button>
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
