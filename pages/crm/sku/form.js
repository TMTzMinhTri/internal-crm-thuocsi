import { Controller, useForm } from "react-hook-form";
import React, { useState } from "react";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getPriceClient } from "../../../client/price";
import AppCRM from "../../_layout";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Head from "next/head";
import {
    Accordion, AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box, Button, ButtonGroup, Divider,
    Grid,
    Paper,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core";
import styles from "./pricing.module.css";
import HelpOutlinedIcon from "@material-ui/icons/HelpOutlined";
import RenderPriceConfig from "./price-config";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Link from "next/link";

export default function renderForm(props) {
    const { register, handleSubmit, errors, reset, watch, control, getValues, setValue } = useForm({ mode: 'onChange', defaultValues: props.price });
    const [loading, setLoading] = useState(false);
    const { error, warn, info, success } = useToast();
    let defaultIds = []
    for (let i = 0; i < props.price?.wholesalePrice?.length; i++) {
        defaultIds.push(i + 1)
    }
    const [ids, setIds] = useState(defaultIds);
    const [idDeleteds, setIdDeleteds] = useState([]);
    const [expanded, setExpanded] = React.useState(false);
    const [listTag, setListTag] = useState(props.listTag);
    let sellerCode = "MedX"

    // func onSubmit used because useForm not working with some fields
    async function createNewPricing(formData) {
        idDeleteds.forEach((val, index) => formData.wholesalePrice?.splice(index, 1))
        setLoading(true);
        let _client = getPriceClient()
        formData.tags = [];
        if (formData.tagsName) {
            for (let i = 0; i < formData.tagsName.length; i++) {
                formData.tags.push(
                    listTag.filter(
                        (tag) => tag.name === formData.tagsName[i]
                    )[0].code
                );
            }
        }
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
        formData.tags = [];
        if (formData.tagsName) {
            for (let i = 0; i < formData.tagsName.length; i++) {
                formData.tags.push(
                    listTag.filter(
                        (tag) => tag.name === formData.tagsName[i]
                    )[0].code
                );
            }
        }
        idDeleteds.forEach((val, index) => formData.wholesalePrice?.splice(index, 1))
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
            formData.sellerCode = sellerCode
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
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={3}>
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
                                <Grid item container>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <Controller
                                            render={({ onChange, ...props }) => (
                                                <Autocomplete
                                                    id="tagsName"
                                                    multiple
                                                    size="small"
                                                    options={listTag.map(tag => tag.name)}
                                                    // options={listSearchCategory.map(
                                                    // 	(category) => category.label
                                                    // )}
                                                    InputLabelProps={{
                                                        shrink: true
                                                    }}
                                                    filterSelectedOptions
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Loại Tag"
                                                            error={!!errors.tagsName}
                                                            placeholder=""
                                                            variant="outlined"
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

                                    </Grid>
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
                                        hidden={typeof props.product === "undefined" && !getValues().productCode} errors={errors} index={0} />

                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <Typography gutterBottom>
                                        Cài đặt giá bán buôn:
                                    <Tooltip title="Danh sách cài đặt bán buôn (bán sỉ)" placement="right-start">
                                            <HelpOutlinedIcon fontSize="small" />
                                        </Tooltip>
                                    </Typography>
                                    {
                                        ids.map((num, idx) => (
                                            <Accordion expanded={expanded === `panel${idx}`} style={{ display: idDeleteds.includes(num) ? 'none' : '' }} onChange={handleChange(`panel${idx}`)}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
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
                                                        register={register} errors={errors} index={idx} />
                                                </AccordionDetails>
                                                <AccordionActions>
                                                    <Button size="small" color="secondary" variant="contained"
                                                        startIcon={<DeleteIcon />}
                                                        // onClick={() => setIds(ids.filter(id => id !== num))}>Xóa</Button>
                                                        onClick={() => setIdDeleteds([...idDeleteds, num])}>Xóa</Button>
                                                </AccordionActions>
                                            </Accordion>
                                        ))
                                    }
                                    <Button
                                        variant="outlined"
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
                                </Button>
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
