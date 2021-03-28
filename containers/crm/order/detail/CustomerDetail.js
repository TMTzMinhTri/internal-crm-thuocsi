import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { Box } from "@material-ui/core";
import { getMasterDataClient } from "client/master-data";
import styles from "./detail.module.css";
import { isValid } from "components/global";
import Link from "next/link";

function InfoLine({ label, val, type = "" }) {
    if (type == "customer") {
        return <Box className={styles.infoLine}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>
                <Link href={`/crm/customer/detail?customerCode=${val}`} prefetch={false}>
                    <a target="_blank" style={{ textDecoration: 'none', color: 'green' }}><b>{val}</b></a>
                </Link>
            </span>
        </Box>
    }
    return (
        <Box className={styles.infoLine}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{val}</span>
        </Box>
    );
}

export async function getMasterDataAddress({ ctx, data, wardCode, districtCode, provinceCode }) {
    const masterDataClient = getMasterDataClient(ctx, data);
    const masterDataResult = await Promise.all([
        masterDataClient.getWardByWardCode(wardCode),
        masterDataClient.getDistrictByDistrictCode(districtCode),
        masterDataClient.getProvinceByProvinceCode(provinceCode),
    ]);
    const masterDataAddress = masterDataResult
        .map((result) => (isValid(result) ? result.data[0].name : ""))
        .filter((el) => el)
        .join(", ");
    return masterDataAddress;
}

export default function CustomerDetail({ order }) {
    const orderInfo = order;
    return (
        <MyCard>
            <MyCardHeader title="Thông tin đặt hàng" small={true}>
                {/* <Authorization requiredScreen="/crm/order/edit">
                    <Link href={`/crm/order/edit?orderNo=${order.orderNo}`} prefetch={false}>
                        <a target="_blank" prefetch={false} className={styles.actionLink}>
                            <FontAwesomeIcon icon={faPencilAlt} /> Cập nhật
                        </a>
                    </Link>
                </Authorization> */}
            </MyCardHeader>
            <MyCardContent>
                <InfoLine label="ID đơn hàng" val={orderInfo.orderId}></InfoLine>
                <InfoLine label="Mã đơn hàng" val={orderInfo.orderNo}></InfoLine>
                <InfoLine label="ID khách hàng" val={orderInfo.customerID}></InfoLine>
                <InfoLine label="Mã khách hàng" val={orderInfo.customerCode} type="customer"></InfoLine>
                <InfoLine label="Tên khách hàng" val={orderInfo.customerName}></InfoLine>
                <InfoLine label="Số điện thoại" val={orderInfo.customerPhone}></InfoLine>
                <InfoLine label="Địa chỉ" val={orderInfo.customerShippingAddress}></InfoLine>
                <InfoLine label="Khu vực" val={orderInfo.masterDataAddress}></InfoLine>
            </MyCardContent>
        </MyCard>
    );
}
