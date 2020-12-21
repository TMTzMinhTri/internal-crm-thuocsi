import ProductPage, { loadSKUProduct, loadProduct, loadProductData, mixProductAndPrice } from "pages/crm/product/index"
import { doWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { ssrPipe } from "../components/global";
export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return ssrPipe(loadSKUProduct, loadProduct, mixProductAndPrice)(ctx).then((resp) => {
            return resp
        });
    })
}

export default function HRMIndexPage(props) {
    return ProductPage(props)
}