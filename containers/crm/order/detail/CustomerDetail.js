import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { Box } from "@material-ui/core";
import styles from "./detail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import Authorization from "@thuocsi/nextjs-components/authorization/authorization";
import Link from "next/link";

function InfoLine({ label, val }) {
    return (
        <Box className={styles.infoLine}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{val}</span>
        </Box>
    );
}

export default function CustomerDetail({ order }) {
    const orderInfo = order;
    return (
        <MyCard>
            <MyCardHeader title="Thông tin đặt hàng" small={true}>
                <Authorization requiredScreen="/crm/order/edit">
                    <Link href={`/crm/order/edit?orderNo=${order.orderNo}`} prefetch={false}>
                        <a target="_blank" prefetch={false} className={styles.actionLink}>
                            <FontAwesomeIcon icon={faPencilAlt} /> Cập nhật
                        </a>
                    </Link>
                </Authorization>
            </MyCardHeader>
            <MyCardContent>
                <InfoLine label="ID" val={orderInfo.customerID}></InfoLine>
                <InfoLine label="Mã khách hàng" val={orderInfo.customerCode}></InfoLine>
                <InfoLine label="Tên khách hàng" val={orderInfo.customerName}></InfoLine>
                <InfoLine label="Email" val={orderInfo.customerEmail}></InfoLine>
                <InfoLine label="Số điện thoại" val={orderInfo.customerPhone}></InfoLine>
                <InfoLine label="Địa chỉ" val={orderInfo.customerShippingAddress}></InfoLine>
                <InfoLine label="Địa chỉ hành chính" val={orderInfo.masteDataAddress}></InfoLine>
            </MyCardContent>
        </MyCard>
    );
}
