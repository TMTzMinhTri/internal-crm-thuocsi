import { APIClient } from "@thuocsi/nextjs-lib/utils";
class CategoryClient {

    constructor(ctx, data) {
        this.client = new APIClient(ctx, data)
    }

    // TODO

}

export function getCategoryClient(ctx, data){
    return new CategoryClient(ctx, data)
}
