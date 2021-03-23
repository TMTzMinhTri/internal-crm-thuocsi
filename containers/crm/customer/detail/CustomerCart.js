import { MyActivity, getActivities } from "@thuocsi/nextjs-components/my-activity/my-activity"
import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card"

/**
 * Get cart info of customer. This data is needed to use CustomerCart component.
 * @param {object} param.ctx
 * @param {object} param.data
 * @param {string} param.customerCode code of customer 
 */
export async function getCustomerCart({ ctx, data, customerCode }) {
    return {
        status: "OK",
        data: [{}]
    }
}

/**
 * Component that display cart info of customer
 * @param {[]cart} param.cartInfo
 */
export default function CustomerCart({ cartInfo }) {
    return (
        <MyCard>
            <MyCardHeader title="Giỏ hàng hiện tại" small={true}></MyCardHeader>
            <MyCardContent>
                Coming soon ...
            </MyCardContent>
        </MyCard>
    )
}