import {
    Divider,
    Grid,
    InputBase,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import Head from "next/head";
import Link from "next/link";
import Router, {useRouter} from "next/router";
import AppCRM from "pages/_layout";
import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-components/lib/login";
import React, {useState} from "react";
import styles from "../pricing/pricing.module.css";
import {useForm} from "react-hook-form";
import {getProductClient} from "../../../client/product";
import {ssrPipe} from "../../../components/global";
import {getPriceClient} from "../../../client/price";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import SettingsIcon from '@material-ui/icons/Settings';
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import PanelCollapse from "../../../components/panel/panel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { ProductTypes, ProductStatus } from "components/global";
const LIMIT = 20

export async function loadProduct(ctx) {

    try {
        let data = {props: {}}
        let query = ctx.query
        let q = typeof (query.q) === "undefined" ? '' : query.q
        let filterProduct = typeof (query.filterProduct) === "undefined" ? '' : query.filterProduct
        let page = query.page || 0
        let limit = query.limit || LIMIT
        let offset = page * limit

        let productClient = getProductClient(ctx, data)
        let res = {}
        if (filterProduct === 'all') {
            res = await productClient.getProductList(offset, limit, q)
        } else if (filterProduct === 'noPrice') {
            res = await productClient.getProductNoPrice(offset, limit, q)
        } else (
            res = await productClient.getProductHasPrice(offset, limit, q)
        )

        if (res.status === 'OK') {
            return {
                products: res.data,
                count: res.total,
                ctx: ctx
            }
        } else {
            return {
                products: [],
                count: 0,
                ctx: ctx
            }
        }
    } catch (err) {
        console.log(err)
        return {}
    }

}

export async function loadPrice(data) {
    try {
        let productIds = []
        data?.products?.forEach(e => {
            productIds.push(e.productID)
        })
        let priceClient = getPriceClient(data?.ctx, {})
        let res = await priceClient.getListPriceByProductIds(productIds)
        if (res.status === 'OK') {
            data.prices = res.data
        }
        console.log(res)
        return data
    } catch (error) {
        console.log(error)
        return data
    }
}

export async function mixProductAndPrice(data) {
    try {
        delete data.ctx
        let priceMap = {}
        data.prices.map(price => {
            priceMap[price.productId] = price
        })
        data.priceMap = priceMap
        return data
    } catch (e) {
        data.priceMap = {}
        return data
    }
}

export function ssrPipePricing() {
    return ssrPipe(loadProduct, loadPrice, mixProductAndPrice);
}

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return ssrPipe(loadProduct, loadPrice, mixProductAndPrice)(ctx).then((resp) => {
            return resp
        });
    })
}

export default function ProductPage(props) {
    return renderWithLoggedInUser(props, render)
}

