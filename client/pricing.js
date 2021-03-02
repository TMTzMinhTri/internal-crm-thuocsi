import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "../components/component/constant";

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

    getListPricingByFilter({
        q,
        sku,
        productCode,
        type,
        price,
        status,
        limit,
        offset,
    }) {
        return this.callFromNextJS(
            "POST",
            `${prefix}/selling/search`,
            {
                q,
                sku,
                productCode,
                type,
                price,
                status,
                limit,
                offset,
                getTotal: true,
            }
        )
    }

    getListPricingByFilterFromClient({
        q,
        sku,
        productCode,
        type,
        price,
        status,
        limit,
        offset,
    }) {
        return this.callFromClient(
            "POST",
            `${prefix}/selling/search`,
            {
                q,
                sku,
                productCode,
                type,
                price,
                status,
                limit,
                offset,
                getTotal: true,
            }
        )
    }

    getListProductByProductCode(productCodes) {
        return this.callFromNextJS(
            "POST",
            `${prefixProduct}/product/list`, {
            productCodes
        });
    }

    getListProductByProductCodeFromClient(productCodes) {
        return this.callFromClient(
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

    updatePriceGenConfig(data) {
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

    getCategoryFromCache() {
        return this.callFromNextJS(
            "GET",
            `${prefixProduct}/categories/list`,
        );
    }

    getConfigPriceByID(priceCode) {
        return this.callFromNextJS(
            "GET",
            `${prefix}/product/config`, {
            priceCode
        });
    }

    getPricingTicketByCode(code) {
        return {
            data: [
                {
                    code,
                    name: "Seller request update sku #Medx.LHPGEQ1PGE",
                    status: "NEW",
                    next : {
                        sellerCode : "Medx",
                        retailPrice : {
                            price : 1000022,
                            type : "FIXED_PRICE"
                        },
                        brand : "LOCAL",
                        maxQuantity : 100054,
                    },
                    previous : {
                        brand : "LOCAL",
                        maxQuantity : 1000,
                        retailPrice : {
                            type : "FIXED_REVENUE",
                            price : 10000
                        },
                    },
                }
            ],
            status: "OK",
        };
    }
}

export function getPricingClient(ctx, data) {
    return new PricingClient(ctx, data)
}
