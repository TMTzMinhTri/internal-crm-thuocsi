import {
    Box,
    Button, FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel, List, ListItem,
    ListItemIcon,
    MenuItem, Paper,
    Radio, RadioGroup, Select, TextField,
    Typography
} from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import { getPricingClient } from "client/price";
import { filterListObjectName, SellPrices } from "components/global";
import Head from "next/head";
import AppCRM from "pages/_layout";
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormAddCondition from "./form";
import styles from "./pricing.module.css";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadTags(ctx) 
    })
}

export async function loadTags(ctx) {
    let data = {props: {}}
    let _client = getPricingClient(ctx, {})
    let tagDefs = ['condUserType']
    data.props.conditions = {}
    let conditions = await _client.getConditionSellTypeByTag({
        q: 'all',
    })
    
    if (conditions.status !== "OK") {
        for(let tag of tagDefs) {
            data.props.conditions[tag] = []
        }
    } else {
        data.props.conditions = conditions?.data[0]
    }

    return data
}

export default function NewFromPage(props) {
    return renderWithLoggedInUser(props, render)
}

const TagItem = ({conditions, tag, control, register, idx,setValue, eventAddMore}) => {
    let tagInfo = conditions[`${tag}`]
    return (
        <ListItem>
            <FormControl  style={{width: '100%'}} size="small" variant="outlined">
                
                {
                    Array.isArray(tagInfo?.data) === true ?(
                        <div>
                            <InputLabel id="customer-select-label">{tagInfo.name}</InputLabel>
                            <Controller 
                                name={tag}
                                control={control}
                                inputRef={register}
                                style={{width: '100%'}}
                                as={
                                    <Select label={tagInfo.name}>
                                        {
                                            
                                            tagInfo.data.map((tg,index) => (
                                                <MenuItem value={tg.value}>{tg.label}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                }
                            />
                        </div>
                        
                    ):(
                        <TextField
                            id={tag}
                            name={tag}
                            variant="outlined"
                            size="small"
                            type="number"
                            label={tagInfo.name}
                            placeholder=""
                            defaultValue={1000}
                            // helperText={errors.name?.message}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={(e) => setValue(tag, parseInt(e.target.value,10))}
                            style={{width: '100%'}}
                            // error={errors.name ? true : false}
                            required
                            inputRef={
                                register({
                                    required: "Vui lòng nhập",
                                    valueAsNumber: true, // important
                                })
                            }
                        />
                    )
                }
                
            </FormControl>
            <ListItemIcon>
                <IconButton edge="end" aria-label="add" color="primary" onClick={eventAddMore}>
                    <AddCircleOutlineOutlinedIcon />
                </IconButton>
                {
                    idx > 1?(
                        <IconButton edge="end" aria-label="delete" color="secondary">
                            <HighlightOffOutlinedIcon />
                        </IconButton>
                    ):(
                        <div></div>
                    )
                }
                
            </ListItemIcon>
        </ListItem>
    )
}

function render(props) {
    const { register, handleSubmit, errors, reset, watch, control, getValues, setValue } = useForm({ mode: 'onChange' });
    const [open, setOpen] = useState(false);
    const [conditions, setConditions] = useState(["condUserType"])
    
    // func onSubmit used because useForm not working with some fields
    function onSubmit(formData){
        // TODO
        console.log(formData)
    }

    function handleOpenModal() {
        setOpen(!open);
    }

    function updateConditions(val) {
        val.forEach((item,idx) => {
            if(conditions.indexOf(item) < 0) {
                setConditions([...conditions,item])
            }
        })
    }

    const handleChangeSetting = (event) => {
        alert(event.target.value);
        setValue("condSettingType", event.target.value);
    };

    let lstOptions = filterListObjectName(props?.conditions)

    return (
        <AppCRM select="/crm/pricing">
            <Head>
                <title>Thêm cài đặt giá</title>
            </Head>
            <Box component={Paper} display="block">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Box className={styles.contentPadding}>
                        <Box style={{ fontSize: 24, margin: 10}}>Thông tin cài đặt giá</Box>
                        <Grid container spacing={3} className={styles.resetMargin}>
                            <Grid item xs={12} sm={12} md={12}>
                                <Typography gutterBottom>
                                    Loại cài đặt:
                                </Typography>
                                <Controller
                                    rules={{ required: true }}
                                    control={control}
                                    defaultValue={SellPrices[0].value}
                                    name="condSettingType"
                                    as={
                                        <RadioGroup
                                        aria-label="condSettingType"
                                        onChange={handleChangeSetting}
                                        >
                                        <Grid spacing={3} container justify="space-around" alignItems="center">
                                            {
                                                SellPrices.map((row) => (
                                                    <Grid item xs={6} sm={6} md={3}>
                                                        <FormControlLabel value={row.value} control={<Radio color="primary"/>}
                                                                        label={row.label}/>
                                                        
                                                    </Grid>
                                                ))
                                            }
                                            <Grid item xs={6} sm={6} md={3}></Grid>
                                        </Grid>
                                        </RadioGroup>
                                    }
                                    />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <Typography gutterBottom>
                                    Điều kiện:
                                </Typography>
                                <Grid item xs={4} sm={3} md={3}>
                                    <List dense={true}>
                                        {
                                            conditions.map((tag, idx) => (
                                                <TagItem conditions={props.conditions} tag={tag} control={control} register={register} idx={idx} eventAddMore={handleOpenModal}/>
                                            ))
                                        }
                                    </List>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit(onSubmit)}
                                style={{margin: 8}}>
                                Lưu
                            </Button>
                            <Button variant="contained" style={{margin: 8}}>Làm mới</Button>

                            
                            <pre>SELECTED: {JSON.stringify(conditions, null, 2)}</pre>

                            <pre>FORM: {JSON.stringify(getValues(), null, 2)}</pre>

                            <pre>FORM: {JSON.stringify(props.conditions, null, 2)}</pre>
                        </Box>
                    </Box>
                </form>
                {
                    open===true?(
                        FormAddCondition(open,lstOptions,updateConditions,setOpen,conditions)
                        
                    ):(
                        FormAddCondition(open,lstOptions,updateConditions,setOpen,conditions)
                    )
                }
                
            </Box>
        </AppCRM>
    )
}