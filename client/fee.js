import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "./constrant";
const {
    PREFIX_MASTER,
    PREFIX_CUSTOMER,
    PREFIX_PRODUCT,
    PREFIX_PRICING,
} = constURL;
const PREFIX = PREFIX_PRICING;

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

    getTagFeeList(offset, limit, q) {
        return this.callFromNextJS(
            'GET',
            `${PREFIX_PRODUCT}/tags/list`,
            {
                offset,
                limit,
                q,
                getTotal: true,
            }
        )
    }

    getThresholdFeeList(offset, limit, q) {
        return this.callFromNextJS(
            'GET',
            `${PREFIX_PRODUCT}/thresholds/list`,
            {
                offset,
                limit,
                q,
                getTotal: true,
            }
        )
    }

    updateRegionFee({ code, feeValue, estThuocSi, estLogistic }) {
        return this.callFromClient(
            'PUT',
            `${PREFIX_MASTER}/region/fee`,
            {
                code,
                feeValue,
                estThuocSi,
                estLogistic
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

    updateTagFee(code, fee) {
        return this.callFromClient(
            'PUT',
            `${PREFIX_PRODUCT}/tags/fee`,
            {
                code,
                feeValue: fee,
            }
        )
    }

    updatePriceLevelFee(code, fee) {
        return this.callFromClient(
            'PUT',
            `${PREFIX}/price-level/fee`,
            {
                code,
                feeValue: fee,
            }
        )
    }

    approveFee({ code, status }) {
        return this.callFromClient(
            'PUT',
            `${PREFIX}/fee/approve`,
            {
                code,
                status
            }
        )
    }

    lockFee({ code, status }) {
        return this.callFromClient(
            'PUT',
            `${PREFIX}/fee/lock`,
            {
                code,
                status
            }
        )
    }
}

export function getFeeClient(ctx, data = { props: {} }) {
    return new FeeClient(ctx, data)
}