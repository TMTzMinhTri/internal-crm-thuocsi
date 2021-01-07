import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "./constant";

const prefixMaster = constURL.PREFIX_MASTER
const prefix = constURL.PREFIX_PRICING
const prefixProduct = `${constURL.PREFIX_PRODUCT}`
class PricingClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    getListPricing(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${prefix}/selling/list`, {
            q,
            offset,
            limit,
            getTotal: true
        })
    }

    getListProductByProductCode(productCodes) {
        return this.callFromNextJS(
            "POST",
            `${prefixProduct}/product/list`, {
            productCodes
        });
    }

    getListCategory(q) {
        return this.callFromNextJS(
            "GET",
            `${prefixProduct}/category/list`, {
            // q: q,
            // offset: 0,
            // limit: 100,
            // getTotal: true
        })
    }

    getListCategoryFromClient(q) {
        return this.callFromClient(
            "GET",
            `${prefixProduct}/category/list`, {
            q,
            getTotal: true
        })
    }

    updatePriceGenConfig(data){
        return this.callFromClient(
            "PUT",
            `${prefix}/product/config`,
            data
        )
    }

    createNewPriceGenConfig(data) {
        return this.callFromClient(
            "POST",
            `${prefix}/product/config`, data
        )
    }

    configPrice(data) {
        console.log({ ...data });
        return this.callFromClient(
            "POST",
            `${prefix}/product/config`, { ...data });
    }

    getListConfigPrice(data) {
        return this.callFromNextJS(
            "GET",
            `${prefix}/product/config/list`, {
            ...data,
            getTotal: true
        })
    }

    getConfigPriceByCode(code) {
        return this.callFromNextJS(
            "GET",
            `${prefix}/product/config?priceCode=${code}`)
    }

    getProvinceLists() {
        return this.callFromNextJS(
            "GET",
            `${prefixMaster}/province/list`, '');
    }

    getCategoryWithArrayID(data) {
        return this.callFromNextJS(
            "POST",
            `${prefixProduct}/category/list`, {
            codes: data
        });
    }

    getConfigPriceByID(priceCode) {
        return this.callFromNextJS(
            "GET",
            `${prefix}/product/config`, {
            priceCode
        });
    }

}

export function getPricingClient(ctx, data) {
    return new PricingClient(ctx, data)
}