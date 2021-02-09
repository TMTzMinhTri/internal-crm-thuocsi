export const FeeType = {
    FIXED_REVENUE: "FIXED_REVENUE",
    FIXED_PRICE: "FIXED_PRICE",
}

export const feeLabels = {
    [FeeType.FIXED_PRICE]: "Tính phí theo giá bán cuối",
    [FeeType.FIXED_REVENUE]: "Tính phí theo doanh thu người bán",
}

export const feeTypeOptions = [
    {
        value: FeeType.FIXED_PRICE,
        label: feeLabels[FeeType.FIXED_PRICE],
    },
    {
        value: FeeType.FIXED_REVENUE,
        label: feeLabels[FeeType.FIXED_REVENUE],
    }
]

export const feeValidation = {
    name: {
        required: "Vui lòng nhập tên phí dịch vụ",
        maxLength: {
            value: 50,
            message: "Tên phí dịch vụ tối đa 50 kí tự",
        },
        pattern: {
            value: /^(?!.*[ ]{2})/,
            message: "Tên không hợp lệ."
        },
        
    },
    formula: {
        required: "Vui lòng nhập công thức",
    },
}