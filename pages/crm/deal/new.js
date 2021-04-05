import React from "react";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login"

import AppCRM from "pages/_layout";
import { DealForm } from "containers/crm/deal/DealForm";
import { getPricingClient } from "client/pricing";

async function loadDealData(ctx) {
    const props = {
        skuOptions: []
    };
    const pricingClient = getPricingClient(ctx, {});
    const skusResp = await await pricingClient.searchSellingSKUsByKeyword("");

    props.skuOptions = skusResp.data?.map(({ sku, seller, name }) => {
        return ({ value: sku, label: `${name} - ${seller?.name ?? seller?.code ?? ""}`, sellerCode: seller?.code, sku })
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