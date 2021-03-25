import { Button } from "@material-ui/core";
import { TicketStatusLabel, TicketStatusColor } from "view-models/ticket";

export default function TicketStatus({ val }) {
    return (
        <Button variant="outlined" style={{ color: TicketStatusColor[val], borderColor: TicketStatusColor[val] }} disabled>
            {TicketStatusLabel[val]}
        </Button>
    );
}
