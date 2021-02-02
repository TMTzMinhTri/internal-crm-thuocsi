import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "./constrant";

const { PREFIX_PRICING } = constURL;

class PriceLevelClient extends APIClient {
    createPriceLevel({
        name,
        fromPrice,
        toPrice,
        description,
        feeValue,
    }) {
        return this.callFromClient(
            'POST',
            `${PREFIX_PRICING}/price-level`,
            {
                name,
                fromPrice,
                toPrice,
                description,
                feeValue,
            }
        )
    }

    getPriceLevelByCode(priceLevelCode) {
        return this.callFromNextJS(
            'GET',
            `${PREFIX_PRICING}/price-level`,
            {
                priceLevelCode,
            }
        )
    }

    getPriceLevelList(offset, limit, q) {
        return this.callFromNextJS(
            'GET',
            `${PREFIX_PRICING}/price-level/list`,
            {
                limit,
                offset,
                q,
            }
        )
    }
}

export function getPriceLevelClient(ctx, data) {
    return new PriceLevelClient(ctx, data);
}