import React, {useState} from "react";
import {Divider, Grid, IconButton, InputBase, Paper} from "@material-ui/core";
import PanelCollapse from "../../../components/panel/panel";
import {Controller, useForm} from "react-hook-form";
import styles from "../pricing/pricing.module.css";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const productTypes = [
    {
        value: "ALL",
        label: "Tất cả"
    },
    {
        value: "SET",
        label: "Đã được cài giá"
    },
    {
        value: "NOT_SET",
        label: "Chưa được cài giá"
    }
]

export default function SearchForm(props) {
    let [open, setOpen] = useState(false);
    let [search, setSearch] = useState('');
    const {register, handleSubmit, errors, control} = useForm();

    function onCollapse() {
        // func set expand panel search
        setOpen(!open);
    }

    async function handleChange(event) {
        const target = event.target;
        const value = target.value;
        setSearch(value)
    }

    function onSearch(formData) {
        try {
            setSearch('')
        } catch (error) {
            console.log(error)
        }
    }

    function fnSearch(data) {
        // TODO example
        alert(data)
    }

    return (
        <div>
            <Grid container alignItems="center" style={{marginBottom: '10px'}}>
                <Grid item xs={6} sm={3} md={3}>
                    <Paper component="form" className={styles.search}>
                        <InputBase
                            id="q"
                            name="q"
                            className={styles.input}
                            value={search}
                            onChange={handleChange}
                            inputRef={register}
                            placeholder="Tìm kiếm sản phẩm theo tên hoặc sku"
                            inputProps={{'aria-label': 'Tìm kiếm sản phẩm theo tên hoặc sku'}}
                        />
                        <IconButton className={open === true ? styles.iconButtonHidden : styles.iconButton}
                                    aria-label="search"
                                    onClick={handleSubmit(onSearch)}>
                            <SearchIcon/>
                        </IconButton>
                        <Divider className={styles.divider} orientation="vertical"/>
                        <IconButton className={styles.iconButton} aria-label="filter-list"
                                    onClick={onCollapse}>
                            <FilterListIcon/>
                        </IconButton>
                    </Paper>

                </Grid>
            </Grid>
            {
                open === true ? (
                    <Grid item xs={12} sm={12} md={12}>
                        <PanelCollapse expand={open} setOpen={setOpen} setExecute={fnSearch}>
                            <Grid container spacing={5} direction="row" alignItems="center">
                                <Grid item xs={4} md={4} sm={4}>
                                    <FormControl style={{width: '100%'}} size="small" variant="outlined">
                                        <InputLabel id="department-select-label" sise="small">Sản phẩm</InputLabel>
                                        <Controller
                                            name="productType"
                                            control={control}
                                            lable="Cấp độ"
                                            defaultValue={productTypes ? productTypes[0].value : ''}
                                            rules={{required: true}}
                                            error={!!errors.level}
                                            as={
                                                <Select label="Sản phẩm">
                                                    {productTypes.map(({value, label}) => (
                                                        <MenuItem value={value} key={value}>{label}</MenuItem>
                                                    ))}
                                                </Select>
                                            }
                                        />
                                    </FormControl>
                                </Grid>

                            </Grid>
                        </PanelCollapse>
                    </Grid>
                ) : (
                    <div/>
                )
            }
        </div>
    )
}