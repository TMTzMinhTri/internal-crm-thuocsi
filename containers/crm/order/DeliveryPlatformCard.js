import React from "react";
import { Card, CardContent, Grid, MenuItem, TextField, Typography } from "@material-ui/core";
import { Controller } from "react-hook-form";

import { useFormStyles } from "components/MuiStyles";

export const DeliveryPlatformCard = ({ control, errors, deliveryPlatforms, value }) => {
    const styles = useFormStyles();
    const flatform = deliveryPlatforms?.find(item => item.code === value);
    return (
        <Grid container spacing={3} item xs={12}>
            <Grid item xs={4}>
                <Typography className={`${styles.fieldLabel} ${styles.required}`} >Hình thức vận chuyển</Typography>
                <Controller
                    control={control}
                    name="deliveryPlatform"
                    as={
                        <TextField
                            variant="outlined"
                            size="small"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={!!errors.deliveryPlatform}
                            helperText={errors.deliveryPlatform?.message}
                            fullWidth
                            required
                            select
                        >
                            {deliveryPlatforms.map(({ code, name }) => (
                                <MenuItem key={`pv_${code}`} value={code}>{name}</MenuItem>
                            ))}
                        </TextField>
                    }
                />
            </Grid>
            <Grid item xs={8}>
                <Card className={styles.readOnlyInfoCard} variant="outlined">
                    <CardContent>
                        <p><b>Phí:</b> {flatform?.feeValue}</p>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

    )
};
