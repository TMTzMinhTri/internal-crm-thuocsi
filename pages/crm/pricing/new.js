import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-components/lib/login";
import {getProductClient} from "client/product";
import React from 'react';
import renderForm from "./form";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadListProduct(ctx)
    })
}

export async function loadListProduct(ctx) {
    let data = {props: {}}
    let _client = getProductClient(ctx, {})
    data.props.products = []
    let products = await _client.getListProduct({})

    if (products.status !== "OK") {
        data.props.products = []
    } else {
        data.props.products = products?.data
    }

    return data
}

export default function NewFromPage(props) {
    return renderWithLoggedInUser(props, renderForm)
}
