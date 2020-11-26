import {
    Button,
    ButtonGroup,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import Head from "next/head";
import Link from "next/link";
import Router, {useRouter} from "next/router";
import AppCRM from "pages/_layout";
import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-lib/login";
import React from "react";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadProductData(ctx)
    })
}

export async function loadProductData(ctx) {
    // Fetch data from external API
    let query = ctx.query
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit

    let result = {
        data: [
            {
                sku: 'sku',
                name: 'name',
                status: 'status 1',
                vat: '0.1',
                price: '100000'
            },
            {
                sku: 'sku',
                name: 'name',
                status: 'status 1',
                vat: '0.1',
                price: '100000'
            },
            {
                sku: 'sku',
                name: 'name',
                status: 'status 1',
                vat: '0.1',
                price: '100000'
            },
            {
                sku: 'sku',
                name: 'name',
                status: 'status 1',
                vat: '0.1',
                price: '100000'
            },
            {
                sku: 'sku',
                name: 'name',
                status: 'status 1',
                vat: '0.1',
                price: '100000'
            },
            {
                sku: 'sku',
                name: 'name',
                status: 'status 1',
                vat: '0.1',
                price: '100000'
            },
            {
                sku: 'sku',
                name: 'name',
                status: 'status 1',
                vat: '0.1',
                price: '100000'
            },
            {
                sku: 'sku',
                name: 'name',
                status: 'status 1',
                vat: '0.1',
                price: '100000'
            },
            {
                sku: 'sku',
                name: 'name',
                status: 'status 1',
                vat: '0.1',
                price: '100000'
            },
        ],
        total: 10,
    }
    // Pass data to the page via props
    return {props: {data: result.data, count: result.total}}
}

/*
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
*/

export default function ProductPage(props) {
    return renderWithLoggedInUser(props, render)
}

export function formatNumber(num) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function render(props) {
    let router = useRouter()
    let page = parseInt(router.query.page) || 0
    let limit = parseInt(router.query.limit) || 20

    const RenderRow = (row) => (
        <TableRow>
            <TableCell component="th" scope="row">{row.data.sku}</TableCell>
            <TableCell align="left">{row.data.name}</TableCell>
            <TableCell align="left">{row.data.status}</TableCell>
            <TableCell align="left">{row.data.vat}</TableCell>
            <TableCell align="left">{formatNumber(row.data.price)}</TableCell>
            <TableCell align="left">{formatNumber(row.data.price)}</TableCell>
            <TableCell align="center">
                <Link href={`/cms/ingredient/edit?ingredientID=${row.ingredientID}`}>
                    <ButtonGroup color="primary" aria-label="contained primary button group">
                        <Button variant="contained" size="small" color="primary">Xem</Button>
                    </ButtonGroup>
                </Link>
            </TableCell>
        </TableRow>
    )

    return (
        <AppCRM select="/crm/product">
            <Head>
                <title>Danh sách sản phẩm</title>
            </Head>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">SKU</TableCell>
                            <TableCell align="left">Tên sản phẩm</TableCell>
                            <TableCell align="left">Trạng thái</TableCell>
                            <TableCell align="left">VAT</TableCell>
                            <TableCell align="left">Giá bán lẻ của NXS</TableCell>
                            <TableCell align="left">Giá bán sau VAT</TableCell>
                            <TableCell align="center">Tác vụ</TableCell>
                        </TableRow>
                    </TableHead>
                    {props.data.length > 0 ? (
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
                        onChangePage={(event, page, rowsPerPage) => {
                            Router.push(`/pricing?page=${page}&limit=${rowsPerPage}`)
                        }}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    )
}