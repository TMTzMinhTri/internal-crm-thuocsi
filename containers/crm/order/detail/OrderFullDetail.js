import { Box } from "@material-ui/core";
import { isValid } from "components/global";
import { getOrderClient } from "client/order";
import DeliveryDetail, { getDeliveryPlatformName, getPaymentMethodName } from "./DeliveryDetail";
import CustomerDetail, { getMasterDataAddress } from "./CustomerDetail";
import PricingDetail from "./PricingDetail";
import OrderItemList, { getOrderItemList } from "./OrderItemList";
import PromoDealDetail from "./PromoDealDetail";
import OrderTicketList, { getTicketList } from "./OrderTicketList";
import OrderHistory, { getOrderHistory } from "./OrderHistory";
import { OrderAutoSearch } from "./OrderAutoSearch";
import styles from "./detail.module.css";

export async function getOrderFullDetail({ ctx, data, orderNo }) {
    const orderClient = getOrderClient(ctx, data);
    const orderResult = await orderClient.getOrderByOrderNo(orderNo);
    if (!isValid(orderResult)) return {};
    const order = orderResult.data[0];
    const [
        masterDataAddress,
        orderItemList,
        ticketList,
        activitiesData,
        paymentMethodName,
        deliveryPlatformName,
    ] = await Promise.all([
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
        getPaymentMethodName({ ctx, data, paymentMethodCode: order.paymentMethod }),
        getDeliveryPlatformName({ ctx, data, deliveryPlatformCode: order.deliveryPlatform }),
    ]);
    return {
        order: {
            ...order,
            masterDataAddress,
            orderItemList,
            ticketList,
            paymentMethodName,
            deliveryPlatformName,
        },
        activitiesData,
        orderNo,
    };
}

function FlexContainer({ children }) {
    return <Box className={styles.flexContainer}>{children}</Box>;
}

function FlexContent({ children }) {
    return <Box className={styles.flexContent}>{children}</Box>;
}

export default function OrderFullDetail({ order, activitiesData, orderNo }) {
    return (
        <Box>
            <OrderAutoSearch orderInfo={order}></OrderAutoSearch>
            {order && (
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
                            <PromoDealDetail order={order}></PromoDealDetail>
                        </FlexContent>
                        <FlexContent>
                            <PricingDetail order={order}></PricingDetail>
                        </FlexContent>
                    </FlexContainer>
                    <OrderItemList
                        orderItemList={order.orderItemList}
                        totalPrice={order.subTotalPrice}
                    ></OrderItemList>
                    <OrderTicketList ticketList={order.ticketList}></OrderTicketList>

                    <OrderHistory activitiesData={activitiesData}></OrderHistory>
                </Box>
            )}
            {orderNo && "Không tìm thấy thông tin đơn hàng"}
        </Box>
    );
}
