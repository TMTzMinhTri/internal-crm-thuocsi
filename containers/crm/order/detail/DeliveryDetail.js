import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { formatDateTime } from "components/global";
import { Box } from "@material-ui/core";
import styles from "./detail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { getDeliveryClient } from "client/delivery";
import Authorization from "@thuocsi/nextjs-components/authorization/authorization";
import Link from "next/link";
import { isValid } from "components/global";
import OrderStatus from "./OrderStatus";

export async function getDeliveryPlatformName({ ctx, data, deliveryPlatformCode }) {
    const deliveryClient = getDeliveryClient(ctx, data);
    const deliveryPlatformListResult = await deliveryClient.getListDeliveryByCode(deliveryPlatformCode);
    return isValid(deliveryPlatformListResult) ? deliveryPlatformListResult.data[0].name : "";
}

export async function getPaymentMethodName({ ctx, data, paymentMethodCode }) {
    const deliveryClient = getDeliveryClient(ctx, data);
    const paymentMethodListResult = await deliveryClient.getListPaymentMethodByCode(paymentMethodCode);
    return isValid(paymentMethodListResult) ? paymentMethodListResult.data[0].name : "";
}

const EnumLineType = {
    ORDER_STATUS: "order_status",
    DATE: "date",
};

function InfoLine({ label, val, type }) {
    if (type == EnumLineType.ORDER_STATUS) {
        return (
            <Box className={styles.infoLine}>
                <span className={styles.label}>{label}</span>

                <span className={styles.value}>
                    <OrderStatus val={val} />
                </span>
            </Box>
        );
    }
    if (type == EnumLineType.DATE) {
        return (
            <Box className={styles.infoLine}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>{formatDateTime(val)}</span>
            </Box>
        );
    }
    return (
        <Box className={styles.infoLine}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{val || "(Chưa có)"}</span>
        </Box>
    );
}

export default function DeliveryDetail({ order, orderNo }) {
    const orderInfo = order;
    return (
        <MyCard>
            <MyCardHeader title="Thông tin giao hàng" small={true}>
                {/* <Authorization requiredScreen="/crm/order/edit">
                    <Link href={`/crm/order/edit?orderNo=${orderNo}`} prefetch={false}>
                        <a target="_blank" prefetch={false} className={styles.actionLink}>
                            <FontAwesomeIcon icon={faPencilAlt} /> Cập nhật
                        </a>
                    </Link>
                </Authorization> */}
            </MyCardHeader>
            <MyCardContent>
                <InfoLine label="Hình thức thanh toán" val={orderInfo.paymentMethodName}></InfoLine>
                <InfoLine label="Đơn vị vận chuyển" val={orderInfo.deliveryPlatformName}></InfoLine>
                <InfoLine label="Mã vận đơn" val={orderInfo.deliveryTrackingNumber}></InfoLine>
                <InfoLine label="Trạng thái giao hàng" val={orderInfo.deliveryStatus}></InfoLine>
                <InfoLine label="Ngày giao" val={orderInfo.deliveryDate} type={EnumLineType.DATE}></InfoLine>
                <InfoLine
                    label="Trạng thái đơn hàng"
                    val={orderInfo.status}
                    type={EnumLineType.ORDER_STATUS}
                ></InfoLine>
                <InfoLine label="Ghi chú" val={orderInfo.note}></InfoLine>
            </MyCardContent>
        </MyCard>
    );
}
