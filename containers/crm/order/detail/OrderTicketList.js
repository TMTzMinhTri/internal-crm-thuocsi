import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { formatDateTime } from "components/global";
import { Table, TableHead, TableRow, TableCell, TableBody, Tooltip } from "@material-ui/core";
import { AccountType, TicketStatus } from "containers/crm/ticket/ticket-display";
import { isValid } from "components/global";
import { getTicketClient } from "client/ticket";
import styles from "./detail.module.css";
import Link from 'next/link';

export async function getTicketList({ ctx, data, orderNo, orderId }) {
    const ticketClient = getTicketClient(ctx, data);
    const ticketListResult = await ticketClient.getTicketByFilter({
        saleOrderCode: orderNo,
        saleOrderID: orderId,
    });
    let tickets = [];
    if (isValid(ticketListResult)) {
        tickets = ticketListResult.data;
    }
    return tickets;
}

export default function OrderTicketList({ ticketList }) {
    return (
        <MyCard>
            <MyCardHeader title="Danh sách phiếu hỗ trợ của đơn hàng" small={true}>
            </MyCardHeader>
            <MyCardContent>
                <Table size="small">
                    <colgroup>
                        <col style={{ width: 100 }} />
                        <col />
                        <col />
                        <col />
                        <col />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã</TableCell>
                            <TableCell align="left">Thời gian tạo</TableCell>
                            <TableCell align="left">Người tạo</TableCell>
                            <TableCell align="left">Người tiếp nhận</TableCell>
                            <TableCell align="left">Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ticketList && ticketList.length ? (
                            ticketList.map((row) => (
                                <TableRow key={row.code}>
                                    <TableCell component="th" scope="row">
                                        <Link href={`/cs/ticket/my-ticket?ticketCode=${row.code}`} prefetch={false}>
                                            <a target="_blank" style={{ textDecoration: 'none', color: 'green', fontWeight: 'bold' }}>
                                                {row.code}
                                            </a>
                                        </Link>
                                    </TableCell>

                                    <TableCell align="left">{formatDateTime(row.createdTime)}</TableCell>
                                    <TableCell align="left">
                                        <AccountType type={row.createdByType} />
                                        <Tooltip title={row.createdByName}>
                                            <span>{row.createdBy}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="left">
                                        {row.assignUser} - {row.assignName}
                                    </TableCell>
                                    <TableCell align="center">
                                        <TicketStatus status={row.status} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                                <TableRow>
                                    <TableCell colSpan="100%">Không có phiếu hỗ trợ nào</TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </MyCardContent>
        </MyCard>
    );
}
