import { FormCommonValidator } from "utils/HookForm";

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

export const DealValidation = {
    startTime: {
        required: "Thời gian bắt đầu không được để trống.",
    },
    endTime: {
        required: "Thời gian kết thúc không được để trống.",
    },
    readyTime: {
        required: "Thời gian cho phép hiển thị không được để trống.",
    },
    name: {
        required: "Tên deal không được để trống.",
    },
    maxQuantity: {
        required: "Số lượng được phép bán không được để trống.",
        min: {
            value: 0,
            message: "Số lượng được phép bán không được nhỏ hơn 0.",
        },
        validate: {
            noDecimal: FormCommonValidator.noDecimal,
        }
    },
    price: {
        required: "Giá không được để trống.",
        min: {
            value: 1,
            message: "Giá không được nhỏ hơn 1.",
        },
        max: {
            value: 1000000000,
            message: "Giá không được lớn hơn 1,000,000,000.",
        },
        validate: {
            noDecimal: FormCommonValidator.noDecimal,
        }
    },
    skus: {
        select: {
            required: "Vui lòng chọn sku.",
        },
        quantity: {
            required: "Số lượng không được để trống.",
            min: {
                value: 1,
                message: "Số lượng không được nhỏ hơn 1.",
            },
            max: {
                value: 1000000000,
                message: "Số lượng không được lớn hơn 1,000,000,000.",
            },
            validate: {
                noDecimal: FormCommonValidator.noDecimal,
            }
        },
    },
    imageUrls: {
        combo: {
            required: "Vui lòng chọn hình ảnh sản phẩm.",
            validate: (value) => {
                if (Array.isArray(value) && value.length < 2) {
                    return "Combo phải có tối thiểu 2 hình ảnh sản phẩm.";
                }
            }
        }
    }
}