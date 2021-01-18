import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { useToast } from '@thuocsi/nextjs-components/toast/useToast';
import renderForm, { loadData } from "./form";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, loadData)
}

export default function NewPage(props) {
    return renderWithLoggedInUser(props, render)
}

export function render(props) {
    return renderForm(props, useToast())
}