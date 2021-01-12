import stylesGlobal from "components/css-global.module.css";
import Link from "next/link";
import Head from "next/head";
import AppCRM from "pages/_layout";

export function NotFound(props) {
    return (
        <AppCRM select={props.link}>
            <Head>
                <title>{props.titlePage}</title>
            </Head>
            <div className={stylesGlobal.height404}>
                <div>
                    <span>Không tìm thấy kết quả phù hợp | </span>
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

// if (props.status === "NOT_FOUND") {
//     return (
//         <NotFound titlePage={titlePage} link="/crm/pricing" labelLink="cấu hình giá"></NotFound>
//     )
// }