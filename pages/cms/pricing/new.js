import { Box, Button, FormControl, FormGroup, InputLabel, MenuItem, Paper, Select, TextField } from "@material-ui/core";
import Head from "next/head";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AppCMS from "../../_layout";
import styles from "./product.module.css";

const defaultState = {
    name: "",
    sku: "",
    description: "",
    origin: "",
    madeBy: "",
    storage: "",
    unit: "Hộp",
    category: "",
    indication: "",
    dosage: "",
    volume: ""
}

export default function NewPage(props) {
    const [units] = useState([
        {
            label: "Hộp",
            value: "Hộp"
        }
    ]);
    const [categories, setCategories] = useState([])
    const [state, setState] = useState(defaultState);
    const { register, handleSubmit, errors } = useForm();

    const {name, unit, category} = state
    
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

    async function createNewProduct(item) {
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
            await createNewProduct(state)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadCategoryData({})
    },[]);

    return (
        <AppCMS select="/product">
            <Head>
                <title>Thêm sản phẩm</title>
            </Head>
            <Box component={Paper}>
                <FormGroup>
                    <Box className={styles.contentPadding}>
                        <Box style={{ fontSize: 24 }}>Thêm sản phẩm mới</Box>
                        <Box>
                            <TextField
                                id="name"
                                name="name"
                                label="Tên sản phẩm"
                                placeholder=""
                                helperText={errors.name?.message}
                                margin="normal"
                                value={name}
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
                                placeholder=""
                                helperText={errors.sku? errors.sku.message: "Mã sản phẩm"}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: '20%' }}
                                onChange={handleChange}
                                error={ errors.sku ? true : false }
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
                        </Box>
                        <Box>
                            <TextField
                                id="description"
                                name="description"
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
                                    onChange={handleChange}
                                    value={unit}
                                    
                                >
                                    {units.map(({label, value}) => (
                                        <MenuItem value={value} key={value}>{label}</MenuItem>
                                    ))}
                                    {/* <MenuItem value={"Hộp"}>Hộp</MenuItem>
                                    <MenuItem value={"Chai"}>Chai</MenuItem>
                                    <MenuItem value={"Túi"}>Túi</MenuItem>
                                    <MenuItem value={"Hũ"}>Hũ</MenuItem>
                                    <MenuItem value={"Gói"}>Gói</MenuItem>
                                    <MenuItem value={"Tube"}>Tube</MenuItem> */}
                                </Select>
                            </FormControl>
                            <TextField
                                id="volume"
                                name="volume"
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
                                    onChange={handleChange}
                                    value={category}
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
        </AppCMS>
    )
}