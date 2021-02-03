import React from "react";
import stylesGlobal from "components/css-global.module.css";
import Link from "next/link";
import Head from "next/head";
import AppCRM from "pages/_layout";

/**
 * @param {object} props 
 * @param {string} props.link 
 * @param {string} props.titlePage
 * @param {string} props.labelLink
 * @param {string} props.message
 */
export function NotFound(props) {
    return (
        <AppCRM select={props.link}>
            <Head>
                <title>{props.titlePage}</title>
            </Head>
            <div className={stylesGlobal.height404}>
                <div>
                    <span>{props.message ?? "Không tìm thấy kết quả phù hợp"} | </span>
                    <Link href={props.link}>
                        <a>
                            Quay lại trang danh sách {props.labelLink}
                        </a>
                    </Link>
                </div>
            </div>
        </AppCRM>
    );
}
