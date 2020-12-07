import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import renderForm from "./form";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return {props: {}}
    })
}

export default function NewPage(props) {
    return renderWithLoggedInUser(props, render)
}

export function render(props) {
    return renderForm(props)
}