import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card"
import { Box } from '@material-ui/core';
import { formatDateTime } from 'components/global';
import styles from './detail.module.css'
import { getTicketClient } from 'client/ticket';
import { Table } from '@material-ui/core';
import { TableHead } from '@material-ui/core';
import { TableRow } from '@material-ui/core';
import { TableCell } from '@material-ui/core';
import { TableBody } from '@material-ui/core';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Authorization from '@thuocsi/nextjs-components/authorization/authorization';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TicketStatus } from "containers/crm/ticket/ticket-display";
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
export default function CustomerTicketList({ ticketList, customerCode }) {

    return (
        <MyCard>
            <MyCardHeader title="Danh sách phiếu hỗ trợ gần đây" small={true}>
                <Authorization requiredScreen="/cs/ticket">
                    <Link href={`/cs/ticket?customerCode=${customerCode}`} prefetch={false}>
                        <a target="_blank" prefetch={false} className={styles.actionLink}>
                            <FontAwesomeIcon icon={faListAlt} /> Xem tất cả
                        </a>
                    </Link>
                </Authorization>
            </MyCardHeader>
            <MyCardContent>
                <Table size="small">
                    <colgroup>
                        <col style={{ width: 100 }} />
                        <col style={{ width: 160 }} />
                        <col />
                        <col />
                        <col />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã</TableCell>
                            <TableCell align="left">Đơn hàng</TableCell>
                            <TableCell align="left">Thời gian tạo</TableCell>
                            <TableCell >Người xử lý</TableCell>
                            <TableCell align="left">Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(ticketList && ticketList.length) ? ticketList.map(row =>
                        (<TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                                {row.code}
                            </TableCell>
                            <TableCell align="left">{row.saleOrderID} - {row.saleOrderCode}</TableCell>
                            <TableCell align="left">{formatDateTime(new Date(row.createdTime))}</TableCell>
                            <TableCell >{row.assignName}</TableCell>
                            <TableCell>
                                <TicketStatus status={row.status} />
                            </TableCell>
                        </TableRow>)) : (<TableRow>
                            <TableCell colSpan="100%">Không có yêu cầu hỗ trợ nào</TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </MyCardContent>
        </MyCard>
    )
}