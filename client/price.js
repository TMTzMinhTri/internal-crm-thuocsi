import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
const PREFIX = `/marketplace/pricing/v1`
// const PREFIX = ``

class PriceClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    getPrice(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/product/list`,
            {
                q: q,
                offset: offset,
                limit: limit,
                getTotal: true
            })
    }

    getPriceByPriceID(productID) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/product`,
            {
                productID: productID
            })
    }

    getListPriceByProductIds(productIds) {
        return this.callFromNextJS(
            "POST",
            `${PREFIX}/product/list`,
            {
                productIds: productIds
            })
    }

    createNewPrice(data) {
        return this.callFromClient(
            "POST",
            `${PREFIX}/product`,
            data
        )
    }

    updatePrice(data) {
        return this.callFromClient(
            "PUT",
            `${PREFIX}/product`,
            data
        )
    }

    createNewPricing(data) {
        return this.callFromClient(
            "POST",
            `${PREFIX}/selling`,
            data
        )
    }
}

export function getPriceClient(ctx, data) {
    return new PriceClient(ctx, data)
}
