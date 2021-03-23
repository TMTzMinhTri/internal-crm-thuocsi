import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card"
import { getOrderClient } from "client/order"
import { formatDateTime } from 'components/global';
import { formatNumber } from 'components/global';
import styles from './detail.module.css'
import { Table } from '@material-ui/core';
import { TableHead } from '@material-ui/core';
import { TableRow } from '@material-ui/core';
import { TableCell } from '@material-ui/core';
import { TableBody } from '@material-ui/core';

/**
 * Get order data of customer. This data is needed to use CustomerNote component.
 * @param {object} param.ctx
 * @param {object} param.data
 * @param {string} param.customerCode code of customer 
 */
export async function getCustomerNote({ ctx, data, customerCode }) {
    return getOrderClient(ctx, data)
        .getOrderByFilterFromNextJS({
            offset: 0,
            limit: 10,
            customerCode: customerCode
        })
}

/**
 * Component that display note list of customer.
 * @param {[]note} param.noteList
 */
export default function CustomerNote({ noteList }) {
    return (
        <MyCard>
            <MyCardHeader title="Ghi chú về khách hàng gần đây" small={true}></MyCardHeader>
            <MyCardContent>
                <Table size="small">
                    <colgroup>
                        <col style={{ width: 120 }} />
                        <col style={{ width: 120 }} />
                        <col />
                        <col />
                        <col />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Thời gian</TableCell>
                            <TableCell align="right">Nhân viên</TableCell>
                            <TableCell align="left">Nội dung</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(noteList && noteList.length) ? noteList.map(row =>
                        (<TableRow key={row.id}>
                            <TableCell align="left">{formatDateTime(new Date(row.createdTime))}</TableCell>
                            <TableCell align="right">{formatNumber(row.username)}</TableCell>
                            <TableCell>{row.content}</TableCell>
                        </TableRow>)) : (<TableRow>
                            <TableCell colSpan="100%">Không có ghi chú nào</TableCell>
                        </TableRow>)}
                    </TableBody>

                </Table>
            </MyCardContent>
        </MyCard>
    )
}