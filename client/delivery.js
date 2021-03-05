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
            `${PREFIX}/delivery-platform/list`,
            {
                q,
                offset,
                limit,
                getTotal: true
            })
    }

}

export function getDeliveryClient(ctx, data = { props: {} }) {
    return new DeliveryClient(ctx, data)
}