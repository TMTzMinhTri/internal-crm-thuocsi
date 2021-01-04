import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-components/lib/login";
import {getProductClient} from "client/product";
import { getTagClient } from "client/tag";
import React from 'react';
import renderForm from "./form";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";

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

    let _client1 = getTagClient(ctx,{})
    let listTag = await _client1.getListTag(0,500,"")
    data.props.listTag= listTag.data || [];

    if (products.status !== "OK") {
        data.props.products = []
    } else {
        data.props.products = products?.data
    }

    return data
}

export default function NewFromPage(props) {
    return renderWithLoggedInUser(props, render)
}

export function render(props) {
    return renderForm(props, useToast())
}