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
        status,
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
                status,
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

    updateDealStatus({
        code,
        status,
    }) {
        return this.callFromClient(
            "PUT",
            `${PREFIX}/deal/status`,
            {
                code,
                status,
            }
        )
    }
}

export function getDealClient(ctx, data) {
    return new DealClient(ctx, data);
}