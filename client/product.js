import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import {queryParamGetProductGift} from "../components/component/constant";
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

    getProductListNone(limit) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/product/list`, {limit})
    }

    searchProductCategoryListFromClient(productName,categoryCode) {
        let data = {}
        if (productName) {
            data = {
                ...data,
                q: productName
            }
        }
        if (categoryCode) {
            data = {
                ...data,
                categoryCode: categoryCode,
            }
        }
        return this.callFromClient(
            "GET",
            `${PREFIX}/product/category/list`, data)
    }

    searchProductListFromClient(productName,categoryCode) {
        let data = {}
        if (productName) {
            data = {
                ...data,
                q: productName
            }
        }
        if (categoryCode) {
            data = {
                ...data,
                categoryCode: categoryCode,
            }
        }
        return this.callFromClient(
            "GET",
            `${PREFIX}/product/list`, data)
    }

    async getProductListFromClient(q) {
        return this.callFromClient(
            "GET",
            `${PREFIX}/product/category/list`, {
                q: q,
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

    getListProductNoneFromClient(limit) {
        return this.callFromClient(
            "GET",
            `${PREFIX}/product/list`, {limit})
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
