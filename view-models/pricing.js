export const PriceLevelValidator = {
    name: {
        required: "Vui lòng nhập tên.",
        validate: (value) => {
            const validators = [
                {
                    value: new RegExp("[\\p{P}\\p{S}]", "ug"),
                    message: "Vui lòng nhập tên không bao gồm ký tự đặc biệt."
                },
                {
                    value: /^(.*[ ]{2})|^ /,
                    message: "Tên không hợp lệ (dư ký tự khoảng trắng).",
                }
            ]
            for (let i = 0; i < validators.length; i++) {
                if (validators[i].value?.test(value)) {
                    return validators[i].message;
                }
            }
        },
        min: {
            value: 6,
            message: "Vui lòng nhập tên có tối thiểu 6 ký tự.",
        },
        max: {
            value: 250,
            message: "Vui lòng nhập tên có tối đa 250 ký tự."
        }
    },
    fromPrice: {
        required: "Vui lòng nhập mức giá.",
        min: {
            value: 0,
            message: "Vui lòng nhập mức giá tối thiểu bằng 0.",
        },
    },
    toPrice: {
        required: "Vui lòng nhập mức giá.",
        min: {
            value: 0,
            message: "Vui lòng nhập mức giá tối thiểu bằng 0.",
        },
    },
    feeValue: {
        required: "Vui lòng nhập mức phí.",
    }
}