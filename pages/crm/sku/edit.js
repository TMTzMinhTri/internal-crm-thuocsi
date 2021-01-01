import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { getProductClient } from "client/product";
import renderForm from "./form";
import { getPriceClient } from "../../../client/price";
import { getTagClient } from "client/tag";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadProduct(ctx)
    })
}

export async function loadProduct(ctx) {
    let data = { props: {} }
    let _client = getPriceClient(ctx, {})
    let query = ctx.query
    let code = query.sellPriceCode
    let res = await _client.getSellingPricingByCode(code)
    let _client1 = getTagClient(ctx, {})
    let listTag = await _client1.getListTag(0, 500, "")
    data.props.listTag = listTag.data || [];
    res.data[0].tagsName = [];
    if(res.data[0].tags) {
        for (let i = 0; i < res.data[0].tags.length; i++) {
            res.data[0].tagsName.push(
                listTag.data.filter(
                    (tag) => tag.code === res.data[0].tags[i]
                )[0].name
            );
        }
    }
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
    return renderWithLoggedInUser(props, render)
}

export function render(props) {
    return renderForm(props, useToast())
}