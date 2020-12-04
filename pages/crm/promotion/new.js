import {
    Box,
    Button,
    ButtonGroup,
    CardContent,
    CardHeader,
    FormControlLabel,
    FormGroup,
    Paper,
    Radio,
    RadioGroup,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import Head from "next/head";
import AppCRM from "pages/_layout";
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import styles from "./promotion.module.css";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-lib/login";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Checkbox from "@material-ui/core/Checkbox";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return {props: {}}
    })
}

const defaultState = {
    promotionOption: "option1",
    type: "type1",
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
    const {promotionOption, type} = state
    const {register, handleSubmit, errors} = useForm();

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
        <AppCRM select="/crm/promotion">
            <Head>
                <title>Thêm khuyến mãi</title>
            </Head>
            <Box component={Paper}>
                <FormGroup>
                    <Box className={styles.contentPadding}>
                        <Box style={{fontSize: 24}}>Thêm khuyến mãi mới</Box>
                        <CardHeader
                            subheader="Thông tin khuyến mãi"
                        />
                        <CardContent>
                            <Grid spacing={3} container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        id="name"
                                        name="name"
                                        label="Tên khuyến mãi"
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
                                        label="Số lần áp dụng"
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
                                        label="Số lần áp dụng cho mỗi khách"
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
                                                required: "Mã khuyến mãi không thể để trống",
                                                maxLength: {
                                                    value: 50,
                                                    message: "Mã khuyến mãi có chiều dài tối đa là 50 kí tự"
                                                },
                                                minLength: {
                                                    value: 6,
                                                    message: "Mã khuyến mãi có chiều dài  là 6 kí tự"
                                                },
                                                pattern: {
                                                    value: /[A-Za-z]/,
                                                    message: "Mã khuyến mãi phải có kí tự là chữ"
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
                                                required: "Mã khuyến mãi không thể để trống",
                                                maxLength: {
                                                    value: 50,
                                                    message: "Mã khuyến mãi có chiều dài tối đa là 50 kí tự"
                                                },
                                                minLength: {
                                                    value: 6,
                                                    message: "Mã khuyến mãi có chiều dài  là 6 kí tự"
                                                },
                                                pattern: {
                                                    value: /[A-Za-z]/,
                                                    message: "Mã khuyến mãi phải có kí tự là chữ"
                                                }
                                            })
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider/>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Điều kiện
                            </Typography>
                            <RadioGroup aria-label="quiz" name="promotionOption" value={promotionOption}
                                        onChange={handleChange}>
                                <Grid spacing={3} container justify="space-around" alignItems="center">
                                    <Grid item xs={12} sm={6} md={6}>
                                        <FormControlLabel value="option1" control={<Radio color="primary"/>}
                                                          label="Giảm giá theo lượng sản phẩm"/>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <FormControlLabel value="option2" control={<Radio color="primary"/>}
                                                          label="Giảm giá theo giá trị đơn hàng"/>
                                    </Grid>
                                </Grid>
                            </RadioGroup>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Loại
                                    </Typography>
                                    <RadioGroup aria-label="quiz" name="type" value={type}
                                                onChange={handleChange}>
                                        <Grid spacing={1} container justify="space-around" alignItems="center">
                                            <Grid item xs={12} sm={6} md={4}>
                                                <FormControlLabel value="type1"
                                                                  control={<Radio style={{color: 'blue'}}/>}
                                                                  label="Giảm tiền"/>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <FormControlLabel value="type2"
                                                                  control={<Radio style={{color: 'blue'}}/>}
                                                                  label="Giảm % giá sản phẩm"/>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <FormControlLabel value="type3"
                                                                  control={<Radio style={{color: 'blue'}}/>}
                                                                  label="Quà"/>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <FormControlLabel value="type4"
                                                                  control={<Radio style={{color: 'blue'}}/>}
                                                                  label="Giảm tiền + quà"/>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <FormControlLabel value="type5"
                                                                  control={<Radio style={{color: 'blue'}}/>}
                                                                  label="Giảm % giá + quà"/>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <FormControlLabel value="type6"
                                                                  control={<Radio style={{color: 'blue'}}/>}
                                                                  label="Tặng sản phẩm"/>
                                            </Grid>
                                        </Grid>
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            {
                                promotionOption === "option1" ? (
                                    type === "type1" ? (
                                        <Card variant="outlined" style={{marginTop: '10px'}}>
                                            <List component="nav" aria-label="mailbox folders">
                                                {
                                                    promotionCodePercents.map((code, index) => (
                                                        <ListItem key={"type1_" + code.id} button>
                                                            <Grid spacing={1} container alignItems="center">
                                                                <Grid item xs={5} sm={5} md={5}>
                                                                    <TextField
                                                                        id="priceMinValue"
                                                                        name="priceMinValue"
                                                                        label="Số lượng sản phẩm"
                                                                        placeholder=""
                                                                        type="number"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        helperText={errors.priceMinValue?.message}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        style={{width: '100%'}}
                                                                        error={!!errors.priceMinValue}
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
                                                                        type="number"
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
                                                                                    <IconButton color="secondary"
                                                                                                component="span"
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
                                        </Card>
                                    ) : type === "type2" ? (
                                        <Card variant="outlined" style={{marginTop: '10px'}}>
                                            <List component="nav" aria-label="mailbox folders">
                                                {
                                                    promotionCodePercents.map((code, index) => (
                                                        <ListItem key={"type2_" + code.id} button>
                                                            <Grid spacing={1} container alignItems="center">
                                                                <Grid item xs={4} sm={4} md={4}>
                                                                    <TextField
                                                                        id="priceMinValue"
                                                                        name="priceMinValue"
                                                                        label="Số lượng sản phẩm"
                                                                        placeholder=""
                                                                        type="number"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        helperText={errors.priceMinValue?.message}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        style={{width: '100%'}}
                                                                        error={!!errors.priceMinValue}
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
                                                                <Grid item xs={4} sm={4} md={4}>
                                                                    <TextField
                                                                        id="code"
                                                                        name="code"
                                                                        type="number"
                                                                        label="Số tiền giảm tối đa"
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
                                                                                    <IconButton color="secondary"
                                                                                                component="span"
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
                                        </Card>
                                    ) : type === "type3" ? (
                                        <Card variant="outlined" style={{marginTop: '10px'}}>
                                            <div>
                                                <ButtonGroup color="primary" size="small"
                                                             aria-label="contained primary button group"
                                                             className={styles.btnDialog}
                                                             onClick={handleClickOpen}
                                                >
                                                    <Button variant="contained" color="primary">Thêm quà</Button>
                                                </ButtonGroup>
                                                <TableContainer component={Paper}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="left">Hình ảnh</TableCell>
                                                                <TableCell align="left">Tên quà</TableCell>
                                                                <TableCell align="left">Số lượng</TableCell>
                                                                <TableCell align="center">Thao tác</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    </Table>
                                                </TableContainer>
                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"
                                                >
                                                    <DialogTitle id="alert-dialog-title">{"Chọn quà"}</DialogTitle>
                                                    <DialogContent>
                                                        <Paper component="form" className={styles.search}
                                                               style={{marginBottom: '10px'}}>
                                                            <InputBase
                                                                id="q"
                                                                name="q"
                                                                className={styles.input}
                                                                onChange={handleChange}
                                                                inputRef={register}
                                                                placeholder="Tìm kiếm quà"
                                                                inputProps={{'aria-label': 'Tìm kiếm quà'}}
                                                            />
                                                            <IconButton className={styles.iconButton} aria-label="search">
                                                                <SearchIcon/>
                                                            </IconButton>
                                                        </Paper>
                                                        <TableContainer component={Paper}>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell align="left">Hình ảnh</TableCell>
                                                                        <TableCell align="left">Tên quà</TableCell>
                                                                        <TableCell align="left" style={{width: '25%'}}>Số
                                                                            lượng</TableCell>
                                                                        <TableCell align="center">Thao tác</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </Table>
                                                        </TableContainer>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose} color="secondary">
                                                            Hủy
                                                        </Button>
                                                        <Button onClick={handleClose} color="primary" autoFocus>
                                                            Thêm
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>
                                        </Card>
                                    ) : type === "type4" ? (
                                        <div>
                                            <Card variant="outlined" style={{marginTop: '10px'}}>
                                                <List component="nav" aria-label="mailbox folders">
                                                    {
                                                        promotionCodeDefaults.map((code, index) => (
                                                            <ListItem key={code.id} button>
                                                                <Grid spacing={1} container alignItems="center">
                                                                    <Grid item xs={5} sm={5} md={5}>
                                                                        <TextField
                                                                            id="priceMinValue"
                                                                            name="priceMinValue"
                                                                            label="Số lượng sản phẩm"
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
                                                                                        <IconButton color="secondary"
                                                                                                    component="span"
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
                                            </Card>
                                            <Card variant="outlined" style={{marginTop: '4px'}}>
                                                <ButtonGroup color="primary" size="small"
                                                             aria-label="contained primary button group"
                                                             className={styles.btnDialog}
                                                             onClick={handleClickOpen}
                                                >
                                                    <Button variant="contained" color="primary">Thêm quà</Button>
                                                </ButtonGroup>
                                                <TableContainer component={Paper}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="left">Hình ảnh</TableCell>
                                                                <TableCell align="left">Tên quà</TableCell>
                                                                <TableCell align="left">Số lượng</TableCell>
                                                                <TableCell align="center">Thao tác</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    </Table>
                                                </TableContainer>
                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"
                                                >
                                                    <DialogTitle id="alert-dialog-title">{"Chọn quà"}</DialogTitle>
                                                    <DialogContent>
                                                        <Paper component="form" className={styles.search}
                                                               style={{marginBottom: '10px'}}>
                                                            <InputBase
                                                                id="q"
                                                                name="q"
                                                                className={styles.input}
                                                                onChange={handleChange}
                                                                inputRef={register}
                                                                placeholder="Tìm kiếm quà"
                                                                inputProps={{'aria-label': 'Tìm kiếm quà'}}
                                                            />
                                                            <IconButton className={styles.iconButton}
                                                                        aria-label="search">
                                                                <SearchIcon/>
                                                            </IconButton>
                                                        </Paper>
                                                        <TableContainer component={Paper}>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell align="left">Hình ảnh</TableCell>
                                                                        <TableCell align="left">Tên quà</TableCell>
                                                                        <TableCell align="left" style={{width: '25%'}}>Số
                                                                            lượng</TableCell>
                                                                        <TableCell align="center">Thao tác</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </Table>
                                                        </TableContainer>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose} color="secondary">
                                                            Hủy
                                                        </Button>
                                                        <Button onClick={handleClose} color="primary" autoFocus>
                                                            Thêm
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </Card>
                                        </div>
                                    ) : type === "type5" ? (
                                        <div>
                                            <Card variant="outlined" style={{marginTop: '10px'}}>
                                                <List component="nav" aria-label="mailbox folders">
                                                    {
                                                        promotionCodePercents.map((code, index) => (
                                                            <ListItem key={"type2_" + code.id} button>
                                                                <Grid spacing={1} container alignItems="center">
                                                                    <Grid item xs={4} sm={4} md={4}>
                                                                        <TextField
                                                                            id="priceMinValue"
                                                                            name="priceMinValue"
                                                                            label="Số lượng sản phẩm"
                                                                            placeholder=""
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            helperText={errors.priceMinValue?.message}
                                                                            InputLabelProps={{
                                                                                shrink: true,
                                                                            }}
                                                                            style={{width: '100%'}}
                                                                            error={!!errors.priceMinValue}
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
                                                                    <Grid item xs={4} sm={4} md={4}>
                                                                        <TextField
                                                                            id="code"
                                                                            name="code"
                                                                            type="number"
                                                                            label="Số tiền giảm tối đa"
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
                                                                                        <IconButton color="secondary"
                                                                                                    component="span"
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
                                            </Card>
                                            <Card variant="outlined" style={{marginTop: '4px'}}>
                                                <ButtonGroup color="primary" size="small"
                                                             aria-label="contained primary button group"
                                                             className={styles.btnDialog}
                                                             onClick={handleClickOpen}
                                                >
                                                    <Button variant="contained" color="primary">Thêm quà</Button>
                                                </ButtonGroup>
                                                <TableContainer component={Paper}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="left">Hình ảnh</TableCell>
                                                                <TableCell align="left">Tên quà</TableCell>
                                                                <TableCell align="left">Số lượng</TableCell>
                                                                <TableCell align="center">Thao tác</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    </Table>
                                                </TableContainer>
                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"
                                                >
                                                    <DialogTitle id="alert-dialog-title">{"Chọn quà"}</DialogTitle>
                                                    <DialogContent>
                                                        <Paper component="form" className={styles.search}
                                                               style={{marginBottom: '10px'}}>
                                                            <InputBase
                                                                id="q"
                                                                name="q"
                                                                className={styles.input}
                                                                onChange={handleChange}
                                                                inputRef={register}
                                                                placeholder="Tìm kiếm quà"
                                                                inputProps={{'aria-label': 'Tìm kiếm quà'}}
                                                            />
                                                            <IconButton className={styles.iconButton}
                                                                        aria-label="search">
                                                                <SearchIcon/>
                                                            </IconButton>
                                                        </Paper>
                                                        <TableContainer component={Paper}>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell align="left">Hình ảnh</TableCell>
                                                                        <TableCell align="left">Tên quà</TableCell>
                                                                        <TableCell align="left" style={{width: '25%'}}>Số
                                                                            lượng</TableCell>
                                                                        <TableCell align="center">Thao tác</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </Table>
                                                        </TableContainer>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose} color="secondary">
                                                            Hủy
                                                        </Button>
                                                        <Button onClick={handleClose} color="primary" autoFocus>
                                                            Thêm
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </Card>
                                        </div>
                                    ) : type === "type6" ? (
                                        <Card variant="outlined" style={{marginTop: '10px'}}>
                                            <div>
                                                <ButtonGroup color="primary" size="small"
                                                             aria-label="contained primary button group"
                                                             className={styles.btnDialog}
                                                             onClick={handleClickOpen}
                                                >
                                                    <Button variant="contained" size="small"  color="primary">Thêm sản phẩm</Button>
                                                </ButtonGroup>
                                                <TableContainer component={Paper}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="left">Hình ảnh</TableCell>
                                                                <TableCell align="left">Tên sản phẩm</TableCell>
                                                                <TableCell align="left">Số lượng</TableCell>
                                                                <TableCell align="left">Đơn vị</TableCell>
                                                                <TableCell align="center">Thao tác</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableRow>
                                                            <TableCell align="left">png</TableCell>
                                                            <TableCell align="left">Khẩu trang</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="left">Hộp</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">png</TableCell>
                                                            <TableCell align="left">Khẩu trang</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="left">Hộp</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">png</TableCell>
                                                            <TableCell align="left">Khẩu trang</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="left">Hộp</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    </Table>
                                                </TableContainer>
                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"
                                                >
                                                    <DialogTitle id="alert-dialog-title">{"Chọn sản phẩm"}</DialogTitle>
                                                    <DialogContent>
                                                        <Paper component="form" className={styles.search}
                                                               style={{marginBottom: '10px'}}>
                                                            <InputBase
                                                                id="q"
                                                                name="q"
                                                                className={styles.input}
                                                                onChange={handleChange}
                                                                inputRef={register}
                                                                placeholder="Tìm kiếm sản phẩm"
                                                                inputProps={{'aria-label': 'Tìm kiếm sản phẩm'}}
                                                            />
                                                            <IconButton className={styles.iconButton} aria-label="search">
                                                                <SearchIcon/>
                                                            </IconButton>
                                                        </Paper>
                                                        <TableContainer component={Paper}>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell align="left">Hình ảnh</TableCell>
                                                                        <TableCell align="left">Tên sản phẩm</TableCell>
                                                                        <TableCell align="left">Đơn vị</TableCell>
                                                                        <TableCell align="left" style={{width: '25%'}}>Số
                                                                            lượng</TableCell>
                                                                        <TableCell align="center">Thao tác</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableRow>
                                                                    <TableCell align="left">png</TableCell>
                                                                    <TableCell align="left">Khẩu trang</TableCell>
                                                                    <TableCell align="left">Hộp</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">png</TableCell>
                                                                    <TableCell align="left">Khẩu trang</TableCell>
                                                                    <TableCell align="left">Hộp</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">png</TableCell>
                                                                    <TableCell align="left">Khẩu trang</TableCell>
                                                                    <TableCell align="left">Hộp</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </Table>
                                                        </TableContainer>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose} color="secondary">
                                                            Hủy
                                                        </Button>
                                                        <Button onClick={handleClose} color="primary" autoFocus>
                                                            Thêm
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>
                                        </Card>
                                    ): (
                                        <div/>
                                    )
                                ) : (
                                    type === "type1" ? (
                                        <Card variant="outlined" style={{marginTop: '10px'}}>
                                            <List component="nav" aria-label="mailbox folders">
                                                {
                                                    promotionCodePercents.map((code, index) => (
                                                        <ListItem key={"type1_" + code.id} button>
                                                            <Grid spacing={1} container alignItems="center">
                                                                <Grid item xs={5} sm={5} md={5}>
                                                                    <TextField
                                                                        id="priceMinValue"
                                                                        name="priceMinValue"
                                                                        label="Giá trị đơn hàng"
                                                                        placeholder=""
                                                                        type="number"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        helperText={errors.priceMinValue?.message}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        style={{width: '100%'}}
                                                                        error={!!errors.priceMinValue}
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
                                                                        type="number"
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
                                                                                    <IconButton color="secondary"
                                                                                                component="span"
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
                                        </Card>
                                    ) : type === "type2" ? (
                                        <Card variant="outlined" style={{marginTop: '10px'}}>
                                            <List component="nav" aria-label="mailbox folders">
                                                {
                                                    promotionCodePercents.map((code, index) => (
                                                        <ListItem key={"type2_" + code.id} button>
                                                            <Grid spacing={1} container alignItems="center">
                                                                <Grid item xs={4} sm={4} md={4}>
                                                                    <TextField
                                                                        id="priceMinValue"
                                                                        name="priceMinValue"
                                                                        label="Giá trị đơn hàng"
                                                                        placeholder=""
                                                                        type="number"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        helperText={errors.priceMinValue?.message}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        style={{width: '100%'}}
                                                                        error={!!errors.priceMinValue}
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
                                                                <Grid item xs={4} sm={4} md={4}>
                                                                    <TextField
                                                                        id="code"
                                                                        name="code"
                                                                        type="number"
                                                                        label="Số tiền giảm tối đa"
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
                                                                                    <IconButton color="secondary"
                                                                                                component="span"
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
                                        </Card>
                                    ) : type === "type3" ? (
                                        <Card variant="outlined" style={{marginTop: '10px'}}>
                                            <div>
                                                <ButtonGroup color="primary" size="small"
                                                             aria-label="contained primary button group"
                                                             className={styles.btnDialog}
                                                             onClick={handleClickOpen}
                                                >
                                                    <Button variant="contained" color="primary">Thêm quà</Button>
                                                </ButtonGroup>
                                                <TableContainer component={Paper}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="left">Hình ảnh</TableCell>
                                                                <TableCell align="left">Tên quà</TableCell>
                                                                <TableCell align="left">Số lượng</TableCell>
                                                                <TableCell align="center">Thao tác</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    </Table>
                                                </TableContainer>
                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"
                                                >
                                                    <DialogTitle id="alert-dialog-title">{"Chọn quà"}</DialogTitle>
                                                    <DialogContent>
                                                        <Paper component="form" className={styles.search}
                                                               style={{marginBottom: '10px'}}>
                                                            <InputBase
                                                                id="q"
                                                                name="q"
                                                                className={styles.input}
                                                                onChange={handleChange}
                                                                inputRef={register}
                                                                placeholder="Tìm kiếm quà"
                                                                inputProps={{'aria-label': 'Tìm kiếm quà'}}
                                                            />
                                                            <IconButton className={styles.iconButton} aria-label="search">
                                                                <SearchIcon/>
                                                            </IconButton>
                                                        </Paper>
                                                        <TableContainer component={Paper}>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell align="left">Hình ảnh</TableCell>
                                                                        <TableCell align="left">Tên quà</TableCell>
                                                                        <TableCell align="left" style={{width: '25%'}}>Số
                                                                            lượng</TableCell>
                                                                        <TableCell align="center">Thao tác</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </Table>
                                                        </TableContainer>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose} color="secondary">
                                                            Hủy
                                                        </Button>
                                                        <Button onClick={handleClose} color="primary" autoFocus>
                                                            Thêm
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>
                                        </Card>
                                    ) : type === "type4" ? (
                                        <div>
                                            <Card variant="outlined" style={{marginTop: '10px'}}>
                                                <List component="nav" aria-label="mailbox folders">
                                                    {
                                                        promotionCodeDefaults.map((code, index) => (
                                                            <ListItem key={code.id} button>
                                                                <Grid spacing={1} container alignItems="center">
                                                                    <Grid item xs={5} sm={5} md={5}>
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
                                                                                        <IconButton color="secondary"
                                                                                                    component="span"
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
                                            </Card>
                                            <Card variant="outlined" style={{marginTop: '4px'}}>
                                                <ButtonGroup color="primary" size="small"
                                                             aria-label="contained primary button group"
                                                             className={styles.btnDialog}
                                                             onClick={handleClickOpen}
                                                >
                                                    <Button variant="contained" color="primary">Thêm quà</Button>
                                                </ButtonGroup>
                                                <TableContainer component={Paper}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="left">Hình ảnh</TableCell>
                                                                <TableCell align="left">Tên quà</TableCell>
                                                                <TableCell align="left">Số lượng</TableCell>
                                                                <TableCell align="center">Thao tác</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    </Table>
                                                </TableContainer>
                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"
                                                >
                                                    <DialogTitle id="alert-dialog-title">{"Chọn quà"}</DialogTitle>
                                                    <DialogContent>
                                                        <Paper component="form" className={styles.search}
                                                               style={{marginBottom: '10px'}}>
                                                            <InputBase
                                                                id="q"
                                                                name="q"
                                                                className={styles.input}
                                                                onChange={handleChange}
                                                                inputRef={register}
                                                                placeholder="Tìm kiếm quà"
                                                                inputProps={{'aria-label': 'Tìm kiếm quà'}}
                                                            />
                                                            <IconButton className={styles.iconButton}
                                                                        aria-label="search">
                                                                <SearchIcon/>
                                                            </IconButton>
                                                        </Paper>
                                                        <TableContainer component={Paper}>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell align="left">Hình ảnh</TableCell>
                                                                        <TableCell align="left">Tên quà</TableCell>
                                                                        <TableCell align="left" style={{width: '25%'}}>Số
                                                                            lượng</TableCell>
                                                                        <TableCell align="center">Thao tác</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </Table>
                                                        </TableContainer>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose} color="secondary">
                                                            Hủy
                                                        </Button>
                                                        <Button onClick={handleClose} color="primary" autoFocus>
                                                            Thêm
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </Card>
                                        </div>
                                    ) : type === "type5" ? (
                                        <div>
                                            <Card variant="outlined" style={{marginTop: '10px'}}>
                                                <List component="nav" aria-label="mailbox folders">
                                                    {
                                                        promotionCodePercents.map((code, index) => (
                                                            <ListItem key={"type2_" + code.id} button>
                                                                <Grid spacing={1} container alignItems="center">
                                                                    <Grid item xs={4} sm={4} md={4}>
                                                                        <TextField
                                                                            id="priceMinValue"
                                                                            name="priceMinValue"
                                                                            label="Giá trị đơn hàng"
                                                                            placeholder=""
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            helperText={errors.priceMinValue?.message}
                                                                            InputLabelProps={{
                                                                                shrink: true,
                                                                            }}
                                                                            style={{width: '100%'}}
                                                                            error={!!errors.priceMinValue}
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
                                                                    <Grid item xs={4} sm={4} md={4}>
                                                                        <TextField
                                                                            id="code"
                                                                            name="code"
                                                                            type="number"
                                                                            label="Số tiền giảm tối đa"
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
                                                                                        <IconButton color="secondary"
                                                                                                    component="span"
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
                                            </Card>
                                            <Card variant="outlined" style={{marginTop: '4px'}}>
                                                <ButtonGroup color="primary" size="small"
                                                             aria-label="contained primary button group"
                                                             className={styles.btnDialog}
                                                             onClick={handleClickOpen}
                                                >
                                                    <Button variant="contained" color="primary">Thêm quà</Button>
                                                </ButtonGroup>
                                                <TableContainer component={Paper}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="left">Hình ảnh</TableCell>
                                                                <TableCell align="left">Tên quà</TableCell>
                                                                <TableCell align="left">Số lượng</TableCell>
                                                                <TableCell align="center">Thao tác</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">Balo</TableCell>
                                                            <TableCell align="left">Ảnh</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    </Table>
                                                </TableContainer>
                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"
                                                >
                                                    <DialogTitle id="alert-dialog-title">{"Chọn quà"}</DialogTitle>
                                                    <DialogContent>
                                                        <Paper component="form" className={styles.search}
                                                               style={{marginBottom: '10px'}}>
                                                            <InputBase
                                                                id="q"
                                                                name="q"
                                                                className={styles.input}
                                                                onChange={handleChange}
                                                                inputRef={register}
                                                                placeholder="Tìm kiếm quà"
                                                                inputProps={{'aria-label': 'Tìm kiếm quà'}}
                                                            />
                                                            <IconButton className={styles.iconButton}
                                                                        aria-label="search">
                                                                <SearchIcon/>
                                                            </IconButton>
                                                        </Paper>
                                                        <TableContainer component={Paper}>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell align="left">Hình ảnh</TableCell>
                                                                        <TableCell align="left">Tên quà</TableCell>
                                                                        <TableCell align="left" style={{width: '25%'}}>Số
                                                                            lượng</TableCell>
                                                                        <TableCell align="center">Thao tác</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">Balo</TableCell>
                                                                    <TableCell align="left">Ảnh</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </Table>
                                                        </TableContainer>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose} color="secondary">
                                                            Hủy
                                                        </Button>
                                                        <Button onClick={handleClose} color="primary" autoFocus>
                                                            Thêm
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </Card>
                                        </div>
                                    ) : type === "type6" ? (
                                        <Card variant="outlined" style={{marginTop: '10px'}}>
                                            <div>
                                                <ButtonGroup color="primary" size="small"
                                                             aria-label="contained primary button group"
                                                             className={styles.btnDialog}
                                                             onClick={handleClickOpen}
                                                >
                                                    <Button variant="contained" size="small"  color="primary">Thêm sản phẩm</Button>
                                                </ButtonGroup>
                                                <TableContainer component={Paper}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="left">Hình ảnh</TableCell>
                                                                <TableCell align="left">Tên sản phẩm</TableCell>
                                                                <TableCell align="left">Số lượng</TableCell>
                                                                <TableCell align="left">Đơn vị</TableCell>
                                                                <TableCell align="center">Thao tác</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableRow>
                                                            <TableCell align="left">png</TableCell>
                                                            <TableCell align="left">Khẩu trang</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="left">Hộp</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">png</TableCell>
                                                            <TableCell align="left">Khẩu trang</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="left">Hộp</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">png</TableCell>
                                                            <TableCell align="left">Khẩu trang</TableCell>
                                                            <TableCell align="left">12</TableCell>
                                                            <TableCell align="left">Hộp</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton color="secondary"
                                                                            component="span"
                                                                            onClick={() => handleRemoveCodePercent(code.id)}>
                                                                    <HighlightOffOutlinedIcon/>
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    </Table>
                                                </TableContainer>
                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"
                                                >
                                                    <DialogTitle id="alert-dialog-title">{"Chọn sản phẩm"}</DialogTitle>
                                                    <DialogContent>
                                                        <Paper component="form" className={styles.search}
                                                               style={{marginBottom: '10px'}}>
                                                            <InputBase
                                                                id="q"
                                                                name="q"
                                                                className={styles.input}
                                                                onChange={handleChange}
                                                                inputRef={register}
                                                                placeholder="Tìm kiếm sản phẩm"
                                                                inputProps={{'aria-label': 'Tìm kiếm sản phẩm'}}
                                                            />
                                                            <IconButton className={styles.iconButton} aria-label="search">
                                                                <SearchIcon/>
                                                            </IconButton>
                                                        </Paper>
                                                        <TableContainer component={Paper}>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell align="left">Hình ảnh</TableCell>
                                                                        <TableCell align="left">Tên sản phẩm</TableCell>
                                                                        <TableCell align="left">Đơn vị</TableCell>
                                                                        <TableCell align="left" style={{width: '25%'}}>Số
                                                                            lượng</TableCell>
                                                                        <TableCell align="center">Thao tác</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableRow>
                                                                    <TableCell align="left">png</TableCell>
                                                                    <TableCell align="left">Khẩu trang</TableCell>
                                                                    <TableCell align="left">Hộp</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">png</TableCell>
                                                                    <TableCell align="left">Khẩu trang</TableCell>
                                                                    <TableCell align="left">Hộp</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="left">png</TableCell>
                                                                    <TableCell align="left">Khẩu trang</TableCell>
                                                                    <TableCell align="left">Hộp</TableCell>
                                                                    <TableCell align="left">
                                                                        <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            style={{
                                                                                height: '40%'
                                                                            }}
                                                                            type="number"
                                                                            id="outlined-adornment-weight"
                                                                            aria-describedby="outlined-weight-helper-text"
                                                                            labelWidth={0}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <Checkbox style={{color: 'green'}}/>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </Table>
                                                        </TableContainer>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose} color="secondary">
                                                            Hủy
                                                        </Button>
                                                        <Button onClick={handleClose} color="primary" autoFocus>
                                                            Thêm
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                            </div>
                                        </Card>
                                    ): (
                                        <div/>
                                    )
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
                                            label="Tên khuyến mãi"
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
                                                    required: "Mã khuyến mãi không thể để trống",
                                                    maxLength: {
                                                        value: 50,
                                                        message: "Mã khuyến mãi có chiều dài tối đa là 50 kí tự"
                                                    },
                                                    minLength: {
                                                        value: 6,
                                                        message: "Mã khuyến mãi có chiều dài  là 6 kí tự"
                                                    },
                                                    pattern: {
                                                        value: /[A-Za-z]/,
                                                        message: "Mã khuyến mãi phải có kí tự là chữ"
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