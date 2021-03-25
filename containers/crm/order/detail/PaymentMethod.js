import { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import styles from "./detail.module.css";

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

export default function PaymentMethod({ paymentMethodCode }) {
    return <Box className={styles.paymentMethod}>{PAYMENT_METHOD[paymentMethodCode].label}</Box>;
}
