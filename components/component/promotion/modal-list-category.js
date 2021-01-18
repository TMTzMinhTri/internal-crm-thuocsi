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
import { defaultPromotionScope, limitText } from "client/constant";

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
    setStateCategory({ ...stateCategory, categorySearch: event.target.value });
  };

  const handleActiveCategory = (category, active) => {
    let { listCategoryPromotion } = stateCategory;
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
        style={{ margin: "1rem 0" }}
        onClick={handleClickOpen}
      >
        Chọn danh mục
      </Button>
      <Modal open={open} onClose={handleClose} className={styles.modal}>
        <div className={styles.modalBody}>
          <h1 className={styles.headerModal}>Chọn danh mục</h1>
          {/* <div style={{ margin: "1.25rem" }}>
            <Grid spacing={3} container>
              <Grid item sx={12} sm={4} md={4} className={styles.blockSearch}>
                <FormControl className={styles.select}>
                  <InputLabel id="category-select-outlined-label">
                    Chọn danh mục
                  </InputLabel>
                  <Select
                    autoWidth={false}
                    style={{ width: "100% !important" }}
                    labelId="category-select-outlined-label"
                    id="category-select-outlined"
                    onChange={handleChangeCategory}
                    inputRef={register}
                    label="Chọn danh mục"
                  >
                    {stateCategory.listCategoryPromotion.map(({ category }) => (
                      <MenuItem value={category} key={category.categoryID}>
                        {limitText(category.name, 20) || "...Không xác định"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div> */}
          <DialogContent className={styles.modalContent}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Thao tác</TableCell>
                    <TableCell align="left">Thông tin danh mục</TableCell>
                    <TableCell align="left">Ảnh</TableCell>
                  </TableRow>
                </TableHead>
                {stateCategory.listCategoryPromotion.map(
                  ({ category, active }) => (
                    <TableRow key={category.productID}>
                      <TableCell align="left">
                        <Checkbox
                          checked={active}
                          style={{ color: "green" }}
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
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Hủy
            </Button>
            <Button
              onClick={() =>
                handleAddCategoryPromotion(stateCategory.listCategoryPromotion)
              }
              color="primary"
              variant="outlined"
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
