import {APIClient} from "@thuocsi/nextjs-components/lib/utils";
const URI = `/core/master-data/v1`
// const URI = ``

class MasterDataClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    getProvince(offset, limit, q, getTotal = true) {
        return this.callFromNextJS(
            "GET",
            `${URI}/province/list`,
            {
                q:q,
                offset: offset,
                limit: limit,
                getTotal,
            })
    }

    getProvinceFromClient(offset, limit, q, getTotal = true) {
        return this.callFromClient(
            "GET",
            `${URI}/province/list`,
            {
                q:q,
                offset: offset,
                limit: limit,
                getTotal,
            })
    }

    getDistrictByProvinceCode(provinceCode) {
        return this.callFromClient(
            "GET",
            `${URI}/district`,
            {
                provinceCode: provinceCode
            })
    }

    getDistrictByProvinceCodeFromNextJs(provinceCode) {
        return this.callFromNextJS(
            "GET",
            `${URI}/district`,
            {
                provinceCode: provinceCode
            })
    }

    getWardByDistrictCode(districtCode) {
        return this.callFromClient(
            "GET",
            `${URI}/administrative/list`,
            {
                districtCode: districtCode
            })
    }

    getWardByDistrictCodeFromNextJS(districtCode) {
        return this.callFromNextJS(
            "GET",
            `${URI}/administrative/list`,
            {
                districtCode: districtCode
            })
    }

    getProvinceByProvinceCode(provinceCode) {
        return this.callFromNextJS(
            "GET",
            `${URI}/province`,
            {
                code: provinceCode
            })
    }

    getDistrictByDistrictCode(districtCode) {
        return this.callFromNextJS(
            "GET",
            `${URI}/district`,
            {
                code: districtCode
            })
    }

    getWardByWardCode(wardCode) {
        return this.callFromNextJS(
            "GET",
            `${URI}/administrative/list`,
            {
                wardCode: wardCode
            })
    }

    getWardByWardCodeFromClient(wardCode) {
        return this.callFromClient(
            "GET",
            `${URI}/administrative/list`,
            {
                wardCode: wardCode
            })
    }
}

export function getMasterDataClient(ctx, data) {
    return new MasterDataClient(ctx, data)
}
