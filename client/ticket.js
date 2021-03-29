import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
const URI = `/marketplace/ticket/v1`
// const URI = ``

class TicketClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    getTicketByCustomer({
        customerCode,
        limit,
        offset,
    }) {
        return this.call(
            "GET",
            `${URI}/ticket/all`,
            {
                q: JSON.stringify({ customerCode }),
                limit,
                offset,
                getTotal: true,
            }
        )
    }

    getTicketByOrderNo({
        orderCode,
        limit,
        offset,
    }) {
        return this.call(
            "GET",
            `${URI}/ticket/all`,
            {
                q: JSON.stringify({ orderCode }),
                limit,
                offset,
                getTotal: true,
            }
        )
    }
}

export function getTicketClient(ctx, data) {
    return new TicketClient(ctx, data)
}
