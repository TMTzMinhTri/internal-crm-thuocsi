import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-components/lib/login";
import {getProductClient} from "client/product";
import renderForm from "./form";
import {getPriceClient} from "../../../client/price";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadProduct(ctx)
    })
}

export async function loadProduct(ctx) {
    let data = {props: {}}
    let _client = getPriceClient(ctx, {})
    let query = ctx.query
    let code = query.sellPriceCode
    let res = await _client.getSellingPricingByCode(code)
    console.log(res)
    if (res.status !== "OK") {
        data.props.price = {}
    } else {
        data.props.price = res?.data[0]
        let productCode = data.props.price.productCode
        let _client2 = getProductClient(ctx, {})
        res = await _client2.getListProductByIdsOrCodes([], [productCode])
        data.props.product = res?.data[0]
    }

    return data
}

export default function EditPage(props) {
    return renderWithLoggedInUser(props, renderForm)
}

