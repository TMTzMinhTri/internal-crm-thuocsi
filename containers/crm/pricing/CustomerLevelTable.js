import React, { useState } from "react";
import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";

import { getFeeClient } from "client/fee";
import { unknownErrorText } from "components/commonErrors";

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: "12px"
    }
}));

/**
 * @param {object} props
 * @param {object} props.row
 * @param {string} props.row.code
 * @param {string} props.row.name
 * @param {string} props.row.description
 * @param {string} props.row.levelId
 * @param {string} props.row.feeValue
 */
const CustomerLevelRow = ({ row, updateFee }) => {
    const [fee, setFee] = useState(row.feeValue);
    return (
        <Grid container item xs={12} spacing={3}>
            <Grid item xs={12} md={6}>
                <TextField
                    label="Mã hạng"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true
                    }}
                    size="small"
                    disabled
                    fullWidth
                    value={row.code}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    label="Tên hạng"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true
                    }}
                    size="small"
                    disabled
                    fullWidth
                    value={row.name}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Mô tả"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true
                    }}
                    size="small"
                    disabled
                    fullWidth
                    value={row.description}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    label="ID cấp"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true
                    }}
                    size="small"
                    disabled
                    fullWidth
                    value={row.levelId}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Giá trị tính phí"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true
                    }}
                    InputProps={{
                        inputProps: {
                            min: 0
                        }
                    }}
                    size="small"
                    type="number"
                    fullWidth
                    value={fee}
                    onChange={e => setFee(e.target.value)}
                />
            </Grid>
            <Grid item>
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    disabled={fee == row.feeValue}
                    onClick={() => updateFee?.({
                        code: row.code,
                        fee,
                    })}
                >
                    Lưu
                    </Button>
            </Grid>
        </Grid>
    )
}

/**
 * @param {object} props
 * @param {object[]} props.data
 * @param {string} props.data[].code
 * @param {string} props.data[].name
 * @param {string} props.data[].description
 * @param {string} props.data[].levelId
 * @param {string} props.data[].feeValue
 */
export default function CustomerLevelTable({ data = [] }) {
    const styles = useStyles();
    const toast = useToast();

    const updateFee = async ({ code, fee }) => {
        try {
            const feeClient = getFeeClient();
            const res = await feeClient.updateCustomerLevelFee(code, fee);
            if (res.status === 'OK') {
                toast.success(res.message ?? 'Cập nhật giá trị tính phí thành công.');
            } else {
                toast.error(res.message ?? unknownErrorText);
            }
        } catch (err) {
            toast.error(err.message ?? unknownErrorText);
        }
    }

    return (
        <Grid container item xs={12} md={6} spacing={3} className={styles.container} >
            {data.map((row) => (<CustomerLevelRow row={row} />))}
        </Grid>
    )
}
