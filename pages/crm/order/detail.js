import React from "react";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import OrderFullDetail from "containers/crm/order/detail/OrderFullDetail"; // getOrderFullDetail,
import { getOrderClient } from "client/order";
import { getMasterDataClient } from "client/master-data";
import { getProductClient } from "client/product";
import { getTicketClient } from "client/ticket";
import { getOrderHistory } from "containers/crm/order/detail/OrderHistory";
import { isValid } from "utils/ClientUtils";
import AppCRM from "pages/_layout";
import Head from "next/head";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, loadData);
}

export default function EditPage(props) {
    return renderWithLoggedInUser(props, render);
}

// load data at server side
async function loadData(ctx) {
    let data = { props: {} };

    // clients
    const orderClient = getOrderClient(ctx, data);
    const masterDataClient = getMasterDataClient(ctx, data);
    const productClient = getProductClient(ctx, data);
    const ticketClient = getTicketClient(ctx, data);

    const { orderNo } = ctx.query;
    const orderResult = await orderClient.getOrderByOrderNo(orderNo);
    let order;

    if (!isValid(orderResult)) order = {};
    else order = orderResult.data[0];

    // get master data name
    const masterDataResult = await Promise.all([
        masterDataClient.getWardByWardCode(order.customerWardCode),
        masterDataClient.getDistrictByDistrictCode(order.customerDistrictCode),
        masterDataClient.getProvinceByProvinceCode(order.customerProvinceCode),
    ]);
    const masterDataAddress = masterDataResult
        .map((result) => (isValid(result) ? result.data[0].name : ""))
        .filter((el) => el)
        .join(", ");

    // get info product
    const productSkus = order.orderItems?.map((orderItem) => orderItem.productSku) || [];
    const [productsResult, ticketsResult, activitiesData] = await Promise.all([
        productClient.getProductBySKUs(productSkus),
        ticketClient.getTicketByFilter({
            saleOrderCode: order.orderNo,
            saleOrderID: order.orderId,
        }),
        getOrderHistory({ ctx, orderNo: order.orderNo }),
    ]);
    let mapInfoProduct = {};
    if (isValid(productsResult)) {
        productsResult.data.forEach((product) => {
            mapInfoProduct[product.sku] = product;
        });
    }
    const orderItems =
        order.orderItems?.map((orderItem) => {
            return {
                ...orderItem,
                productInfo: mapInfoProduct[orderItem.productSku],
            };
        }) || [];

    // get tickets
    let tickets = [];
    if (isValid(ticketsResult)) {
        tickets = ticketsResult.data;
    }
    data.props.order = order;
    data.props.order.masteDataAddress = masterDataAddress;
    data.props.order.orderItemList = orderItems;
    data.props.order.ticketList = tickets;
    data.props.activitiesData = activitiesData;
    return data;
}

// do render
function render({ order, activitiesData }) {
    const breadcrumb = [
        {
            name: "Trang chủ",
            link: "/crm",
        },
        {
            name: "Danh sách đặt hàng",
            link: "/crm/order",
        },
        {
            name: "Tra cứu đặt hàng",
        },
    ];

    return (
        <AppCRM select="/crm/order/detail" breadcrumb={breadcrumb}>
            <Head>
                <title>Chi tiết đặt hàng</title>
            </Head>
            <OrderFullDetail order={order} activitiesData={activitiesData} />
        </AppCRM>
    );
}
