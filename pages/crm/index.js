import { doWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import ProductPage, { loadProductData } from "pages/crm/product/index";
export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadProductData(ctx)
    })
}

export default function HRMIndexPage(props) {
    return ProductPage(props)
}