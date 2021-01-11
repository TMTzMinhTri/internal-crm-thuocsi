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
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import React, { useEffect, useState } from "react";
import styles from "../pricing/pricing.module.css";
import { useForm } from "react-hook-form";
import { getProductClient } from "../../../client/product";
import { ssrPipe } from "../../../components/global";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import PanelCollapse from "../../../components/panel/panel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { ProductTypes, ProductStatus } from "components/global";
import Image from 'next/image';

const LIMIT = 20

export async function loadProduct(data) {
    const productClient = getProductClient(data.ctx, data);
    const productCodes = data.skuList.map(item =>
        item.productCode
    );
    if (productCodes.length > 0) {
        try {
            const res = await productClient.postListProducstWithCodes(productCodes);
            if (res.status === 'OK') {
                return {
                    products: res.data,
                    skuList: data.skuList,
                    count: data.count || 0,
                    ctx: data.ctx
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    return {
        products: [],
        skuList: [],
        count: 0,
        ctx: data.ctx
    }

}

export async function loadSKUProduct(ctx) {
    const productClient = getProductClient(ctx, {});
    let data = {
        skuList: {}
    };
    let query = ctx.query
    let q = typeof (query.q) === "undefined" ? '' : query.q
    let page = query.page || 0
    let limit = query.limit || LIMIT
    let offset = page * limit
    try {
        const res = await productClient.getListSKUProduct(offset, limit, q);
        if (res.status === "OK") {
            data.skuList = res.data;
            return {
                ...data,
                ctx,
                count: res.total || 0
            };
        }
    } catch (error) {
        console.log(error)
    }
    return {
        skuList: {},
        count: 0,
        ctx
    }
}

export async function mixProductAndPrice(data) {
    try {
        delete data.ctx
        let dataMix = {}
        dataMix = data.skuList.map((itm, i) => {
            return {
                ...data.products.find((item) => (item.code === itm.productCode) && item),
                ...itm
            }
        })
        data.dataMix = dataMix
        return data
    } catch (e) {
        data.dataMix = {}
        return data
    }
}

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return ssrPipe(loadSKUProduct, loadProduct, mixProductAndPrice)(ctx).then((resp) => {
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
    let router = useRouter();
    let [open, setOpen] = useState(false);
    const [dataTable, setDataTable] = useState(props.dataMix || []);
    let [state, setState] = useState({ productName: '' })
    const { register, handleSubmit, errors, control } = useForm();

    let page = parseInt(router.query.page) || 0
    let limit = parseInt(router.query.limit) || LIMIT
    let filterProduct = router.query.filterProduct || ''
    let q = router.query.q || ''

    useEffect(() => {
        setDataTable(props.dataMix);
    }, [props]);

    const handleChange = async (event, val) => {
        setState({ ...state, [event.target.name]: event.target.value })
    }

    function onSearch(formData) {
        q = state.search.trim().replace(/\s+/g, ' ');
        router.push(`?q=${q}`)
    }

    function fnSearch(data) {
        router.push(`/crm/product?q=${state.productName}`)
    }

    function getFirstImage(val) {
        if (!val[0]) {
            return `/default.png`; // default link
        }
        return val[0].split(';')[0]
    }

    const RenderRow = (row) => (
        <TableRow>
            <TableCell scope="row">{row.data.code}</TableCell>
            <TableCell scope="center">
                <Image src={getFirstImage(row.data.imageUrls)} title="image" alt="image"
                    width={100}
                    height={100} />
            </TableCell>
            <TableCell align="left" style={{ width: '40%' }}>{row.data.name}</TableCell>
            <TableCell align="center">{ProductStatus[row.data.status] || '-'}</TableCell>
            <TableCell align="center">
                {
                    // <Link href={`/crm/product/edit?productID=${row.data.productID}`}>
                    //     <a>
                    //         <Tooltip title="Cập nhật giá sản phẩm">
                    //             <IconButton>
                    //                 <EditIcon fontSize="small" />
                    //             </IconButton>
                    //         </Tooltip>
                    //     </a>
                    // </Link>
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
                        {/* <Paper className={styles.search} style={{ marginBottom: '10px' }}>
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
                                placeholder="Tìm kiếm theo tên hoặc sku"
                                inputProps={{ 'aria-label': 'Tìm kiếm theo tên hoặc sku' }}
                            />
                            <IconButton className={open === true ? styles.iconButtonHidden : styles.iconButton}
                                aria-label="search"
                                onClick={onSearch}
                            >
                                <SearchIcon />
                            </IconButton>
                            <Divider className={styles.divider} orientation="vertical" />
                        </Paper> */}
                    </Grid>
                </Grid>
                {
                    open === true ? (
                        <form>
                            <Grid item xs={12} sm={12} md={12} style={{ marginBottom: '10px' }}>
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
                                                style={{ width: '100%' }}
                                                inputRef={register}
                                            />
                                        </Grid>
                                        <Grid item xs={4} md={4} sm={4}>
                                            <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                                                <InputLabel id="department-select-label" sise="small">Sản phẩm</InputLabel>
                                                <Select
                                                    id="productType"
                                                    name="productType"
                                                    label="Sản phẩm"
                                                    onChange={handleChange}
                                                    defaultValue={ProductTypes ? ProductTypes[1].value : {}}
                                                >
                                                    {ProductTypes.map(({ value, label }) => (
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
                            <div />
                        )
                }
            </div>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">SKU</TableCell>
                            <TableCell align="center">Hình ảnh</TableCell>
                            <TableCell align="left">Tên sản phẩm</TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {dataTable.length > 0 ? (
                        <TableBody>
                            {dataTable.map((row, i) => (
                                <RenderRow key={i} data={row} />
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
                        count={props.count || dataTable.length}
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