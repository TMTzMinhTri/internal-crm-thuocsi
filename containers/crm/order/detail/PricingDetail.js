import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { Box } from "@material-ui/core";
import styles from "./detail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { formatNumber } from "components/global";
import Authorization from "@thuocsi/nextjs-components/authorization/authorization";
import Link from "next/link";

const EnumLineType = {
    CURRENCY: "currency",
};

function InfoLine({ label, val, type }) {
    if (type == EnumLineType.CURRENCY) {
        return (
            <Box className={styles.infoLine}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>{formatNumber(val)} đ</span>
            </Box>
        );
    }
    return (
        <Box className={styles.infoLine}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{val}</span>
        </Box>
    );
}

export default function PricingDetail({ order, orderNo }) {
    const orderInfo = order;
    return (
        <MyCard>
            <MyCardHeader title="Thông tin thành tiền" small={true}>
                <Authorization requiredScreen="/crm/order/edit">
                    <Link href={`/crm/order/edit?orderNo=${orderNo}`} prefetch={false}>
                        <a target="_blank" prefetch={false} className={styles.actionLink}>
                            <FontAwesomeIcon icon={faPencilAlt} /> Cập nhật
                        </a>
                    </Link>
                </Authorization>
            </MyCardHeader>
            <MyCardContent>
                <InfoLine
                    label="Giá theo hình thức thanh toán"
                    val={orderInfo.paymentMethodFee}
                    type={EnumLineType.CURRENCY}
                ></InfoLine>
                <InfoLine
                    label="Giá theo đơn vị vận chuyển"
                    val={orderInfo.deliveryPlatformFee}
                    type={EnumLineType.CURRENCY}
                ></InfoLine>
                <InfoLine label="Phí vận chuyển" val={orderInfo.shippingFee} type={EnumLineType.CURRENCY}></InfoLine>
                <InfoLine label="Tổng tiền" val={orderInfo.subTotalPrice} type={EnumLineType.CURRENCY}></InfoLine>
                <InfoLine label="Giảm giá" val={orderInfo.totalDiscount} type={EnumLineType.CURRENCY}></InfoLine>
                <InfoLine label="Tổng cộng" val={orderInfo.totalPrice} type={EnumLineType.CURRENCY}></InfoLine>
            </MyCardContent>
        </MyCard>
    );
}
