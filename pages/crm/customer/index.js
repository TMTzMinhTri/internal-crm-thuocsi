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
import styles from "./customer.module.css";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from '@material-ui/icons/Search';
import IconButton from "@material-ui/core/IconButton";
import {useForm} from "react-hook-form";

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
                customerID: '1',
                name: 'Thứ sáu đen tối',
                code: '123_321#2',
                type: 'black friday',
                timeShow: '12/03/2021',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                customerID: '2',
                name: 'Thứ 5 trong sáng',
                code: '123312^#2',
                type: 'light day',
                timeShow: '12/03/2021',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                customerID: '3',
                name: 'Noel',
                code: '7&311#2',
                type: 'meri chris',
                timeShow: '12/03/2021',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                customerID: '4',
                name: 'Tết tết',
                code: '31265#2',
                type: 'holiday',
                timeShow: '12/03/2021',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                customerID: '5',
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

export default function PromotionPage(props) {
    return renderWithLoggedInUser(props, render)
}

export function formatNumber(num) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function render(props) {
    let router = useRouter()
    const {register, handleSubmit, errors} = useForm();
    let [search, setSearch] = useState('')
    let q = router.query.q || ''
    let page = parseInt(router.query.page) || 0
    let limit = parseInt(router.query.limit) || 20

    function searchPromotion(formData) {
        let q = formData.q
        Router.push(`/crm/customer?q=${q}`)
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
    
    const RenderRow = (row) => (
        <TableRow>
            <TableCell component="th" scope="row">{row.data.customerID}</TableCell>
            <TableCell align="left">{row.data.name}</TableCell>
            <TableCell align="left">{row.data.code}</TableCell>
            <TableCell align="left">{row.data.type}</TableCell>
            <TableCell align="left">{row.data.timeShow}</TableCell>
            <TableCell align="left">{row.data.start}</TableCell>
            <TableCell align="left">{row.data.end}</TableCell>
            <TableCell align="center">
                <Link href={`/cms/customer/edit?customerID=${row.customerID}`}>
                    <ButtonGroup color="primary" aria-label="contained primary button group">
                        <Button variant="contained" size="small" color="primary">Cập nhật</Button>
                    </ButtonGroup>
                </Link>
            </TableCell>
        </TableRow>
    )

    return (
        <AppCRM select="/crm/customer">
            <Head>
                <title>Danh sách khách hàng</title>
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
                                    placeholder="Tìm kiếm khách hàng"
                                    inputProps={{'aria-label': 'Tìm kiếm khách hàng'}}
                                />
                                <IconButton className={styles.iconButton} aria-label="search"
                                            onClick={handleSubmit(onSearch)}>
                                    <SearchIcon/>
                                </IconButton>
                            </Paper>
                        </form>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Link href="/crm/customer/new">
                            <ButtonGroup color="primary" aria-label="contained primary button group"
                                         className={styles.rightGroup}>
                                <Button variant="contained" color="primary">Thêm khách hàng</Button>
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
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Tên khách hàng</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Cấp độ</TableCell>
                            <TableCell align="left">Điểm</TableCell>
                            <TableCell align="left">Số điện thoại</TableCell>
                            <TableCell align="left">Trạng thái</TableCell>
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
                        labelUnit="khách hàng"
                        count={props.count}
                        rowsPerPage={limit}
                        page={page}
                        onChangePage={(event, page, rowsPerPage) => {
                            Router.push(`/customer?page=${page}&limit=${rowsPerPage}`)
                        }}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    )
}