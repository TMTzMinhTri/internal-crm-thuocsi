import React from "react";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login"

import AppCRM from "pages/_layout";
import { DealForm } from "containers/crm/deal/DealForm";
import { getPricingClient } from "client/pricing";
import { getProductClient } from "client/product";

async function loadDealData(ctx) {
    const props = {
        skuOptions: []
    };
    const pricingClient = getPricingClient(ctx, {});
    const productClient = getProductClient(ctx, {});
    const skusResp = await pricingClient.getListPricingByFilter({ offset: 0, limit: 100, q: "", status: "ACTIVE" });
    const skuMap = {};
    skusResp.data?.forEach(({ sku }) => {
        if (!skuMap[sku]) {
            skuMap[sku] = true;
        }
    });

    const productResp = productClient.getProductBySKUs(Object.keys(skuMap));

    props.skuOptions = productResp.data?.map(({ sku, seller, name }) => {
        return ({ value: sku, label: `${name} - ${seller?.name ?? seller?.code}`, sellerCode: seller.code, sku })
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