import React, { useState } from 'react';
import { Box, Grid, IconButton, makeStyles, MenuItem, Paper, Select, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import Head from "next/head";

import { ViewType } from "containers/crm/pricing";
import ProvinceTable from "containers/crm/pricing/ProvinceTable";
import RegionTable from 'containers/crm/pricing/RegionTable';
import AppCRM from "pages/_layout";
import DistrictTable from 'containers/crm/pricing/DistrictTable';
import WardTable from 'containers/crm/pricing/WardTable';
import CustomerLevelTable from 'containers/crm/pricing/CustomerLevelTable';
import { useRouter } from 'next/router';
import { getFeeClient } from 'client/fee';

const mockCustomerResData = {
    "status": "OK",
    "data": [
        {
            "code": "LEVEL_SLIVER",
            "createdTime": "2021-01-24T16:15:29.684Z",
            "description": "Hạng bạc",
            "feeValue": 0,
            "levelId": 4,
            "name": "Bạc"
        },
        {
            "code": "LEVEL_GOLD",
            "createdTime": "2021-01-24T16:15:29.606Z",
            "description": "Hạng vàng",
            "feeValue": 0,
            "levelId": 3,
            "name": "Vàng"
        },
        {
            "code": "LEVEL_PLATINUM",
            "createdTime": "2021-01-24T16:15:29.528Z",
            "description": "Hạng bạch kim",
            "feeValue": 0,
            "levelId": 2,
            "name": "Bạch kim"
        },
        {
            "code": "LEVEL_DIAMOND",
            "createdTime": "2021-01-24T16:15:29.452Z",
            "description": "Hạng kim cương",
            "feeValue": 0,
            "levelId": 1,
            "name": "Kim cương"
        }
    ],
    "message": "Query level successfully."
}

export async function loadPricingData(ctx, type, offset, limit) {
    const feeClient = getFeeClient(ctx);
    if (type === ViewType.REGION) {
        const res = await feeClient.getRegionFeeList(offset, limit);
        if (res.status === 'OK') {
            return {
                total: res.data.length,
                data: res.data,
            }
        } else {
            return { message: res.message, }
        }
    }
    if (type === ViewType.PROVINCE) {
        const res = await feeClient.getProvinceFeeList(offset, limit);
        if (res.status === 'OK') {
            return {
                total: res.data.length,
                data: res.data,
            }
        } else {
            return { message: res.message, }
        }
    }
    if (type === ViewType.DISTRICT) {
        const res = await feeClient.getDistrictFeeList(offset, limit);
        if (res.status === 'OK') {
            return {
                total: res.data.length,
                data: res.data,
            }
        } else {
            return { message: res.message, }
        }
    }
    if (type === ViewType.WARD) {
        const res = await feeClient.getWardFeeList(offset, limit);
        if (res.status === 'OK') {
            return {
                total: res.data.length,
                data: res.data,
            }
        } else {
            return { message: res.message, }
        }
    }
    if (type === ViewType.CUSTOMER) {
        const res = await feeClient.getCustomerLevelFeeList();
        if (res.status === 'OK') {
            return {
                data: res.data,
            }
        } else {
            return { message: res.message, }
        }
    }
}

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, async (ctx) => {
        const query = ctx.query;
        const {
            v = ViewType.CUSTOMER,
            q = '',
            page = 0,
            limit = 20,
        } = query;

        const data = await loadPricingData(ctx, v, page * limit, limit);

        return {
            props: {
                viewType: v,
                q,
                page,
                limit,
                regionData: v === ViewType.REGION ? data : null,
                provinceData: v === ViewType.PROVINCE ? data : null,
                districtData: v === ViewType.DISTRICT ? data : null,
                wardData: v === ViewType.WARD ? data : null,
                customerData: v === ViewType.CUSTOMER ? data : null,
                message: data.message ?? null,
            }
        }
    })
}

/**
 * @param {object} props
 * @param {string} props.viewType
 * @param {object[]} props.regionData
 * @param {object[]} props.provinceData
 * @param {object[]} props.districtData
 * @param {object[]} props.wardData
 * @param {object[]} props.customerData
 */
function render(props) {
    const router = useRouter();
    const [viewType, setViewType] = useState(props.viewType);
    const [searchText, setSearchText] = useState(props.q);

    return (
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Danh sách cấu hình giá</title>
            </Head>
            <Box component={Paper} padding={2}>
                <Grid container spacing={3}>
                    <Grid item container xs={12} spacing={3}>
                        <Grid item md={3}>
                            <TextField
                                label="Tìm kiếm theo"
                                variant="outlined"
                                size="small"
                                fullWidth
                                select
                                value={viewType}
                                onChange={(e) => {
                                    setViewType(e.target.value);
                                    router.push(`/crm/pricing?v=${e.target.value}&q=${searchText}`);
                                }}
                            >
                                <MenuItem value={ViewType.REGION}>Theo vùng</MenuItem>
                                <MenuItem value={ViewType.PROVINCE}>Theo tỉnh thành</MenuItem>
                                <MenuItem value={ViewType.DISTRICT}>Theo quận huyện</MenuItem>
                                <MenuItem value={ViewType.WARD}>Theo phường/xã</MenuItem>
                                <MenuItem value={ViewType.CUSTOMER}>Theo khách hàng</MenuItem>
                            </TextField>
                        </Grid>
                        {viewType != ViewType.CUSTOMER && (
                            <Grid item md={4}>
                                <TextField
                                    label="Tìm kiếm"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            < IconButton
                                                size="small"
                                                onClick={() => router.push(`/crm/pricing?v=${viewType}&q=${searchText}`)}
                                            >
                                                <Search />
                                            </IconButton>
                                        )
                                    }}
                                    onChange={e => setSearchText(e.target.value)}
                                    value={searchText}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <Grid item container xs={12} >
                        {props.viewType === ViewType.REGION && (
                            <RegionTable
                                data={props.regionData?.data}
                                q={searchText}
                                message={props.regionData?.message}
                            />
                        )}
                        {props.viewType === ViewType.PROVINCE && (
                            <ProvinceTable
                                data={props.provinceData?.data}
                                q={searchText}
                                message={props.provinceData?.message}
                            />
                        )}
                        {props.viewType === ViewType.DISTRICT && (
                            <DistrictTable
                                data={props.districtData?.data}
                                q={searchText}
                                message={props.districtData?.message}
                            />
                        )}
                        {props.viewType === ViewType.WARD && (
                            <WardTable
                                data={props.wardData?.data}
                                q={searchText}
                                message={props.wardData?.message}
                            />
                        )}
                        {props.viewType === ViewType.CUSTOMER && (
                            <CustomerLevelTable
                                data={props.customerData?.data}
                                q={searchText}
                                message={props.customerData?.message}
                            />
                        )}
                    </Grid>
                </Grid>
            </Box>
        </AppCRM>
    )
}

export default function ConfigPricingPage(props) {
    return renderWithLoggedInUser(props, render)
}