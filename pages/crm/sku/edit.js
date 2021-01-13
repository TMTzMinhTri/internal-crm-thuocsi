import {
    doWithLoggedInUser,
    renderWithLoggedInUser
} from "@thuocsi/nextjs-components/lib/login";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getPriceClient } from "client/price";
import { getProductClient } from "client/product";
import { getTagClient } from "client/tag";
import renderForm from "./form";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadProduct(ctx);
    });
}

export async function loadProduct(ctx) {
    let data = {
        props: {
            status: 'OK'
        }
    };
    let _client = getPriceClient(ctx, {});
    let query = ctx.query;
    let code = query.sellPriceCode;
    let res = await _client.getSellingPricingByCode(code);

    if (res.status !== "OK") {
        data.props.status = res.status
        data.props.price = {};
    } else {
        let _client1 = getTagClient(ctx, {});
        let listTag = await _client1.getListTag(0, 100, "");
        data.props.listTag = listTag.data || [];
        res.data[0].tagsName = [];
        res.data[0].tagsName = [...res.data[0].tags] || []
        data.props.price = res?.data[0];
        let productCode = data.props.price.productCode;
        data.props.price.wholesalePrice = data.props.price.wholesalePrice.map(
            (price) => ({ ...price, percentageDiscount: price.percentageDiscount * 100 })
        );
        let _client2 = getProductClient(ctx, {});
        res = await _client2.getListProductByIdsOrCodes([], [productCode]);
        if (res.data) {
            data.props.product = res?.data[0];
        } else {
            data.props.product = []
        }
    }
    // console.log(data.props.price.wholesalePrice)
    return data;
}

export default function EditPage(props) {
    return renderWithLoggedInUser(props, render)
}

export function render(props) {
    return renderForm(props, useToast())
}
