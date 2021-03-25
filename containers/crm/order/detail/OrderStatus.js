import { Button } from "@material-ui/core";
import { OrderStatusColor, OrderStatusLabel } from "view-models/order";

export default function OrderStatus({ status }) {
    return (
        <Button
            size="small"
            variant="outlined"
            style={{
                color: OrderStatusColor[status],
                borderColor: OrderStatusColor[status],
            }}
            disabled
        >
            {OrderStatusLabel[status]}
        </Button>
    );
}
