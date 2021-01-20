import { Backdrop, CircularProgress, createMuiTheme, ServerStyleSheets, ThemeProvider } from '@material-ui/core';
import Layout from '@thuocsi/nextjs-components/layout/layout';
import Loader from '@thuocsi/nextjs-components/loader/loader';
import { ToastProvider } from "@thuocsi/nextjs-components/toast/providers/ToastProvider";
import { useRouter } from "next/router";
import React, { useEffect } from 'react';
import styles from "./global.css";

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
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
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

    // use ServerStyleSheets to remove affect of injected CSS
    // ref: https://material-ui.com/guides/server-rendering/
    const sheets = new ServerStyleSheets();
    if (pageProps.loggedIn) {
        return sheets.collect(
            <ThemeProvider theme={theme}>
                <ToastProvider>
                    <Layout className={styles.blank} loggedInUserInfo={pageProps.loggedInUserInfo}>
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
        return sheets.collect(<ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>)
    }

}
