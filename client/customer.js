import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
const URI = `/marketplace/customer/v1`;
// const URI = ``

class CustomerClient extends APIClient {
    constructor(ctx, data) {
        super(ctx, data);
    }

    getCustomer(offset, limit, q) {
        return this.callFromNextJS("GET", `${URI}/account/list`, {
            q: q,
            offset: offset,
            limit: limit,
            getTotal: true,
        });
    }

    getCustomerClient(q) {
        return this.callFromClient("GET", `${URI}/account/list`, {
            q: q,
            limit: 20,
            getTotal: true,
        });
    }

    getCustomerByCustomerID(customerID) {
        return this.callFromNextJS("GET", `${URI}/account`, {
            customerID: customerID,
        });
    }

    getLevel() {
        return this.callFromClient("GET", `${URI}/level/list`);
    }

  getLevelByCodes(codes) {
    return this.callFromClient("POST", `${URI}/level/list`, { codes });
  }
    getLevelByIDs(ids) {
        return this.callFromClient("POST", `${URI}/level/list`, { ids });
    }

    getCustomerByIDs(ids) {
        return this.callFromNextJS("POST", `${URI}/account/list`, { ids });
    }

    getCustomerFromClient(offset, limit, q) {
        return this.callFromClient("GET", `${URI}/account/list`, {
            q: q,
            offset: offset,
            limit: limit,
            getTotal: true,
        });
    }

    getCustomerByCustomerCode(customerCode) {
        return this.callFromNextJS("GET", `${URI}/account`, {
            customerCode: customerCode,
        });
    }

    createNewCustomer(data) {
        return this.callFromClient("POST", `${URI}/account`, data);
    }

    updateCustomer(data) {
        return this.callFromClient("PUT", `${URI}/account`, data);
    }

    approveAccount(data) {
        return this.callFromClient("PUT", `${URI}/account/approve`, data);
    }

    lockAccount(data) {
        return this.callFromClient("PUT", `${URI}/account/lock`, data);
    }
}

export function getCustomerClient(ctx, data) {
    return new CustomerClient(ctx, data);
}
