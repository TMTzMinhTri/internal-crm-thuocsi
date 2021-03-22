import React, { useEffect, useState } from "react";
import { Button, CardContent, Grid, makeStyles, Typography } from "@material-ui/core";

import { MyDrawer } from "components/MyDrawer";
import { CustomerScopeLabel, CustomerStatusLabel } from "view-models/customer";
import { statuses } from "components/global";
import { useFormStyles } from "components/MuiStyles";
import { getMasterDataClient } from "client/master-data";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";

const useStyles = makeStyles((theme) => ({
    cardContent: {
        [theme.breakpoints.up("sm")]: {
            width: "580px",
        },
        [theme.breakpoints.up("md")]: {
            width: "880px",
        },
    },
}));

/**
 * @param {object} props 
 * @param {object|null} props.customer
 * @param {{value: string, label: string}[]} props.levels
 * @param {Function} props.onClose
 */
export const CustomerDetailDrawer = ({ customer, levels, onClose }) => {
    const formStyles = useFormStyles();
    const classes = useStyles();
    const toast = useToast();
    const color = statuses.find(({ value }) => customer?.status === value)?.color ?? "grey";

    const [levelLabelMap] = useState(levels?.reduce((acc, { value, label }) => {
        acc[value] = label;
        return acc;
    }, {}) ?? {});
    const [provinceMap, setProvinceMap] = useState({});
    const [districtMap, setDistrictMap] = useState({});
    const [wardMap, setWardMap] = useState({});

    const getProvinces = async () => {
        const masterDataClient = getMasterDataClient();
        const resp = await masterDataClient.getProvinceFromClient(0, 1000, "", false);
        setProvinceMap(resp.data?.reduce((acc, cur) => {
            acc[cur.code] = { ...cur, subFetched: false };
            return acc;
        }, {}) ?? {});
    };

    const getDistricts = async (provinceCode) => {
        const masterDataClient = getMasterDataClient();
        const resp = await masterDataClient.getDistrictByProvinceCode(provinceCode);
        setDistrictMap(resp.data?.reduce((acc, cur) => {
            acc[cur.code] = { ...cur, subFetched: false };
            return acc;
        }, {}) ?? {});
    }

    const getWards = async (districtCode) => {
        const masterDataClient = getMasterDataClient();
        const resp = await masterDataClient.getWardByDistrictCode(districtCode);
        setWardMap(resp.data?.reduce((acc, cur) => {
            acc[cur.code] = { ...cur};
            return acc;
        }, {}) ?? {});
    }

    useEffect(() => {
        (async () => {
            try {
                await getProvinces();
            } catch (e) {
                toast.error(e.message);
            }
        })()
    }, []);
    useEffect(() => {
        (async () => {
            if (!customer) return;
            try {
                if (provinceMap[customer.provinceCode].subFetched == false) {
                    const map = { ...provinceMap };
                    await getDistricts(customer.provinceCode);
                    map[customer.provinceCode].subFetched = true;
                }
            } catch (e) {
                toast.error(e.message);
            }
        })()
    }, [customer?.provinceCode]);
    useEffect(() => {
        (async () => {
            if (!customer) return;
            try {
                if (provinceMap[customer.districtCode]?.subFetched == false) {
                    const map = { ...districtMap };
                    await getWards(customer.districtCode);
                    map[customer.districtCode].subFetched = true;
                }
            } catch (e) {
                toast.error(e.message);
            }
        })()
    }, [customer?.districtCode]);


    return (
        <MyDrawer open={customer} onClose={onClose} title="Thông tin khách hàng">
            <CardContent className={classes.cardContent}>
                <Grid container spacing={3}>
                    <Grid container spacing={1} item>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography className={formStyles.fieldLabel}>Mã khách hàng</Typography>
                        </Grid>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography>{customer?.code}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography className={formStyles.fieldLabel}>Tên khách hàng</Typography>
                        </Grid>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography>{customer?.name}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography className={formStyles.fieldLabel}>Số điện thoại</Typography>
                        </Grid>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography>{customer?.phone}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography className={formStyles.fieldLabel}>Email</Typography>
                        </Grid>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography>{customer?.email || "-"}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography className={formStyles.fieldLabel}>Tỉnh thành</Typography>
                        </Grid>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography>{provinceMap[customer?.provinceCode]?.name || "-"}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography className={formStyles.fieldLabel}>Quận/huyện</Typography>
                        </Grid>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography>{districtMap[customer?.districtCode]?.name || "-"}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography className={formStyles.fieldLabel}>Phường/xã</Typography>
                        </Grid>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography>{wardMap[customer?.wardCode]?.name || "-"}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography className={formStyles.fieldLabel}>Cấp</Typography>
                        </Grid>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography>{levelLabelMap[customer?.level]}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography className={formStyles.fieldLabel}>Vai trò</Typography>
                        </Grid>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography>{CustomerScopeLabel[customer?.scope]}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography className={formStyles.fieldLabel}>Điểm</Typography>
                        </Grid>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography>{customer?.point}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} item>
                        <Grid item xs={6} md={4} lg={3}>
                            <Typography className={formStyles.fieldLabel}>Trạng thái</Typography>
                        </Grid>
                        <Grid item xs={6} md={4} lg={3}>
                            <Button
                                disabled
                                size="small"
                                variant="outlined"
                                style={{ color, borderColor: color }}
                            >
                                {CustomerStatusLabel[customer?.status]}
                            </Button>
                        </Grid>
                    </Grid>

                </Grid>
            </CardContent>
        </MyDrawer>
    );
};
