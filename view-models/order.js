export const OrderPaymentMethod = {
    PAYMENT_METHOD_BANK: "PAYMENT_METHOD_BANK",
}

export const OrderStatus = {
    WAIT_CONFIRM: "WaitConfirm",
    CONFIRMED: "Confirmed",
    CANCELED: "Canceled",
}

export const OrderValidation = {
    name: {
        required: "Tên khách hàng không thể để trống",
        maxLength: {
            value: 50,
            message: "Tên khách hàng có độ dài tối đa 50 kí tự"
        },
        minLength: {
            value: 6,
            message: "Tên khách hàng có độ dài tối thiểu 6 kí tự"
        },
        pattern: {
            value: /^(?!.*[ ]{2})/,
            message: "Tên không hợp lệ (không được dư khoảng trắng)."
        }
    },
    phone: {
        required: "Số điện thoại không thể để trống",
        pattern: {
            value: /^[0-9]{10,12}$/,
            message: "Số điện thoại không hợp lệ"
        },
    },
    address: {
        required: "Địa chỉ không thể để trống",
        maxLength: {
            value: 250,
            message: "Địa chỉ có độ dài tối đa 250 kí tự"
        },
        minLength: {
            value: 1,
            message: "Địa chỉ có độ dài tối thiểu 1 kí tự"
        },
        pattern: {
            value: /^(?!.*[ ]{2})/,
            message: "Địa chỉ không hợp lệ (không được dư khoảng trắng)."
        }
    },
    province: {
        required: "Vui lòng chọn."
    },
    district: {
        required: "Vui lòng chọn."
    },
    ward: {
        required: "Vui lòng chọn."
    }
}