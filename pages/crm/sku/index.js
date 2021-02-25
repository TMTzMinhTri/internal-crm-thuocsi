import {
    IconButton, Button, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Tooltip, Dialog, FormControl, FormLabel, DialogContent, DialogActions,
    TextField, DialogTitle, Typography, Select, MenuItem, Divider, Grid, InputBase,
} from "@material-ui/core";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { getPricingClient } from 'client/pricing';
import { ErrorCode, formatNumber, ProductStatus, SkuStatuses, SellPrices, formatUrlSearch } from "components/global";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { getPriceClient } from "client/price";
import { MyCard, MyCardActions, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import styles from "./pricing.module.css"

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

    let result = { data: {}, count: 0 };
    result = await _client.getListPricing(offset, limit, q);
    let mixData = {}
    if (result.status === 'OK') {
        if (result.data.length > 0) {
            const productCodes = result.data.map((item) => item.productCode);
            const listProducts = await _client.getListProductByProductCode(productCodes);
            if (listProducts.status === 'OK') {
                mixData = result.data.map(t1 => ({ ...t1, ...listProducts.data.find(t2 => t2.code === t1.productCode) }))
                let statuses = {}
                result.data?.forEach(e => {
                    statuses[e.sellPriceCode] = e.status
                });
                return { props: { data: mixData, statuses: statuses, count: result.total } }
            }


            return {
                props: {
                    data: result.data,
                    count: result.total,
                    statuses: {}
                }
            }
        }
    }
    // Pass data to the page via props
    return { props: { data: [], count: 0, message: "Không tìm thấy kết quả phù hợp" } }
}

export default function PricingPage(props) {
    return renderWithLoggedInUser(props, render)
}

const breadcrumb = [
    {
        name: "Trang chủ",
        link: "/crm"
    },
    {
        name: "Danh sách sku"
    },
]

