import React from "react";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login"

import AppCRM from "pages/_layout";
import { DealForm } from "containers/crm/deal/DealForm";
import { getPricingClient } from "client/pricing";
import { getDealClient } from "client/deal";
import { unknownErrorText } from "components/commonErrors";
import { getProductClient } from "client/product";

async function loadDealData(ctx) {
    const dealCode = ctx.query.dealCode;
    const props = {
        skuOptions: [],
        deal: null,
        message: "",
    };
    if (!dealCode) {
        props.message = "Không tìm thấy kết quả phù hợp.";
        return { props };
    }
    const dealClient = getDealClient(ctx, {});
    const dealResp = await dealClient.getDealByCode(dealCode);
    if (dealResp.status !== "OK") {
        if (dealResp.status === "NOT_FOUND") {
            props.message = "Không tìm thấy kết quả phù hợp.";
        } else {
            props.message = dealResp.message ?? unknownErrorText;
        }
        return { props };
    }
    props.deal = dealResp.data[0];

    const pricingClient = getPricingClient(ctx, {});
    const productClient = getProductClient(ctx, {});
    const skusResp = await pricingClient.searchSellingSKUsByKeyword("");
    const skuMap = {};
    skusResp.data?.forEach(({ sku, seller, name }) => {
        if (!skuMap[sku]) {
            skuMap[sku] = { value: sku, label: `${name} - ${seller?.name ?? seller?.code ?? ""}`, sellerCode: seller?.code, sku };
        }
    });
    const skuCodes = [];
    props.deal.skus.forEach(({ sku }) => {
        if (!skuMap[sku]) {
            skuCodes.push(sku);
        }
    });
    
    if (skuCodes.length > 0) {
        const productResp = await productClient.getProductBySKUs(skuCodes);
    
        productResp.data?.forEach(({ sku, seller, name }) => {
            skuMap[sku] = { value: sku, label: `${name} - ${seller?.name ?? seller?.code ?? ""}`, sellerCode: seller?.code, sku };
        });
    }

    props.skuOptions = Object.values(skuMap);

    props.deal.skus = props.deal.skus.map((data) => {
        const { label = "" } = skuMap[data.sku] ?? {};
        return { ...data, label }
    });

    return {
        props,
    }
}

export function getServerSideProps(ctx) {
    return doWithLoggedInUser(ctx, async () => {
        return await loadDealData(ctx)
    })
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
        name: "Cập nhật deal"
    }
]
const render = props => {

    return (
        <AppCRM breadcrumb={breadcrumb}>
            <DealForm {...props} isUpdate />
        </AppCRM>
    )
}

export default function NewDealPage(props) {
    return renderWithLoggedInUser(props, render);
}