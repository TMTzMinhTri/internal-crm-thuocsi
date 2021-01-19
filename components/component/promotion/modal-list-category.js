import React, {useEffect, useState} from "react";
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
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import {defaultPromotionScope, limitText} from "../constant";

const RenderTableListCategory = (props) => {
    const {
        promotionScope,
        open,
        register,
        listCategoryPromotion,
        listCategoryDefault,
    } = props;

    const {
        handleAddCategoryPromotion,
        handleClickOpen,
        handleClose,
        handleRemoveCategoryPromotion,
    } = props;

    console.log("listCategoryPromotion", listCategoryPromotion);

    const [stateCategory, setStateCategory] = useState({
        listCategoryAction: listCategoryPromotion,
        listCategoryPromotion: listCategoryDefault,
        categorySearch: {},
        productNameSearch: "",
    });

    const [showAutoComplete, setShowAutoComplete] = useState(false);

    const handleOpenModal = () => {
        // console.log("listCategoryDefault", listCategoryDefault);
        setStateCategory({
            ...stateCategory,
            listCategoryAction: listCategoryPromotion,
            listCategoryPromotion: listCategoryDefault,
        });
        handleClickOpen();
    };

    const handleChangeCategory = (event) => {
        setStateCategory({...stateCategory, categorySearch: event.target.value});
    };

    const handleActiveCategory = (category, active) => {
        let {listCategoryPromotion} = stateCategory;
        listCategoryPromotion.forEach((o) => {
            if (o.category.categoryID === category.categoryID) {
                o.active = active;
            }
        });
        setStateCategory({
            ...stateCategory,
            listCategoryPromotion: listCategoryPromotion,
        });
    };

    return (
        <div>
            <Button
                variant="contained"
                style={{margin: "1rem 0"}}
                onClick={handleClickOpen}
            >
                Chọn danh mục
            </Button>
            <Modal open={open} onClose={handleClose} className={styles.modal}>
                <div className={styles.modalBody}>
                    <h1 className={styles.headerModal}>Chọn danh mục</h1>
                    <DialogContent className={styles.modalContent}>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" width="40%">Thao tác</TableCell>
                                        <TableCell align="left" width="60%">Thông tin danh mục</TableCell>
                                    </TableRow>
                                </TableHead>
                                {stateCategory.listCategoryPromotion.map(
                                    ({category, active}) => (
                                        <TableRow key={category.productID}>
                                            <TableCell align="left">
                                                <Checkbox
                                                    checked={active}
                                                    style={{color: "green"}}
                                                    onChange={(e, value) =>
                                                        handleActiveCategory(category, value)
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell align="left">{category.name}</TableCell>
                                            <TableCell align="left">
                                                {category.imageUrls ? (
                                                    <image src={category.imageUrls[0]}></image>
                                                ) : (
                                                    <div></div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" color="secondary">
                            Hủy
                        </Button>
                        <Button onClick={() => handleAddCategoryPromotion(stateCategory.listCategoryPromotion)} color="contained" variant="outlined" autoFocus>
                            Thêm
                        </Button>
                    </DialogActions>
                </div>
            </Modal>
            {promotionScope === defaultPromotionScope.CATEGORY ? (
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
                            {listCategoryPromotion.map((category) => (
                                <TableRow>
                                    <TableCell align="left">
                                        {category.imageUrls ? (
                                            <image src={category.imageUrls[0]}></image>
                                        ) : (
                                            <div></div>
                                        )}
                                    </TableCell>
                                    <TableCell align="left">{category.name}</TableCell>
                                    <TableCell align="left">
                                        <IconButton
                                            color="secondary"
                                            component="span"
                                            onClick={() => handleRemoveCategoryPromotion(category)}
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

export default RenderTableListCategory;
