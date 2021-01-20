import React from "react";

import {
    CardContent,
    CardHeader,
    Container,
    Grid,
    TextField,
} from "@material-ui/core";
import {defaultPromotionType} from "../constant";

const InfomationFields = (props) => {
    const {
        dataRender = {
            promotionName: "",
            totalCode: "",
            applyPerUser: 1,
            promotionCode: "",
            totalUsed: 0,
            totalCollect: 0,
        },
        errors,
        promotionType,
        endTime = new Date(),
        startTime = new Date(),
        register,
        edit = false,
    } = props;

    const {handleChange} = props;

    return (
        <>
            <CardHeader subheader="Thông tin khuyến mãi"/>
            <CardContent>
                <Grid spacing={3} container>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            id="promotionName"
                            name="promotionName"
                            label="Tên khuyến mãi"
                            placeholder=""
                            variant="outlined"
                            defaultValue={dataRender.promotionName}
                            helperText={errors.promotionName?.message}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{width: "100%"}}
                            error={errors.promotionName ? true : false}
                            required
                            inputRef={register({
                                required: "Tên khuyến mãi không được để trống",
                                maxLength: {
                                    value: 250,
                                    message: "Tên khuyến mãi không được vượt quá 250 kí tự",
                                },
                                minLength: {
                                    value: 6,
                                    message: "Tên khuyến mãi phải có độ dài lớn hơn 6 kí tự",
                                },
                                pattern: {
                                    value: /[A-Za-z]/,
                                    message: "Tên khuyến mãi phải có kí tự là chứ số",
                                },
                            })}
                        />
                    </Grid>
                    {edit &&
                    dataRender.promotionType === defaultPromotionType.VOUCHER_CODE ? (
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                id="promotionCode"
                                name="promotionCode"
                                label="Mã khuyến mãi"
                                placeholder=""
                                variant="outlined"
                                defaultValue={dataRender.promotionCode}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{width: "100%"}}
                                inputRef={register}
                            />
                        </Grid>
                    ) : promotionType === defaultPromotionType.VOUCHER_CODE &&(
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                id="promotionCode"
                                name="promotionCode"
                                label="Mã khuyến mãi"
                                placeholder=""
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{width: "100%"}}
                                inputRef={register}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            id="totalCode"
                            name="totalCode"
                            label="Số lượng mã giảm giá"
                            type="number"
                            variant="outlined"
                            defaultValue={dataRender.totalCode}
                            helperText={errors.totalCode?.message}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{width: "100%"}}
                            error={errors.totalCode ? true : false}
                            required
                            inputRef={register({
                                required: "Số lượng mã giảm giá không được để trống",
                                pattern: {
                                    value: /[0-9]/,
                                    message: "Chỉ chấp nhận kí tự là số",
                                },
                            })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            id="totalApply"
                            name="totalApply"
                            label="Số lượt sử dụng cho mỗi khách"
                            type="number"
                            variant="outlined"
                            defaultValue={dataRender.applyPerUser}
                            helperText={errors.totalApply?.message}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{width: "100%"}}
                            error={errors.totalApply ? true : false}
                            required
                            inputRef={register({
                                required: "Số lượt sử dụng cho mỗi khách tối thiểu là 1",
                                pattern: {
                                    value: /[0-9]/,
                                    message: "Chỉ chấp nhận kí tự là số",
                                },
                            })}
                        />
                    </Grid>
                    {edit && (
                        <>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    id="totalUsed"
                                    name="totalUsed"
                                    label="Số lượng đơn hàng đã áp dụng"
                                    placeholder=""
                                    disabled={true}
                                    variant="outlined"
                                    defaultValue={dataRender.totalUsed || 0}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{width: "100%"}}
                                    inputRef={register}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    id="totalCollect"
                                    name="totalCollect"
                                    label="Số lượng mã được thu thập"
                                    placeholder=""
                                    disabled={true}
                                    variant="outlined"
                                    defaultValue={dataRender.totalCollect || 0}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{width: "100%"}}
                                    inputRef={register}
                                />
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            id="startTime"
                            name="startTime"
                            label="Thời gian bắt đầu"
                            placeholder=""
                            variant="outlined"
                            defaultValue={startTime}
                            helperText={errors.startTime?.message}
                            type="datetime-local"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{width: "100%"}}
                            error={errors.startTime ? true : false}
                            required
                            inputRef={register({
                                required: "Vui lòng chọn thời gian bắt đầu",
                            })}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            id="endTime = new Date()"
                            name="endTime"
                            label="Thời gian kết thúc"
                            variant="outlined"
                            placeholder=""
                            type="datetime-local"
                            defaultValue={endTime}
                            helperText={errors.endTime?.message}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{width: "100%"}}
                            onChange={handleChange}
                            error={errors.endTime ? true : false}
                            required
                            inputRef={register({
                                required: "Vui lòng chọn ngày kêt thúc",
                            })}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </>
    );
};

export default InfomationFields;
