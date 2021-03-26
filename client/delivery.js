import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "./constrant";
const {
    PREFIX_PRICING,
} = constURL;
const PREFIX = PREFIX_PRICING;

class DeliveryClient extends APIClient {
    constructor(ctx, data) {
        super(ctx, data)
    }

    getListDelivery(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/delivery-platforms/list`,
            {
                q,
                offset,
                limit,
                getTotal: true
            })
    }

    getListDeliveryByCode(deliveryPlatformCode) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/delivery-platform`,
            {
                deliveryPlatformCode
            })
    }

    getListDeliveryByCodeFromClient(deliveryPlatformCode) {
        return this.callFromClient(
            "GET",
            `${PREFIX}/delivery-platform`,
            {
                deliveryPlatformCode
            })
    }

    getListPaymentMethodByCode(paymentMethodCode) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/payment-method`,
            {
                paymentMethodCode
            })
    }

}

export function getDeliveryClient(ctx, data = { props: {} }) {
    return new DeliveryClient(ctx, data)
}