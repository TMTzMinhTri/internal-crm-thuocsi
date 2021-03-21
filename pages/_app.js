import { faDollarSign, faPercentage, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Backdrop, CircularProgress, createMuiTheme, ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Layout from '@thuocsi/nextjs-components/layout/layout';
import Loader from '@thuocsi/nextjs-components/loader/loader';
import { ToastProvider } from "@thuocsi/nextjs-components/toast/providers/ToastProvider";
import { useRouter } from "next/router";
import React, { useEffect } from 'react';
import styles from "./global.css";

const menu = [{
    key: "CUSTOMER",
    name: "Khách hàng",
    link: "/crm/customer",
    icon: faUsers,
    subMenu: [
        {
            key: "CUSTOMER",
            name: "Khách hàng",
            link: "/crm/customer"
        },
        {
            key: "ACCOUNT",
            name: "Tài khoản",
            link: "/crm/account"
        }
    ]
},
{
    key: "ORDER",
    name: "Đơn hàng",
    link: "/crm/order",
    icon: faDollarSign,
},
{
    key: "DISCOUNT",
    name: "Khuyến mãi",
    link: "/crm/promotion",
    icon: faPercentage,
    subMenu: [
        {
            key: "DISCOUNT",
            name: "Chương trình khuyến mãi",
            link: "/crm/promotion"
        },
        {
            key: "VOUCHER",
            name: "Mã khuyến mãi",
            link: "/crm/voucher"
        }
    ]
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
                        <Backdrop style={{ zIndex: theme.zIndex.drawer + 1, color: '#fff' }} className={styles.backdrop} open={showBackdrop}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
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
