import {
    InputBase, Button, ButtonGroup, CardContent, IconButton, Paper, Typography, Box,
    TextField, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow,
} from "@material-ui/core";
import { MyCard, MyCardActions, MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import SearchIcon from "@material-ui/icons/Search";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import Grid from "@material-ui/core/Grid";
import { getCommonAPI } from 'client/common';
import ModalCustom from "@thuocsi/nextjs-components/simple-dialog/dialogs";
import Head from "next/head";
import Link from "next/link";
import AppCRM from "pages/_layout";
import { unknownErrorText } from "components/commonErrors";
import React, { useState, useEffect, useCallback } from "react";
import { useFormStyles } from "components/MuiStyles";
import { formatNumber } from 'components/global';
import { Save as SaveIcon, Delete as DeleteIcon, TableChart } from "@material-ui/icons";
import { useForm } from "react-hook-form";
import { formSetter } from "utils/HookForm"
import styles from "./customer.module.css";
import { getCustomerClient } from "client/customer";
import { OrderItemValidation } from "view-models/order";
import { getOrderClient } from "client/order";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import MuiSingleAuto from "@thuocsi/nextjs-components/muiauto/single";
import { getProductClient } from "client/product";
import { getMasterDataClient } from "client/master-data";
import { useRouter } from "next/router";

const breadcrumb = [
    {
        name: "Trang chủ",
        link: "/crm"
    },
    {
        name: "Danh sách khách hàng",
        link: "/crm/customer",
    },
    {
        name: "Đặt hàng",
    },
];

const noOptionsText = "Không có tùy chọn";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadData(ctx);
    });
}

export async function loadData(ctx) {
    let data = {
        props: {
            status: "OK"
        }
    };


    const phone = ctx.query.phone
    data.props.phone = ""
    if (phone) {
        data.props.phone = phone
    }

    // get list customer level
    const customerCommon = getCommonAPI(ctx, {});
    const resLevel = await customerCommon.getListLevelCustomers();
    data.props.condUserType = [];
    if (resLevel.status === 'OK') {
        data.props.condUserType = resLevel.data.map(item => { return { value: item.code, label: item.name }; });
    }

    // get list province data
    const provinceClient = getMasterDataClient(ctx, {});
    const resProvince = await provinceClient.getProvince(0, 100, "", false)
    data.props.province = []
    if (resProvince.status === 'OK') {
        data.props.province = resProvince.data.map(item => ({ value: item.code, label: item.name }))
    }

    return data;
}

export default function CreateCartPage(props) {
    return renderWithLoggedInUser(props, renderForm)
}

