import { Box } from "@material-ui/core";
import DeliveryDetail from "./DeliveryDetail";
import CustomerDetail from "./CustomerDetail";
import PricingDetail from "./PricingDetail";
import OrderItemList from "./OrderItemList";
import PromoDealDetail from "./PromoDealDetail";
import OrderTicketList from "./OrderTicketList";
import OrderHistory from "./OrderHistory";
import styles from "./detail.module.css";

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
                            <OrderItemList orderItemList={order.orderItemList} totalPrice={order.subTotalPrice}></OrderItemList>
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
