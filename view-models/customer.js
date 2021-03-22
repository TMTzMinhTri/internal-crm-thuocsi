export const CustomerStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
}

export const CustomerStatusLabel = {
    [CustomerStatus.ACTIVE]: "Đang hoạt động",
    [CustomerStatus.INACTIVE]: "Chưa kích hoạt",
}

export const CustomerScope = {
    PHARMACY: "PHARMACY",
    CLINIC: "CLINIC",
    DRUGSTORE: "DRUGSTORE"
}

export const CustomerScopeLabel = {
    [CustomerScope.PHARMACY]: "Nhà thuốc",
    [CustomerScope.CLINIC]: "Phòng khám",
    [CustomerScope.DRUGSTORE]: "Quầy thuốc"
}

export const customerValidation = {
    point: {
        min: {
            value: 0,
            message: "Điểm không được nhỏ hơn 0",
        }
    },
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
    email: {
        required: "Email khách hàng không thể để trống",
        pattern: {
            value: /^([a-z0-9])+([\._+][a-z0-9]+)*@([a-z0-9]+\.)+[a-z0-9]+$/,
            message: "Email không hợp lệ",
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
    legalRepresentative: {
        required: "Người đại diện không thể để trống",
        maxLength: {
            value: 100,
            message: "Người đại diện có độ dài tối đa 100 kí tự"
        },
        minLength: {
            value: 1,
            message: "Người đại diện có độ dài tối thiểu 1 kí tự"
        },
        pattern: {
            value: /^(?!.*[ ]{2})/,
            message: "Người đại diện không hợp lệ (không được dư khoảng trắng)."
        }
    },
    companyName: {
        validate: (value) => {
            const validators = [
                {
                    value: /^(.*[ ]{2})|^ /,
                    message: "Tên công ty không hợp lệ (dư ký tự khoảng trắng).",
                }
            ]
            for (let i = 0; i < validators.length; i++) {
                if (validators[i].value?.test(value)) {
                    return validators[i].message;
                }
            }
        }
    },
    companyAddress: {
        validate: (value) => {
            const validators = [
                {
                    value: /^(.*[ ]{2})|^ /,
                    message: "Địa chỉ công ty không hợp lệ (dư ký tự khoảng trắng).",
                }
            ]
            for (let i = 0; i < validators.length; i++) {
                if (validators[i].value?.test(value)) {
                    return validators[i].message;
                }
            }
        }
    },
    mst: {
        required: "Mã số thuế không thể để trống",
        maxLength: {
            value: 50,
            message: "Mã số thuế có độ dài tối đa 50 kí tự"
        },
        minLength: {
            value: 1,
            message: "Mã số thuế có độ dài tối thiểu 1 kí tự"
        },
        pattern: {
            value: /^(?!.*[ ]{2})/,
            message: "Mã số thuế không hợp lệ (không được dư khoảng trắng)."
        }
    },
    password: {
        required: "Mật khẩu không thể để trống",
        pattern: {
            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,12}$/,
            message: "Mật khẩu có độ dài từ 8 đến 12 kí tự, phải có ít nhất 1 chữ thường, 1 chữ hoa và 1 số"
        }
    }
};