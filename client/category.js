import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "./constant";
const prefix = constURL.PREFIX_PRODUCT
class CategoryClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    getListCategory(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${prefix}/category/list`, {
                q: q,
                offset: offset,
                limit: limit,
                getTotal: true
            })
    }

    getListCategoryFromClient(offset, limit, q) {
        return this.callFromClient(
            "GET",
            `${prefix}/category/list`, {
                q: q,
                offset: offset,
                limit: limit,
                getTotal: true
            })
    }
}

export function getCategoryClient(ctx, data) {
    return new CategoryClient(ctx, data)
}