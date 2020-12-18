import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
const prefix = `/marketplace/pricing/v1`
class PricingClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    createNewPricing(data) {
        return this.callFromClient(
            "POST",
            `${prefix}/selling`,
            data
        )
    }
}

export function getPricingClient(ctx, data){
    return new PricingClient(ctx, data)
}
