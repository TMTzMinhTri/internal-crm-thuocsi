import { Button } from "@material-ui/core";
import { OrderStatusColor, OrderStatusLabel } from "view-models/order";

export default function OrderStatus({ val }) {
    return (
        <Button
            size="small"
            variant="outlined"
            style={{
                color: OrderStatusColor[val],
                borderColor: OrderStatusColor[val],
            }}
            disabled
        >
            {OrderStatusLabel[val]}
        </Button>
    );
}
