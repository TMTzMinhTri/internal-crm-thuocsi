import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import {queryParamGetProductGift} from "./constant";
const PREFIX = `/marketplace/product/v1`
// const PREFIX = ``

class ProductClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    getListProduct(query) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/product/list`, query)
    }

    getListProductByIdsOrCodes(ids, codes) {
        return this.callFromNextJS(
            "POST",
            `${PREFIX}/product/list`,
            {
                productIds: ids,
                productCodes: codes
            })
    }

    getListSKUProduct(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/sku/list`,
            {
                q,
                offset,
                limit,
                getTotal: true
            }
        )
    }

    postListProducstWithCodes(productCodes) {
        return this.callFromNextJS(
            "POST",
            `${PREFIX}/product/list`,
            {
                productCodes
            })
    }

    getProductByCategoryCode(categoryCode) {
        return this.callFromClient(
            "GET",
            `${PREFIX}/product/category/list`,
            {categoryCode}
            )
    }


    getProductList(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/product/list`, {
            q: q,
            offset: offset,
            limit: limit,
            getTotal: true
        })
    }

    searchProductListFromClient(q,gift) {
        return this.callFromClient(
            "GET",
            `${PREFIX}/product/category/list`, {
                q: q,
                categoryCode: gift,
            })
    }

    getProductHasPrice(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/product/list`, {
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
            `${PREFIX}/product/list`, {
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
