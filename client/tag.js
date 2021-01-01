import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "./constant";
const prefix = constURL.PREFIX_PRODUCT

class TagClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    getListTag(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${prefix}/tag/list`, {
            q: q,
            offset: offset,
            limit: limit,
            getTotal: true
        })
    }

    getTagByTagCode(tagCode) {
        return this.callFromNextJS(
            "GET",
            `${prefix}/tag`,
            {
                tagCode: tagCode,
            }
        )
    }

    createTag(body) {
        return this.callFromClient(
            "POST",
            `${prefix}/tag`,
            body
        )
    }

    updateTag(data) {
        return this.callFromClient(
            "PUT",
            `${prefix}/tag`,
            data
        )
    }
}

export function getTagClient(ctx, data) {
    return new TagClient(ctx, data)
}