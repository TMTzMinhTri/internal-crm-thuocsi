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

    getOrderByFilter({
        q,
        orderNo,
        customerName,
        customerPhone,
        customerEmail,
        customerShippingAddress,
        price,
        status,
        limit,
        ofset,
    }) {
        return this.callFromClient(
            "POST",
            `${URI}/order/search`,
            {
                q,
                orderNo,
                customerName,
                customerPhone,
                customerEmail,
                customerShippingAddress,
                price,
                status,
                limit,
                ofset,
                getTotal: true,
            }
        )
    }

    getOrderByFilterFromNextJS({
        customerCode,
        limit,
        ofset,
    }) {
        return this.callFromNextJS(
            "POST",
            `${URI}/order/search`,
            {
                customerCode,
                limit,
                ofset,
            }
        )
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
                orderNo
            }
        )
    }

    getOrderByOrderNoFromClient(orderNo) {
        return this.callFromClient(
            "GET",
            `${URI}/order`,
            {
                orderNo
            }
        )
    }

    getOrderItemByOrderNo(orderNo) {
        return this.callFromNextJS(
            "GET",
            `${URI}/order-item`,
            {
                orderNo
            }
        )
    }

    getOrderItemByOrderNoFromClient(orderNo) {
        return this.callFromClient(
            "GET",
            `${URI}/order-item`,
            {
                orderNo
            }
        )
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

    removeOrderItem(data) {
        return this.callFromClient(
            'PUT',
            `${URI}/order-item/remove`,
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
