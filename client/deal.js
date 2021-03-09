import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "./constrant";

const PREFIX = constURL.PREFIX_PRICING;

class DealClient extends APIClient {
    constructor(ctx, data) {
        super(ctx, data);
    }

    getDealList({
        offset,
        limit,
        q,
        dealType,
        getTotal = false,
    }) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/deal/list`,
            {
                offset,
                limit,
                q,
                dealType,
                getTotal,
            }
        )
    }
}

export function getDealClient(ctx, data) {
    return new DealClient(ctx, data);
}