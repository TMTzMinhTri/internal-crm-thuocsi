import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, IconButton, Paper, Tab, Tabs, TextField } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import Head from "next/head";

import { ViewType } from "containers/crm/pricing";
import AppCRM from "pages/_layout";
import { useRouter } from 'next/router';
import { getFeeClient } from 'client/fee';
import { unknownErrorText } from 'components/commonErrors';
import { formatUrlSearch } from 'components/global';
import {
    RegionTable,
    ProvinceTable,
    DistrictTable,
    CustomerLevelTable,
    WardTable,
    TagTable,
    PriceLevelTable,
} from "containers/crm/pricing";
import Link from 'next/link';
import { getPriceLevelClient } from 'client/price-level';

export async function loadPricingData(ctx, type, offset, limit, q) {
    const feeClient = getFeeClient(ctx);
    const priceLevelClient = getPriceLevelClient(ctx);
    if (type === ViewType.REGION) {
        const res = await feeClient.getRegionFeeList(offset, limit, q);
        if (res.status === 'OK') {
            return {
                total: res.total ?? null,
                data: res.data,
            }
        }
        if (res.status === 'NOT_FOUND') {
            return {
                message: 'Không tìm thấy vùng phù hợp.'
            }
        }
        return { message: res.message, }
    }
    if (type === ViewType.PROVINCE) {
        const res = await feeClient.getProvinceFeeList(offset, limit, q);
        if (res.status === 'OK') {
            return {
                total: res.total ?? null,
                data: res.data,
            }
        }
        if (res.status === 'NOT_FOUND') {
            return {
                message: 'Không tìm thấy tỉnh thành phù hợp.'
            }
        }
        return { message: res.message, }

    }
    if (type === ViewType.DISTRICT) {
        const res = await feeClient.getDistrictFeeList(offset, limit, q);
        if (res.status === 'OK') {
            return {
                total: res.total ?? null,
                data: res.data,
            }
        }
        if (res.status === 'NOT_FOUND') {
            return {
                message: 'Không tìm thấy quận huyện phù hợp.'
            }
        }
        return { message: res.message, }
    }
    if (type === ViewType.WARD) {
        const res = await feeClient.getWardFeeList(offset, limit, q);
        if (res.status === 'OK') {
            return {
                total: res.total ?? null,
                data: res.data,
            }
        }
        if (res.status === 'NOT_FOUND') {
            return {
                message: 'Không tìm thấy phường/xã phù hợp.'
            }
        }
        return { message: res.message, }
    }
    if (type === ViewType.CUSTOMER) {
        const res = await feeClient.getCustomerLevelFeeList();
        if (res.status === 'OK') {
            return {
                data: res.data,
            }
        }
        if (res.status === 'NOT_FOUND') {
            return {
                message: 'Không tìm thấy hạng khách hàng phù hợp.'
            }
        }
        return { message: res.message, }
    }
    if (type === ViewType.TAG) {
        const res = await feeClient.getTagFeeList(offset, limit, q);
        if (res.status === 'OK') {
            return {
                total: res.total ?? null,
                data: res.data,
            }
        }
        if (res.status === 'NOT_FOUND') {
            return {
                message: 'Không tìm thấy tag phù hợp.'
            }
        }
        return { message: res.message, }
    }
    if (type === ViewType.PRICE_LEVEL) {
        const res = await priceLevelClient.getPriceLevelList(offset, limit, q);
        if (res.status === 'OK') {
            return {
                total: res.total ?? null,
                data: res.data,
            }
        }
        if (res.status === 'NOT_FOUND') {
            return {
                message: 'Không tìm thấy ngưỡng giá phù hợp.'
            }
        }
        return { message: res.message, }
    }
}

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, async (ctx) => {
        const query = ctx.query;
        let {
            v = ViewType.CUSTOMER,
            q = '',
        } = query;

        if (
            v !== ViewType.CUSTOMER &&
            v !== ViewType.PRICE_LEVEL &&
            v !== ViewType.TAG &&
            v !== ViewType.REGION &&
            v !== ViewType.PROVINCE &&
            v !== ViewType.DISTRICT &&
            v !== ViewType.WARD
        )
            v = ViewType.CUSTOMER;

        const page = parseInt(query.page ?? 0, 10);
        const limit = parseInt(query.limit ?? 20, 10);

        try {
            const data = await loadPricingData(ctx, v, page * limit, limit, q);
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
                    tagData: v === ViewType.TAG ? data : null,
                    priceLevelData: v === ViewType.PRICE_LEVEL ? data : null,
                }
            }
        } catch (err) {
            return {
                props: {
                    viewType: v,
                    q,
                    page,
                    limit,
                    message: err.message ?? unknownErrorText,
                }
            }
        }
    })
}

const searchPlaceholderText = {
    [ViewType.TAG]: "Nhập tên hoặc mã tag,...",
    [ViewType.REGION]: "Nhập tên vùng,...",
    [ViewType.PROVINCE]: "Nhập tên tỉnh thành,...",
    [ViewType.DISTRICT]: "Nhập tên quận huyện,...",
    [ViewType.WARD]: "Nhập tên phường/xã,...",
    [ViewType.PRICE_LEVEL]: "Nhập tên ngưỡng giá,...",
}

