import {APIClient} from "@thuocsi/nextjs-components/lib/utils";
const PREFIX = `/marketplace/product/v1`
// const PREFIX = ``

class ProductClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    getListProduct(query){
        return this.callFromNextJS(
            "GET",
            `${prefix}/product/list`,query)
    }

    getProductList(offset, limit, q) {
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

    getProductHasPrice(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/product/list`,
            {
                q: q,
                offset: offset,
                limit: limit,
                filter: "hasPrice",
                getTotal: true
            })
    }

    getProductNoPrice(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/product/list`,
            {
                q: q,
                offset: offset,
                limit: limit,
                filter: "noPrice",
                getTotal: true
            })
    }
}

export function getProductClient(ctx, data) {
    return new ProductClient(ctx, data)
}
