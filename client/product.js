import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
const prefix = `/marketplace/product/v1`
class ProductClient extends APIClient {

    constructor(ctx, data) {
        super(ctx, data)
    }

    getListProduct(query){
        return this.callFromNextJS(
            "GET",
            `${prefix}/product/list`,query)
    }
}

export function getProductClient(ctx, data){
    return new ProductClient(ctx, data)
}
