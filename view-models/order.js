export const OrderPaymentMethod = {
    PAYMENT_METHOD_BANK: "PAYMENT_METHOD_BANK",
};

export const OrderStatus = {
    WAIT_TO_CONFIRM: "WAIT_TO_CONFIRM",
    CONFIRMED: "CONFIRMED",
    PROCESSING: "PROCESSING",
    DELIVERING: "DELIVERING",
    CANCEL: "CANCEL",
    COMPLETED: "COMPLETED",
};

export const OrderStatusLabel = {
    [OrderStatus.WAIT_TO_CONFIRM]: "Chờ xác nhận",
    [OrderStatus.CONFIRMED]: "Đã xác nhận",
    [OrderStatus.PROCESSING]: "Đang xử lý",
    [OrderStatus.DELIVERING]: "Đang vận chuyển",
    [OrderStatus.CANCEL]: "Đã hủy",
    [OrderStatus.COMPLETED]: "Đã hoàn tất",
};

export const OrderStatusColor = {
    [OrderStatus.WAIT_TO_CONFIRM]: "green",
    [OrderStatus.CONFIRMED]: "blue",
    [OrderStatus.PROCESSING]: "blue",
    [OrderStatus.DELIVERING]: "blue",
    [OrderStatus.CANCEL]: "red",
    [OrderStatus.COMPLETED]: "blue",
};

export const OrderValidation = {
    customerName: {
        required: "Tên khách hàng không thể để trống",
        maxLength: {
            value: 50,
            message: "Tên khách hàng có độ dài tối đa 50 kí tự",
        },
        minLength: {
            value: 6,
            message: "Tên khách hàng có độ dài tối thiểu 6 kí tự",
        },
        pattern: {
            value: /^(?!.*[ ]{2})/,
            message: "Tên không hợp lệ (không được dư khoảng trắng).",
        },
    },
    customerPhone: {
        required: "Số điện thoại không thể để trống",
        pattern: {
            value: /^[0-9]{10,12}$/,
            message: "Số điện thoại không hợp lệ",
        },
    },
    customerShippingAddress: {
        required: "Địa chỉ không thể để trống",
        maxLength: {
            value: 250,
            message: "Địa chỉ có độ dài tối đa 250 kí tự",
        },
        minLength: {
            value: 1,
            message: "Địa chỉ có độ dài tối thiểu 1 kí tự",
        },
        pattern: {
            value: /^(?!.*[ ]{2})/,
            message: "Địa chỉ không hợp lệ (không được dư khoảng trắng).",
        },
    },
    province: {
        required: "Vui lòng chọn.",
    },
    district: {
        required: "Vui lòng chọn.",
    },
    ward: {
        required: "Vui lòng chọn.",
    },
};

export const OrderItemValidation = {
    quanitity: {
        validate: (max) => (value) => {
            if (value <= 0) return "Số lượng sản phẩm phải lớn hơn 0.";
            if (value > max) return "Không được tăng số lượng sản phẩm.";
        },
    },
};
