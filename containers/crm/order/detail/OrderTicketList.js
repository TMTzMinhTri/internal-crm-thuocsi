import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { formatDateTime } from "components/global";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import { TicketStatus } from "containers/crm/ticket/ticket-display";
import { isValid } from "components/global";
import { getTicketClient } from "client/ticket";
import styles from "./detail.module.css";

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
                            <TableCell align="right">Thời gian tạo</TableCell>
                            <TableCell align="center">Người Xử lý</TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ticketList && ticketList.length ? (
                            ticketList.map((row) => (
                                <TableRow key={row.code}>
                                    <TableCell component="th" scope="row">
                                        {row.code}
                                    </TableCell>

                                    <TableCell align="right">{formatDateTime(row.createdTime)}</TableCell>
                                    <TableCell align="center">{row.createdBy}</TableCell>
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
