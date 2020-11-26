import {faUsers} from '@fortawesome/free-solid-svg-icons'
import App from "@thuocsi/nextjs-components/app/app"
import {Component} from "react"

export default class AppCRM extends Component {

    constructor(props) {
        super(props)
        this.state = {
            menu: [
                {
                    key: "PRODUCT",
                    name: "Sản phẩm",
                    link: "/crm/product",
                    icon: faUsers
                },
                {
                    key: "PRICING",
                    name: "Chỉ số giá",
                    link: "/crm/pricing",
                    icon: faUsers
                },
                {
                    key: "PROMO",
                    name: "Mã giảm giá",
                    link: "/crm/promo",
                    icon: faUsers
                },
            ]
        }
    }

    render() {
        let {children} = this.props
        return (
            <App menu={this.state.menu} select={this.props.select}>
                {children}
            </App>
        )
    }
}