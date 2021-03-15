import { APIClient } from "@thuocsi/nextjs-components/lib/utils";

let apiPrefix = "/core/account/v1"

class AccountClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    getAccount(search, offset, limit) {
        return this.callFromNextJS(
            "GET",
            `${apiPrefix}/account/list`,
            {
                q: JSON.stringify({
                    "type": "CUSTOMER"
                }),
                search: search,
                offset: offset,
                limit: limit,
                getTotal: true
            })
    }

    getAccountByUsername(username) {
        return this.callFromNextJS(
            "GET",
            `/core/account/v1/account`,
            {
                "type": "CUSTOMER",
                "username": username,
                "getUserRole": true
            }
        )
    }

    updateCustomerAccount(data) {
        data.type = "CUSTOMER"
        return this.callFromClient(
            "PUT",
            "/core/account/v1/account",
            data
        )
    }

    updateAccountStatus(data) {
        data.type = "CUSTOMER"
        return this.callFromClient(
            "PUT",
            `${apiPrefix}/account/status`,
            data
        )
    }


    resetCustomerPassword(username) {
        return this.callFromClient(
            "PUT",
            `${apiPrefix}/account/reset-password`,
            {
                username: username,
                type: "CUSTOMER"
            }
        )
    }

}

export function getAccountClient(ctx, data) {
    return new AccountClient(ctx, data)
}