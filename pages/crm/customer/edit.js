import React from 'react';
import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-components/lib/login";
import renderForm, {loadData} from "./form";
import {useToast} from "@thuocsi/nextjs-components/toast/useToast";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, loadData)
}

export default function EditPage(props) {
    return renderWithLoggedInUser(props, render)
}

export function render(props) {
    return renderForm(props, useToast())
}