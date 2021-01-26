import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "./constrant";
const { PREFIX_MASTER } = constURL;
const PREFIX = constURL.PREFIX_PRICING;

class FeeClient extends APIClient {
    constructor(ctx, data) {
        super(ctx, data)
    }

    getFee(offset, limit, q) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/fee/list`,
            {
                q,
                offset,
                limit,
                getTotal: true
            })
    }

    getFeeByCode(feeCode) {
        return this.callFromNextJS(
            "GET",
            `${PREFIX}/fee`,
            {
                feeCode,
            })
    }

    createFee(feeData) {
        return this.callFromClient(
            "POST",
            `${PREFIX}/fee`,
            feeData
        )
    }

    updateFee(feeData) {
        return this.callFromClient(
            "PUT",
            `${PREFIX}/fee`,
            feeData
        )
    }

    getRegionFeeList(offset, limit, q) {
        return this.callFromNextJS(
            'GET',
            `${PREFIX_MASTER}/region/list`,
            {
                offset,
                limit,
                q,
            }
        )
    }

    getProvinceFeeList(offset, limit, q) {
        return this.callFromNextJS(
            'GET',
            `${PREFIX_MASTER}/province/list`,
            {
                offset,
                limit,
                q,
            }
        )
    }

    getDistrictFeeList(offset, limit, q) {
        return this.callFromNextJS(
            'GET',
            `${PREFIX_MASTER}/district/list`,
            {
                offset,
                limit,
                q,
            }
        )
    }

    getWardFeeList(offset, limit, q) {
        return this.callFromNextJS(
            'GET',
            `${PREFIX_MASTER}/ward/list`,
            {
                offset,
                limit,
                q,
            }
        )
    }

    getCustomerLevelFeeList() {
        return this.callFromNextJS(
            'GET',
            `${PREFIX_MASTER}/level/list`,
            {}
        )   
    }

    updateRegionFee(code, fee) {
        return this.callFromClient(
            'PUT',
            `${PREFIX_MASTER}/region`,
            {
                code,
                fee,
            }
        )
    }

    updateProvinceFee(code, fee) {
        return this.callFromClient(
            'PUT',
            `${PREFIX_MASTER}/province`,
            {
                code,
                fee,
            }
        )
    }

    updateDistrictFee(code, fee) {
        return this.callFromClient(
            'PUT',
            `${PREFIX_MASTER}/district`,
            {
                code,
                fee,
            }
        )
    }

    updateWardFee(code, fee) {
        return this.callFromClient(
            'PUT',
            `${PREFIX_MASTER}/ward`,
            {
                code,
                fee,
            }
        )
    }

    updateCustomerLevelFee() {
        return this.callFromClient(
            'PUT',
            `${PREFIX_MASTER}/level`,
        )   
    }
}

export function getFeeClient(ctx, data = { props: {} }) {
    return new FeeClient(ctx, data)
}