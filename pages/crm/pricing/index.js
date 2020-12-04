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
import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-components/lib/login";
import React from "react";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadPricingData(ctx)
    })
}

export async function loadPricingData(ctx) {
    // Fetch data from external API
    let query = ctx.query
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit

    let result = {
        data: [
            {
                pricingID: '1',
                name: 'ngoài biển',
                status: 'status 1',
                type: 'location',
                value: '0.1',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                pricingID: '2',
                name: 'vip',
                status: 'status 1',
                type: 'customer',
                value: '0.1',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                pricingID: '3',
                name: 'poor',
                status: 'status 1',
                type: 'customer',
                value: '0.1',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                pricingID: '4',
                name: 'rick',
                status: 'status 1',
                type: 'customer',
                value: '0.1',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                pricingID: '5',
                name: 'gold',
                status: 'status 1',
                type: 'customer',
                value: '0.1',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                pricingID: '6',
                name: 'trên núi',
                status: 'status 1',
                type: 'location',
                value: '0.1',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                pricingID: '7',
                name: 'đồng bằng',
                status: 'status 1',
                type: 'location',
                value: '0.1',
                start: '12/12/2012',
                end: '20/02/2020'
            },

        ],
        total: 10,
    }
    // Pass data to the page via props
    return {props: {data: result.data, count: result.total}}
}

export default function PricingPage(props) {
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
            <TableCell component="th" scope="row">{row.data.pricingID}</TableCell>
            <TableCell align="left">{row.data.name}</TableCell>
            <TableCell align="left">{row.data.status}</TableCell>
            <TableCell align="left">{row.data.type}</TableCell>
            <TableCell align="left">{row.data.value}</TableCell>
            <TableCell align="left">{row.data.start}</TableCell>
            <TableCell align="left">{row.data.end}</TableCell>
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
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Danh sách chỉ số</title>
            </Head>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Tên chỉ số</TableCell>
                            <TableCell align="left">Trạng thái</TableCell>
                            <TableCell align="left">Loại</TableCell>
                            <TableCell align="left">Giá trị</TableCell>
                            <TableCell align="left">Bắt đầu</TableCell>
                            <TableCell align="left">Kết thúc</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
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
                        labelUnit="chỉ số"
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