import { Button } from "@material-ui/core";
import { TicketStatusLabel, TicketStatusColor } from "view-models/ticket";

export default function TicketStatus({ status }) {
    return (
        <Button variant="outlined" style={{ color: TicketStatusColor[status], borderColor: TicketStatusColor[status] }} disabled>
            {TicketStatusLabel[status]}
        </Button>
    );
}
