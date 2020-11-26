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
        return loadPromoData(ctx)
    })
}

export async function loadPromoData(ctx) {
    // Fetch data from external API
    let query = ctx.query
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit

    let result = {
        data: [
            {
                promoID: '1',
                name: 'Thứ sáu đen tối',
                code: '123_321#2',
                type: 'black friday',
                timeShow: '12/03/2021',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                promoID: '2',
                name: 'Thứ 5 trong sáng',
                code: '123312^#2',
                type: 'light day',
                timeShow: '12/03/2021',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                promoID: '3',
                name: 'Noel',
                code: '7&311#2',
                type: 'meri chris',
                timeShow: '12/03/2021',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                promoID: '4',
                name: 'Tết tết',
                code: '31265#2',
                type: 'holiday',
                timeShow: '12/03/2021',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                promoID: '5',
                name: 'Super',
                code: '312432#2',
                type: 'super',
                timeShow: '12/03/2021',
                start: '12/12/2012',
                end: '20/02/2020'
            },
        ],
        total: 10,
    }
    // Pass data to the page via props
    return {props: {data: result.data, count: result.total}}
}

export default function PromoPage(props) {
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
            <TableCell component="th" scope="row">{row.data.promoID}</TableCell>
            <TableCell align="left">{row.data.name}</TableCell>
            <TableCell align="left">{row.data.code}</TableCell>
            <TableCell align="left">{row.data.type}</TableCell>
            <TableCell align="left">{row.data.timeShow}</TableCell>
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
        <AppCRM select="/crm/promo">
            <Head>
                <title>Danh sách mã giảm giá</title>
            </Head>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Tên</TableCell>
                            <TableCell align="left">Mã giảm giá</TableCell>
                            <TableCell align="left">Loại</TableCell>
                            <TableCell align="left">Thời gian hiển thị</TableCell>
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
                        labelUnit="mã giảm giá"
                        count={props.count}
                        rowsPerPage={limit}
                        page={page}
                        onChangePage={(event, page, rowsPerPage) => {
                            Router.push(`/promo?page=${page}&limit=${rowsPerPage}`)
                        }}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    )
}