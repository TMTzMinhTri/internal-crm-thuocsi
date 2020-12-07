import {
    Button,
    ButtonGroup,
    Divider,
    FormControl, Grid,
    IconButton, InputBase,
    InputLabel, Paper,
    Select, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import PanelCollapse from "components/panel/panel";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./pricing.module.css";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadPricingData(ctx)
    })
}

export async function loadPricingData(ctx) {
    // Fetch data from external API
    let query = ctx.query
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit

    let result = {
        data: [
            {
                pricingID: '1',
                name: 'ngoài biển',
                status: 'status 1',
                type: 'location',
                value: '0.1',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                pricingID: '2',
                name: 'vip',
                status: 'status 1',
                type: 'customer',
                value: '0.1',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                pricingID: '3',
                name: 'poor',
                status: 'status 1',
                type: 'customer',
                value: '0.1',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                pricingID: '4',
                name: 'rick',
                status: 'status 1',
                type: 'customer',
                value: '0.1',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                pricingID: '5',
                name: 'gold',
                status: 'status 1',
                type: 'customer',
                value: '0.1',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                pricingID: '6',
                name: 'trên núi',
                status: 'status 1',
                type: 'location',
                value: '0.1',
                start: '12/12/2012',
                end: '20/02/2020'
            },
            {
                pricingID: '7',
                name: 'đồng bằng',
                status: 'status 1',
                type: 'location',
                value: '0.1',
                start: '12/12/2012',
                end: '20/02/2020'
            },

        ],
        total: 10,
    }
    // Pass data to the page via props
    return {props: {data: result.data, count: result.total}}
}

export default function PricingPage(props) {
    return renderWithLoggedInUser(props, render)
}