/**
 * @param {object} props
 * @param {string} props.viewType
 * @param {string} props.q
 * @param {number} props.page
 * @param {number} props.limit
 * @param {object[]} props.regionData
 * @param {object[]} props.provinceData
 * @param {object[]} props.districtData
 * @param {object[]} props.wardData
 * @param {object[]} props.customerData
 * @param {object[]} props.tagData
 */
function render(props) {
    const router = useRouter();
    const [viewType, setViewType] = useState(props.viewType);
    const [searchText, setSearchText] = useState(props.q);

    useEffect(() => {
        setViewType(props.viewType);
    }, [props.viewType]);

    useEffect(() => {
        setSearchText(props.q);
    }, [props.q]);

    const handleEnterPress = (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        router.push(`/crm/pricing?v=${viewType}&q=${formatUrlSearch(searchText)}`)
    }

    return (
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Danh sách cấu hình giá</title>
            </Head>
            <Box
                component={Paper}
                style={{ padding: "16px" }}
                display="block"
            >
                <Grid container spacing={3}>
                    <Grid item container xs={12} spacing={3}>
                        <Grid item xs={12}>
                            <Tabs
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                onChange={(_, value) => {
                                    setViewType(value);
                                    router.push(`/crm/pricing?v=${value}&q=${searchText}`);
                                }}
                                value={viewType}
                            >
                                <Tab value={ViewType.CUSTOMER} label="Theo khách hàng" />
                                <Tab value={ViewType.TAG} label="Theo tag" />
                                <Tab value={ViewType.PRICE_LEVEL} label="Theo ngưỡng giá" />
                                <Tab value={ViewType.REGION} label="Theo vùng" />
                                <Tab value={ViewType.PROVINCE} label="Theo tỉnh thành" />
                                <Tab value={ViewType.DISTRICT} label="Theo quận huyện" />
                                <Tab value={ViewType.WARD} label="Theo phường/xã" />
                            </Tabs>
                        </Grid>
                        {viewType != ViewType.CUSTOMER && (
                            <>
                                <Grid item md={4}>
                                    <TextField
                                        label="Tìm kiếm"
                                        placeholder={searchPlaceholderText[viewType]}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                < IconButton
                                                    size="small"
                                                    onClick={() => router.push(`/crm/pricing?v=${viewType}&q=${searchText}`)}
                                                >
                                                    <Search />
                                                </IconButton>
                                            ),
                                        }}
                                        onChange={e => setSearchText(e.target.value)}
                                        onKeyPress={handleEnterPress}
                                        value={searchText}

                                    />
                                </Grid>
                                <Grid item container xs={12} md={8} justify="flex-end">
                                    {viewType === ViewType.PRICE_LEVEL && (
                                        <Grid item>
                                            <Link href="/crm/pricing/price-level/new">
                                                <Button variant="contained" color="primary">Tạo mới</Button>
                                            </Link>
                                        </Grid>
                                    )}
                                </Grid>
                            </>
                        )}
                    </Grid>
                    <Grid item container xs={12} >
                        {viewType === ViewType.REGION && (
                            <RegionTable
                                data={props.regionData?.data}
                                q={searchText}
                                message={props.regionData?.message}
                                page={props.page}
                                limit={props.limit}
                                total={props.regionData?.total}
                            />
                        )}
                        {viewType === ViewType.TAG && (
                            <TagTable
                                data={props.tagData?.data}
                                q={searchText}
                                message={props.tagData?.message}
                                page={props.page}
                                limit={props.limit}
                                total={props.tagData?.total}
                            />
                        )}
                        {viewType === ViewType.PRICE_LEVEL && (
                            <PriceLevelTable
                                data={props.priceLevelData?.data}
                                q={searchText}
                                message={props.priceLevelData?.message}
                                page={props.page}
                                limit={props.limit}
                                total={props.priceLevelData?.total}
                            />
                        )}
                        {viewType === ViewType.PROVINCE && (
                            <ProvinceTable
                                data={props.provinceData?.data}
                                q={searchText}
                                message={props.provinceData?.message}
                                page={props.page}
                                limit={props.limit}
                                total={props.provinceData?.total}
                            />
                        )}
                        {viewType === ViewType.DISTRICT && (
                            <DistrictTable
                                data={props.districtData?.data}
                                q={searchText}
                                message={props.districtData?.message}
                                page={props.page}
                                limit={props.limit}
                                total={props.districtData?.total}
                            />
                        )}
                        {viewType === ViewType.WARD && (
                            <WardTable
                                data={props.wardData?.data}
                                q={searchText}
                                message={props.wardData?.message}
                                page={props.page}
                                limit={props.limit}
                                total={props.wardData?.total}
                            />
                        )}
                        {viewType === ViewType.CUSTOMER && (
                            <CustomerLevelTable
                                data={props.customerData?.data}
                                q={searchText}
                                message={props.customerData?.message}
                                page={props.page}
                                limit={props.limit}
                                total={props.customerData?.total}
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