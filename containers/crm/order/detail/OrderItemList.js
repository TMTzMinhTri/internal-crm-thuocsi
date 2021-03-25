import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { formatNumber } from "components/global";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Authorization from "@thuocsi/nextjs-components/authorization/authorization";
import Link from "next/link";
import styles from "./detail.module.css";

export default function OrderItemList({ orderItemList, totalPrice }) {
    const getQuantityProduct = () => {
        return orderItemList.reduce((accumulator, currentValue) => accumulator + currentValue.quantity, 0);
    };
    return (
        <MyCard>
            <MyCardHeader title="Danh sách sản phẩm" small={true}>
                <Authorization requiredScreen="/crm/order">
                    <Link href={`/crm/order?orderNo=`} prefetch={false}>
                        <a target="_blank" className={styles.actionLink}>
                            <FontAwesomeIcon icon={faListAlt} /> Xem tất cả sản phẩm
                        </a>
                    </Link>
                </Authorization>
            </MyCardHeader>
            <MyCardContent>
                <Table size="small">
                    <colgroup>
                        <col style={{ width: 100 }} />
                        <col style={{ width: 350 }} />
                        <col />
                        <col />
                        <col />
                    </colgroup>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="center">Sản phẩm</TableCell>
                            <TableCell align="right">Giá</TableCell>
                            <TableCell align="right">Số lượng</TableCell>
                            <TableCell align="right">Thành tiền</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderItemList && orderItemList.length ? (
                            orderItemList.map((row) => (
                                <TableRow key={row.productID}>
                                    <TableCell component="th" scope="row">
                                        {row.productID}
                                    </TableCell>
                                    <TableCell align="center" style={{ textTransform: "capitalize" }}>
                                        {row.productInfo.name}
                                    </TableCell>
                                    <TableCell align="right">{formatNumber(row.salePrice)}</TableCell>
                                    <TableCell align="right">{formatNumber(row.quantity)}</TableCell>

                                    <TableCell align="right">{formatNumber(row.totalPrice)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="100%">Không có sản phẩm nào</TableCell>
                            </TableRow>
                        )}
                        {orderItemList && orderItemList.length && (
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell style={{ fontWeight: 600 }}>Tổng cộng</TableCell>
                                <TableCell></TableCell>
                                <TableCell style={{ fontWeight: 600 }} align="right">
                                    {getQuantityProduct()}
                                </TableCell>
                                <TableCell style={{ fontWeight: 600 }} align="right">
                                    {formatNumber(totalPrice)} đ
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </MyCardContent>
        </MyCard>
    );
}
