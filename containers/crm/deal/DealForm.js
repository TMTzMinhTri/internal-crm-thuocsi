import React, { useState } from "react";
import {
    MyCard,
    MyCardActions,
    MyCardContent,
    MyCardHeader,
} from "@thuocsi/nextjs-components/my-card/my-card";
import LabelBox from "@thuocsi/nextjs-components/editor/label-box/index";
import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    MenuItem,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@material-ui/core";
import { Add as AddIcon, Delete as DeleteIcon } from "@material-ui/icons";
import Link from "next/link";
import { Controller, useController, useForm } from "react-hook-form";

import {
    DealFlashSaleLabel,
    DealStatus,
    DealStatusLabel,
    DealType,
    DealTypeOptions,
    DealValidation,
} from "view-models/deal";
import MuiSingleAuto from "@thuocsi/nextjs-components/muiauto/single";
import { getPricingClient } from "client/pricing";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { unknownErrorText } from "components/commonErrors";
import ImageUploadField from "components/image-upload-field";
import { getProductClient } from "client/product";
import { getDealClient } from "client/deal";
import { useRouter } from "next/router";


const defaultValuesDealForm = {
    startTime: null,
    endTime: null,
    readyTime: null,
    name: "",
    dealType: DealType.DEAL,
    description: "",
    status: DealStatus.ACTIVE,
    tags: [],
    imageUrls: [],
    isFlashSale: false,
    maxQuantity: 0,
    price: 1,
    // discount: {
    //     type: DiscountType.ABSOLUTE,
    //     percentageDiscount: 0,
    //     maxPercentageDiscount: 0,
    //     absoluteDiscount: 0,
    // },
    skus: [],
}
export const DealForm = (props) => {
    const router = useRouter();
    const toast = useToast();
    const dealForm = useForm({
        defaultValues: defaultValuesDealForm,
        mode: "onChange",
    });
    const { dealType, maxQuantity } = dealForm.watch();
    useController({
        name: "imageUrls",
        control: dealForm.control,
        defaultValue: defaultValuesDealForm.imageUrls,
    });
    const [skuOptions, setSkuOptions] = useState(props.skuOptions ?? []);
    const [skus, setSkus] = useState([]);
    const [skuQuantitySum, setSkuQuantitySum] = useState(0);
    const skuForm = useForm({
        defaultValues: {
            pricing: null,
            quantity: 0,
        },
        mode: "onChange",
    });
    const [productImages, setProductImages] = useState([]);

    async function searchSkus(text) {
        const pricingClient = getPricingClient();
        const skusResp = await pricingClient.getListPricingByFilterFromClient({ q: text, limit: 100 });
        if (skusResp.status !== "OK") {
            if (skusResp.status === "NOT_FOUND") {
                toast.error("Không tìm thấy sku.")
            } else {
                toast.error(skusResp.message ?? unknownErrorText);
            }
            return;
        }
        const skuOptions = skusResp.data?.map(({ sellerCode, sku }) => ({ value: sku, label: sku, sellerCode, sku })) ?? [];
        setSkuOptions(skuOptions);
        return skuOptions;
    }

    async function createOrUpdateDeal(formData) {
        const dealClient = getDealClient();
        let resp;
        if (props.isUpdate) {
            resp = await dealClient.updateDeal({ ...formData, skus });
        } else {
            resp = await dealClient.createDeal({ ...formData, skus });
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
        const { pricing: { sku, sellerCode }, quantity } = formData;
        console.log({ formData });
        if (dealType === DealType.COMBO) {
            setSkus([...skus, { sku, sellerCode, quantity }]);
            setSkuQuantitySum(skuQuantitySum + quantity);
            skuForm.reset({
                pricing: null,
                quantity: 0,
            });
        } else {
            setSkus([{ sku, sellerCode, quantity }]);
        }
    }

    const handleRemoveSku = async (sku) => {
        const arr = [...skus];
        const idx = arr.findIndex(item => item.sku === sku);
        setSkuQuantitySum(skuQuantitySum - arr[idx].quantity);
        arr.splice(idx, 1);
        setSkus(arr);
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
            const deal = await createOrUpdateDeal(formData);
            router.push({
                href: "/crm/deal/edit",
                query: {
                    dealCode: deal.code,
                }
            })
        } catch (e) {
            toast.error(e.message);
        }
    }

    return (
        <MyCard>
            <MyCardHeader title={props.isUpdate ? `Deal #${props.deal.code}` : "Tạo mới deal"} />
            <MyCardContent>
                <Grid container spacing={8}>
                    <Grid item xs={12} md={5} container spacing={3}>
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
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                variant="outlined"
                                size="small"
                                label="Tên deal"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                                error={!!dealForm.errors.name}
                                helperText={dealForm.errors.name?.message}
                                inputRef={dealForm.register(DealValidation.name)}
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
                                required
                                error={!!dealForm.errors.startTime}
                                helperText={dealForm.errors.startTime?.message}
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
                                helperText={dealForm.errors.endTime?.message}
                                inputRef={dealForm.register(DealValidation.endTime)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="price"
                                variant="outlined"
                                size="small"
                                label="Giá"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    min: 1,
                                }}
                                required
                                error={!!dealForm.errors.price}
                                helperText={dealForm.errors.price?.message}
                                inputRef={dealForm.register(DealValidation.price)}
                            />
                        </Grid>
                        {/* <Grid item xs={12}>
                                <Controller
                                    name="discount.type"
                                    control={dealForm.control}
                                    defaultValue={defaultValuesDealForm.discount.type}
                                    as={
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            label=""
                                            placeholder=""
                                            select
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        >
                                            {DiscountTypeOptions.map(({ value, label }) => (
                                                <MenuItem key={value} value={value} >{label}</MenuItem>
                                            ))}
                                        </TextField>
                                    }
                                />
                            </Grid>
                            {discount.type === DiscountType.ABSOLUTE ?
                                (
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            name="discount.absoluteDiscount"
                                            variant="outlined"
                                            size="small"
                                            label="Giá trị giảm giá tuyệt đối"
                                            placeholder=""
                                            fullWidth
                                            type="number"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                min: 0
                                            }}
                                            inputRef={dealForm.register}
                                        />
                                    </Grid>
                                ) : (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                name="discount.percentageDiscount"
                                                variant="outlined"
                                                size="small"
                                                label="Giá trị giảm giá theo %"
                                                fullWidth
                                                type="number"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    min: 0
                                                }}
                                                inputRef={dealForm.register}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                name="discount.maxPercentageDiscount"
                                                variant="outlined"
                                                size="small"
                                                label="Giá trị giảm tối đa"
                                                placeholder=""
                                                fullWidth
                                                type="number"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    min: 0
                                                }}
                                                inputRef={dealForm.register}
                                            />
                                        </Grid>
                                    </>
                                )} */}
                    </Grid>
                    <Grid item xs={12} md={5} container spacing={3}>
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
                                required
                                error={!!dealForm.errors.readyTime}
                                helperText={dealForm.errors.readyTime?.message}
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
                                type="number"
                                inputProps={{
                                    min: 0
                                }}
                                error={!!dealForm.errors.maxQuantity}
                                helperText={dealForm.errors.maxQuantity?.message}
                                inputRef={dealForm.register({
                                    ...DealValidation.maxQuantity,
                                    valueAsNumber: true,
                                })}
                            />
                        </Grid>
                        {/* Keep to not break layout */}
                        <Grid item xs={12} />
                        <Grid item xs={12} />
                    </Grid>
                    <Grid item xs={12} md={5} container spacing={3} alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant="h6">Danh sách sản phẩm thuộc deal</Typography>
                        </Grid>
                        {dealType === DealType.COMBO && (
                            <Table size="small">
                                <colgroup>
                                    <col width="45%" />
                                    <col width="40%" />
                                    <col width="15%" />
                                </colgroup>
                                <TableHead>
                                    <TableCell>sku</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell align="center">Thao tác</TableCell>
                                </TableHead>
                                <TableBody>
                                    {skus.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.sku}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    onClick={() => handleRemoveSku(item.sku)}
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
                                                inputProps={{
                                                    min: 1
                                                }}
                                                required
                                                error={!!skuForm.errors.quantity}
                                                helperText={skuForm.errors.quantity?.message}
                                                inputRef={skuForm.register(DealValidation.skus.quantity(skuQuantitySum, maxQuantity))}
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
                            <Grid item xs={12} md={5}>
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
                                />
                            </Grid>
                        )}
                    </Grid>
                    <Grid item xs={12} md={5} container spacing={3} alignItems="center">
                        <Grid item xs={12}>
                            <LabelBox label="Hình ảnh sản phẩm" padding={1}>
                                <ImageUploadField
                                    title="Cập nhật hình ảnh sản phẩm"
                                    images={productImages}
                                    handleCropCallback={handleCropCallback}
                                    handleRemoveImage={handleRemoveImage} />
                            </LabelBox>
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
