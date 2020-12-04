import React, {useEffect} from 'react';
import {createMuiTheme, ServerStyleSheets, ThemeProvider} from '@material-ui/core';
import Layout from '@thuocsi/nextjs-components/layout/layout';
import Loader from '@thuocsi/nextjs-components/loader/loader';
import {ToastProvider} from "@thuocsi/nextjs-components/toast/providers/ToastProvider";
import styles from "./global.css"

export var theme = createMuiTheme({
    palette: {
        primary: {
            main: '#00b46e',
            dark: '#00a45e',
            contrastText: "#fff"
        }
    }
})

export default function App(props) {
    const [showLoader, setShowLoader] = React.useState(true)

    useEffect(() => {
            setTimeout(() => {
                setShowLoader(false)
            }, 500)
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
