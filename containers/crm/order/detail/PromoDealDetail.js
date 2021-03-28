import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { getCustomerClient } from "client/customer";
import { Box } from "@material-ui/core";
import { getMasterDataClient } from "client/master-data";
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
            <span className={styles.value}>{val || "-"}</span>
        </Box>
    );
}

export default function PricingDetail({ order, orderNo }) {
    const orderInfo = order;
    return (
        <MyCard>
            <MyCardHeader title="Thông tin khuyến mãi" small={true}>
                {/* <Authorization requiredScreen="/crm/order/edit">
                    <Link href={`/crm/order/edit?orderNo=${orderNo}`} prefetch={false}>
                        <a target="_blank" prefetch={false} className={styles.actionLink}>
                            <FontAwesomeIcon icon={faPencilAlt} /> Cập nhật
                        </a>
                    </Link>
                </Authorization> */}
            </MyCardHeader>
            <MyCardContent>
                <InfoLine label="Mã giảm giá" val={orderInfo.redeemCode[0]}></InfoLine>
            </MyCardContent>
        </MyCard>
    );
}
