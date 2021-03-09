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
            icon: faUsers
        },
        {
            key: "PRICING",
            name: "Sản phẩm",
            link: "/crm/sku",
            icon: faDollarSign,
            subMenu: [
                {
                    key: "PRICING_ACTIVE",
                    name: "Sản phẩm đang hoạt động",
                    link: "/crm/sku",
                },
                {
                    key: "PRICING_REQUEST",
                    name: "Sản phẩm chờ duyệt",
                    link: "/crm/sku/request",
                },
            ]
        },
        {
            key: "FEE",
            name: "Cài đặt phí",
            link: "/crm/fee",
            icon: faDollarSign,
            subMenu: [
                {   
                    key: "FEE",
                    name: "Công thức phí",
                    link: "/crm/fee",
                },
                {
                    key: "CONFIGPRICING",
                    name: "Hệ số phí",
                    link: "/crm/pricing",
                },
            ]
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
        {
            key:"DELIVERY",
            name:"Giao hàng",
            link:"/crm/delivery/time",
            subMenu: [
                {
                    key:"DELIVERY",
                    name:"Thời gian giao hàng",
                    link:"/crm/delivery/time",
                },
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
    const [showBackdrop, setShowBackdrop] = React.useState(false)

    useEffect(() => {
        let routeChangeStart = () => setShowBackdrop(true);
        let routeChangeComplete = () => setShowBackdrop(false);
    
        router.events.on("routeChangeStart", routeChangeStart);
        router.events.on("routeChangeComplete", routeChangeComplete);
        router.events.on("routeChangeError", routeChangeComplete);
        setTimeout(() => {
            setShowLoader(false)
        }, 500)
        return () => {
                router.events.off("routeChangeStart", routeChangeStart);
                router.events.off("routeChangeComplete", routeChangeComplete);
                router.events.off("routeChangeError", routeChangeComplete);
            }
        }, []
    )
    const {Component, pageProps} = props

    if (pageProps.loggedIn) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <ToastProvider>
                    <Layout className={styles.blank} loggedInUserInfo={pageProps.loggedInUserInfo} menu={menu} title="CRM">
                        <Component {...pageProps} />
                        <Backdrop style={{zIndex: theme.zIndex.drawer + 1, color: '#fff'}} className={styles.backdrop} open={showBackdrop}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
                    </Layout>
                </ToastProvider>
                <Loader show={showLoader}></Loader>
            </ThemeProvider>
        )
    } else {
        return (<ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>)
    }

}
