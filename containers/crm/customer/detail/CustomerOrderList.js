import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card"
import { getOrderClient } from "client/order"
import { Box } from '@material-ui/core';
import { formatDateTime } from 'components/global';
import { formatNumber } from 'components/global';
import styles from './detail.module.css'

/**
 * Get order data of customer. This data is needed to use CustomerOrderList component.
 * @param {object} param.ctx
 * @param {object} param.data
 * @param {string} param.customerCode code of customer 
 */
export async function getCustomerOrderList({ ctx, data, customerCode }) {
    return getOrderClient(ctx, data)
        .getOrderByFilterFromNextJS({
            offset: 0,
            limit: 20,
            customerCode: customerCode
        })
}

/**
 * Component that display order list of customer.
 * @param {[]order} param.orderList
 */
export default function CustomerOrderList({ orderList }) {
    return (
        <MyCard>
            <MyCardHeader title="Danh sách đơn hàng gần đây" small={true}></MyCardHeader>
            <MyCardContent>
                <Box className={styles.listHead}>
                    <span className={styles.orderNoHead}>ID</span>
                    <span className={styles.orderNoHead}>Mã đơn</span>
                    <span className={styles.createdTime}>Thời gian đặt hàng</span>
                    <span className={styles.totalPrice}>Giá trị đơn</span>
                    <span className={styles.status}>Trạng thái</span>
                </Box>
                {(orderList && orderList.length) ? orderList.map(order =>
                    <OrderListItem order={order} key={order.orderNo}></OrderListItem>
                ) : "Không tìm thấy thông tin đơn hàng"}
            </MyCardContent>
        </MyCard>
    )
}


export function OrderListItem({ order }) {
    return <Box className={styles.itemContainer}>
        <span className={styles.orderNo}>{order.orderId}</span>
        <span className={styles.orderNo}>{order.orderNo}</span>
        <span className={styles.createdTime}>{formatDateTime(new Date(order.createdTime))}</span>
        <span className={styles.totalPrice}>{formatNumber(order.totalPrice)}</span>
        <span className={styles.status}>{order.status}</span>
    </Box>
}