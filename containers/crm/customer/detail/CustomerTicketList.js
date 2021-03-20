import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card"
import { Box } from '@material-ui/core';
import { formatDateTime } from 'components/global';
import styles from './detail.module.css'
import { getTicketClient } from 'client/ticket';
/**
 * Get ticket data of customer. This data is needed to use CustomerTicketList component.
 * @param {object} param.ctx
 * @param {object} param.data
 * @param {string} param.customerCode code of customer 
 */
export async function getCustomerTicketList({ ctx, data, customerCode }) {
    return await getTicketClient(ctx, data)
        .getTicketByFilter({
            offset: 0,
            limit: 20,
            customerCode: customerCode
        })
}

/**
 * Component that display ticket list of customer.
 * @param {[]ticket} param.ticketList
 */
export default function CustomerTicketList({ ticketList }) {
    return (
        <MyCard>
            <MyCardHeader title="Danh sách yêu cầu hỗ trợ gần đây" small={true}></MyCardHeader>
            <MyCardContent>
                <Box className={styles.listHead}>
                    <span className={styles.orderNoHead}>Mã yêu cầu</span>
                    <span className={styles.saleOrderID}>ID đơn hàng</span>
                    <span className={styles.orderNoHead}>Mã đơn hàng</span>
                    <span className={styles.createdTime}>Thời gian</span>
                    <span className={styles.totalPrice}>Người xử lý</span>
                    <span className={styles.status}>Trạng thái</span>
                </Box>
                {(ticketList && ticketList.length) ? ticketList.map(ticket =>
                    <TicketItem order={ticket} key={ticket.id}></TicketItem>
                ) : "Không tìm thấy yêu cầu hỗ trợ"}
            </MyCardContent>
        </MyCard>
    )
}


export function TicketItem({ ticket }) {
    return <Box className={styles.itemContainer}>
        <span className={styles.orderNo}>{ticket.code}</span>
        <span className={styles.createdTime}>{formatDateTime(new Date(order.createdTime))}</span>
        <span className={styles.totalPrice}>{ticket.username}</span>
        <span className={styles.status}>{ticket.status}</span>
    </Box>
}