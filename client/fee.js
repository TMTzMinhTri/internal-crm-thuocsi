import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "./constrant";
const { PREFIX_MASTER, PREFIX_CUSTOMER } = constURL;
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
                getTotal: true,
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
                getTotal: true,
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
                getTotal: true,
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
                getTotal: true,
            }
        )
    }

    getCustomerLevelFeeList() {
        return this.callFromNextJS(
            'GET',
            `${PREFIX_CUSTOMER}/level/list`,
            {}
        )
    }

    updateRegionFee(code, fee) {
        return this.callFromClient(
            'PUT',
            `${PREFIX_MASTER}/region/fee`,
            {
                code,
                feeValue: fee,
            }
        )
    }

    updateProvinceFee(code, fee) {
        return this.callFromClient(
            'PUT',
            `${PREFIX_MASTER}/province/fee`,
            {
                code,
                feeValue: fee,
            }
        )
    }

    updateDistrictFee(code, fee) {
        return this.callFromClient(
            'PUT',
            `${PREFIX_MASTER}/district/fee`,
            {
                code,
                feeValue: fee,
            }
        )
    }

    updateWardFee(code, fee) {
        return this.callFromClient(
            'PUT',
            `${PREFIX_MASTER}/ward/fee`,
            {
                code,
                feeValue: fee,
            }
        )
    }

    updateCustomerLevelFee(code, fee) {
        return this.callFromClient(
            'PUT',
            `${PREFIX_CUSTOMER}/level/fee`,
            {
                code,
                feeValue: fee,
            }
        )
    }
}

export function getFeeClient(ctx, data = { props: {} }) {
    return new FeeClient(ctx, data)
}