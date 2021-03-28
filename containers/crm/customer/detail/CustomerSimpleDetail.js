import { MyCard, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card"
import { getCustomerClient } from 'client/customer';
import { Box } from '@material-ui/core';
import { getMasterDataClient } from 'client/master-data';
import styles from './detail.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import Authorization from '@thuocsi/nextjs-components/authorization/authorization';
import Link from "next/link";
import CustomerLevel from './CustomerLevel';
import CustomerStatus from './CustomerStatus';


function InfoLine({ customerCode = "", label, val, type }) {
    if (type == "level") {
        return <Box className={styles.infoLine}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>
                <CustomerLevel level={val}></CustomerLevel>
            </span>
        </Box>
    }

    if (type == "status") {
        return <Box className={styles.infoLine}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>
                <CustomerStatus status={val} customer={val}></CustomerStatus>
            </span>
        </Box>
    }

    return <Box className={styles.infoLine}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{val}</span>
    </Box>
}

/**
 * Get info of customer. This data is needed to use CustomerSimpleDetail component.
 * @param {object} param.ctx
 * @param {object} param.data
 * @param {string} param.customerCode code of customer 
 */
export async function getCustomerSimpleDetail({ ctx, data, customerCode }) {
    let customerResult = await getCustomerClient(ctx, data)
        .getCustomerByCustomerCode(customerCode)
    if (customerResult && customerResult.status == "OK") {
        let customer = customerResult.data[0]
        let provinceResult = await getMasterDataClient(ctx, data).getProvinceByProvinceCode(customer.provinceCode)
        if (provinceResult && provinceResult.status == "OK") {
            customer.provinceName = provinceResult.data[0].name
        }
    }
    return customerResult
}

/**
 * Component that display order list of customer.
 * @param {object} param.customerInfo
 */
export default function CustomerSimpleDetail({ customerInfo }) {
    customerInfo = customerInfo[0]
    return (
        <MyCard>
            <MyCardHeader title="Thông tin khách hàng" small={true}>
                <Authorization requiredScreen="/crm/customer/edit">
                    <Link href={`/crm/customer/edit?customerCode=${customerInfo.code}`} prefetch={false}>
                        <a target="_blank" prefetch={false} className={styles.actionLink}>
                            <FontAwesomeIcon icon={faPencilAlt} /> Cập nhật
                        </a>
                    </Link>
                </Authorization>
            </MyCardHeader>
            <MyCardContent>
                <InfoLine label="ID" val={customerInfo.customerID}></InfoLine>
                <InfoLine label="Mã khách hàng" val={customerInfo.code}></InfoLine>
                <InfoLine label="Tên khách hàng" val={customerInfo.name}></InfoLine>
                <InfoLine label="Cấp bậc" val={customerInfo.level} type="level"></InfoLine>
                <InfoLine label="Email" val={customerInfo.email}></InfoLine>
                <InfoLine label="Số điện thoại" val={customerInfo.phone}></InfoLine>
                <InfoLine label="Trạng thái" val={customerInfo} type="status" customerCode={customerInfo.code}></InfoLine>
                <InfoLine label="Tỉnh thành" val={customerInfo.provinceName}></InfoLine>
            </MyCardContent>
        </MyCard>
    )
}