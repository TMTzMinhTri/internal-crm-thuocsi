import React, { useEffect, useState } from "react";
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
import { defaultPromotionScope } from "../constant";
import { limitText } from "../until";

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
        return (o.active = active);
      }
    });
    setStateCategory({
      ...stateCategory,
      listCategoryAction: listCategoryAction,
    });
  };

  const handleCloseModal = () => {
    let listCategoryAction = stateCategory.listCategoryAction;
    listCategoryAction.map((o, index) => {
      let bool = false;
      listCategoryPromotion.map((promotion) => {
        console.log(promotion, "promo");
        if (o.category.categoryID == promotion.categoryID) {
          bool = true;
        }
      });
      o.active = bool;
    });
    console.log(listCategoryAction, "listCategoryAction");
    setStateCategory({
      ...stateCategory,
      listCategoryAction: listCategoryAction,
    });
    handleClose();
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        style={{ margin: "1rem 0" }}
        onClick={handleClickOpen}
      >
        Chọn danh mục
      </Button>
      <Modal
        open={open}
        onClose={() => {
          handleClose();
        }}
        className={styles.modal}
      >
        <div className={styles.modalBody}>
          <h1 className={styles.headerModal}>Danh mục sản phẩm</h1>
          <DialogContent className={styles.modalContent}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      Chọn
                    </TableCell>
                    <TableCell align="left">
                      Tên danh mục
                    </TableCell>
                  </TableRow>
                </TableHead>
                {stateCategory.listCategoryAction.length > 0 &&
                  stateCategory.listCategoryAction?.map(
                    ({ category, active }) => (
                      <TableRow key={category?.code}>
                        <TableCell align="left">
                          <Checkbox
                            checked={active}
                            style={{ color: "green" }}
                            onChange={(e, value) =>
                              handleActiveCategory(category, value)
                            }
                          />
                        </TableCell>
                        <TableCell align="left">
                          {limitText(category?.name, 50) || ""}
                        </TableCell>
                      </TableRow>
                    )
                  )}
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} variant="contained">
              Hủy
            </Button>
            <Button
              onClick={() =>
                handleAddCategoryPromotion(stateCategory.listCategoryAction)
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
      {promotionScope === defaultPromotionScope.CATEGORY ? (
        <Card>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Tên danh mục</TableCell>
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
                      <HighlightOffOutlinedIcon />
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