import {
    Button,
    ButtonGroup,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from "@material-ui/core";
import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-components/lib/login";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import Head from "next/head";
import Link from "next/link";
import Router, {useRouter} from "next/router";
import AppCRM from "pages/_layout";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import styles from "./pricing.module.css";
import {getPricingClient} from 'client/pricing';
import EditIcon from "@material-ui/icons/Edit";
import {ProductStatus, SellPrices} from "components/global";
import Chip from "@material-ui/core/Chip";

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
    let q = query.q || ''

    let _client = getPricingClient(ctx, {})

    let result = {data: {}, count: 0};
    result = await _client.getListPricing(offset, limit, q);
    let mixData = {}
    if (result.status === 'OK') {
        if (result.data.length > 0) {
            const productCodes = result.data.map((item) => item.productCode);
            const listProducts = await _client.getListProductByProductCode(productCodes);
            if (listProducts.status === 'OK') {
                mixData = result.data.map(t1 => ({...t1, ...listProducts.data.find(t2 => t2.code === t1.productCode)}))
                return {props: {data: mixData, count: result.total}}
            }
            return {
                props: {
                    data: result.data,
                    count: result.total
                }
            }
        }
    }
    // Pass data to the page via props
    return {props: {data: [], count: 0}}
}

export default function PricingPage(props) {
    return renderWithLoggedInUser(props, render)
}

export function formatNumber(num) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function render(props) {
    let router = useRouter();
    const {register, handleSubmit, errors, control} = useForm();

    let page = parseInt(router.query.page) || 0;
    let limit = parseInt(router.query.limit) || 20;
    let q = router.query.q && router.query.q !== '' ? `q=${router.query.q}` : '';

    let [sellingData, setSellingData] = useState([]);
    let [countSelling, setCountSelling] = useState(0);
    let [search, setSearch] = useState(router.query.q || '');
    let [open, setOpen] = useState(false);

    useEffect(() => {
        setSellingData(props.data);
        setCountSelling(props.count);
    }, [props]);

    function showType(type) {
        let a = SellPrices.filter((item) => {
            return item.value === type;
        });
        return a[0].label;
    }

    return (
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Danh sách cài đặt</title>
            </Head>
            <div className={styles.grid}>
                <Grid container spacing={3} direction="row"
                      justify="space-evenly"
                      alignItems="center"
                >
                    <Grid item xs={12} sm={6} md={6}>
                        {/*<Paper component="form" className={styles.search}>
                            <InputBase
                                id="q"
                                name="q"
                                className={styles.input}
                                value={search}
                                onChange={handleChange}
                                inputRef={register}
                                onKeyPress={event => {
                                    if (event.key === 'Enter') {
                                        onSearch()
                                    }
                                }}
                                placeholder="Tìm kiếm theo tên sản phẩm"
                                inputProps={{ 'aria-label': 'Tìm kiếm theo tên sản phẩm' }}
                            />
                            <IconButton className={open === true ? styles.iconButtonHidden : styles.iconButton} aria-label="search"
                                onClick={handleSubmit(onSearch)}>
                                <SearchIcon />
                            </IconButton>
                            <Divider className={styles.divider} orientation="vertical" />
                            <IconButton className={styles.iconButton} aria-label="filter-list"
                                onClick={onCollapse}>
                                <FilterListIcon />
                            </IconButton>
                        </Paper>*/}
                    </Grid>

                    <Grid item xs={12} sm={6} md={6}>
                        <Link href="/crm/pricing/new">
                            <ButtonGroup color="primary" aria-label="contained primary button group"
                                         className={styles.rightGroup}>
                                <Button variant="contained" color="primary" className={styles.btnAction}>Thêm cài
                                    đặt</Button>
                            </ButtonGroup>
                        </Link>
                    </Grid>
                </Grid>
            </div>
            {
                q === '' ? (
                    <span/>
                ) : (
                    <div className={styles.textSearch}>Kết quả tìm kiếm cho <i>'{search}'</i></div>
                )
            }
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">SKU</TableCell>
                            <TableCell align="left">Tên Sản Phẩm</TableCell>
                            <TableCell align="left">Loại</TableCell>
                            <TableCell align="left">Giá bán lẻ</TableCell>
                            <TableCell align="left">Giá bán buôn</TableCell>
                            <TableCell align="left">Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {sellingData.length > 0 ? (
                        <TableBody>
                            {
                                sellingData.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell align="left">{row.sku}</TableCell>
                                        <TableCell align="left">{row.name || '-'}</TableCell>
                                        <TableCell align="left">{
                                            showType(row.retailPrice.type)
                                        }</TableCell>
                                        <TableCell align="left">{formatNumber(row.retailPrice.price)}</TableCell>
                                        <TableCell align="left">
                                            {
                                                row.wholesalePrice?.map((price) => (
                                                    <div>
                                                        <Chip variant="outlined" size="small"
                                                              label={'Giá bán: ' + formatNumber(price.price || 0) + 'đ' +
                                                              ' - Giảm: ' + (price.percentageDiscount || 0) + '%' +
                                                              (formatNumber(price.absoluteDiscount || 0) !== 0 ?
                                                                  (' - Giảm giá: ' + formatNumber(price.absoluteDiscount || 0)) : ('')) + 'đ' +
                                                              ' - Số lượng: ' + price.minNumber}/>
                                                        <br/>
                                                    </div>
                                                ))
                                            }
                                        </TableCell>
                                        <TableCell align="left">{ProductStatus[row.status]}</TableCell>
                                        <TableCell align="center">
                                            <Link href={`/crm/pricing/edit?sellPriceCode=${row.sellPriceCode}`}>
                                                <Tooltip title="Cập nhật thông tin">
                                                    <IconButton>
                                                        <EditIcon fontSize="small"/>
                                                    </IconButton>
                                                </Tooltip>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
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
                            let qq = q ? '&' + q : '';
                            Router.push(`/crm/pricing?page=${page}&limit=${rowsPerPage}${qq}`)
                        }}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    )
}