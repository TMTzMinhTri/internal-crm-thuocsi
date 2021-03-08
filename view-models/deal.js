export const DealType = {
    DEAL: "DEAL",
    COMBO: "COMBO",
};

export const DealTypeLabel = {
    [DealType.DEAL]: "Khuyến mãi",
    [DealType.COMBO]: "Combo",
};

export const DealTypeOptions = Object.keys(DealType).map((key) => ({
    value: DealType[key],
    label: DealTypeLabel[DealType[key]],
}));

export const DealStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
};

export const DealStatusLabel = {
    [DealStatus.ACTIVE]: "Đang hoạt động",
    [DealStatus.INACTIVE]: "Không hoạt động",
};

export const DealStatusOptions = Object.keys(DealStatus).map((key) => ({
    value: DealStatus[key],
    label: DealStatusLabel[DealStatus[key]],
}));

export const DealFlashSaleLabel = {
    [true]: "Bật flash sale",
    [false]: "Tắt flash sale",
};

export const DiscountType = {
    PERCENTAGE: "PERCENTAGE",
    ABSOLUTE: "ABSOLUTE",
}

export const DiscountTypeLabel = {
    [DiscountType.ABSOLUTE]: "Giảm giá tuyệt đối",
    [DiscountType.PERCENTAGE]: "Giảm giá theo %",
}

export const DiscountTypeOptions = Object.keys(DiscountType).map((key) => ({
    value: DiscountType[key],
    label: DiscountTypeLabel[DiscountType[key]],
}));