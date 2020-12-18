import { doWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import PricingPage, { loadPricingData } from "pages/crm/pricing/index";
export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadPricingData(ctx)
    })
}

export default function HRMIndexPage(props) {
    return PricingPage(props)
}