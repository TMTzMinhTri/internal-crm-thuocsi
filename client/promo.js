import { APIClient } from "@thuocsi/nextjs-lib/utils";
class PromoClient {

    constructor(ctx, data) {
        this.client = new APIClient(ctx, data)
    }

    // TODO

}

export function getPromoClient(ctx, data){
    return new PromoClient(ctx, data)
}