export function renderForm(props) {

    const formStyles = useFormStyles();
    const router = useRouter()
    const { error, success } = useToast();
    const customerClient = getCustomerClient()
    const orderClient = getOrderClient()
    const productClient = getProductClient()

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState(router.query.phone || props.phone)
    const [customerData, setCustomerData] = useState(null)
    const [productPreview, setProductPreview] = useState(null)
    const [cartItemsError, setCartItemsError] = useState({});
    const [cartItemQuantityMap, setCartItemQuantityMap] = useState({});
    const [productsOption, setProductsOption] = useState([{ value: "", label: "" }])
    const [deletedCartItem, setDeletedCartItem] = useState(null)
    const [cart, setCart] = useState([])

    const { register, handleSubmit, setValue, control, errors, watch, getValues, reset } = useForm({
        defaultValues: {},
        mode: "onChange"
    });

    useEffect(() => {
        setProductPreview(getValues("product"))
    }, [watch("product")])

    useEffect(() => {
        getCartData()
        getProductCacheData()
    }, [customerData])

    useEffect(() => {
        onSearch()
    }, [router.query.phone])

    const getCartItemQuantityStyle = useCallback(({ sku, quantity }) => {
        const oldValue = cartItemQuantityMap[sku];
        if (!oldValue || oldValue == quantity) return "none";
        else return "block";
    }, [cartItemQuantityMap])

    const onSubmit = (formData) => {
        handleProductToCart(formData.product?.sku, +formData.quantity)
    };

    const getListProductCodes = (cartData) => {
        let lstCodes = []
        cartData?.forEach(cartItem => { lstCodes.push(cartItem.productCode) })
        return lstCodes
    }

    const getProductData = async (lstCodes, cartData) => {
        const resp = await productClient.getListProductByIdsOrCodesFromClient(null, lstCodes)
        if (resp.status === "OK") {
            resp.data.forEach(product => {
                cartData?.forEach((item, idx) => {
                    if (item.productCode == product.code) {
                        cartData[idx].imageUrl = product.imageUrls[0]
                        cartData[idx].name = product.name
                    }
                })
            })
            setCart(cartData)
            setCartItemQuantityMap(cartData.reduce((acc, cur) => {
                acc[cur.sku] = cur.quantity;
                return acc;
            }, {}));
        }
    }

    const getCustomerData = async () => {
        if (search?.length == 0) return
        const resp = await customerClient.getCustomerByFilter({ phone: search })
        if (resp.status === "OK") {
            resp.data[0].level = props.condUserType?.find(item => item.value == resp.data[0].level)?.label
            resp.data[0].provinceCode = props.province?.find(item => item.value == resp.data[0].provinceCode)?.label
            setCustomerData(resp.data[0])
            formSetter(resp.data[0], ["name", "email", "phone", "address", "level", "provinceCode"], setValue)
        } else {
            setCustomerData(null)
            reset()
            setCart([])
        }
    }

    const getCartData = async () => {
        const resp = await orderClient.getCurrentCart({ phone: customerData?.phone })
        if (resp.status === "OK") {
            let cartData = resp.data[0].cartItems
            getProductData(getListProductCodes(cartData), cartData)
        } else {
            setCart([])
            setCartItemQuantityMap([]);
        }
    }

    const getProductCacheData = async (q = "") => {
        let data = []
        const resp = await productClient.getProductCacheFromClient({ q, offset: 0, limit: 10, phone: customerData?.phone })
        if (resp.status === "OK") {
            data = resp.data?.map(item => ({ ...item, value: item.sku, label: item.name, maxQuantity: item.maxQuantity }))
        }
        setProductsOption(data)
    }

    const getTotalPrice = () => {
        return cart?.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0)
    }

    const onSearch = () => {
        getCustomerData()
    }

    const handleCartItemQuantityChange = (index, value) => {
        const arr = [...cart];
        let errText = OrderItemValidation.quantity.validate(arr[index].maxQuantity)(value) ?? null
        setCartItemsError({ ...cartItemsError, [index]: errText })
        arr[index].quantity = value;
        setCart(arr);
    }

    const handleCartItemQuantityUpdate = async (sku, value) => {
        setLoading(true);
        try {
            const resp = await orderClient.addProductToCart({ sku: sku, quantity: value, phone: customerData?.phone });
            if (resp.status === "OK") {
                success("Cập nhật số lượng sản phẩm thành công")
                getCartData()
            }
        } catch (e) {
            error(e.message ?? unknownErrorText);
        }
        setLoading(false);
    }

    const handleProductToCart = async (sku, value) => {
        setLoading(true);
        try {
            const resp = await orderClient.addProductToCart({ sku: sku, quantity: value, phone: customerData?.phone });
            if (resp.status === "OK") {
                success("Thêm sản phẩm thành công")
                setProductPreview(null)
                getCartData()
            }
        } catch (e) {
            error(e.message ?? unknownErrorText);
        }
        setLoading(false);
    }

    const handleRemoveCartItem = async () => {
        setLoading(true);
        try {
            const resp = await orderClient.removeProductFromCart({ phone: customerData?.phone, sku: deletedCartItem.sku });
            if (resp.status === "OK") {
                success("Cập nhật số lượng sản phẩm thành công")
                getCartData()
            }
        } catch (e) {
            error(e.message ?? unknownErrorText);
        }
        setLoading(false);
    }

    return (
        <AppCRM select="/crm/customer/order" breadcrumb={breadcrumb}>
            <Head>
                <title>Đặt hàng</title>
            </Head>
            <MyCard>
                <MyCardHeader title="Danh sách khách hàng" />
                <MyCardActions>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Paper className={styles.search}>
                                <InputBase
                                    id="q"
                                    name="q"
                                    className={styles.input}
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyPress={event => {
                                        if (event.key === 'Enter' || event.keyCode === 13) {
                                            onSearch();
                                        }
                                    }}
                                    placeholder="Nhập số điện thoại khách hàng"
                                />
                                <IconButton className={styles.iconButton} aria-label="search"
                                    onClick={() => { if (search?.length > 0) router.push(`/crm/customer/order?phone=${search}`) }}>
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </Grid>
                    </Grid>
                </MyCardActions>
            </MyCard>
            <form>
                <MyCard>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={6}>
                            <MyCard>
                                <MyCardHeader title="Thông tin liên lạc" small={true} />
                                <MyCardContent style={{ display: customerData ? null : 'none' }}>
                                    <Grid spacing={3} container>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                id="name"
                                                name="name"
                                                label="Tên khách hàng"
                                                variant="outlined"
                                                size="small"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                fullWidth
                                                disabled
                                                inputRef={register}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                id="phone"
                                                name="phone"
                                                label="Số điện thoại"
                                                size="small"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                disabled
                                                fullWidth
                                                inputRef={register}
                                            />
                                        </Grid>
                                    </Grid>
                                </MyCardContent>
                            </MyCard>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <MyCard>
                                <MyCardHeader title="Thông tin khách hàng" small={true}></MyCardHeader>
                                <MyCardContent style={{ display: customerData ? null : 'none' }}>
                                    <Grid spacing={3} container>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                id="level"
                                                name="level"
                                                label="Loại khách hàng"
                                                variant="outlined"
                                                size="small"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                disabled
                                                fullWidth
                                                inputRef={register}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                id="provinceCode"
                                                name="provinceCode"
                                                label="Tỉnh/Thành"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                disabled
                                                size="small"
                                                fullWidth
                                                inputRef={register}
                                            />
                                        </Grid>
                                    </Grid>
                                </MyCardContent>
                            </MyCard>
                        </Grid>
                    </Grid>
                </MyCard>
                <MyCard>
                    <MyCardHeader title="Thêm sản phẩm" small={true}></MyCardHeader>
                    <MyCardContent style={{ display: customerData ? null : 'none' }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={4}>
                                <MuiSingleAuto
                                    id="product"
                                    name="product"
                                    errors={errors}
                                    placeholder="Thêm sản phẩm"
                                    onFieldChange={getProductCacheData}
                                    options={productsOption}
                                    control={control}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6} md={1}>
                                <TextField
                                    id="quantity"
                                    name="quantity"
                                    label="Số lượng"
                                    disabled={!getValues("product")}
                                    inputProps={{
                                        min: 1,
                                        max: productPreview?.maxQuantity,
                                        style: { textAlign: 'right' }
                                    }}
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={!!errors?.quantity}
                                    helperText={errors.quantity?.message}
                                    size="small"
                                    defaultValue={1}
                                    fullWidth
                                    type="number"
                                    inputRef={register({
                                        required: "Vui lòng nhập số lượng",
                                        min: {
                                            value: 1,
                                            message: "Vui lòng nhập số lượng sản phẩm lớn hơn"
                                        },
                                        max: {
                                            value: productPreview?.maxQuantity,
                                            message: "Vui lòng nhập số lượng sản phẩm nhỏ hơn"
                                        }
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={3}>
                                <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>Thêm</Button>
                            </Grid>
                        </Grid>
                        {productPreview && (<Box style={{ marginTop: '30px' }}>
                            <TableContainer>
                                <Table variant="outlined"
                                    size="small" aria-label="a dense table">
                                    <colgroup>
                                        <col width="20%" />
                                        <col width="20%" />
                                        <col width="20%" />
                                        <col width="20%" />
                                    </colgroup>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">Sản phẩm</TableCell>
                                            <TableCell align="center">Hình ảnh</TableCell>
                                            <TableCell align="right">Số lượng hiện có</TableCell>
                                            <TableCell align="right">Giá</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="left">{productPreview?.name}</TableCell>
                                            <TableCell align="center">
                                                <img src={productPreview.imageUrls ? productPreview.imageUrls[0] : null} title="image" alt="image" width={120} height={120} />
                                            </TableCell>
                                            <TableCell align="right">{formatNumber(productPreview?.maxQuantity)}</TableCell>
                                            <TableCell align="right">{formatNumber(productPreview?.salePrice)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>)}
                    </MyCardContent>
                </MyCard>
                <MyCard>
                    <MyCardHeader title="Thông tin giỏ hàng" small={true}></MyCardHeader>
                    <MyCardContent>
                        {cart?.length > 0 && (<Box style={{ marginTop: '10px' }}>
                            <TableContainer>
                                <Table variant="outlined"
                                    size="small" aria-label="a dense table">
                                    <colgroup>
                                        <col width="5%" />
                                        <col width="15%" />
                                        <col width="15%" />
                                        <col width="15%" />
                                        <col width="20%" />
                                        <col width="30%" />
                                    </colgroup>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">STT</TableCell>
                                            <TableCell align="left">Sản phẩm</TableCell>
                                            <TableCell align="center">Hình ảnh</TableCell>
                                            <TableCell align="right">Số lượng</TableCell>
                                            <TableCell align="right">Giá hiển thị </TableCell>
                                            <TableCell align="right">Thành tiền</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cart?.map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell align="center">{i + 1}</TableCell>
                                                <TableCell align="left">{row.name}</TableCell>
                                                <TableCell align="center">
                                                    <img src={row.imageUrl} title="image" alt="image" width={120} height={120} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Grid container spacing={1} alignItems="center">
                                                        <Grid item xs={11}>
                                                            <TextField
                                                                variant="outlined"
                                                                name="quantity"
                                                                size="small"
                                                                value={row.quantity}
                                                                type="number"
                                                                fullWidth
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <IconButton
                                                                            size="small"
                                                                            color="primary"
                                                                            style={{ display: getCartItemQuantityStyle({ sku: row.sku, quantity: row.quantity }) }}
                                                                            disabled={loading || !!cartItemsError[i]}
                                                                            onClick={() => handleCartItemQuantityUpdate(row.sku, row.quantity)}
                                                                        >
                                                                            <SaveIcon fontSize="small" />
                                                                        </IconButton>
                                                                    )
                                                                }}
                                                                inputProps={{
                                                                    min: 1,
                                                                    max: row.maxQuantity,
                                                                    style: { textAlign: 'right' }
                                                                }}
                                                                error={!!cartItemsError[i]}
                                                                helperText={cartItemsError[i]}
                                                                onChange={e => handleCartItemQuantityChange(i, +e.target.value)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton
                                                                className={formStyles.secondaryIconButton}
                                                                size="small"
                                                                onClick={() => setDeletedCartItem(row)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                </TableCell>
                                                <TableCell align="right">{formatNumber(row.salePrice)}</TableCell>
                                                <TableCell align="right">{formatNumber(row.total)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter className={formStyles.tableFooter}>
                                        <TableRow>
                                            <TableCell colSpan={6} style={{ fontWeight: 'bold', color: 'black', fontSize: '20px' }} align="right">Tổng tiền  {formatNumber(getTotalPrice())}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                                <ModalCustom
                                    title="Thông báo"
                                    primaryText="Xóa"
                                    open={deletedCartItem}
                                    onExcute={handleRemoveCartItem}
                                    onClose={setDeletedCartItem}
                                >
                                    <Typography>Bạn có chắc muốn <b>xóa</b> sản phẩm này?</Typography>
                                </ModalCustom>
                            </TableContainer>
                        </Box>)}
                        {cart.length == 0 && (<span>Hiện tại chưa có sản phẩm nào</span>)}
                    </MyCardContent>
                </MyCard>

                <MyCard>
                    <MyCardActions>
                        <Link href={`/crm/customer`}>
                            <ButtonGroup color="primary" aria-label="contained primary button group">
                                <Button variant="contained" color="default">Quay lại</Button>
                            </ButtonGroup>
                        </Link>
                    </MyCardActions>
                </MyCard>
            </form>
        </AppCRM >
    );
}