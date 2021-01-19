import React, {useState} from "react";
import {
    Button,
    Modal,
    Paper,
    InputLabel,
    Grid,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Select,
    MenuItem,
    FormControl,
    IconButton,
    Checkbox,
    DialogContent,
    DialogActions,
    Card,
} from "@material-ui/core";
import styles from "./promotion.module.css";
import SearchIcon from "@material-ui/icons/Search";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import {getProductClient} from "client/product";
import {defaultPromotionScope} from "../constant";
import {limitText} from "../until";

async function searchProductList(q, categoryCode) {
    return await getProductClient().searchProductListFromClient(q, categoryCode);
}

const RenderTableListProduct = (props) => {
    const [stateProduct, setStateProduct] = useState({
        listProductAction: props.listProductDefault,
        listCategoryPromotion: props.listCategoryPromotion,
        categorySearch: {},
        productNameSearch: "",
    });

    const [showAutoComplete, setShowAutoComplete] = useState(false);

    const handleChangeProductSearch = (event) => {
        setStateProduct({...stateProduct, productNameSearch: event.target.value});
    };

    const handleCloseModal = () => {
        setStateProduct({
            ...stateProduct,
            listProductAction: props.listProductDefault,
        });
        return props.handleClose();
    };

    const handleChangeCategory = (event) => {
        setStateProduct({...stateProduct, categorySearch: event.target.value});
    };

    const handleActiveProduct = (product, active) => {
        let {listProductAction} = stateProduct;
        listProductAction.forEach((productAction) => {
            if (productAction.product.productID === product.productID) {
                productAction.active = active;
            }
        });
        setStateProduct({...stateProduct, listProductAction: listProductAction});
        console.log('defau',props.listProductDefault)
    };

    const handleOnSearchProductCategory = async () => {
        let seachProductResponse = await searchProductList(
            stateProduct.productNameSearch,
            stateProduct.categorySearch.code
        );
        if (seachProductResponse && seachProductResponse.status === "OK") {
            let listProductAction = [];
            seachProductResponse.data?.forEach((searchProduct, index) => {
                if (index < 5) {
                    listProductAction.push({
                        product: searchProduct,
                        active:
                            props.listProductPromotion.find(
                                (productPromotion) =>
                                    productPromotion.productID === searchProduct.productID
                            ) || false,
                    });
                }
            });
            setStateProduct({
                ...stateProduct,
                listProductAction: listProductAction,
            });
        } else {
            setStateProduct({...stateProduct, listProductAction: []});
        }
    };

    return (
        <div>
            <Button
                variant="contained"
                style={{margin: "1rem 0"}}
                onClick={() => {
                    props.handleClickOpen()
                    setStateProduct({...stateProduct,productNameSearch: "",categorySearch: {}})}
                }>
                Chọn sản phẩm
            </Button>
            <Modal
                open={props.open}
                onClose={() => {props.handleClose()}}
                className={styles.modal}>
                <div className={styles.modalBody}>
                    <h1 className={styles.headerModal}>Chọn sản phẩm</h1>
                    <div style={{margin: "1.25rem"}}>
                        <Grid spacing={3} container>
                            <Grid item sx={12} sm={4} md={4}>
                                <TextField
                                    placeholder="Tên sản phẩm"
                                    label="Tên sản phẩm"
                                    name="searchProduct"
                                    variant="outlined"
                                    onChange={handleChangeProductSearch}
                                    style={{width: "100% !important"}}
                                    inputRef={props.register}
                                />
                            </Grid>
                            <Grid item sx={12} sm={4} md={4} className={styles.blockSearch}>
                                <FormControl className={styles.select}>
                                    <InputLabel id="category-select-outlined-label" variant="outlined">
                                        Chọn danh mục
                                    </InputLabel>
                                    <Select
                                        autoWidth={false}
                                        style={{width: "100% !important"}}
                                        labelId="category-select-outlined-label"
                                        id="category-select-outlined"
                                        variant="outlined"
                                        onChange={handleChangeCategory}
                                        label="Chọn danh mục"
                                    >
                                        {stateProduct.listCategoryPromotion.map((category) => (
                                            <MenuItem value={category} key={category.categoryID}>
                                                {limitText(category.name, 20) || "...Không xác định"}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item sx={12} sm={4} md={4} style={{display: "flex"}}>
                                <Button
                                    variant="contained"
                                    onClick={handleOnSearchProductCategory}
                                    className={styles.buttonSearch}
                                    startIcon={<SearchIcon/>}
                                >
                                    Tìm kiếm
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                    <DialogContent>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Thao tác</TableCell>
                                        <TableCell align="left">Thông tin sản phẩm</TableCell>
                                        <TableCell align="left">Ảnh</TableCell>
                                    </TableRow>
                                </TableHead>
                                {stateProduct.listProductAction.map(({product, active}) => (
                                    <TableRow key={product?.productID}>
                                        <TableCell align="left">
                                            <Checkbox
                                                checked={active}
                                                style={{color: "green"}}
                                                onChange={(e, value) =>
                                                    handleActiveProduct(product, value)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="left">{product.name}</TableCell>
                                        <TableCell align="left">
                                            {product.imageUrls ? (
                                                <image src={product.imageUrls[0]}></image>
                                            ) : (
                                                <div></div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={props.handleClose}
                            variant="contained">
                            Hủy
                        </Button>
                        <Button
                            onClick={() =>
                                props.handleAddProductPromotion(stateProduct.listProductAction)
                            }
                            color="primary"
                            variant="contained"
                            autoFocus
                        >
                            Thêm
                        </Button>
                    </DialogActions>
                </div>
            </Modal>
            {props.promotionScope === defaultPromotionScope.PRODUCT ? (
                <Card>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Ảnh</TableCell>
                                    <TableCell align="left">Thông tin sản phẩm</TableCell>
                                    <TableCell align="left">Hành Động</TableCell>
                                </TableRow>
                            </TableHead>
                            {props.listProductPromotion.map((product) => (
                                <TableRow key={product?.productID}>
                                    <TableCell align="left">
                                        {product.imageUrls ? (
                                            <image src={product.imageUrls[0]}></image>
                                        ) : (
                                            <div></div>
                                        )}
                                    </TableCell>
                                    <TableCell align="left">{product.name}</TableCell>
                                    <TableCell align="left">
                                        <IconButton
                                            color="secondary"
                                            component="span"
                                            onClick={() =>
                                                props.handleRemoveProductPromotion(product)
                                            }
                                        >
                                            <HighlightOffOutlinedIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </Table>
                    </TableContainer>
                </Card>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default RenderTableListProduct;
