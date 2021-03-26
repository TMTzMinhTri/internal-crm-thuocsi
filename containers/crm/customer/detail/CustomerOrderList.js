import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card"
import { getOrderClient } from "client/order"
import { formatDateTime } from 'components/global';
import { formatNumber } from 'components/global';
import styles from './detail.module.css'
import { Table, Box } from '@material-ui/core';
import { TableHead } from '@material-ui/core';
import { TableRow } from '@material-ui/core';
import { TableCell } from '@material-ui/core';
import { TableBody } from '@material-ui/core';
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Authorization from '@thuocsi/nextjs-components/authorization/authorization';
import Link from 'next/link';

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
            limit: 5,
            customerCode: customerCode
        })
}

/**
 * Component that display order list of customer.
 * @param {[]order} param.orderList
 */
export default function CustomerOrderList({ orderList, customerCode }) {
    return (
        <MyCard>
            <MyCardHeader title="Danh sách đơn hàng gần đây" small={true}>
            <Authorization requiredScreen="/crm/order" >
                    <Link
                        href={`/crm/order?customerCode=${customerCode}`}
                        prefetch={false}>
                        <a target="_blank" className={styles.actionLink}>
                            <FontAwesomeIcon icon={faListAlt} /> Xem tất cả đơn
                        </a>
                    </Link>
                </Authorization>
            </MyCardHeader>
            <MyCardContent>
                <Table size="small">
                    <colgroup>
                        <col style={{ width: 100 }} />
                        <col style={{ width: 120 }} />
                        <col />
                        <col />
                        <col />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="left">Mã đơn</TableCell>
                            <TableCell align="left">Thời gian đặt hàng</TableCell>
                            <TableCell align="right">Giá trị đơn</TableCell>
                            <TableCell align="left">Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {orderList && orderList.length ? (
                            orderList.map((row) => (
                                <TableRow key={row.orderId}>
                                    <TableCell component="th" scope="row">
                                        {row.orderId}
                                    </TableCell>
                                    <TableCell align="left">{row.orderNo}</TableCell>
                                    <TableCell align="left">{formatDateTime(new Date(row.createdTime))}</TableCell>
                                    <TableCell align="right">{formatNumber(row.totalPrice)}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="100%">Không có đơn hàng nào</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </MyCardContent>
        </MyCard>
    )
}
