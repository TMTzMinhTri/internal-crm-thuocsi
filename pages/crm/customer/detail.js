import React from 'react';
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import CustomerFullDetail, { getCustomerFullDetail } from 'containers/crm/customer/detail/CustomerFullDetail';
import AppCRM from 'pages/_layout';
import Head from 'next/head';

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, loadData)
}

export default function EditPage(props) {
    return renderWithLoggedInUser(props, render)
}

// load data at server side
async function loadData(ctx) {
    let data = { props: {} }
    let customerCode = ctx.query.customerCode
    let customerData = await getCustomerFullDetail({ ctx, data, customerCode })
    for (let key in customerData) {
        data.props[key] = customerData[key]
    }
    data.props.customerCode = customerCode || ""
    return data
}

// do render
function render({ customerCode, customerInfo, orderList, noteList, ticketList, activitiesData }) {
    const breadcrumb = [
        {
            name: "Trang chủ",
            link: "/crm"
        },
        {
            name: "Danh sách khách hàng",
            link: "/crm/customer"
        },
        {
            name: "Tra cứu khách hàng",
        },
    ];

    return (
        <AppCRM select="/crm/customer/detail" breadcrumb={breadcrumb}>
            <Head>
                <title>Chi tiết khách hàng</title>
            </Head>
            <CustomerFullDetail
                customerCode={customerCode}
                customerInfo={customerInfo}
                orderList={orderList}
                activitiesData={activitiesData}
                noteList={noteList}
                ticketList={ticketList}
            >
            </CustomerFullDetail>

        </AppCRM>
    )
}