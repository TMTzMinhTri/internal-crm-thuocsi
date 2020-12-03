import {faUsers, faReceipt, faMoneyCheckAlt, faGifts, faPercentage, faDollarSign} from '@fortawesome/free-solid-svg-icons'
import App from "@thuocsi/nextjs-components/app/app"
import React, {Component} from "react"

export default class AppCRM extends Component {

    constructor(props) {
        super(props)
        this.state = {
            menu: [
                {
                    key: "ORDER",
                    name: "Đơn hàng",
                    link: "/cms/product",
                    icon: faReceipt
                },
                {
                    key: "CUSTOMER",
                    name: "Khách hàng",
                    link: "/cms/product",
                    icon: faUsers
                },
                {
                    key: "PRODUCT",
                    name: "Bảng giá",
                    link: "/cms/product",
                    icon: faMoneyCheckAlt
                },
                {
                    key: "PRICING",
                    name: "Chỉ số giá",
                    link: "/crm/pricing",
                    icon: faDollarSign
                },
                {
                    key: "PROMO",
                    name: "Khuyến mãi",
                    link: "/crm/promo",
                    icon: faPercentage
                },
                {
                    key: "POINT",
                    name: "Điểm thưởng",
                    link: "/crm/pricing",
                    icon: faGifts
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