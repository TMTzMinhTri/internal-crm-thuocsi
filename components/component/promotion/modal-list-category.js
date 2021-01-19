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


    const [stateCategory, setStateCategory] = useState({
        listCategoryAction: listCategoryDefault,
    });

    const handleActiveCategory = (category, active) => {
        let listCategoryAction = stateCategory.listCategoryAction;
        listCategoryAction.forEach((o) => {
            if (o.category.categoryID === category.categoryID) {
                return o.active = active;
            }
        });
        setStateCategory({
            ...stateCategory,
            listCategoryAction: listCategoryAction,
        });
    };

    return (
        <div>
            <Button
                variant="contained"
                style={{margin: "1rem 0"}}
                onClick={handleClickOpen}>
                Chọn danh mục
            </Button>
            <Modal open={open} onClose={() => {handleClose()}} className={styles.modal}>
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
                                {
                                    stateCategory.listCategoryAction.length > 0 && (
                                        stateCategory.listCategoryAction?.map(
                                                ({category, active}) => (
                                                    <TableRow key={category?.code}>
                                                        <TableCell align="left">
                                                            <Checkbox
                                                                checked={active}
                                                                style={{color: "green"}}
                                                                onChange={(e, value) =>
                                                                    handleActiveCategory(category, value)
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell align="left">{category?.name || ""}</TableCell>
                                                    </TableRow>
                                                )
                                            )
                                    )
                                }
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" color="secondary">
                            Hủy
                        </Button>
                        <Button onClick={() => handleAddCategoryPromotion(stateCategory.listCategoryAction)} color="primary" variant="contained" autoFocus>
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
                                    <TableCell align="center">Thông tin danh mục</TableCell>
                                    <TableCell align="left">Hành Động</TableCell>
                                </TableRow>
                            </TableHead>
                            {listCategoryPromotion?.map((category) => (
                                <TableRow key={category?.code}>
                                    <TableCell align="center">{category.name}</TableCell>
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
