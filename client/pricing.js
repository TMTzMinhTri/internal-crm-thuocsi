import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
const prefix = `/marketplace/pricing/v1`

class PricingClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    getListPricing(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${prefix}/selling/list`, {
                q,
                offset,
                limit,
                getTotal: true
            })
    }
}

export function getPricingClient(ctx, data) {
    return new PricingClient(ctx, data)
}