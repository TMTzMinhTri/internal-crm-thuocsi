import { Button, ButtonGroup, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import styles from "./pricing.module.css";

export async function getServerSideProps({ query }) {
    return await loadProductData(query)
}

export async function loadProductData(query) {
    // Fetch data from external API
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit

    const res = await fetch(`http://34.87.48.109/core/product/v1/product/list?offset=${offset}&limit=${limit}&getTotal=true`, {
        method: "GET",
        headers: {
            "Authorization": "Basic bmFtcGg6MTIzNDU2"
        }
    })

    const result = await res.json()
    if(result.status != "OK") {
        return { props: {data: [], count: 0, message: result.message} }
    }
    console.log(result)
    // Pass data to the page via props
    return { props: {data: result.data, count: result.total} }
}

export async function loadPricingData(query) {
    // Fetch data from external API
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit

    const res = await fetch(`http://34.87.48.109/customer/pricing/v1/product/list?offset=${offset}&limit=${limit}&getTotal=true`, {
        method: "GET",
        headers: {
            "Authorization": "Basic bmFtcGg6MTIzNDU2"
        }
    })

    const result = await res.json()
    if(result.status != "OK") {
        return { props: {data: [], count: 0, message: result.message} }
    }
    console.log(result)
    // Pass data to the page via props
    return { props: {data: result.data, count: result.total} }
}


export function formatNumber(num) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export default function ProductPage(props) {
    let router = useRouter()
    let page = parseInt(router.query.page) || 0
    let limit = parseInt(router.query.limit) || 20

    const RenderRow = (row) => (
        <TableRow>
            <TableCell component="th" scope="row">
                <Link href={`/pricing/edit?sale_id=${row.productSaleID}`}>
                    <a><b>{row.data.sku}</b></a>
                </Link>
            </TableCell>
            <TableCell align="left">{row.data.name}</TableCell>
            <TableCell align="left">{row.status}</TableCell>
            <TableCell align="left">{row.originalPrice}</TableCell>
            <TableCell align="left">{row.basePrice}</TableCell>
            <TableCell align="right">...</TableCell>
        </TableRow>
    )

    return (
        <AppCRM select="/pricing">
            <Head>
                <title>Danh sách sản phẩm</title>
            </Head>
            <Link href="/pricing/new">
                <ButtonGroup color="primary" aria-label="contained primary button group" className={styles.rightGroup}>
                    <Button variant="contained" color="primary" disabled>Thêm sản phẩm</Button>
                </ButtonGroup>
            </Link>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">SKU</TableCell>
                            <TableCell align="left">Tên sản phẩm</TableCell>
                            <TableCell align="left">Trạng thái</TableCell>
                            <TableCell align="left">Giá gốc</TableCell>
                            <TableCell align="left">Giá bán</TableCell>
                            <TableCell align="right">Tác vụ</TableCell>
                        </TableRow>
                    </TableHead>
                    { props.data.length > 0 ? (
                    <TableBody>
                        {props.data.map(row => (
                            <RenderRow data={row}/>
                        ))}
                    </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={3} align="left">{props.message}</TableCell>
                            </TableRow>
                        </TableBody>
                    )}

                    <MyTablePagination
                        labelUnit="sản phẩm"
                        count={props.count}
                        rowsPerPage={limit}
                        page={page}
                        onChangePage={(event, page, rowsPerPage) => { Router.push(`/pricing?page=${page}&limit=${rowsPerPage}`) }}
                    ></MyTablePagination>
                </Table>
            </TableContainer>
        </AppCRM>
    )
}