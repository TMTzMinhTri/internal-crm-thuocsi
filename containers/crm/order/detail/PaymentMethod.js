import { Box } from "@material-ui/core";

export const PAYMENT_METHOD = {
    PAYMENT_METHOD_NORMAL: {
        value: "PAYMENT_METHOD_NORMAL",
        label: "Thanh toán tiền mặt khi nhận hàng",
    },
    PAYMENT_METHOD_BANK: {
        value: "PAYMENT_METHOD_BANK",
        label: "Chuyển khoản",
    },
};

export default function PaymentMethod({ val }) {
    return <Box>{PAYMENT_METHOD[val].label}</Box>;
}
