import { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import styles from "./detail.module.css";

export const DELIVERY_FLATFORM = {
    DELIVERY_PLATFORM_NORMAL: {
        value: "DELIVERY_PLATFORM_NORMAL",
        label: "Giao hàng tiêu chuẩn",
    },
};

export default function DeliveryFlatform({ deliveryFlatformCode }) {
    return <Box className={styles.deliveryFlatform}>{DELIVERY_FLATFORM[deliveryFlatformCode].label}</Box>;
}
