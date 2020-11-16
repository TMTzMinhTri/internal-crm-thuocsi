import React from 'react';
import App from 'next/app';
import Layout from '@thuocsi/nextjs-components/layout/layout';
import styles from "./global.css"
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import Loader from '@thuocsi/nextjs-components/loader/loader';

export var theme = createMuiTheme({
    palette: {
        primary: {
            main: '#00b46e',
            dark: '#00a45e',
            contrastText: "#fff"
        }
    }
})

export default class MyApp extends App {
    constructor(props) {
        super(props)
        this.state = {
            showLoader: true
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ showLoader: false })
        }, 500)
    }


    render() {
        const { Component, pageProps } = this.props
        return (
            <ThemeProvider theme={theme}>
                <Layout show={!this.state.showLoader}>
                    <Component {...pageProps} />
                </Layout>
                <Loader show={this.state.showLoader}></Loader>
            </ThemeProvider>
        )
    }
}