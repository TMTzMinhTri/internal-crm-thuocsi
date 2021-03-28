import { MyActivity, getActivities } from "@thuocsi/nextjs-components/my-activity/my-activity";
import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";

/**
 * Get activities data of customer. This data is needed to use CustomerHistory component.
 * @param {object} param.ctx
 * @param {object} param.data
 * @param {string} param.customerCode code of customer
 */
export async function getOrderHistory({ ctx, data, orderNo }) {
    return getActivities(ctx, data, {
        keys: "ORDER/" + orderNo,
        type: "ORDER",
    });
}

/**
 * Component that display activity list of customer.
 * @param {[]activity} param.activitiesData
 */
export default function OrderHistory({ activitiesData }) {
    return (
        <MyCard>
            <MyCardHeader title="Lịch sử thao tác" small={true}></MyCardHeader>
            <MyCardContent>
                {activitiesData && activitiesData.length ? (
                    <MyActivity data={activitiesData}></MyActivity>
                ) : (
                    "Không có thông tin thao tác liên quan"
                )}
            </MyCardContent>
        </MyCard>
    );
}
