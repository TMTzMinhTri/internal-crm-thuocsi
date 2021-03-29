import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { formatNumber } from "components/global";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Authorization from "@thuocsi/nextjs-components/authorization/authorization";
import Link from "next/link";
import { getProductClient } from "client/product";
import { isValid } from "components/global";
import styles from "./detail.module.css";

export async function getOrderItemList({ ctx, data, orderItems }) {
    const productClient = getProductClient(ctx, data);
    const productSkus = orderItems?.map((orderItem) => orderItem.productSku) || [];
    const productsResult = await productClient.getProductBySKUs(productSkus);
    let mapInfoProduct = {};
    if (isValid(productsResult)) {
        productsResult.data.forEach((product) => {
            mapInfoProduct[product.sku] = product;
        });
    }
    const orderItemList =
        orderItems?.map((orderItem) => {
            return {
                ...orderItem,
                productInfo: mapInfoProduct[orderItem.productSku],
            };
        }) || [];
    return orderItemList;
}

export default function OrderItemList({ orderItemList, totalPrice }) {
    const getQuantityProduct = () => {
        return orderItemList.reduce((accumulator, currentValue) => accumulator + currentValue.quantity, 0);
    };
    return (
        <MyCard>
            <MyCardHeader title="Danh sách sản phẩm trong đơn hàng" small={true}>
                {/* <Authorization requiredScreen="/crm/order">
                    <Link href={`/crm/order?orderNo=`} prefetch={false}>
                        <a target="_blank" className={styles.actionLink}>
                            <FontAwesomeIcon icon={faListAlt} /> Xem tất cả sản phẩm
                        </a>
                    </Link>
                </Authorization> */}
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
                            <TableCell>ID</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell align="left">Sản phẩm</TableCell>
                            <TableCell align="right">Đơn giá</TableCell>
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
                                    <TableCell component="th" scope="row">
                                        {row.productSku}
                                    </TableCell>
                                    <TableCell align="left" style={{ textTransform: "capitalize" }}>
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
                                    {formatNumber(totalPrice)}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </MyCardContent>
        </MyCard>
    );
}