export function formatNumber(num) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function render(props) {
    let router = useRouter()
    let page = parseInt(router.query.page) || 0
    let limit = parseInt(router.query.limit) || 20
    let [search, setSearch] = useState('');
    let [open, setOpen] = useState(false);
    const {register, handleSubmit, errors, control} = useForm();
    let q = router.query.q || ''

    async function handleChange(event) {
        const target = event.target;
        const value = target.value;
        setSearch(value)
    }

    function onSearch(formData) {
        try {
            searchPromotion(formData)
            setSearch('')
        } catch (error) {
            console.log(error)
        }
    }
    
    function onCollapse() {
        // func set expand panel search
        setOpen(!open);
    }

    function fnSearch(data) {
        // TODO example
        alert(data)
    }

    const RenderRow = (row) => (
        <TableRow>
            <TableCell component="th" scope="row">{row.data.pricingID}</TableCell>
            <TableCell align="left">{row.data.name}</TableCell>
            <TableCell align="left">{row.data.status}</TableCell>
            <TableCell align="left">{row.data.type}</TableCell>
            <TableCell align="left">{row.data.value}</TableCell>
            <TableCell align="left">{row.data.start}</TableCell>
            <TableCell align="left">{row.data.end}</TableCell>
            <TableCell align="center">
                <Link href={`/cms/ingredient/edit?ingredientID=${row.ingredientID}`}>
                    <ButtonGroup color="primary" aria-label="contained primary button group">
                        <Button variant="contained" size="small" color="primary">Xem</Button>
                    </ButtonGroup>
                </Link>
            </TableCell>
        </TableRow>
    )

    return (
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Danh sách cài đặt</title>
            </Head>
            <div className={styles.grid}>
                <Grid container spacing={3} direction="row"
                      justify="space-evenly"
                      alignItems="center"
                >
                    <Grid item xs={12} sm={6} md={6}>
                        <form>
                            <Paper component="form" className={styles.search}>
                                <InputBase
                                    id="q"
                                    name="q"
                                    className={styles.input}
                                    value={search}
                                    onChange={handleChange}
                                    inputRef={register}
                                    placeholder="Tìm kiếm khuyến mãi"
                                    inputProps={{'aria-label': 'Tìm kiếm khuyến mãi'}}
                                />
                                <IconButton className={open===true?styles.iconButtonHidden:styles.iconButton} aria-label="search"
                                            onClick={handleSubmit(onSearch)}>
                                    <SearchIcon/>
                                </IconButton>
                                <Divider className={styles.divider} orientation="vertical" />
                                <IconButton className={styles.iconButton} aria-label="filter-list"
                                            onClick={onCollapse}>
                                    <FilterListIcon/>
                                </IconButton>
                            </Paper>
                        </form>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={6}>
                        <Link href="/crm/promotion/new">
                            <ButtonGroup color="primary" aria-label="contained primary button group"
                                         className={styles.rightGroup}>
                                <Button variant="contained" color="primary" className={styles.btnAction}>Filter</Button>
                                <Button variant="contained" color="primary" className={styles.btnAction}>Thêm khuyến mãi</Button>
                            </ButtonGroup>
                        </Link>
                    </Grid>
                </Grid>
            </div>
            {
                q === '' ? (
                    <span/>
                ) : (
                    <div className={styles.textSearch}>Kết quả tìm kiếm cho <i>'{q}'</i></div>
                )
            }

            {
                open === true ? (
                    <Grid item xs={12} sm={12} md={12}>
                        <PanelCollapse expand={open} setOpen={setOpen} setExecute={fnSearch}>
                            <Grid container spacing={2} direction="row"
                                justify="space-evenly"
                                alignItems="center"
                            >
                                <Grid item xs={10} sm={6} md={4} className={styles.gridForm}>
                                    <FormControl className={styles.formControl} style={{width: '100%', margin: '-10px'}}>
                                        <InputLabel id="category-select-label" style={{marginLeft: '5%'}}>Loại sản phẩm</InputLabel>
                                        <Select
                                            labelId="category-select-label"
                                            id="category"
                                            name="category"
                                            variant="outlined"
                                        >
                                            
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={10} sm={6} md={4} className={styles.gridForm}>
                                    <FormControl className={styles.formControl} style={{width: '100%', margin: '-10px'}}>
                                        <InputLabel id="category-select-label" style={{marginLeft: '5%'}}>Loại sản phẩm</InputLabel>
                                        <Select
                                            labelId="category-select-label"
                                            id="category"
                                            name="category"
                                            variant="outlined"
                                            margin="normal"
                                        >
                                            
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={10} sm={6} md={4} className={styles.gridForm}>
                                    <FormControl className={styles.formControl} style={{width: '100%', margin: '-10px'}}>
                                        <TextField
                                            id="volume"
                                            name="volume"
                                            label="Thể tích"
                                            placeholder=""
                                            helperText="Ví dụ: 4 chai x 300ml"
                                            
                                            variant="outlined"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{width: '100%', marginTop: '20px' }}
                                            required
                                            inputRef={
                                                register({
                                                    required: "Volume Required",
                                                })
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={10} sm={6} md={4} className={styles.gridForm}>
                                    <FormControl className={styles.formControl} style={{width: '100%', margin: '-10px'}}>
                                        <InputLabel id="category-select-label" style={{marginLeft: '5%'}}>Loại sản phẩm</InputLabel>
                                        <Select
                                            labelId="category-select-label"
                                            id="category"
                                            name="category"
                                        >
                                            
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={10} sm={6} md={4} className={styles.gridForm}>
                                    <FormControl className={styles.formControl} style={{width: '100%', margin: '-10px'}}>
                                        <InputLabel id="category-select-label" style={{marginLeft: '5%'}}>Loại sản phẩm</InputLabel>
                                            <Controller 
                                                name="unit"
                                                control={control}
                                            
                                                as={
                                                    <Select label="unit" variant="outlined">
                                                        
                                                    </Select>
                                                }
                                            />
                                        </FormControl>
                                </Grid>
                                <Grid item xs={10} sm={6} md={4} className={styles.gridForm}></Grid>
                            </Grid>
                        </PanelCollapse>
                    </Grid>
                ):(
                    <div></div>
                )
            }
        
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Tên chỉ số</TableCell>
                            <TableCell align="left">Trạng thái</TableCell>
                            <TableCell align="left">Loại</TableCell>
                            <TableCell align="left">Giá trị</TableCell>
                            <TableCell align="left">Bắt đầu</TableCell>
                            <TableCell align="left">Kết thúc</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {props.data.length > 0 ? (
                        <TableBody>
                            {props.data.map(row => (
                                <RenderRow data={row}/>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={3} align="left">{props.message}</TableCell>
                            </TableRow>
                        </TableBody>
                    )}

                    <MyTablePagination
                        labelUnit="chỉ số"
                        count={props.count}
                        rowsPerPage={limit}
                        page={page}
                        onChangePage={(event, page, rowsPerPage) => {
                            Router.push(`/pricing?page=${page}&limit=${rowsPerPage}`)
                        }}
                    />
                </Table>
            </TableContainer>
        </AppCRM>
    )
}