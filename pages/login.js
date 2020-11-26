import { APIStatus } from "@thuocsi/nextjs-lib/common";
import { parseBody } from "next/dist/next-server/server/api-utils";
import LoginForm from "../components/login/login";

/*
Login page that is used on stg/uat/prd is only run from internal-hrm code repo.
'Login.js' file of other repos is only used for local testing.

This file have 2 ways to use:
+ GET method: display login page with login form
+ POST method: receive submitted login data (username/password)
*/
export async function getServerSideProps(ctx) {
    let returnObject = {props: {}}
    if (ctx.req && ctx.req.method === "POST") {

        // read form data
        let body = await parseBody(ctx.req, '1kb')

        // call backend API
        const response = await fetch(`${process.env.API_HOST}/core/account/v1/authentication`, {
            method: "POST",
            contentType: "application/json",
            body: JSON.stringify({
                username: body.username,
                password: body.password,
            }),
            headers: {
                "User-Agent": ctx.req.headers['user-agent'],
                "X-Forwarded-For":ctx.req.headers['x-forwarded-for'],
            }
        })
        const result = await response.json()
        console.log(result)

        // if OK, do set cookie & redirect page to relative target
        if (result.status === APIStatus.OK) {
            console.log("@@@")
            let data = result.data[0]
            let url = body.url || "/"
            let res = ctx.res
            res.setHeader("set-cookie", `session_token=${data.bearerToken}; Path=/; HttpOnly`)
            res.setHeader("location", url);
            res.statusCode = 302;
            res.end();
        }

        returnObject.props.url = body.url
    }
    return returnObject

}

/*
A simple login page.
Can customize to display more.
LoginForm has basic inputs of authentication flow:
+ Login label
+ Username / password input
+ Submit button
*/
export default function LoginPage(props) {
    return <LoginForm url={props.url}></LoginForm>
}
