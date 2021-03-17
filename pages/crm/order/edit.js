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
import { OrderForm } from 'containers/crm/order/edit/OrderForm';
import { NotFound } from 'components/components-global';

async function loadOrderFormData(ctx) {
    const props = {
        message: "",
        order: null,
        orderItems: [],
        productMap: {},
        productCodes: [],
        sellerMap: {},
        sellerCodes: [],
        provinces: [],
        districts: [],
        wards: [],
        paymentMethods: [],
        deliveryPlatforms: [],
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

    //Get Master Data
    const masterDataClient = getMasterDataClient(ctx, {});
    // Pre-load provinces, distrists, wards for selector.
    const [
        provincesResp,
        districtsResp,
        wardsResp,
    ] = await Promise.all([
        masterDataClient.getProvince(0, 100, "", false),
        masterDataClient.getDistrictByProvinceCodeFromNextJs(props.order.customerProvinceCode),
        masterDataClient.getWardByDistrictCodeFromNextJS(props.order.customerDistrictCode),
    ])
    props.provinces = provincesResp.data ?? [];
    props.districts = districtsResp.data ?? [];
    props.wards = wardsResp.data ?? [];

    // Get list delivery
    const deliveryClient = getDeliveryClient(ctx, {});
    const deliveryResp = await deliveryClient.getListDelivery(0, 100, "");
    if (deliveryResp.status == "OK") {
        props.deliveryPlatforms = deliveryResp.data;
    }

    // Get list payment method
    const paymentClient = getPaymentClient(ctx, {});
    const paymentResp = await paymentClient.getListPaymentMethod();
    if (paymentResp.status == "OK") {
        props.paymentMethods = paymentResp.data;
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
    const skuMap = {};
    const skuCodes = [];
    const productMap = {};
    const productCodes = [];
    const sellerMap = {};
    const sellerCodes = [];
    orderItemResp.data.forEach(({ productSku, sellerCode }) => {
        if (productSku && !skuMap[productSku]) {
            skuMap[productSku] = true;
            skuCodes.push(productSku);
        }
        if (sellerCode && !sellerMap[sellerCode]) {
            sellerMap[sellerCode] = true;
            sellerCodes.push(sellerCode);
        }
    });
    const [productResp, sellerResp] = await Promise.all([
        productClient.getProductBySKUs(skuCodes),
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
        product: productMap[skuMap[orderItem.productSku].productCode] ?? null,
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
    if (!props.order) {
        return <NotFound titlePage="Thông tin đơn hàng" labelLink="Danh sách đơn hàng" link="/crm/order"/>
    }
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