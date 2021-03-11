import React from "react";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login"

import AppCRM from "pages/_layout";
import { DealForm } from "containers/crm/deal/DealForm";
import { getPricingClient } from "client/pricing";
import { getSellerClient } from "client/seller";

async function loadDealData(ctx) {
    const props = {
        skuOptions: []
    };
    const pricingClient = getPricingClient(ctx, {});
    const sellerClient = getSellerClient(ctx, {});
    const skusResp = await pricingClient.getListPricingByFilter({ offset: 0, limit: 100 });
    const productMap = {};
    const productCodes = [];
    const sellerMap = {};
    const sellerCodes = [];
    skusResp.data?.forEach(({ productCode, sellerCode }) => {
        if (!productMap[productCode]) {
            productCodes.push(productCode);
            productMap[productCode] = true;
        }
        if (!sellerMap[sellerCode]) {
            sellerCodes.push(sellerCode);
            sellerMap[sellerCode] = true;
        }
    });
    const [productResp, sellerResp] = await Promise.all([
        pricingClient.getListProductByProductCode(productCodes),
        sellerClient.getSellerBySellerCodes(sellerCodes),
    ])
    props.skuOptions = skusResp.data?.map(({ sellerCode, sku, productCode }) => {
        const product = productResp.data?.find(prd => prd.code === productCode);
        const seller = sellerResp.data?.find(seller => seller.code === sellerCode);
        return ({ value: sku, label: `${product?.name} - ${seller?.name ?? sellerCode}`, sellerCode, sku })
    }) ?? [];
    return {
        props,
    }
}

export function getServerSideProps(ctx) {
    return doWithLoggedInUser(ctx, () => loadDealData(ctx))
}

const breadcrumb = [
    {
        name: "Trang chủ",
        link: "/crm",
    },
    {
        name: "Danh sách deal",
        link: "/crm/deal",
    },
    {
        name: "Thêm deal"
    }
]
const render = props => {

    return (
        <AppCRM breadcrumb={breadcrumb}>
            <DealForm {...props}/>
        </AppCRM>
    )
}

export default function NewDealPage(props) {
    return renderWithLoggedInUser(props, render);
}