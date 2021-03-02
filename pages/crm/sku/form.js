import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Button,
    ButtonGroup,
    FormControl,
    Grid,
    TextField,
    Tooltip,
    Typography,
} from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import HelpOutlinedIcon from "@material-ui/icons/HelpOutlined";
import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { getPriceClient } from "client/price";
import { NotFound } from "components/components-global";
import { Brand } from "components/global";
import MuiMultipleAuto from "components/muiauto/multiple";
import MuiSingleAuto from "components/muiauto/single";
import { RenderPriceConfig } from "containers/crm/sku/RenderPriceConfig";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./pricing.module.css";

let breadcrumbEdit = [
    {
        name: "Trang chủ",
        link: "/crm"
    },
    {
        name: "Danh sách sku",
        link: "/crm/sku",
    },
    {
        name: "Cập nhật cài đặt sku",
    },
];

export default function renderForm(props, toast) {
    if (props.status && props.status !== "OK") {
        return (
            <NotFound link='/crm/sku' titlePage="Cập nhật cài đặt sku" labelLink="sản phẩm" />
        );
    }

    const { register, handleSubmit, errors, reset, control, getValues, setValue, clearErrors } = useForm({
        mode: 'onSubmit', defaultValues: props.price || {
            productCode: [],
            tagsName: [],
            brand: "LOCAL"
        }
    });
    const [, setLoading] = useState(false);
    const { error, success } = toast;
    const [defaultIds, setDefaultIds] = useState(props.price?.wholesalePrice?.map((value, ind) => ind) || []);
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
    const [minQuantitys] = useState(props.price?.wholesalePrice?.map(v => { v.minNumber; }) || []);
    const router = useRouter();
    let sellerCode = "MedX";
    // tamnt
    const [incrId, setIncrId] = useState(0);

    // func onSubmit used because useForm not working with some fields
    async function createNewPricing(formData) {
        let code = formData.productCode?.value.code;
        setLoading(true);
        formData.sellerCode = props.sellerCode;
        formData.productCode = code;
        formData.tags = [];
        formData.tagsName?.forEach((tag) => {
            formData.tags.push(tag.label);
        });
        let wholesale = formData.wholesalePrice?.filter((item) => item && item.type !== "");
        formData.wholesalePrice = wholesale;

        let _client = getPriceClient();

        let result = await _client.createNewPricing(formData);
        setLoading(false);
        if (result.status === "OK") {
            success(result.message ? 'Thao tác thành công' : 'Thông báo không xác định');
            router.push(`/crm/sku`);
        } else {
            error(result.message || 'Thao tác không thành công, vui lòng thử lại sau');
        }
    }

    async function updatePricing(formData) {
        formData.sellPriceId = props.price?.sellPriceId;
        formData.sellerCode = props.price?.sellerCode;
        formData.productCode = props.product?.code;
        formData.categoryCodes = categoryCode;
        formData.tags = [];
        formData.tagsName?.forEach((tag) => {
            formData.tags.push(tag.label);
        });

        let wholesale = formData.wholesalePrice?.filter((item) => item && item.type !== "");
        formData.wholesalePrice = wholesale;
        setLoading(true);
        let _client = getPriceClient();
        let result = await _client.updatePrice(formData);
        setLoading(false);
        if (result.status === "OK") {
            success(result.message ? 'Cập nhật thông tin thành công' : 'Có lỗi xảy ra');
        } else {
            error(result.message || 'Cập nhật thông tin không thành công');
        }
    }

    // func submit data
    async function onSubmit(formData) {

        try {
            formData.categoryCodes = categoryCode;
            formData.sellerCode = sellerCode;
            if (typeof props.product === "undefined") {
                await createNewPricing(formData);
            } else {
                await updatePricing(formData);
            }
        } catch (err) {
            setLoading(false);
            error(err.message || err.toString());
        }
    }
    let lstOptions = props?.products;
    function updateCategoryCode(data) {
        if (data && data.value && data.value.categoryCodes) {
            setCategoryCode(data.value.categoryCodes);
            setHidden(false);
            return;
        }
        setHidden(true);
    }

    return (
        <AppCRM select="/crm/sku" breadcrumb={breadcrumbEdit}>
            <Head>
                <title>Cập nhật cài đặt sku</title>
            </Head>
            <MyCard>
                <MyCardHeader title={`Cài đặt sku #${props.price?.sku}`} />
                <MyCardContent>
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
                                            <FormControl style={{ width: '100%' }} size="small">
                                                <Typography gutterBottom>
                                                    <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                                        Sản phẩm<span style={{ color: 'red' }}>*</span>:
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
                            <FormControl style={{ width: '100%' }} size="small">
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
                            <FormControl style={{ width: '100%' }} size="small">
                                <Typography gutterBottom>
                                    <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                        Brand<span style={{ color: 'red' }}>*</span>:
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
                            <FormControl style={{ width: '100%' }} size="small">
                                <Typography gutterBottom>
                                    <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                        Số lượng đặt tối đa trên một đơn hàng<span style={{ color: 'red' }}>*</span>:
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
                                    onChange={(e) => { setMaxQuantity(e.target.value); }}
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
                                                message: "Vui lòng nhập số lượng đặt tối đa áp dụng lớn hơn hoặc bằng 2"
                                            },
                                            valueAsNumber: true, // important,
                                        })
                                    }
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </MyCardContent>
                <MyCardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Typography gutterBottom variant={'h6'} style={{ fontWeight: 'bold', color: 'black' }}>
                                Cài đặt giá bán lẻ:
                                        <Tooltip title="Cài đặt bán lẻ, bắt buộc nhập" placement="right-start">
                                    <HelpOutlinedIcon fontSize="small" />
                                </Tooltip>
                            </Typography>
                            <RenderPriceConfig
                                name={'retailPrice'}
                                control={control}
                                register={register}
                                clearErrors={clearErrors}
                                setValue={setValue}
                                maxQuantity={maxQuantity}
                                setAbsoluteDiscount={setAbsoluteDiscount}
                                hidden={hidden === true && !props.isUpdate}
                                errors={errors}
                                index={0}
                                getValues={getValues}
                                limitQty={limitQty}
                                ids={ids}
                                defaultIds={defaultIds}
                                idDeleteds={idDeleteds}
                            />
                        </Grid>
                    </Grid>
                </MyCardContent>
                <MyCardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={12} style={{ marginTop: '10px' }}>
                            <Typography gutterBottom variant={'h6'} style={{ fontWeight: 'bold', color: 'black' }}>
                                Cài đặt giá bán buôn:
                                        <Tooltip title="Danh sách cài đặt bán buôn (bán sỉ)" placement="right-start">
                                    <HelpOutlinedIcon fontSize="small" />
                                </Tooltip>
                            </Typography>
                            {defaultIds.length > 0 && defaultIds.map((num, idx) => (
                                <div key={num} style={{ marginTop: 10 }}>
                                    <Accordion
                                        // style={{ backgroundColor: '#f8faf8', paddingTop: '5px' }}
                                        expanded={expandeds ? expandeds[idx] : false}
                                        onChange={() => {
                                            let tmpExpandeds = [...expandeds];
                                            tmpExpandeds[idx] = !tmpExpandeds[idx];
                                            setExpandeds(tmpExpandeds);
                                        }}
                                    >
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
                                            <RenderPriceConfig name={`wholesalePrice`}
                                                control={control}
                                                clearErrors={clearErrors}
                                                setValue={setValue}
                                                maxQuantity={maxQuantity}
                                                absoluteDiscount={absoluteDiscount}
                                                minQuantitys={minQuantitys}
                                                register={register}
                                                errors={errors}
                                                index={num}
                                                getValues={getValues}
                                                limitQty={limitQty}
                                                ids={ids}
                                                defaultIds={defaultIds}
                                                idDeleteds={idDeleteds}
                                            />
                                        </AccordionDetails>
                                        <AccordionActions>
                                            <Button size="small" color="secondary" variant="contained"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => {
                                                    setIncrId(incrId + 1);
                                                    setDefaultIds(defaultIds.filter((_id) => _id !== num));
                                                    setExpandeds(expandeds.filter((val, index) => index !== idx));
                                                }}>Xóa</Button>
                                        </AccordionActions>
                                    </Accordion>
                                </div>
                            ))}
                            {props.isUpdate ? <Button
                                color="primary"
                                disabled={(typeof props.product === "undefined" && !getValues().productCode) || (defaultIds.length === 5)}
                                style={{ marginTop: '10px', display: defaultIds.length === 5 ? 'none' : '' }}
                                onClick={() => {
                                    let mId = defaultIds.length - 1 <= 0 ? incrId + defaultIds.length : defaultIds.length + incrId + 1;
                                    setDefaultIds([...defaultIds, mId + 1]);
                                    setExpandeds([...expandeds, true]);
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
                                        let mId = defaultIds.length - 1 <= 0 ? incrId + defaultIds.length : defaultIds.length + incrId + 1;
                                        setDefaultIds([...defaultIds, mId + 1]);
                                        setExpandeds([...expandeds, true]);
                                    }}
                                    startIcon={<AddIcon />}
                                >
                                    Thêm giá bán buôn
                                    </Button>
                            }
                        </Grid>
                    </Grid>
                </MyCardContent>
                <MyCardContent>
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
                </MyCardContent>
            </MyCard>
        </AppCRM >
    );
}
