import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
const URI = `/marketplace/order/v1`
// const URI = ``

class OrderClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    getOrder(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${URI}/order/list`,
            {
                // q: q,
                offset: offset,
                limit: limit,
                // getTotal: true
            })
    }

    // getCustomerByCustomerID(customerID) {
    //     return this.callFromNextJS(
    //         "GET",
    //         `${URI}/account`,
    //         {
    //             customerID: customerID
    //         })
    // }

    // getCustomerByCustomerCode(customerCode) {
    //     return this.callFromNextJS(
    //         "GET",
    //         `${URI}/account`,
    //         {
    //             customerCode: customerCode
    //         })
    // }

    // createNewCustomer(data) {
    //     return this.callFromClient(
    //         "POST",
    //         `${URI}/account`,
    //         data
    //     )
    // }

    // updateCustomer(data) {
    //     return this.callFromClient(
    //         "PUT",
    //         `${URI}/account`,
    //         data
    //     )
    // }

    // updateStatus(data) {
    //     return this.callFromClient(
    //         "PUT",
    //         `${URI}/account/approve`,
    //         data
    //     )
    // }
}

export function getOrderClient(ctx, data) {
    return new OrderClient(ctx, data)
}
