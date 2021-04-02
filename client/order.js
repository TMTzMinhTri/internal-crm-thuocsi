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
        orderID,
        saleOrderCode,
        customerName,
        customerPhone,
        customerEmail,
        customerShippingAddress,
        price,
        status,
        limit,
        offset,
        dateFrom,
        dateTo
    }) {
        return this.callFromClient(
            "POST",
            `${URI}/order/search`,
            {
                q,
                orderID,
                saleOrderCode,
                customerName,
                customerPhone,
                customerEmail,
                customerShippingAddress,
                price,
                status,
                limit,
                offset,
                dateFrom,
                dateTo,
                getTotal: true,
            }
        )
    }

    getOrderByFilterFromNextJS({
        customerCode,
        limit,
        offset,
    }) {
        return this.callFromNextJS(
            "POST",
            `${URI}/order/search`,
            {
                customerCode,
                limit,
                offset,
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

    getCurrentCart({ phone }) {
        return this.callFromClient(
            "GET",
            `${URI}/admin/cart`,
            {
                phone
            }
        )
    }

    addProductToCart({ sku, phone, quantity }) {
        return this.callFromClient(
            "POST",
            `${URI}/admin/cart/add`,
            {
                sku,
                phone,
                quantity,
            }
        )
    }

    removeProductFromCart({ sku, phone }) {
        return this.callFromClient(
            "POST",
            `${URI}/admin/cart/remove`,
            {
                sku,
                phone,
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


}

export function getOrderClient(ctx, data) {
    return new OrderClient(ctx, data)
}
