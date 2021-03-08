import React from "react";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login"

import AppCRM from "pages/_layout";
import { DealForm } from "containers/crm/deal/DealForm";

export function getServerSideProps(ctx) {
    return doWithLoggedInUser(ctx, () => { })
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
            <DealForm />
        </AppCRM>
    )
}

export default function NewDealPage(props) {
    return renderWithLoggedInUser(props, render);
}