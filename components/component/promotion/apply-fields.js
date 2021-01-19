import React from "react";

import {
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    Grid,
    Typography,
} from "@material-ui/core";
import {defaultPromotionScope, defaultUseTypePromotion} from "../constant";

const ApplyFields = (props) => {
    const {state} = props;
    const {handleChange, handleChangeScope} = props;

    const {promotionScope, promotionUseType} = state;

    return (
        <>
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    Cách áp dụng
                </Typography>
                <Grid spacing={3} container>
                    <RadioGroup
                        aria-label="quiz"
                        name="promotionUseType"
                        value={promotionUseType}
                        onChange={handleChange}
                    >
                        <Grid
                            spacing={3}
                            container
                            justify="space-around"
                            alignItems="center"
                        >
                            <Grid item xs={12} sm={6} md={6}>
                                <FormControlLabel
                                    value={defaultUseTypePromotion.MANY}
                                    control={<Radio color="primary"/>}
                                    label="Được áp dụng với khuyến mãi khác"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <FormControlLabel
                                    value={defaultUseTypePromotion.ALONE}
                                    control={<Radio color="primary"/>}
                                    label="Không được áp dụng với khuyến mãi khác"
                                />
                            </Grid>
                        </Grid>
                    </RadioGroup>
                </Grid>
            </CardContent>
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    Áp dụng cho
                </Typography>
                <Grid spacing={3} container>
                    <RadioGroup
                        aria-label="quiz"
                        name="promotionScope"
                        value={promotionScope}
                        onChange={handleChangeScope}
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
                                    control={<Radio color="primary"/>}
                                    label="Toàn sàn"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} md={4}>
                                <FormControlLabel
                                    value={defaultPromotionScope.PRODUCT}
                                    control={<Radio color="primary"/>}
                                    label="Sản phẩm được chọn"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} md={4}>
                                <FormControlLabel
                                    value={defaultPromotionScope.CATEGORY}
                                    control={<Radio color="primary"/>}
                                    label="Danh mục được chọn"
                                />
                            </Grid>
                        </Grid>
                    </RadioGroup>
                </Grid>
            </CardContent>
        </>
    );
};

export default ApplyFields;
