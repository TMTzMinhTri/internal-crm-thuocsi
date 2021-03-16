import { constURL } from "../components/component/constant";
import { APIClient } from "@thuocsi/nextjs-components/lib/utils";

class VoucherClient extends APIClient {
    constructor(ctx, data) {
        super(ctx, data)
    }

    createVoucher(data) {
        return this.callFromClient(
            "POST",
            `${constURL.PREFIX_PROMOTION}/voucher`, data
        )
    }

    updateVoucher(data) {
        return this.callFromClient(
            "PUT",
            `${constURL.PREFIX_PROMOTION}/voucher`, data
        )
    }

    updateVoucherStatus(voucherId, status) {
        return this.callFromClient(
            "PUT",
            `${constURL.PREFIX_PROMOTION}/voucher/status`, { voucherId, status }
        )
    }

    getVoucherById(voucherId) {
        return this.callFromNextJS(
            "GET",
            `${constURL.PREFIX_PROMOTION}/voucher`,
            { voucherId }
        )
    }

    getVoucherCode(code, limit, offset, getTotal) {
        let q = JSON.stringify({ code })
        console.log('data', q)
        return this.callFromNextJS(
            "GET",
            `${constURL.PREFIX_PROMOTION}/voucher`,
            {
                q: q, limit, getTotal, offset
            }
        )
    }

    getVoucherFromClient(code, limit, offset, getTotal) {
        let q = JSON.stringify({ code })
        return this.callFromClient(
            "GET",
            `${constURL.PREFIX_PROMOTION}/voucher`,
            {
                q: q, limit, getTotal, offset
            }
        )
    }

    createGift(data) {
        return this.callFromClient(
            "POST",
            `${constURL.PREFIX_PROMOTION}/gift-setting`,
            data
        )
    }

    getGiftSetting() {
        return this.callFromNextJS(
            "GET",
            `${constURL.PREFIX_PROMOTION}/gift-setting`,
        )
    }

    getListVouchersByCodes(voucherCodes) {
        return this.callFromNextJS(
            "POST",
            `${constURL.PREFIX_PROMOTION}/voucher/list`,
            { voucherCodes }
        )
    }
}

export function getVoucherClient(ctx, data) {
    return new VoucherClient(ctx, data)
}
