import { Box } from "@material-ui/core";
import { CustomerAutoSearch } from "../CustomerAutoSearch";
import CustomerHistory, { getCustomerHistory } from "./CustomerHistory";
import CustomerNote, { getCustomerNote } from "./CustomerNote";
import CustomerOrderList, { getCustomerOrderList } from "./CustomerOrderList";
import CustomerSimpleDetail, { getCustomerSimpleDetail } from "./CustomerSimpleDetail";
import CustomerTicketList, { getCustomerTicketList } from "./CustomerTicketList";
import styles from './detail.module.css'
/**
 * Get info of customer. This data is needed to use CustomerSimpleDetail component.
 * @param {object} param.ctx
 * @param {object} param.data
 * @param {string} param.customerCode code of customer 
 */
export async function getCustomerFullDetail({ ctx, data, customerCode }) {
    let reqs = [
        getCustomerSimpleDetail({ ctx, data, customerCode }),
        getCustomerHistory({ ctx, data, customerCode }),
        getCustomerOrderList({ ctx, data, customerCode }),
        getCustomerTicketList({ ctx, data, customerCode }),
        getCustomerNote({ ctx, data, customerCode })
    ], result = {}

    // call API & wait parallely
    await Promise.all(reqs).then((values) => {
        result = {
            customerInfo: values[0]?.data || [],
            activitiesData: values[1],
            orderList: values[2]?.data || [],
            ticketList: values[3]?.data || [],
            noteList: values[4]?.data || []
        }
    })
    return result
}

function FlexContainer({ children }) {
    return <Box className={styles.flexContainer}>
        {children}
    </Box>
}

function FlexContent({ children }) {
    return <Box className={styles.flexContent}>
        {children}
    </Box>
}

/**
 * Component that display order list of customer.
 * @param {object} param.customerInfo
 * @param {object} param.activitiesData
 * @param {object} param.orderList
 */
export default function CustomerFullDetail({ activitiesData, orderList, customerInfo, ticketList, noteList, customerCode }) {

    return (
        <Box>
            <CustomerAutoSearch customerInfo={customerInfo}></CustomerAutoSearch>
            {
                customerCode != "" ? ((customerInfo && customerInfo[0] && customerInfo[0].customerID) ? <Box>
                    <FlexContainer>
                        <FlexContent>
                            <CustomerSimpleDetail customerInfo={customerInfo}></CustomerSimpleDetail>
                        </FlexContent>
                        <FlexContent>
                            <CustomerOrderList orderList={orderList} customerCode={customerCode}></CustomerOrderList>
                        </FlexContent>
                    </FlexContainer>
                    <FlexContainer>
                        <FlexContent>
                            <CustomerTicketList ticketList={ticketList} customerCode={customerCode}></CustomerTicketList>
                        </FlexContent>
                        <FlexContent>
                            <CustomerNote noteList={noteList}></CustomerNote>
                        </FlexContent>
                    </FlexContainer>
                    <CustomerHistory activitiesData={activitiesData}></CustomerHistory>
                </Box> : "Không tìm thấy thông tin khách hàng") : ""
            }
        </Box>
    )
}