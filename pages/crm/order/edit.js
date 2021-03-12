import React from 'react';
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import Head from 'next/head';

import AppCRM from 'pages/_layout';
import { getDeliveryClient } from "client/delivery";
import { getMasterDataClient } from "client/master-data";
import { getOrderClient } from "client/order";
import { getPaymentClient } from "client/payment";
import { getSellerClient } from "client/seller";
import { getProductClient } from "client/product";
import { OrderForm } from 'containers/crm/order/OrderForm';

async function loadOrderFormData(ctx) {
    const props = {
        message: "",
        order: null,
        orderItems: [],
        productMap: {},
        productCodes: [],
        sellerMap: {},
        sellerCodes: [],
    };

    const orderNo = ctx.query.orderNo;

    if (!orderNo) {
        props.message = "Không tìm thấy kết quả phù hợp";
        return { props };
    }


    const orderClient = getOrderClient(ctx, {});
    const orderResp = await orderClient.getOrderByOrderNo(orderNo);
    if (orderResp.status !== "OK") {
        props.message = orderResp.message;
        props.status = orderResp.status;
        return { props };
    }
    const order = orderResp.data[0];
    props.order = order;

    //Get Master Data Client
    const masterDataClient = getMasterDataClient(ctx, {});
    const wardResp = await masterDataClient.getWardByWardCode(
        order.customerWardCode
    );
    if (wardResp.status === "OK") {
        props.order.customerProvinceCode = wardResp.data[0].provinceName;
        props.order.customerDistrictCode = wardResp.data[0].districtName;
        props.order.customerWardCode = wardResp.data[0].name;
    }

    // Get list delivery
    const deliveryClient = getDeliveryClient(ctx, {});
    const deliveryResp = await deliveryClient.getListDeliveryByCode(
        order.deliveryPlatform
    );
    if (deliveryResp.status == "OK") {
        props.order.deliveryPlatform = deliveryResp.data[0];
    }

    // Get list payment method
    const paymentClient = getPaymentClient(ctx, {});
    const paymentResp = await paymentClient.getPaymentMethodByCode(
        order.paymentMethod
    );
    if (paymentResp.status == "OK") {
        props.order.paymentMethod = paymentResp.data[0];
    }

    //get list order-item
    const orderItemResp = await orderClient.getOrderItemByOrderNo(orderNo);
    if (orderItemResp.status !== "OK") {
        props.message = orderItemResp.message;
        props.status = orderItemResp.status;
        return { props };
    }

    const productClient = getProductClient(ctx, {});
    const sellerClient = getSellerClient(ctx, {});
    const productMap = {};
    const productCodes = [];
    const sellerMap = {};
    const sellerCodes = [];
    orderItemResp.data.forEach(({ productCode, sellerCode }) => {
        if (productCode && !productMap[productCode]) {
            productMap[productCode] = true;
            productCodes.push(productCode);
        }
        if (sellerCode && !sellerMap[sellerCode]) {
            sellerMap[sellerCode] = true;
            sellerCodes.push(sellerCode);
        }
    });
    const [productResp, sellerResp] = await Promise.all([
        productClient.getListProductByIdsOrCodes([], productCodes),
        sellerClient.getSellerBySellerCodes(sellerCodes)
    ])

    productResp.data?.forEach(product => {
        productMap[product.code] = product;
    });
    sellerResp.data?.forEach(seller => {
        sellerMap[seller.code] = seller;
    });

    props.orderItems = orderItemResp.data.map(orderItem => ({
        ...orderItem,
        product: productMap[orderItem.productCode] ?? null,
        seller: sellerMap[orderItem.sellerCode] ?? null,
    }))
    props.productMap = productMap;
    props.productCodes = productCodes;
    props.sellerMap = sellerMap;
    props.sellerCodes = sellerCodes;
    return { props };
}

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, loadOrderFormData)
}

const breadcrumb = [
    {
        name: "Trang chủ",
        link: "/crm"
    },
    {
        name: "Danh sách đơn hàng",
        link: "/crm/order"
    },
    {
        name: "Cập nhật đơn hàng"
    }
]
export function render(props) {
    return (
        <AppCRM select="/crm/order" breadcrumb={breadcrumb}>
            <Head>
                <title>Thông tin đơn hàng</title>
            </Head>
            <OrderForm {...props} />
        </AppCRM>)
}

export default function EditPage(props) {
    return renderWithLoggedInUser(props, render)
}