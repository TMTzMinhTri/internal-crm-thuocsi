import styles from "./promotion-code.module.css";
import {Box,RadioGroup,FormControlLabel,Radio, Button, CardContent, CardHeader, FormGroup, Paper, TextField} from "@material-ui/core";
import Head from "next/head";
import AppCRM from "pages/_layout";
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-components/lib/login";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return {props: {}}
    })
}

const defaultState = {
   promotionOption: "default",
}

export default function NewPage(props) {
    return renderWithLoggedInUser(props, render)
}

function render(props) {
    const [promotionCodeDefaults, setPromotionCodeDefaults] = useState([
        {
            id: 1,
        },
    ])
    const [promotionCodePercents, setPromotionCodePercents] = useState([
        {
            id: 1,
        },
    ])
    const [state, setState] = useState(defaultState);
    const {promotionOption} = state
    const {register, handleSubmit, errors} = useForm();
    const handleChange = (event) => {
        setState({...state, [event.target.name]: event.target.value})
    }

    async function createNewProduct(item) {

    }

    function handleRemoveCodeDefault(id) {
        const newCodes = promotionCodeDefaults.filter((item) => item.id !== id);
        setPromotionCodeDefaults(newCodes);
    }

    function handleAddCodeDefault(id) {
        setPromotionCodeDefaults([...promotionCodeDefaults, {id: id + 1}]);
    }

    function handleRemoveCodePercent(id) {
        const newCodes = promotionCodePercents.filter((item) => item.id !== id);
        setPromotionCodePercents(newCodes);
    }

    function handleAddCodePercent(id) {
        setPromotionCodePercents([...promotionCodePercents, {id: id + 1}]);
    }

    // func onSubmit used because useForm not working with some fields
    async function onSubmit() {
        try {
            await createNewProduct(state)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AppCRM select="/crm/promotion-code">
            <Head>
                <title>Thêm mã giảm giá</title>
            </Head>
            <Box component={Paper}>
                <FormGroup>
                    <Box className={styles.contentPadding}>
                        <Box style={{fontSize: 24}}>Thêm mã giảm giá mới</Box>
                        <CardHeader
                            subheader="Thông tin mã giảm giá"
                        />
                        <CardContent>
                            <Grid spacing={3} container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        id="name"
                                        name="name"
                                        label="Tên mã giảm giá"
                                        placeholder=""
                                        helperText={errors.name?.message}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{width: '100%'}}
                                        error={errors.name ? true : false}
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
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        id="code"
                                        name="code"
                                        label="Mã"
                                        placeholder=""
                                        helperText={errors.code?.message}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{width: '100%'}}
                                        error={errors.code ? true : false}
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
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        id="quantity"
                                        name="quantity"
                                        label="Số lượng"
                                        type="number"
                                        helperText={errors.quantity?.message}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{width: '100%'}}
                                        error={errors.quantity ? true : false}
                                        required
                                        inputRef={register(
                                            {
                                                required: "Invalid",
                                                pattern: {
                                                    value: /[0-9]/,
                                                    message: "Chỉ chấp nhận kí tự là số"
                                                }
                                            }
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        id="quantityPerCustomer"
                                        name="quantityPerCustomer"
                                        label="Số lượng áp dụng cho mỗi khách"
                                        type="number"
                                        helperText={errors.quantityPerCustomer?.message}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{width: '100%'}}
                                        error={errors.quantityPerCustomer ? true : false}
                                        required
                                        inputRef={register(
                                            {
                                                required: "Invalid",
                                                pattern: {
                                                    value: /[0-9]/,
                                                    message: "Chỉ chấp nhận kí tự là số"
                                                }
                                            }
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        id="startTime"
                                        name="startTime"
                                        label="Thời gian bắt đầu"
                                        placeholder=""
                                        helperText={errors.startTime?.message}
                                        type="datetime-local"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{width: '100%'}}
                                        error={errors.startTime ? true : false}
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
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        id="endTime"
                                        name="endTime"
                                        label="Thời gian kết thúc"
                                        placeholder=""
                                        type="datetime-local"
                                        helperText={errors.endTime?.message}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{width: '100%'}}
                                        onChange={handleChange}
                                        error={errors.endTime ? true : false}
                                        required
                                        inputRef={
                                            register({
                                                required: "Mã giảm giá không thể để trống",
                                                maxLength: {
                                                    value: 50,
                                                    message: "Mã giảm giá có chiều dài tối đa là 50 kí tự"
                                                },
                                                minLength: {
                                                    value: 6,
                                                    message: "Mã giảm giá có chiều dài  là 6 kí tự"
                                                },
                                                pattern: {
                                                    value: /[A-Za-z]/,
                                                    message: "Mã giảm giá phải có kí tự là chữ"
                                                }
                                            })
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        id="showTime"
                                        name="showTime"
                                        label="Thời gian hiển thị trên web"
                                        placeholder=""
                                        min={'2020-10-07T00:00'}
                                        max={'2020-12-14T00:00'}
                                        type="datetime-local"
                                        helperText={errors.name?.message}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        style={{width: '100%'}}
                                        error={!!errors.sku}
                                        inputRef={
                                            register({
                                                required: "Mã giảm giá không thể để trống",
                                                maxLength: {
                                                    value: 50,
                                                    message: "Mã giảm giá có chiều dài tối đa là 50 kí tự"
                                                },
                                                minLength: {
                                                    value: 6,
                                                    message: "Mã giảm giá có chiều dài  là 6 kí tự"
                                                },
                                                pattern: {
                                                    value: /[A-Za-z]/,
                                                    message: "Mã giảm giá phải có kí tự là chữ"
                                                }
                                            })
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider/>
                        <CardHeader
                            subheader="Điều kiện"
                        />
                        <CardContent>
                            <RadioGroup aria-label="quiz" name="promotionOption" value={promotionOption} onChange={handleChange}>
                                <Grid spacing={3} container justify="space-around" alignItems="center">
                                    <Grid item xs={12} sm={6} md={6}>
                                        <FormControlLabel value="default" control={<Radio color="primary"/>}
                                                          label="Mã giảm giá cố định"/>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <FormControlLabel value="percentage" control={<Radio color="primary"/>}
                                                          label="Mã giảm giá theo %"/>
                                    </Grid>
                                </Grid>
                            </RadioGroup>
                            {
                                promotionOption !== defaultState.promotionOption ? (
                                    <List component="nav" aria-label="mailbox folders">
                                        {
                                            promotionCodePercents.map((code, index) => (
                                                <ListItem key={ "percent_" + code.id} button>
                                                    <Grid spacing={1} container alignItems="center">
                                                        <Grid item xs={4} sm={4} md={4}>
                                                            <TextField
                                                                id="priceMinValue"
                                                                name="priceMinValue"
                                                                label="Giá trị đơn hàng"
                                                                placeholder=""
                                                                variant="outlined"
                                                                size="small"
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment
                                                                        position="end">đ</InputAdornment>,
                                                                }}
                                                                helperText={errors.priceMinValue?.message}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                style={{width: '100%'}}
                                                                error={errors.priceMinValue ? true : false}
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
                                                        </Grid>
                                                        <Grid item xs={2} sm={2} md={2}>
                                                            <TextField
                                                                id="code"
                                                                name="code"
                                                                type="number"
                                                                label="Số % giảm"
                                                                placeholder=""
                                                                variant="outlined"
                                                                size="small"
                                                                helperText={errors.code?.message}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment
                                                                        position="end">%</InputAdornment>,
                                                                }}
                                                                style={{width: '100%'}}
                                                                error={errors.code ? true : false}
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
                                                        </Grid>
                                                        <Grid item xs={4} sm={4} md={4}>
                                                            <TextField
                                                                id="code"
                                                                name="code"
                                                                label="Số tiền giảm"
                                                                placeholder=""
                                                                variant="outlined"
                                                                size="small"
                                                                helperText={errors.code?.message}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment
                                                                        position="end">đ</InputAdornment>,
                                                                }}
                                                                style={{width: '100%'}}
                                                                error={errors.code ? true : false}
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
                                                        </Grid>
                                                        <Grid item xs={2} sm={2} md={2}>
                                                            <Grid spacing={1} container alignItems="center">
                                                                <Grid item xs={6} sm={4} md={2}>
                                                                    {
                                                                        promotionCodePercents.length !== 1 ? (
                                                                            <IconButton color="secondary" component="span"
                                                                                        onClick={() => handleRemoveCodePercent(code.id)}>
                                                                                <HighlightOffOutlinedIcon/>
                                                                            </IconButton>
                                                                        ) : (
                                                                            <div/>
                                                                        )
                                                                    }
                                                                </Grid>
                                                                {
                                                                    index + 1 === promotionCodePercents.length ?
                                                                        (
                                                                            <Grid item xs={6} sm={4} md={2}>
                                                                                <IconButton color="primary"
                                                                                            onClick={() => handleAddCodePercent(code.id)}
                                                                                            aria-label="upload picture"
                                                                                            component="span">
                                                                                    <AddCircleOutlineOutlinedIcon/>
                                                                                </IconButton>
                                                                            </Grid>
                                                                        ) : (
                                                                            <div/>
                                                                        )
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                ) : (
                                    <List component="nav" aria-label="mailbox folders">
                                        {
                                            promotionCodeDefaults.map((code, index) => (
                                                <ListItem key={code.id} button>
                                                    <Grid spacing={1} container alignItems="center">
                                                        <Grid item xs={5} sm={5} md={5}>
                                                            <TextField
                                                                id="priceMinValue"
                                                                name="priceMinValue"
                                                                label="Giá trị đơn hàng "
                                                                placeholder=""
                                                                variant="outlined"
                                                                size="small"
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment
                                                                        position="end">đ</InputAdornment>,
                                                                }}
                                                                helperText={errors.priceMinValue?.message}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                style={{width: '100%'}}
                                                                error={errors.priceMinValue ? true : false}
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
                                                        </Grid>
                                                        <Grid item xs={5} sm={5} md={5}>
                                                            <TextField
                                                                id="code"
                                                                name="code"
                                                                label="Số tiền giảm"
                                                                placeholder=""
                                                                variant="outlined"
                                                                size="small"
                                                                helperText={errors.code?.message}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                InputProps={{
                                                                    endAdornment: <InputAdornment
                                                                        position="end">đ</InputAdornment>,
                                                                }}
                                                                style={{width: '100%'}}
                                                                error={errors.code ? true : false}
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
                                                        </Grid>
                                                        <Grid item xs={2} sm={2} md={2}>
                                                            <Grid spacing={1} container alignItems="center">
                                                                <Grid item xs={6} sm={4} md={2}>
                                                                    {
                                                                        promotionCodeDefaults.length !== 1 ? (
                                                                            <IconButton color="secondary" component="span"
                                                                                        onClick={() => handleRemoveCodeDefault(code.id)}>
                                                                                <HighlightOffOutlinedIcon/>
                                                                            </IconButton>
                                                                        ) : (
                                                                            <div/>
                                                                        )
                                                                    }
                                                                </Grid>
                                                                {
                                                                    index + 1 === promotionCodeDefaults.length ?
                                                                        (
                                                                            <Grid item xs={6} sm={4} md={2}>
                                                                                <IconButton color="primary"
                                                                                            onClick={() => handleAddCodeDefault(code.id)}
                                                                                            aria-label="upload picture"
                                                                                            component="span">
                                                                                    <AddCircleOutlineOutlinedIcon/>
                                                                                </IconButton>
                                                                            </Grid>
                                                                        ) : (
                                                                            <div/>
                                                                        )
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                )
                            }


                        </CardContent>
                        <Divider/>
                        <CardHeader
                            subheader="Áp dụng"
                        />
                        {/*  <CardContent>
                                <Grid spacing={3} container justify="space-around">
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            id="name"
                                            name="name"
                                            label="Tên mã giảm giá"
                                            placeholder=""
                                            helperText={errors.name?.message}
                                            value={name}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{width: '100%'}}
                                            error={ errors.name ? true : false }
                                            required
                                            inputRef={register}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            id="code"
                                            name="code"
                                            label="Mã"
                                            placeholder=""
                                            helperText={errors.name?.message}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{ width: '100%' }}
                                            error={ errors.sku ? true : false }
                                            required
                                            inputRef={register}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            id="startTime"
                                            name="startTime"
                                            label="Thời gian bắt đầu"
                                            placeholder=""
                                            helperText={errors.startTime?.message}
                                            type="datetime-local"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{ width: '100%' }}
                                            error={ errors.startTime ? true : false }
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
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            id="endTime"
                                            name="endTime"
                                            label="Thời gian kết thúc"
                                            placeholder=""
                                            type="datetime-local"
                                            helperText={errors.name?.message}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            style={{ width: '100%'}}
                                            onChange={handleChange}
                                            error={ errors.sku ? true : false }
                                            required
                                            inputRef={
                                                register({
                                                    required: "Mã giảm giá không thể để trống",
                                                    maxLength: {
                                                        value: 50,
                                                        message: "Mã giảm giá có chiều dài tối đa là 50 kí tự"
                                                    },
                                                    minLength: {
                                                        value: 6,
                                                        message: "Mã giảm giá có chiều dài  là 6 kí tự"
                                                    },
                                                    pattern: {
                                                        value: /[A-Za-z]/,
                                                        message: "Mã giảm giá phải có kí tự là chữ"
                                                    }
                                                })
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>*/}
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit(onSubmit)}
                                style={{margin: 8}}>
                                Lưu
                            </Button>
                            <Button variant="contained" style={{margin: 8}}>Làm mới</Button>
                        </Box>

                    </Box>
                </FormGroup>
            </Box>
        </AppCRM>
    )
}