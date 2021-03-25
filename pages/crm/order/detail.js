import React from "react";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import OrderFullDetail, { getOrderFullDetail } from "containers/crm/order/detail/OrderFullDetail"; // getOrderFullDetail,
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

    const { orderNo } = ctx.query;
    const orderData = await getOrderFullDetail({ ctx, data, orderNo });
    data.props = orderData;
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
