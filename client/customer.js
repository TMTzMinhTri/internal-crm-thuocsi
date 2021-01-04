import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
const URI = `/marketplace/customer/v1`
// const URI = ``

class CustomerClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    getCustomer(offset, limit, q) {
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

    getCustomerByCustomerID(customerID) {
        return this.callFromNextJS(
            "GET",
            `${URI}/account`,
            {
                customerID: customerID
            })
    }

    getCustomerByCustomerCode(customerCode) {
        return this.callFromNextJS(
            "GET",
            `${URI}/account`,
            {
                customerCode: customerCode
            })
    }

    createNewCustomer(data) {
        return this.callFromClient(
            "POST",
            `${URI}/account`,
            data
        )
    }

    updateCustomer(data) {
        return this.callFromClient(
            "PUT",
            `${URI}/account`,
            data
        )
    }
}

export function getCustomerClient(ctx, data) {
    return new CustomerClient(ctx, data)
}
