import { faDollarSign, faGift, faPercentage, faSearch, faStore, faTag, faUserCircle, faUsers, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Layout from '@thuocsi/nextjs-components/layout/layout';
import Loader, { setupLoading } from '@thuocsi/nextjs-components/loader/loader';
import { ToastProvider } from "@thuocsi/nextjs-components/toast/providers/ToastProvider";
import { useRouter } from "next/router";
import React, { useEffect } from 'react';
import styles from "./global.css";

const menu = [{
    key: "CUSTOMER",
    name: "Khách hàng",
    required: "/crm/customer",
    icon: faUsers,
    subMenu: [
        {
            key: "CUSTOMER",
            name: "Khách hàng",
            link: "/crm/customer",
            icon: faStore,
        },
        {
            key: "LOOKUP",
            name: "Tra cứu",
            link: "/crm/customer/detail",
            icon: faSearch,
        },
        {
            key: "ACCOUNT",
            name: "Tài khoản",
            link: "/crm/account",
            icon: faUserCircle
        },
        {
            key: "ORDER",
            name: "Đặt hàng",
            link: "/crm/customer/order",
            icon: faShoppingCart
        }
    ]
},
{
    key: "ORDER",
    name: "Đơn hàng",
    link: "/crm/order",
    icon: faDollarSign,
    subMenu: [
        {
            key: "ORDER",
            name: "Đơn hàng",
            link: "/crm/order",
            icon: faStore,
        },
        {
            key: "ORDER_LOOKUP",
            name: "Tra cứu",
            link: "/crm/order/detail",
            icon: faSearch,
        }
    ]
},
{
    key: "DISCOUNT",
    name: "Khuyến mãi",
    required: "/crm/promotion",
    icon: faPercentage,
    subMenu: [
        {
            key: "DISCOUNT",
            name: "Chương trình khuyến mãi",
            link: "/crm/promotion",
            icon: faGift
        },
        {
            key: "VOUCHER",
            name: "Mã khuyến mãi",
            link: "/crm/voucher",
            icon: faTag
        }
    ]
},
{
    key: "DEAL",
    name: "Deal",
    link: "/crm/deal",
},
]

export var theme = createMuiTheme({
    palette: {
        primary: {
            main: '#00b46e',
            dark: '#00a45e',
            contrastText: "#fff"
        }
    },
})

export default function App(props) {
    const router = useRouter();
    const [showLoader, setShowLoader] = React.useState(true)
    const [showLoaderText, setShowLoaderText] = React.useState(true)

    // do once
    useEffect(() => {

        // setup first loading
        setTimeout(() => {
            setShowLoaderText(false)
            setShowLoader(false)
        }, 500)

        // setup loading when navigate
        return setupLoading(router, setShowLoader)
    }, [])

    const { Component, pageProps } = props

    if (pageProps.loggedIn) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <ToastProvider>
                    <Layout className={styles.blank} loggedInUserInfo={pageProps.loggedInUserInfo} menu={menu} title="CRM">
                        <Component {...pageProps} />
                    </Layout>
                </ToastProvider>
                <Loader show={showLoader} showText={showLoaderText}></Loader>
            </ThemeProvider>
        )
    } else {
        return (<ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>)
    }

}
