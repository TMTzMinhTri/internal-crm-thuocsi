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
import React, {useState} from "react";
import styles from "./promotion.module.css";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from '@material-ui/icons/Search';
import IconButton from "@material-ui/core/IconButton";
import {useForm} from "react-hook-form";
import {getPromoClient} from "../../../client/promo";
import {displayPromotionScope, displayPromotionType, displayRule} from "../../../client/constant";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadPromoData(ctx)
    })
}

export async function loadPromoData(ctx) {
    // Fetch data from external API
    let returnObject = {props: {}}
    let query = ctx.query
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit

    let _promotionClient = getPromoClient(ctx,{})
    let getPromotionResponse = await _promotionClient.getPromotion("",limit,offset,true)
    if (getPromotionResponse && getPromotionResponse.status === "OK") {
        returnObject.props.data = getPromotionResponse.data
        returnObject.props.count = getPromotionResponse.total
    }

    // Pass data to the page via props
    return returnObject
}

export default function PromotionPage(props) {
    return renderWithLoggedInUser(props, render)
}

export function formatNumber(num) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function render(props) {
    console.log('render',props)
    let router = useRouter()
    const {register, handleSubmit, errors} = useForm();
    let [search, setSearch] = useState('')
    let q = router.query.q || ''
    let page = parseInt(router.query.page) || 0
    let limit = parseInt(router.query.limit) || 20

    function searchPromotion(formData) {
        let q = formData.q
        Router.push(`/crm/promotion?q=${q}`)
    }

    async function handleChange(event) {
        const target = event.target;
        const value = target.value;
        setSearch(value)
    }

    function onSearch(formData) {
        try {
            searchPromotion(formData)
            setSearch('')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AppCRM select="/crm/promotion">
            <Head>
                <title>Danh sách khuyến mãi</title>
            </Head>
            <div className={styles.grid}>
                <Grid container spacing={3} direction="row"
                      justify="space-evenly"
                      alignItems="center"
                >
                    <Grid item xs={12} sm={6} md={6}>
                        <form>
                            <Paper component="form" className={styles.search}>
                                <InputBase
                                    id="q"
                                    name="q"
                                    className={styles.input}
                                    value={search}
                                    onChange={handleChange}
                                    inputRef={register}
                                    placeholder="Tìm kiếm khuyến mãi"
                                    inputProps={{'aria-label': 'Tìm kiếm khuyến mãi'}}
                                />
                                <IconButton className={styles.iconButton} aria-label="search"
                                            onClick={handleSubmit(onSearch)}>
                                    <SearchIcon/>
                                </IconButton>
                            </Paper>
                        </form>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Link href="/crm/promotion/new">
                            <ButtonGroup color="primary" aria-label="contained primary button group"
                                         className={styles.rightGroup}>
                                <Button variant="contained" color="primary">Thêm khuyến mãi</Button>
                            </ButtonGroup>
                        </Link>
                    </Grid>
                </Grid>
            </div>
            {
                q === '' ? (
                    <span/>
                ) : (
                    <div className={styles.textSearch}>Kết quả tìm kiếm cho <i>'{q}'</i></div>
                )
            }
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Tên</TableCell>
                            <TableCell align="left">Loại</TableCell>
                            <TableCell align="left">Áp dụng cho</TableCell>
                            <TableCell align="left">Chi tiết khuyến mãi</TableCell>
                            <TableCell align="left">Thời gian</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {props.data?.length > 0 ? (
                        <TableBody>
                            {props.data.map((row,index) => (
                                <TableRow>
                                    <TableCell align="left">{row.promotionName}</TableCell>
                                    <TableCell align="left">{displayPromotionType(row.promotionType)}</TableCell>
                                    <TableCell align="left">{displayPromotionScope(row.scope)}</TableCell>
                                    <TableCell align="left">{displayRule(row.rule)}</TableCell>
                                    <TableCell align="left">
                                        <div>Từ : {row.startTime}</div>
                                        <div>Đến : {row.endTime}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <ButtonGroup color="primary" aria-label="contained primary button group" onClick={() => router.push({pathname: '/crm/promotion/edit',query: {promotionId: row.promotionId}})}>
                                            <Button variant="contained" size="small" color="primary">Xem</Button>
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ): (
                        <div></div>
                    )}
                    {
                        props.count > 0 ? (
                            <MyTablePagination
                                labelUnit="khuyến mãi"
                                count={props.count}
                                rowsPerPage={limit}
                                page={page}
                                onChangePage={(event, page, rowsPerPage) => {
                                    Router.push(`/promotion?page=${page}&limit=${rowsPerPage}`)
                                }}
                            />
                        ): (
                            <h3>Không tìm thấy danh sách chương trình khuyến mái</h3>
                        )
                    }

                </Table>
            </TableContainer>
        </AppCRM>
    )
}
