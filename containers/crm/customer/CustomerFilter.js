import React, { useEffect } from 'react'
import { useController, useForm } from 'react-hook-form'
import { Box, Button, createStyles, Grid, MenuItem, TextField, Typography } from '@material-ui/core'
import { MyCardContent } from '@thuocsi/nextjs-components/my-card/my-card'
import { statuses } from 'components/global'
import { customerValidation } from 'view-models/customer'

const styles = createStyles({
    title: {
        fontWeight: "bold",
    }
})
const defaultValues = {
    q: "",
    code: "",
    name: "",
    email: "",
    level: "",
    phone: "",
    status: "",
    pointFrom: null,
    pointTo: null,
};
export const CustomerFilter = (props) => {

    const filterForm = useForm({
        defaultValues: {
            ...defaultValues,
            q: props.q,
        },
        mode: "onChange"
    })
    const levelController = useController({
        name: "level",
        control: filterForm.control,
        defaultValue: defaultValues.level
    })
    const { ref: levelRef, ...levelProps } = levelController.field;

    const statusController = useController({
        name: "status",
        control: filterForm.control,
        defaultValue: defaultValues.status
    })
    const { ref: statusRef, ...statusProps } = statusController.field;

    useEffect(() => {
        filterForm.register({ name: "level" })
        filterForm.register({ name: "status" })
    }, [])

    const applyFilter = (formData) => {
        props.onFilterChange?.(formData);
    }

    const handleReset = () => {
        filterForm.reset(defaultValues);
        filterForm.setValue("level", defaultValues.level);
        filterForm.setValue("status", defaultValues.status);
    }
    return (
        <Box style={{
            display: props.open ? "block" : "none"
        }} clone>
            <MyCardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            style={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Tìm kiếm
                            </Typography>
                        <TextField
                            id="q"
                            name="q"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập Tên khách hàng, Email, Số điện thoại"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            style={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Mã khách hàng
                            </Typography>
                        <TextField
                            id="code"
                            name="code"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập mã khách hàng"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            style={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Tên khách hàng
                            </Typography>
                        <TextField
                            id="name"
                            name="name"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập tên khách hàng"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            style={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Email
                        </Typography>
                        <TextField
                            id="email"
                            name="email"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập email"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            style={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Cấp độ
                        </Typography>
                        <TextField
                            id="level"
                            name="level"
                            variant="outlined"
                            size="small"
                            placeholder="Chọn cấp độ"
                            select
                            SelectProps={{
                                displayEmpty: true
                            }}
                            fullWidth
                            {...levelProps}
                            inputRef={levelRef}
                        >
                            <MenuItem value={""}>Tất cả</MenuItem>
                            {props.userTypes?.map(({ value, label }) => (
                                <MenuItem key={value} value={value}>{label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid container item xs={12} sm={6} md={3}>
                        <Typography
                            style={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Điểm
                        </Typography>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="pointFrom"
                                    name="pointFrom"
                                    variant="outlined"
                                    size="small"
                                    placeholder="Điểm từ"
                                    fullWidth
                                    type="number"
                                    inputProps={{
                                        min: 0,
                                    }}
                                    error={!!filterForm.errors.pointFrom}
                                    helperText={filterForm.errors.pointFrom?.message}
                                    inputRef={filterForm.register({ ...customerValidation.point, valueAsNumber: true })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="pointTo"
                                    name="pointTo"
                                    variant="outlined"
                                    size="small"
                                    placeholder="Điểm đến"
                                    fullWidth
                                    type="number"
                                    inputProps={{
                                        min: 0,
                                    }}
                                    error={!!filterForm.errors.pointTo}
                                    helperText={filterForm.errors.pointTo?.message}
                                    inputRef={filterForm.register({ ...customerValidation.point, valueAsNumber: true })}
                                />
                            </Grid>
                        </Grid>



                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            style={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Số điện thoại
                            </Typography>
                        <TextField
                            id="phone"
                            name="phone"
                            variant="outlined"
                            size="small"
                            placeholder="Nhập số điện thoại"
                            fullWidth
                            inputRef={filterForm.register}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            style={styles.title}
                            color="textPrimary"
                            gutterBottom
                        >
                            Trạng thái
                            </Typography>
                        <TextField
                            id="phone"
                            name="phone"
                            variant="outlined"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            select
                            SelectProps={{
                                displayEmpty: true
                            }}
                            fullWidth
                            {...statusProps}
                            inputRef={statusRef}
                        >
                            <MenuItem value={""}>Tất cả</MenuItem>
                            {statuses?.map(({ value, label }) => (
                                <MenuItem key={value} value={value}>{label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item container xs={12} justify="flex-end" spacing={1}>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="default"
                                onClick={handleReset}
                            >
                                Làm mới
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={filterForm.handleSubmit(applyFilter)}
                            >
                                Tìm kiếm
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </MyCardContent>
        </Box>
    )
}
