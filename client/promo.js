import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import {constURL} from "./constant";


class PromoClient extends APIClient{

    constructor(ctx, data) {
        super(ctx, data)
    }

    createPromotion(data) {
        console.log('data',data)
        return this.callFromClient(
            "POST",
            `${constURL.PREFIX_PROMOTION}/promotion`,data
        )
    }

    getPromotionByID(promotionId) {
        return this.callFromNextJS(
            "GET",
            `${constURL.PREFIX_PROMOTION}/promotion`,
            {promotionId}
        )
    }

    getPromotion(status,limit,offset,getTotal) {
        let q = JSON.stringify({status})
        return this.callFromNextJS(
            "GET",
            `${constURL.PREFIX_PROMOTION}/promotion`,
            {
                q,limit,getTotal,offset
            }
        )
    }

    // TODO

}

export function getPromoClient(ctx, data){
    return new PromoClient(ctx, data)
}
