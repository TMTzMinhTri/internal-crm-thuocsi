import { Box } from "@material-ui/core";
import { isValid } from "utils/ClientUtils";
import { getOrderClient } from "client/order";
import DeliveryDetail from "./DeliveryDetail";
import CustomerDetail, { getMasterDataAddress } from "./CustomerDetail";
import PricingDetail from "./PricingDetail";
import OrderItemList, { getOrderItemList } from "./OrderItemList";
import PromoDealDetail from "./PromoDealDetail";
import OrderTicketList, { getTicketList } from "./OrderTicketList";
import OrderHistory, { getOrderHistory } from "./OrderHistory";
import styles from "./detail.module.css";

export async function getOrderFullDetail({ ctx, data, orderNo }) {
    const orderClient = getOrderClient(ctx, data);
    const orderResult = await orderClient.getOrderByOrderNo(orderNo);
    if (!isValid(orderResult)) return {};
    const order = orderResult.data[0];
    const [masterDataAddress, orderItemList, ticketList, activitiesData] = await Promise.all([
        getMasterDataAddress({
            ctx,
            data,
            wardCode: order.customerWardCode,
            districtCode: order.customerDistrictCode,
            provinceCode: order.customerProvinceCode,
        }),
        getOrderItemList({ ctx, data, orderItems: order.orderItems }),
        getTicketList({ ctx, data, orderNo, orderId: order.orderId }),
        getOrderHistory({ ctx, data, orderNo }),
    ]);
    return {
        order: {
            ...order,
            masterDataAddress,
            orderItemList,
            ticketList,
        },
        activitiesData,
    };
}

function FlexContainer({ children }) {
    return <Box className={styles.flexContainer}>{children}</Box>;
}

function FlexContent({ children }) {
    return <Box className={styles.flexContent}>{children}</Box>;
}

export default function OrderFullDetail({ order, activitiesData }) {
    return (
        <Box>
            {order ? (
                <Box>
                    <FlexContainer>
                        <FlexContent>
                            <CustomerDetail order={order}></CustomerDetail>
                        </FlexContent>
                        <FlexContent>
                            <DeliveryDetail order={order}></DeliveryDetail>
                        </FlexContent>
                    </FlexContainer>
                    <FlexContainer>
                        <FlexContent>
                            <OrderItemList
                                orderItemList={order.orderItemList}
                                totalPrice={order.subTotalPrice}
                            ></OrderItemList>
                        </FlexContent>
                        <FlexContent>
                            <PricingDetail order={order}></PricingDetail>
                        </FlexContent>
                    </FlexContainer>
                    <FlexContainer>
                        <FlexContent>
                            <PromoDealDetail order={order}></PromoDealDetail>
                        </FlexContent>
                        <FlexContent>
                            <OrderTicketList ticketList={order.ticketList}></OrderTicketList>
                        </FlexContent>
                    </FlexContainer>

                    <OrderHistory activitiesData={activitiesData}></OrderHistory>
                </Box>
            ) : (
                "Không tìm thấy thông tin đơn hàng"
            )}
        </Box>
    );
}
