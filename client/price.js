import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
class PricingClient {

    constructor(ctx, data) {
        this.client = new APIClient(ctx, data)
    }

    // TODO
    async getConditionSellTypeByTag(query){
        return await this.client.makeRequest(
            "GET",
            // `${process.env.API_HOST}/customer/v1/selling-type`,query)
            `http://localhost/selling-type`,query)
    }
}

export function getPricingClient(ctx, data){
    return new PricingClient(ctx, data)
}
