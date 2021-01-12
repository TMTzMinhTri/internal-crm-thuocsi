import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
const URI = `/marketplace/promotion/v1`


class PromoClient extends APIClient{

    constructor(ctx, data) {
        super(ctx, data)
    }

    createPromotion() {
        return this.callFromClient(
            "POST",
            `${URI}/promotion`,
        )
    }

    getPromotionByID(promotionId) {
        return this.callFromNextJS(
            "GET",
            `${URI}/promotion`,
            {promotionId}
        )
    }

    getPromotion() {
        return this.callFromNextJS(
            "GET",
            `${URI}/promotion`
        )
    }

    // TODO

}

export function getPromoClient(ctx, data){
    return new PromoClient(ctx, data)
}
