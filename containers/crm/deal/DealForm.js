import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    IconButton,
    makeStyles,
    MenuItem,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import { Add as AddIcon, Delete as DeleteIcon } from "@material-ui/icons";
import LabelBox from "@thuocsi/nextjs-components/editor/label-box/index";
import MuiSingleAuto from "@thuocsi/nextjs-components/muiauto/single";
import {
    MyCard,
    MyCardActions,
    MyCardContent,
    MyCardHeader
} from "@thuocsi/nextjs-components/my-card/my-card";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getDealClient } from "client/deal";
import { getPricingClient } from "client/pricing";
import { getProductClient } from "client/product";
import { unknownErrorText } from "components/commonErrors";
import { formatDatetimeFormType } from "components/global";
import ImageUploadField from "components/image-upload-field";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Controller, useController, useForm } from "react-hook-form";
import {
    DealFlashSaleLabel,
    DealStatus,
    DealStatusLabel,
    DealType,
    DealTypeOptions,
    DealValidation
} from "view-models/deal";
import Head from "next/head";

const useStyles = makeStyles({
    gridAlignTop: {
        alignItems: "flex-start",
        alignContent: "flex-start",
    }
})

const defaultValuesDealForm = {
    startTime: formatDatetimeFormType(moment().add(1, "d")),
    endTime: formatDatetimeFormType(moment().add(10, "d")),
    readyTime: formatDatetimeFormType(moment().add(5, "m")),
    name: "",
    dealType: DealType.DEAL,
    description: "",
    status: DealStatus.ACTIVE,
    tags: [],
    imageUrls: [],
    isFlashSale: false,
    maxQuantity: 100,
    price: 10000,
    skus: [],
}
const defaultValuesSkuForm = {
    pricing: null,
    quantity: 1,
}
export const DealForm = (props) => {
    const classes = useStyles();
    const router = useRouter();
    const toast = useToast();
    const isLateUpdate = props.isUpdate && moment(props.deal.startTime).isBefore(moment());
    const dealForm = useForm({
        defaultValues: props.isUpdate ? {
            ...props.deal,
            startTime: formatDatetimeFormType(props.deal.startTime),
            endTime: formatDatetimeFormType(props.deal.endTime),
            readyTime: formatDatetimeFormType(props.deal.readyTime),
        } : defaultValuesDealForm,
        mode: "onChange",
    });
    const { dealType } = dealForm.watch();
    useController({
        name: "imageUrls",
        control: dealForm.control,
        rules: dealType === DealType.COMBO ? DealValidation.imageUrls.combo : {},
        defaultValue: defaultValuesDealForm.imageUrls,
    });
    const [skuOptions, setSkuOptions] = useState(props.skuOptions ?? []);
    const [skuOptionMap, setSkuOptionMap] = useState(props.deal?.skus?.reduce((acc, cur) => {
        acc[cur.sku] = true;
        return acc;
    }, {}) ?? {});
    const [skus, setSkus] = useState(props.deal?.skus ?? []);
    const skuForm = useForm({
        defaultValues: props.isUpdate && props.deal.dealType === DealType.DEAL ? {
            pricing: {
                value: props.deal.skus[0].sku,
                label: props.deal.skus[0].label,
                sku: props.deal.skus[0].sku,
                sellerCode: props.deal.skus[0].sellerCode,
            },
            quantity: props.deal.skus[0].quantity,
        } : defaultValuesSkuForm,
        mode: "onChange",
    });
    const [productImages, setProductImages] = useState(props.deal?.imageUrls ?? []);

    async function searchSkus(text) {
        const pricingClient = getPricingClient();
        const productClient = getProductClient();
        const skusResp = await pricingClient.searchSellingSKUsByKeywordFromClient(text);
        if (skusResp.status !== "OK") {
            if (skusResp.status === "NOT_FOUND") {
                return [];
            } else {
                toast.error(skusResp.message ?? unknownErrorText);
            }
        }
        const skuMap = {};
        skusResp.data?.forEach(({ sku }) => {
            if (!skuMap[sku] && !skuOptionMap[sku]) {
                skuMap[sku] = true;
            }
        });
        const productResp = await productClient.getProductBySKUsFromClient(Object.keys(skuMap));
        const skuOptions = productResp.data?.map(({ sku, seller, name }) => {
            return ({ value: sku, label: `${name} - ${seller?.name ?? seller?.code}`, sellerCode: seller.code, sku })
        }) ?? [];
        setSkuOptions(skuOptions);
        return skuOptions;
    }

    async function createOrUpdateDeal(formData) {
        const data = formData;
        data.startTime = moment(formData.startTime).toISOString();
        data.endTime = moment(formData.endTime).toISOString();
        data.readyTime = moment(formData.readyTime).toISOString();

        const dealClient = getDealClient();
        let resp;
        if (props.isUpdate) {
            resp = await dealClient.updateDeal({ code: props.deal?.code, ...data });
        } else {
            resp = await dealClient.createDeal({ ...data });
        }
        if (resp.status !== "OK") {
            throw new Error(resp.message);
        }
        return resp.data[0];
    }

    async function uploadImage(formData) {
        const productClient = getProductClient();
        return await productClient.uploadProductImage(formData);
    }

    const handleSearchSkus = async (text) => {
        try {
            return await searchSkus(text);
        } catch (e) {
            toast.error(e.message);
        }
    }

    const handleAddSku = async (formData) => {
        console.log(formData)
        const { pricing: { sku, label, sellerCode }, quantity } = formData;
        if (dealType === DealType.COMBO) {
            setSkus([...skus, { sku, label, sellerCode, quantity }]);
            skuForm.reset({
                pricing: null,
                quantity: 0,
            });
            setSkuOptionMap({ ...skuOptionMap, [sku]: true });
        } else {
            setSkus([{ sku, label, sellerCode, quantity: 1 }]);
            setSkuOptionMap({ [sku]: true });
            dealForm.setValue("name", label);
        }
        // Remove the option in Autocomplete
        setSkuOptions(skuOptions.filter(option => option.sku !== sku));
    }

    const handleRemoveSku = async (sku) => {
        const arr = [...skus];
        const idx = arr.findIndex(item => item.sku === sku);
        const deleted = arr.splice(idx, 1)?.[0] ?? {};
        setSkus(arr);
        if (dealType === DealType.COMBO) {
            setSkuOptionMap({ ...skuOptionMap, [sku]: false });
        } else {
            setSkuOptionMap({ [sku]: false });
        }
        // Re-add the option in Autocomplete
        setSkuOptions([...skuOptions, {
            label: deleted.label,
            sellerCode: deleted.sellerCode,
            sku: deleted.sku,
            value: deleted.sku,
        }]);
    }

    async function handleCropCallback(value) {
        try {
            let result = await uploadImage({
                data: value,
            });
            const images = [...dealForm.getValues("imageUrls"), result.data[0]];
            dealForm.setValue("imageUrls", images);
            setProductImages(images);
        } catch (err) {
            toast.error(err.message || err.toString());
        }
    }

    const handleRemoveImage = (url) => {
        const images = [...dealForm.getValues("imageUrls").filter((imgUrl) => imgUrl !== url)];
        dealForm.setValue("imageUrls", images);
        setProductImages(images);
    };

    const handleSubmitDealForm = async (formData) => {
        try {
            const deal = await createOrUpdateDeal({ ...formData, skus });
            toast.success(props.isUpdate ? "Cập nhật deal thành công." : "Tạo deal thành công.")
            if (!props.isUpdate) {
                router.push({
                    pathname: "/crm/deal/edit",
                    query: {
                        dealCode: deal.code,
                    }
                })
            }
        } catch (e) {
            toast.error(e.message);
        }
    }

    return (
        <MyCard>
            <Head>
                <title>{props.isUpdate ? `Cập nhật deal` : "Tạo mới deal"}</title>
            </Head>
            <MyCardHeader title={props.isUpdate ? `Deal #${props.deal.code}` : "Tạo mới deal"} />

            <MyCardContent>
                <Grid container spacing={8}>
                    <Grid className={classes.gridAlignTop} item xs={12} md={5} container spacing={2}>
                        <Grid item xs={12}>
                            <Controller
                                name="dealType"
                                control={dealForm.control}
                                defaultValue={DealType.DEAL}
                                render={({ onChange, ...field }) => (
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        label="Loại deal"
                                        placeholder="Chọn loại deal"
                                        fullWidth
                                        select
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        SelectProps={{
                                            readOnly: props.isUpdate,
                                        }}
                                        {...field}
                                        onChange={(e) => {
                                            onChange(e);
                                            // clear skus
                                            setSkus([]);
                                        }}
                                    >
                                        {DealTypeOptions.map(({ value, label }) => (
                                            <MenuItem key={value} value={value}>{label}</MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="startTime"
                                variant="outlined"
                                size="small"
                                label="Thời gian bắt đầu"
                                type="datetime-local"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    readOnly: isLateUpdate,
                                }}
                                required
                                error={!!dealForm.errors.startTime}
                                helperText={dealForm.errors.startTime?.message ?? "Tới thời gian này sẽ áp dụng cho deal"}
                                inputRef={dealForm.register(DealValidation.startTime)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="endTime"
                                variant="outlined"
                                size="small"
                                label="Thời gian kết thúc"
                                type="datetime-local"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                                error={!!dealForm.errors.endTime}
                                helperText={dealForm.errors.endTime?.message ?? "Tới thời gian này sẽ kết thúc deal"}
                                inputRef={dealForm.register({
                                    ...DealValidation.endTime,
                                    validate: (data) => {
                                        if (isLateUpdate && moment(data).isBefore(moment(props.deal.endTime))) {
                                            return "Thời gian kết thúc mới phải sau thời gian kết thúc cũ"
                                        }
                                    }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="price"
                                variant="outlined"
                                size="small"
                                label="Giá"
                                type="number"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    readOnly: isLateUpdate,
                                }}
                                inputProps={{
                                    min: 1,
                                }}
                                required
                                error={!!dealForm.errors.price}
                                helperText={dealForm.errors.price?.message ?? "Giá bán ra hiển thị trên website"}
                                inputRef={dealForm.register({
                                    ...DealValidation.price,
                                    valueAsNumber: true,
                                })}
                            />
                        </Grid>
                    </Grid>
                    <Grid className={classes.gridAlignTop} item xs={12} md={5} container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormControl>
                                <FormLabel>Trạng thái</FormLabel>
                                <Controller
                                    name="status"
                                    control={dealForm.control}
                                    defaultValue={defaultValuesDealForm.status}
                                    render={({ name, value }) => (
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    color="primary"
                                                    size="small"
                                                    checked={value === DealStatus.ACTIVE}
                                                    onChange={(_, checked) => dealForm.setValue(name, checked ? DealStatus.ACTIVE : DealStatus.INACTIVE)}
                                                />
                                            }
                                            color={value === DealStatus.ACTIVE ? "primary" : "default"}
                                            label={DealStatusLabel[value]}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl>
                                <FormLabel component="div">Flash sale</FormLabel>
                                <Controller
                                    name="isFlashSale"
                                    control={dealForm.control}
                                    defaultValue={defaultValuesDealForm.isFlashSale}
                                    render={({ name, value }) => (
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    color="primary"
                                                    size="small"
                                                    checked={value}
                                                    onChange={(_, checked) => dealForm.setValue(name, checked)}
                                                />
                                            }
                                            color={value ? "primary" : "default"}
                                            label={DealFlashSaleLabel[value]}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="readyTime"
                                variant="outlined"
                                size="small"
                                label="Thời gian cho phép hiển thị"
                                type="datetime-local"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    readOnly: isLateUpdate,
                                }}
                                required
                                error={!!dealForm.errors.readyTime}
                                helperText={dealForm.errors.readyTime?.message ?? "Tới thời gian này sẽ cho hiển thị trên app/web thuocsi"}
                                inputRef={dealForm.register(DealValidation.readyTime)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="maxQuantity"
                                variant="outlined"
                                size="small"
                                label="Số lượng được phép bán trong deal"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    readOnly: isLateUpdate,
                                }}
                                type="number"
                                inputProps={{
                                    min: 0
                                }}
                                error={!!dealForm.errors.maxQuantity}
                                helperText={dealForm.errors.maxQuantity?.message ?? "Nhập = 0 là không giới hạn"}
                                inputRef={dealForm.register({
                                    ...DealValidation.maxQuantity,
                                    valueAsNumber: true,
                                })}
                            />
                        </Grid>
                    </Grid>
                    <Grid className={classes.gridAlignTop} item xs={12} md={5} container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">Danh sách sản phẩm thuộc deal</Typography>
                        </Grid>
                        {dealType === DealType.COMBO && (
                            <Table size="small">
                                <colgroup>
                                    <col width="70%" />
                                    <col width="20%" />
                                    <col width="10%" />
                                </colgroup>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>sku</TableCell>
                                        <TableCell align="center">Số lượng</TableCell>
                                        <TableCell align="center">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {skus.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell><b>{item.sku}</b> - {item.label}</TableCell>
                                            <TableCell align="center">{item.quantity}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    onClick={() => handleRemoveSku(item.sku)}
                                                    disabled={isLateUpdate}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow style={{ verticalAlign: "top" }}>
                                        <TableCell>
                                            <MuiSingleAuto
                                                name="pricing"
                                                options={skuOptions}
                                                placeholder="Tìm kiếm sku"
                                                required
                                                control={skuForm.control}
                                                errors={skuForm.errors}
                                                message={skuForm.errors.pricing?.message}
                                                onFieldChange={handleSearchSkus}
                                                disabled={isLateUpdate}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="quantity"
                                                variant="outlined"
                                                size="small"
                                                type="number"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                InputProps={{
                                                    readOnly: isLateUpdate,
                                                }}
                                                inputProps={{
                                                    min: 1
                                                }}
                                                required
                                                error={!!skuForm.errors.quantity}
                                                helperText={skuForm.errors.quantity?.message}
                                                inputRef={skuForm.register({
                                                    ...DealValidation.skus.quantity,
                                                    valueAsNumber: true,
                                                })}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                onClick={skuForm.handleSubmit(handleAddSku)}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        )}
                        {dealType === DealType.DEAL && (
                            <>
                                <Grid item xs={12}>
                                    <MuiSingleAuto
                                        name="pricing"
                                        options={skuOptions}
                                        label="sku"
                                        placeholder="Tìm kiếm sku"
                                        required
                                        control={skuForm.control}
                                        errors={skuForm.errors}
                                        message={skuForm.errors.pricing?.message}
                                        onFieldChange={handleSearchSkus}
                                        onValueChange={skuForm.handleSubmit(handleAddSku)}
                                        disabled={props.isUpdate}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                    <Grid className={classes.gridAlignTop} item xs={12} md={5} container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant="h6">Tên deal</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                variant="outlined"
                                size="small"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    readOnly: isLateUpdate,
                                }}
                                required
                                error={!!dealForm.errors.name}
                                helperText={dealForm.errors.name?.message}
                                inputRef={dealForm.register(DealValidation.name)}
                            />
                        </Grid>
                        <Grid container spacing={2} item xs={12}>
                            <Grid item xs={12}>
                                <Typography variant="h6">Hình ảnh sản phẩm</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <LabelBox
                                    padding={1}
                                    minHeight={108}
                                    {...(dealForm.errors.imageUrls ? { borderColor: "secondary.main" } : {})}>
                                    <ImageUploadField
                                        title="Cập nhật hình ảnh sản phẩm"
                                        images={productImages}
                                        handleCropCallback={handleCropCallback}
                                        handleRemoveImage={handleRemoveImage}
                                        disabled={isLateUpdate}
                                        required={dealType === DealType.COMBO}
                                    />
                                </LabelBox>
                                <FormHelperText error={dealForm.errors.imageUrls}>{dealForm.errors.imageUrls?.message}</FormHelperText>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </MyCardContent>
            <MyCardActions>
                <Link href="/crm/deal">
                    <Button
                        variant="contained"
                    >
                        Quay lại
                    </Button>
                </Link>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={dealForm.handleSubmit(handleSubmitDealForm)}
                >
                    Lưu
                </Button>
            </MyCardActions>
        </MyCard>
    );
}
