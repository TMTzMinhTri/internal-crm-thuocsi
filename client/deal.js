import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "./constrant";

const PREFIX = constURL.PREFIX_PRICING;

class DealClient extends APIClient {
    constructor(ctx, data) {
        super(ctx, data);
    }

    getDealList({
        offset,
        limit,
        q,
        dealType,
        getTotal = false,
    }) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/deal/list`,
            {
                offset,
                limit,
                q,
                dealType,
                getTotal,
            }
        )
    }

    getDealByCode(code) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/deal`,
            {
                dealCode: code
            }
        )
    }

    createDeal({
        startTime,
        endTime,
        readyTime,
        name,
        dealType,
        description,
        status,
        tags,
        imageUrls,
        isFlashSale,
        maxQuantity,
        price,
        skus,
    }) {
        return this.callFromClient(
            "POST",
            `${PREFIX}/deal`,
            {
                startTime,
                endTime,
                readyTime,
                name,
                dealType,
                description,
                status,
                tags,
                imageUrls,
                isFlashSale,
                maxQuantity,
                price,
                skus,
            }
        )
    }

    updateDeal({
        startTime,
        endTime,
        readyTime,
        name,
        dealType,
        description,
        status,
        tags,
        imageUrls,
        isFlashSale,
        maxQuantity,
        price,
        skus,
    }) {
        return this.callFromClient(
            "PUT",
            `${PREFIX}/deal`,
            {
                startTime,
                endTime,
                readyTime,
                name,
                dealType,
                description,
                status,
                tags,
                imageUrls,
                isFlashSale,
                maxQuantity,
                price,
                skus,
            }
        )
    }
}

export function getDealClient(ctx, data) {
    return new DealClient(ctx, data);
}