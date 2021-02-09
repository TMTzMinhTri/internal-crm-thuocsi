import App from "@thuocsi/nextjs-components/app/app";

export default function AppCRM(props){
    let { children } = props
    return (
        <App select={props.select}>
            {children}
        </App>
    )
}