import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import {constURL} from "../components/component/constant";


class PromoClient extends APIClient{

    constructor(ctx, data) {
        super(ctx, data)
    }

    createPromotion(data) {
        return this.callFromClient(
            "POST",
            `${constURL.PREFIX_PROMOTION}/promotion`,data
        )
    }

    updatePromotion(data) {
        return this.callFromClient(
            "PUT",
            `${constURL.PREFIX_PROMOTION}/promotion`,data
        )
    }

    updateStatusPromotion(data) {
        return this.callFromClient(
            "PUT",
            `${constURL.PREFIX_PROMOTION}/promotion/status`,data
        )
    }

    getPromotionByID(promotionId) {
        return this.callFromNextJS(
            "GET",
            `${constURL.PREFIX_PROMOTION}/promotion`,
            {promotionId}
        )
    }

    getPromotion(promotionName,limit,offset,getTotal,status) {
        let q = JSON.stringify({promotionName,status})
        return this.callFromNextJS(
            "GET",
            `${constURL.PREFIX_PROMOTION}/promotion`,
            {
                q:q,limit,getTotal,offset
            }
        )
    }

    getPromotionFromClient(promotionName,limit,offset,getTotal,status) {
        let q = JSON.stringify({promotionName,status})
        return this.callFromClient(
            "GET",
            `${constURL.PREFIX_PROMOTION}/promotion`,
            {
                q:q,limit,getTotal,offset
            }
        )
    }

    // TODO

}

export function getPromoClient(ctx, data){
    return new PromoClient(ctx, data)
}
