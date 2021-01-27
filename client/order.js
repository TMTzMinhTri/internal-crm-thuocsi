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
                q: q,
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

    getOrderByOrderNo(orderNo) {
        return this.callFromNextJS(
            "GET",
            `${URI}/order`,
            {
                order_no: orderNo
            })
    }

    getOrderItemByOrderNo(orderNo) {
        return this.callFromNextJS(
            "GET",
            `${URI}/order-item`,
            {
                order_no: orderNo
            })
    }

    updateOrder(data) {
        return this.callFromClient(
            "PUT",
            `${URI}/order`,
            data
        )
    }

    updateOrderItem(data) {
        return this.callFromClient(
            "PUT",
            `${URI}/order-item`,
            data
        )
    }

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
