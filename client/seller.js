import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
const URI = `/seller/sellercenter/v1`
// const URI = ``

class SellerClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    getSeller(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${URI}/account/list`,
            {
                q: q,
                offset: offset,
                limit: limit,
                getTotal: true
            })
    }

    getSellerBySellerID(sellerID) {
        return this.callFromNextJS(
            "GET",
            `${URI}/account`,
            {
                sellerID: sellerID
            })
    }

    getSellerBySellerCode(sellerCode) {
        return this.callFromNextJS(
            "GET",
            `${URI}/account`,
            {
                sellerCode: sellerCode
            })
    }

    createNewSeller(data) {
        return this.callFromClient(
            "POST",
            `${URI}/account`,
            data
        )
    }

    updateSeller(data) {
        return this.callFromClient(
            "PUT",
            `${URI}/account`,
            data
        )
    }
}

export function getSellerClient(ctx, data) {
    return new SellerClient(ctx, data)
}
