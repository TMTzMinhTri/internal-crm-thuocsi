import React from "react";
import {
    MyCard,
    MyCardActions,
    MyCardContent,
    MyCardHeader,
} from "@thuocsi/nextjs-components/my-card/my-card";
import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    MenuItem,
    Switch,
    TextField,
    Typography,
} from "@material-ui/core";
import Link from "next/link";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
    DealFlashSaleLabel,
    DealStatus,
    DealStatusLabel,
    DealType,
    DealTypeOptions,
    DiscountType,
    DiscountTypeOptions,
} from "view-models/deal";
import MuiSingleAuto from "@thuocsi/nextjs-components/muiauto/single";
import { getPricingClient } from "client/pricing";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { unknownErrorText } from "components/commonErrors";


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
    discount: {
        type: DiscountType.ABSOLUTE,
        percentageDiscount: 0,
        maxPercentageDiscount: 0,
        absoluteDiscount: 0,
    },
    skus: [],
}
export const DealForm = ({ isUpdate, deal }) => {
    const toast = useToast();
    const dealForm = useForm({
        defaultValues: defaultValuesDealForm,
        mode: "onChange",
    });
    const { discount } = dealForm.watch();
    const dealSkusField = useFieldArray({
        control: dealForm.control,
        name: "skus",
    })

    const skuForm = useForm({
        defaultValues: {
            sku: "",
            sellerCode: "",
            quantity: 0,
        }
    });

    async function searchSkus(text) {
        const pricingClient = getPricingClient();
        const skusResp = await pricingClient.getListPricingByFilterFromClient({ q: text });
        if (skusResp.status !== "OK") {
            if (skusResp.status === "NOT_FOUND") {
                toast.error("Không tìm thấy sku.")
            } else {
                toast.error(skusResp.message ?? unknownErrorText);
            }
            return;
        }
        const skuOptions = skusResp.data?.map(({ sellerCode, sku }) => ({ value: sku, label: sku, sellerCode, sku })) ?? [];
        return skuOptions
    }

    async function addSku(formData) {
        console.log(formData);
        dealSkusField.append({
            sku: formData.sku,
            sellerCode: formData.sellerCode,
            quantity: formData.quantity,
        });
    }

    async function createOrUpdateDeal(formData) {
        console.log(formData);
    }

    const handleSearchSkus = async (text) => {
        try {
            return await searchSkus(text);
        } catch (e) {
            toast.error(e.message);
            return [];
        }
    }

    return (
        <MyCard>
            <form>
                <MyCardHeader title={isUpdate ? `Deal #${deal.code}` : "Tạo mới deal"} />
                <MyCardContent>
                    <Grid container spacing={8}>
                        <Grid item xs={12} md={5} container spacing={3}>
                            <Grid item xs={12}>
                                <Controller
                                    name="dealType"
                                    control={dealForm.control}
                                    defaultValue={DealType.DEAL}
                                    as={
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
                                        >
                                            {DealTypeOptions.map(({ value, label }) => (
                                                <MenuItem key={value} value={value}>{label}</MenuItem>
                                            ))}
                                        </TextField>
                                    }
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
                                    inputRef={dealForm.register}
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
                                    inputRef={dealForm.register}
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
                                    inputRef={dealForm.register}
                                />
                            </Grid>
                            <Grid item xs={12}>
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
                                )}
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
                                    inputRef={dealForm.register}
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
                                    inputRef={dealForm.register}
                                />
                            </Grid>
                            <Grid item xs={12} />
                            <Grid item xs={12} />
                        </Grid>
                        <Grid item xs={12} md={5} container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6">Danh sách sản phẩm thuộc deal</Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <MuiSingleAuto
                                    name="sku"
                                    options={[]}
                                    label="sku"
                                    placeholder="Tìm kiếm sku"
                                    required
                                    control={skuForm.control}
                                    errors={skuForm.errors}
                                    onFieldChange={handleSearchSkus}
                                    onValueChange={skuForm.handleSubmit(addSku)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="quantity"
                                    variant="outlined"
                                    size="small"
                                    label="Số lượng"
                                    type="number"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min: 0
                                    }}
                                    required
                                    inputRef={dealForm.register}
                                />
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
                        onClick={dealForm.handleSubmit(createOrUpdateDeal)}
                    >
                        Lưu
                    </Button>
                </MyCardActions>
            </form>
        </MyCard>
    );
}
