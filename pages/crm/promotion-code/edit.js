import { Box, Button, FormControl, FormGroup, InputLabel, MenuItem, Paper, Select, TextField } from "@material-ui/core";
import Head from "next/head";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from "./promotion-code.module.css";

export async function getServerSideProps({ query }) {
    return await loadProductData(query)
}

export async function loadProductData(query) {
    let sku = query.sku || ''
    
    const res = await fetch(`http://34.87.48.109/core/product/v1/product?sku=${sku}`, {
        method: "GET",
        headers: {
            "Authorization": "Basic bmFtcGg6MTIzNDU2"
        }
    })
    const result = await res.json()
    
    if(result.status != "OK"){
        return { props: Object.assign({data:[]}, result) }
    }

    // console.log(result)
    // Pass data to the page via props
    return { props: result }
}


export default function EditPage(props) {
    const [units] = useState([
        {
            label: "Hộp",
            value: "Hộp"
        }
    ]);
    const product = props?.data[0]
    const [categories, setCategories] = useState([])
    const [state, setState] = useState(product);
    const { register, handleSubmit, errors } = useForm();
    
    const handleChange = (event) => {
        // change event.target.id to event.target.name because select box'event do not return id, ex: {value: "value", name: "category"}
        setState({...state, [event.target.name]: event.target.value})
    }

    async function loadCategoryData(query) {
        let page = query.page || 0
        let limit = query.limit || 100
        let offset = page * limit
    
        const res = await fetch(`http://34.87.48.109/core/product/v1/category/list?offset=${offset}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Authorization": "Basic bmFtcGg6MTIzNDU2"
            }
        })
        const result = await res.json()
        setCategories(result.data.map(({ name }) => ({ label: name, value: name })))
        if(result.data.length > 0) {
            setState({...state, ["category"]: result.data[0].name})
        }
    }

    async function updateProduct(item) {
        const payload = Object.assign({imageUrls: "thuocsi.vn/default.png"},item)
        const res = await fetch(`http://34.87.48.109/core/product/v1/product`, {
            method: 'POST',
            headers: {
                "Authorization": "Basic bmFtcGg6MTIzNDU2"
            },
            body: JSON.stringify(payload)
        })
        const result = await res.json()
        console.log(result)
    }

    // func onSubmit used because useForm not working with some fields
    async function onSubmit(){
        try {
            await updateProduct(state)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadCategoryData({})
    },[]);

    if(props.status !="OK") {
        return (
            <AppCRM select="/product">
                <Head>
                    <title>Thông tin sản phẩm</title>
                </Head>
                <Box component={Paper}>
                    <FormGroup>
                        <Box className={styles.contentPadding}>
                            <Box style={{ fontSize: 24 }}>Thông tin sản phẩm</Box>
                            <Box>{props.message}</Box>
                        </Box>
                    </FormGroup>
                </Box>
            </AppCRM>
        )
    }
    return (
        <AppCRM select="/product">
            <Head>
                <title>Thông tin sản phẩm</title>
            </Head>
            <Box component={Paper}>
                <FormGroup>
                    <Box className={styles.contentPadding}>
                        <Box style={{ fontSize: 24 }}>Thông tin sản phẩm</Box>
                        <Box>
                            <TextField
                                id="name"
                                name="name"
                                value={state.name}
                                label="Tên sản phẩm"
                                placeholder=""
                                helperText={errors.name?.message}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: '25%' }}
                                onChange={({target: {value,name}}) => {
                                    setState({...state,[name]:value})
                                }}
                                error={ errors.name ? true : false }
                                required
                                inputRef={
                                    register({
                                        required: "Name Required",
                                        maxLength: {
                                            value: 250,
                                            message: "Name must be less than 250 characters"
                                        },
                                        minLength: {
                                            value: 6,
                                            message: "Name must be greater than 6 characters"
                                        },
                                        pattern: {
                                            value: /[A-Za-z]/,
                                            message: "Name must be characters"
                                        }
                                    })
                                }
                            />
                            <TextField
                                id="sku"
                                name="sku"
                                label="SKU"
                                value={state.sku}
                                placeholder=""
                                helperText={errors.sku? errors.sku.message: "Mã sản phẩm"}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: '20%' }}
                                onChange={handleChange}
                                error={ errors.sku ? true : false }
                                disabled
                                required
                                inputRef={
                                    register({
                                        required: "SKU Required",
                                        maxLength: {
                                            value: 50,
                                            message: "SKU must be less than 50 characters"
                                        },
                                        minLength: {
                                            value: 6,
                                            message: "SKU must be greater than 6 characters"
                                        },
                                        pattern: {
                                            value: /[A-Za-z]/,
                                            message: "SKU must be characters"
                                        }
                                    })
                                }
                            />
                            <TextField
                                id="createdTime"
                                name="createdTime"
                                label="Created at"
                                value={state.createdTime}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: '20%' }}
                                disabled
                            />
                            <TextField
                                id="lastUpdatedTime"
                                name="lastUpdatedTime"
                                label="Updated at"
                                value={state.lastUpdatedTime}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: '20%' }}
                                disabled
                            />
                        </Box>
                        <Box>
                            <TextField
                                id="description"
                                name="description"
                                value={state.description}
                                label="Mô tả"
                                placeholder=""
                                helperText={errors.description?.message}
                                margin="normal"
                                multiline
                                rowsMax={4}
                                onChange={handleChange}
                                error={ errors.description ? true : false }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: '47%' }}
                            />
                        </Box>
                        <Box>
                            <TextField
                                id="origin"
                                name="origin"
                                value={state.origin}
                                label="Xuất xứ"
                                placeholder="Quốc gia sản xuất"
                                helperText={errors.origin?.message}
                                margin="normal"
                                onChange={handleChange}
                                error={ errors.origin ? true : false }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: '47%' }}
                                required
                                inputRef={
                                    register({
                                        required: "Origin Required",
                                    })
                                }
                            />
                        </Box>
                        <Box>
                            <TextField
                                id="madeBy"
                                name="madeBy"
                                value={state.madeBy}
                                label="Nhà sản xuất"
                                placeholder="Tên nhà sản xuất"
                                helperText={errors.madeBy?.message}
                                margin="normal"
                                onChange={handleChange}
                                error={ errors.madeBy ? true : false }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: '47%' }}
                                required
                                inputRef={
                                    register({
                                        required: "MakeBy Required",
                                    })
                                }
                            />
                        </Box>
                        <Box>
                            <TextField
                                id="storage"
                                name="storage"
                                value={state.storage}
                                label="Bảo quản"
                                placeholder="Cách bảo quản"
                                margin="normal"
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: '47%' }}
                            />
                        </Box>
                        <Box>
                            <FormControl className={styles.formControl} style={{ margin: 12, width: 240 }}>
                                <InputLabel id="unit-select-label">Đơn vị tính</InputLabel>
                                <Select
                                    labelId="unit-select-label"
                                    id="unit-select"
                                    name="unit"
                                    value={state.unit}
                                    onChange={handleChange}
                                >
                                    {units.map(({label, value}) => (
                                        <MenuItem value={value} key={value}>{label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                id="volume"
                                name="volume"
                                value={state.volume}
                                label="Thể tích"
                                placeholder=""
                                helperText="Ví dụ: 4 chai x 300ml"
                                margin="normal"
                                onChange={handleChange}
                                error={ errors.volume ? true : false }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: '23%' }}
                                required
                                inputRef={
                                    register({
                                        required: "Volume Required",
                                    })
                                }
                            />
                            
                        </Box>
                        <Box>
                            <FormControl className={styles.formControl} style={{ margin: 12, width: 240 }}>
                                <InputLabel id="category-select-label">Loại sản phẩm</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    id="category"
                                    name="category"
                                    value={state.category}
                                    onChange={handleChange}
                                >
                                    {categories.map(({label, value}) => (
                                        <MenuItem value={value} key={value}>{label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <TextField
                                id="indication"
                                name="indication"
                                value={state.indication}
                                label="Chỉ định"
                                placeholder=""
                                margin="normal"
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: '23%' }}
                            />
                            <TextField
                                id="dosage"
                                name="dosage"
                                value={state.dosage}
                                label="Liều lượng"
                                placeholder=""
                                margin="normal"
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: '22%' }}
                            />
                        </Box>
                        <Box>
                            <Button
                                variant="contained" 
                                color="primary" 
                                onClick={handleSubmit(onSubmit)}
                                style={{ margin: 8 }}>
                                    Lưu
                            </Button>
                            <Button variant="contained" style={{ margin: 8 }}>Làm mới</Button>
                        </Box>
                        
                    </Box>
                </FormGroup>
            </Box>
        </AppCRM>
    )
}