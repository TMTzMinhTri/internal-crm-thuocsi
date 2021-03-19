import { Box } from "@material-ui/core";
import { CustomerAutoSearch } from "../CustomerAutoSearch";
import CustomerHistory, { getCustomerHistory } from "./CustomerHistory";
import CustomerOrderList, { getCustomerOrderList } from "./CustomerOrderList";
import CustomerSimpleDetail, { getCustomerSimpleDetail } from "./CustomerSimpleDetail";
import CustomerTicketList, { getCustomerTicketList } from "./CustomerTicketList";

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
        getCustomerTicketList({ ctx, data, customerCode })
    ], result = {}

    // call API & wait parallely
    await Promise.all(reqs).then((values) => {
        result = {
            customerInfo: values[0]?.data || [],
            activitiesData: values[1],
            orderList: values[2]?.data || [],
            ticketList: values[3]?.data || []
        }
    })
    return result
}

/**
 * Component that display order list of customer.
 * @param {object} param.customerInfo
 * @param {object} param.activitiesData
 * @param {object} param.orderList
 */
export default function CustomerFullDetail({ activitiesData, orderList, customerInfo, ticketList, customerCode }) {

    return (
        <Box>
            <CustomerAutoSearch customerInfo={customerInfo}></CustomerAutoSearch>
            {
                customerCode != "" ? ((customerInfo && customerInfo[0] && customerInfo[0].customerID) ? <Box>
                    <CustomerSimpleDetail customerInfo={customerInfo}></CustomerSimpleDetail>
                    <CustomerOrderList orderList={orderList}></CustomerOrderList>
                    <CustomerTicketList ticketList={ticketList}></CustomerTicketList>
                    <CustomerHistory activitiesData={activitiesData}></CustomerHistory>
                </Box> : "Không tìm thấy thông tin khách hàng") : ""
            }
        </Box>
    )
}