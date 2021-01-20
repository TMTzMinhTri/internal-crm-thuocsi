import React, { useState } from "react";

import {
  CardContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  Grid,
  Typography,
} from "@material-ui/core";
import { defaultPromotionScope, defaultUseTypePromotion } from "../constant";
import RenderTableListProduct from "./modal-list-product";
import RenderTableListCategory from "./modal-list-category";

const ApplyFields = (props) => {
  const { state, register, open } = props;
  const {
    handleChange,
    handleChangeScope,
    handleOpenListProduct,
    handleCloseListProduct,
    handleOpenListCategory,
    handleCloseListCategory,
    handleAddProductPromotion,
    handleRemoveProductPromotion,
    handleAddCategoryPromotion,
    handleRemoveCategoryPromotion,
  } = props;
  const {
    promotionScope,
    listProductDefault,
    listProductPromotion,
    listCategoryPromotion,
    promotionUseType,
    listCategoryDefault,
  } = state;
  return (
    <>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Chọn cách sử dụng khuyến mãi
        </Typography>
        <Grid
          xs={12}
          item
          direction="row"
          container>
          <RadioGroup
            aria-label="quiz"
            name="promotionUseType"
            value={promotionUseType}
            onChange={handleChange}
            style={{width : '100%'}}
          >
            <Grid
              xs={12}
              item
              container
              direction="row"
              justify="space-around"
              alignItems="center"
              style={{marginLeft : 30}}
            >
              <Grid item xs={4} direction="column" container>
                <FormControlLabel
                  value={defaultUseTypePromotion.MANY}
                  control={<Radio color="primary" />}
                  label="Áp dụng đồng thời với các khuyến mãi khác"
                />
              </Grid>
              <Grid item xs={4} direction="column" container>
                <FormControlLabel
                  value={defaultUseTypePromotion.ALONE}
                  control={<Radio color="primary" />}
                  label="Áp dụng 1 mã trên 1 đơn hàng"
                />
              </Grid>
              <Grid item xs={4} direction="column" container>
              </Grid>
            </Grid>
          </RadioGroup>
        </Grid>
      </CardContent>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Phạm vi áp dụng
        </Typography>
        <Grid xs={12}
          item
          direction="row"
          container              
          style={{marginLeft : 30}}>
          <RadioGroup
            aria-label="quiz"
            name="promotionScope"
            value={promotionScope}
            onChange={handleChangeScope}
            style={{width : '100%'}}
          >
            <Grid
              spacing={3}
              container
              justify="space-around"
              alignItems="center"
            >
              <Grid item xs={12} sm={4} md={4}>
                <FormControlLabel
                  value={defaultPromotionScope.GLOBAL}
                  control={<Radio color="primary" />}
                  label="Toàn sàn"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <FormControlLabel
                  value={defaultPromotionScope.PRODUCT}
                  control={<Radio color="primary" />}
                  label="Sản phẩm được chọn"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <FormControlLabel
                  value={defaultPromotionScope.CATEGORY}
                  control={<Radio color="primary" />}
                  label="Danh mục sản phẩm"
                />
              </Grid>
            </Grid>
          </RadioGroup>
        </Grid>
      </CardContent>
      {promotionScope === defaultPromotionScope.PRODUCT && (
        <RenderTableListProduct
          handleClickOpen={handleOpenListProduct}
          handleClose={handleCloseListProduct}
          open={open.openModalProductScopePromotion}
          register={register}
          listProductDefault={listProductDefault}
          promotionScope={promotionScope}
          listCategoryPromotion={listCategoryPromotion}
          listProductPromotion={listProductPromotion}
          handleAddProductPromotion={handleAddProductPromotion}
          handleRemoveProductPromotion={handleRemoveProductPromotion}
        />
      )}

      {promotionScope === defaultPromotionScope.CATEGORY && (
        <RenderTableListCategory
          handleClickOpen={handleOpenListCategory}
          handleClose={handleCloseListCategory}
          open={open.openModalCategoryScopePromotion}
          promotionScope={promotionScope}
          listCategoryDefault={listCategoryDefault}
          listCategoryPromotion={listCategoryPromotion}
          handleAddCategoryPromotion={handleAddCategoryPromotion}
          handleRemoveCategoryPromotion={handleRemoveCategoryPromotion}
        />
      )}
    </>
  );
};

export default ApplyFields;
