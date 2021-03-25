import { Box } from "@material-ui/core";

export const DELIVERY_PLATFORM = {
    DELIVERY_PLATFORM_NORMAL: {
        value: "DELIVERY_PLATFORM_NORMAL",
        label: "Giao hàng tiêu chuẩn",
    },
};

export default function DeliveryPlatform({ val }) {
    return <Box>{DELIVERY_PLATFORM[val].label}</Box>;
}