export function formatNumber(num) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function render(props) {
    let router = useRouter()
    let [open, setOpen] = useState(false);
    let [search, setSearch] = useState('');
    let [state, setState] = useState({productName: ''})
    const {register, handleSubmit, errors, control} = useForm();

    let page = parseInt(router.query.page) || 0
    let limit = parseInt(router.query.limit) || LIMIT
    let filterProduct = router.query.filterProduct || ''
    let q = router.query.q || ''

    function onCollapse() {
        // func set expand panel search
        setOpen(!open);
    }

    const handleChange = async (event, val) => {
        setState({...state, [event.target.name]: event.target.value})
    }

    function onSearch(formData) {
        router.push(`/crm/product?q=${state.search}`)
    }

    function fnSearch(data) {
        router.push(`/crm/product?q=${state.productName}&filterProduct=${state.productType}`)
    }

    const RenderRow = (row) => (
        <TableRow>
            <TableCell component="th" scope="row">{row.data.sku}</TableCell>
            <TableCell align="left" style={{width: '20%'}}>{row.data.name}</TableCell>
            <TableCell align="center">{ProductStatus[props.priceMap[row.data.productID]?.status] || '-'}</TableCell>
            <TableCell align="left">{props.priceMap[row.data.productID]?.vat || '-'}</TableCell>
            <TableCell align="left">{formatNumber(props.priceMap[row.data.productID]?.buyPrice || '-')}</TableCell>
            <TableCell align="left">{formatNumber(props.priceMap[row.data.productID]?.sellPrice || '-')}</TableCell>
            <TableCell align="left">{formatNumber(props.priceMap[row.data.productID]?.sellPriceVAT || '-')}</TableCell>
            <TableCell align="center">
                {
                    typeof props.priceMap[row.data.productID] === 'undefined' ? (
                        <Link href={`/crm/product/edit?productID=${row.data.productID}`}>
                            <a>
                                <Tooltip title="Cài đặt giá sản phẩm">
                                    <IconButton>
                                        <SettingsIcon fontSize="small"/>
                                    </IconButton>
                                </Tooltip>
                            </a>
                        </Link>
                    ) : (
                        <Link href={`/crm/product/edit?productID=${row.data.productID}`}>
                            <a>
                                <Tooltip title="Cập nhật giá sản phẩm">
                                    <IconButton>
                                        <EditIcon fontSize="small"/>
                                    </IconButton>
                                </Tooltip>
                            </a>
                        </Link>
                    )
                }
            </TableCell>
        </TableRow>
    )

    return (
        <AppCRM select="/crm/product">
            <Head>
                <title>Danh sách sản phẩm</title>
            </Head>
            <div>
                <Grid container alignItems="center">
                    <Grid item xs={6} sm={3} md={3} className={open === true ? styles.hidden : styles.unSetHidden}>
                        <Paper className={styles.search} style={{marginBottom: '10px'}}>
                            <InputBase
                                id="search"
                                name="search"
                                className={styles.input}
                                onChange={handleChange}
                                onKeyPress={event => {
                                    if (event.key === 'Enter') {
                                        onSearch()
                                    }
                                }}
                                placeholder="Tìm kiếm sản phẩm theo tên hoặc sku"
                                inputProps={{'aria-label': 'Tìm kiếm sản phẩm theo tên hoặc sku'}}
                            />
                            <IconButton className={open === true ? styles.iconButtonHidden : styles.iconButton}
                                        aria-label="search"
                                        onClick={onSearch}
                            >
                                <SearchIcon/>
                            </IconButton>
                            <Divider className={styles.divider} orientation="vertical"/>
                            <IconButton className={styles.iconButton} aria-label="filter-list"
                                        onClick={onCollapse}>
                                <FilterListIcon/>
                            </IconButton>
                        </Paper>
                    </Grid>
                </Grid>
                {
                    open === true ? (
                        <form>
                            <Grid item xs={12} sm={12} md={12} style={{marginBottom: '10px'}}>
                                <PanelCollapse expand={open} setOpen={setOpen} setExecute={fnSearch}>
                                    <Grid container spacing={5} direction="row" alignItems="center">
                                        <Grid item xs={4} md={4} sm={4}>
                                            <TextField
                                                id="productName"
                                                name="productName"
                                                variant="outlined"
                                                onChange={handleChange}
                                                size="small"
                                                label="Tên sản phẩm/ SKU"
                                                placeholder=""
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                style={{width: '100%'}}
                                                inputRef={register}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={4} sm={4}>
                                            <FormControl style={{width: '100%'}} size="small" variant="outlined">
                                                <InputLabel id="department-select-label" sise="small">Sản phẩm</InputLabel>
                                                <Select
                                                    id="productType"
                                                    name="productType"
                                                    label="Sản phẩm"
                                                    onChange={handleChange}
                                                    defaultValue={ProductTypes ? ProductTypes[1].value : {}}
                                                >
                                                    {ProductTypes.map(({value, label}) => (
                                                        <MenuItem value={value} key={value}>{label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </PanelCollapse>
                            </Grid>
                        </form>
                    ) : (
                        <div/>
                    )
                }
            </div>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">SKU</TableCell>
                            <TableCell align="left">Tên sản phẩm</TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="left">VAT(%)</TableCell>
                            <TableCell align="left">Giá mua</TableCell>
                            <TableCell align="left">Giá bán</TableCell>
                            <TableCell align="left">Giá bán sau VAT</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {props?.products?.length > 0 ? (
                        <TableBody>
                            {props.products.map(row => (
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
                            Router.push(`/crm/product?page=${page}&limit=${rowsPerPage}&q=${q}&filterProduct=${filterProduct}`)
                        }}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    )
}