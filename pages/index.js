import { doWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import CustomerPage, { loadCustomerData } from "pages/crm/customer";
export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadCustomerData(ctx);
    });
}

export default function CRMIndexPage(props) {
    return CustomerPage(props)
}