function render(props) {
    const { error, success } = useToast();
    let router = useRouter();

    let page = parseInt(router.query.page) || 0;
    let limit = parseInt(router.query.limit) || 20;
    let q = router.query.q && router.query.q !== '' ? `q=${router.query.q}` : '';

    let [searchText, setSearchText] = useState(router.query.q || '');
    let [, setLoading] = useState(false);

    const { register, handleSubmit, errors, control } = useForm()
    const [open, setOpen] = useState(false);
    const [selectedSku, setSelectedSku] = useState({
        code: "",
        status: ""
    });
    const [statuses, setStatuses] = useState(props.statuses)

    useEffect(() => {
        setStatuses(props.statuses);
    }, [props.statuses])

    const handleClickOpen = (code, status) => {
        setOpen(true);
        setSelectedSku({
            code: code,
            status: SkuStatuses.filter(e => e.value === status)[0]
        })
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function onUpdateStatus(formData) {
        setLoading(true);
        let newStatuses = statuses
        newStatuses[selectedSku.code] = formData.status
        setStatuses(newStatuses)
        formData.sellPriceCode = selectedSku.code
        let _client = getPriceClient()
        let result = await _client.updateStatusPrice(formData)
        setLoading(false);
        if (result.status === "OK") {
            success(result.message ? 'Thao tác thành công' : 'Thông báo không xác định')
        } else {
            error(result.message || 'Thao tác không thành công, vui lòng thử lại sau')
        }
        setOpen(false);

    }

    function showType(type) {
        let a = SellPrices.filter((item) => {
            return item.value === type;
        });
        if (typeof a !== 'undefined' && a.length > 0) {
            return a[0]?.label;
        }
        return "Chưa cập nhật";
    }

    async function searchSku() {
        const q = formatUrlSearch(searchText);
        router.push(`?limit${limit}&q=${q}`);
    }

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            searchSku();
        }
    }

    return (
        <AppCRM select="/crm/sku" breadcrumb={breadcrumb}>
            <Head>
                <title>Danh sách sku</title>
            </Head>
            <MyCard>
                <MyCardHeader title="Danh sách sku" />
                <MyCardActions>
                    <Grid container spacing={1} md={6}>
                        <Grid item xs={12} sm={8} md={6}>
                            <Paper className={styles.search} style={{ width: '100%' }}>
                                <InputBase
                                    id="q"
                                    name="q"
                                    className={styles.input}
                                    value={searchText}
                                    autoComplete='off'
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyPress={handleSearch}
                                    placeholder="Nhập tên sản phẩm, mã sku, tên nhà bán hàng,..."
                                    inputProps={{ 'aria-label': 'Nhập tên phí' }}
                                />
                                <IconButton className={styles.iconButton} aria-label="search"
                                    onClick={searchSku}>
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </Grid>
                    </Grid>
                </MyCardActions>
            </MyCard>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">SKU</TableCell>
                            <TableCell align="left">Tên Sản Phẩm</TableCell>
                            <TableCell align="left">Loại</TableCell>
                            <TableCell align="right">Giá bán lẻ</TableCell>
                            {/* <TableCell align="left">Giá bán buôn</TableCell> */}
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {props.data.length > 0 ? (
                        <TableBody>
                            {props.data.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell align="left">{row.sku}</TableCell>
                                    <TableCell align="left">{row.name || '-'}</TableCell>
                                    <TableCell align="left">{
                                        showType(row.retailPrice.type)
                                    }</TableCell>
                                    <TableCell align="right">{formatNumber(row.retailPrice.price)}</TableCell>
                                    <TableCell align="center">
                                        <Button variant="outlined" size="small" onClick={() => handleClickOpen(row.sellPriceCode, row.status)}>
                                            {typeof (row.sellPriceCode) !== 'undefined' ? ProductStatus[statuses[row.sellPriceCode]] : ''}
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Link href={`/crm/sku/edit?sellPriceCode=${row.sellPriceCode}`}>
                                            <Tooltip title="Cập nhật thông tin">
                                                <IconButton>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={3} align="left">{ErrorCode['NOT_FOUND_TABLE']}</TableCell>
                                </TableRow>
                            </TableBody>
                        )}

                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth={"sm"} fullWidth={true}>
                        <DialogTitle id="form-dialog-title">Cập nhật trạng thái</DialogTitle>
                        <Divider></Divider>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <FormControl style={{ width: '100%' }} size="small">
                                        <Typography gutterBottom>
                                            <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>
                                                Trạng thái <span style={{ color: 'red' }}>*</span>
                                            </FormLabel>
                                        </Typography>
                                        <Controller
                                            id="status"
                                            name="status"
                                            variant="outlined"
                                            size="small"
                                            value={selectedSku.status}
                                            control={control}
                                            style={{ width: '50%' }}
                                            defaultValue={SkuStatuses ? SkuStatuses[0].value : ''}
                                            rules={{ required: true }}
                                            error={!!errors.status}
                                            as={
                                                <Select size="small">
                                                    {SkuStatuses?.map(({ value, label }) => (
                                                        <MenuItem size="small" value={value} key={value}>{label}</MenuItem>
                                                    ))}
                                                </Select>
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <FormControl style={{ width: '100%' }}>
                                        <Typography gutterBottom>
                                            <FormLabel component="legend" style={{ fontWeight: 'bold', color: 'black' }}>Ghi chú</FormLabel>
                                        </Typography>
                                        <TextField
                                            id="description"
                                            name="description"
                                            disabled={true}
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            size="small"
                                            placeholder=""
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{ width: '100%' }}
                                            required
                                            inputRef={
                                                register()
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <Divider></Divider>
                        <DialogActions>
                            <Button onClick={handleClose} color="secondary">
                                Hủy
                            </Button>
                            <Button onClick={handleSubmit(onUpdateStatus)} color="primary">
                                Lưu
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <MyTablePagination
                        labelUnit="chỉ số"
                        count={props.count}
                        rowsPerPage={limit}
                        page={page}
                        onChangePage={(event, page, rowsPerPage) => {
                            let qq = q ? '&' + q : '';
                            Router.push(`/crm/sku?page=${page}&limit=${rowsPerPage}${qq}`)
                        }}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    )
}