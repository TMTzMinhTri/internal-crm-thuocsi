import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "./constrant";
const {
    PREFIX_PRICING,
} = constURL;
const PREFIX = PREFIX_PRICING;

class PaymentClient extends APIClient {
    constructor(ctx, data) {
        super(ctx, data)
    }

    getListPaymentMethod(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/payment-method/list`,
            {
                q,
                offset,
                limit,
                getTotal: true
            })
    }

    getPaymentMethodByCode(paymentMethodCode) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/payment-method`,
            {
                paymentMethodCode
            })
    }

    getPaymentMethodByCodeFromClient(paymentMethodCode) {
        return this.callFromClient(
            "GET",
            `${PREFIX}/payment-method`,
            {
                paymentMethodCode
            })
    }

}

export function getPaymentClient(ctx, data = { props: {} }) {
    return new PaymentClient(ctx, data)
}