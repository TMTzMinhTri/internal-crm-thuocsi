import {faDollarSign, faMoneyCheckAlt, faPercentage, faUsers} from '@fortawesome/free-solid-svg-icons' // https://fontawesome.com/icons?d=gallery&s=solid&m=free
import App from "@thuocsi/nextjs-components/app/app"
import React, { Component } from "react"

export default class AppCRM extends Component {

    constructor(props) {
        super(props)
        this.state = {
            menu: [
                // {
                //     key: "ORDER",
                //     name: "Đơn hàng",
                //     link: "/crm/order",
                //     icon: faReceipt
                // },
                {
                    key: "CUSTOMER",
                    name: "Khách hàng",
                    link: "/crm/customer",
                    icon: faUsers
                },
                // {
                //     key: "PRODUCT",
                //     name: "Sản phẩm #",
                //     link: "/crm/product",
                //     icon: faMoneyCheckAlt
                // },
                {
                    key: "PRICING",
                    name: "Sản phẩm",
                    link: "/crm/sku",
                    icon: faDollarSign
                },
                {
                    key: "CONFIGPRICING",
                    name: "Bảng giá",
                    link: "/crm/pricing",
                    icon: faMoneyCheckAlt
                },
                {
                    key:"SELLER",
                    name:"Nhà bán hàng",
                    link:"/crm/seller",
                    icon:faUsers,
                },
                {
                    key:"ORDER",
                    name:"Đơn hàng",
                    link:"/crm/order",
                    icon:faDollarSign,
                },
                // {
                //     key: "DISCOUNT",
                //     name: "Khuyến mãi",
                //     link: "/crm/promotion",
                //     icon: faPercentage
                // },
                {
                    key: "DISCOUNT",
                    name: "Khuyến mãi",
                    link: "/crm/promotion",
                    icon: faPercentage
                },
                // {
                //     key: "PROMO",
                //     name: "Mã giảm giá",
                //     link: "/crm/promotion-code",
                //     icon: faQrcode
                // },
                // {
                //     key: "POINT",
                //     name: "Điểm thưởng",
                //     link: "/crm/pricing",
                //     icon: faGifts
                // },
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
