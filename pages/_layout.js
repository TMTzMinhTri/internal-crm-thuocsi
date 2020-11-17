import { faUsers } from '@fortawesome/free-solid-svg-icons'
import App from "@thuocsi/nextjs-components/app/app"
import { Component } from "react"

export default class AppCRM extends Component {

    constructor(props) {
        super(props)
        this.state = {
            menu: [{
                key: "PRICING",
                name: "Đơn giá",
                link: "/pricing",
                icon: faUsers
            }]
        }
    }

    render() {
        let { children } = this.props
        return (
            <App menu={this.state.menu} select={this.props.select}>
                {children}
            </App>
        )
    }
}