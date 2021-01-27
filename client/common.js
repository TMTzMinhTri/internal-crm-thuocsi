import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "../components/component/constant";

class CommonAPI extends APIClient {
    constructor(ctx, data) {
        super(ctx, data);
    }

    getListLevelCustomers() {
        return this.callFromNextJS("GET", `${constURL.PREFIX_CUSTOMER}/level/list`);
    }
}

export function getCommonAPI(ctx, data) {
    return new CommonAPI(ctx, data);
}
