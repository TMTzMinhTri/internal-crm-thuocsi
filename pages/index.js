import ProductPage, {loadPrice, loadProduct, loadProductData, mixProductAndPrice} from "pages/crm/product/index"
import { doWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import {ssrPipe} from "../components/global";
export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return ssrPipe(loadProduct, loadPrice, mixProductAndPrice)(ctx).then((resp) => {
            return resp
        });
    })
}

export default function HRMIndexPage(props) {
    return ProductPage(props)
}