import {
    Button,
    ButtonGroup,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import Head from "next/head";
import Link from "next/link";
import Router, {useRouter} from "next/router";
import AppCRM from "pages/_layout";
import {doWithLoggedInUser, renderWithLoggedInUser} from "@thuocsi/nextjs-components/lib/login";
import React, {useState} from "react";
import styles from "./promotion.module.css";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from '@material-ui/icons/Search';
import IconButton from "@material-ui/core/IconButton";
import {useForm} from "react-hook-form";
import {getPromoClient} from "../../../client/promo";
import {
    defaultPromotionStatus,
} from "../../../components/component/constant";
import {
    displayPromotionScope,
    displayPromotionType,
    displayRule,
    displayStatus,
    formatTime,
    getPromotionScope
} from "../../../components/component/until";
import Switch from "@material-ui/core/Switch";
import Modal from "@material-ui/core/Modal";
import {useToast} from "@thuocsi/nextjs-components/toast/useToast";

export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, (ctx) => {
        return loadPromoData(ctx)
    })
}

export async function loadPromoData(ctx) {
    // Fetch data from external API
    let returnObject = {props: {}}
    let query = ctx.query
    let page = query.page || 0
    let limit = query.limit || 20
    let offset = page * limit
    let promotionName = query.promotionName || ""

    let _promotionClient = getPromoClient(ctx,{})
    let getPromotionResponse = await _promotionClient.getPromotion(promotionName,limit,offset,true)
    if (getPromotionResponse && getPromotionResponse.status === "OK") {
        returnObject.props.data = getPromotionResponse.data
        returnObject.props.count = getPromotionResponse.total
    }

    // Pass data to the page via props
    return returnObject
}

export default function PromotionPage(props) {
    return renderWithLoggedInUser(props, render)
}

export function formatNumber(num) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

async function updatePromotion(promotionId,status) {
    return getPromoClient().updatePromotion({promotionId,status})
}

function render(props) {
    const toast = useToast()
    let router = useRouter()
    const {register, handleSubmit, errors} = useForm();
    let [search, setSearch] = useState('')
    let [open, setOpen] = useState({
        openModalCreate: false,
    })
    let q = router.query.q || ''

    const [page, setPage] = React.useState(parseInt(router.query.page || 0));
    const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(router.query.perPage) || 20);
    function searchPromotion(formData) {
        let promotionName = formData.promotionName
        Router.push({
            pathname: '/crm/promotion',
            query:{
                promontionName: promotionName,
            }
        })
    }

    const handleChangePage = (event, newPage, rowsPerPage) => {
        setPage(newPage)
        setRowsPerPage(rowsPerPage)

        router.push({
            pathname: '/crm/promotion',
            query: {
                ...router.query,
                limit: rowsPerPage,
                page: newPage,
                perPage: rowsPerPage,
                offset: newPage * rowsPerPage
            }
        })
    };

    const handleActivePromotion = async (event,promotionID) => {
        if (event.target.checked) {
            let promotionResponse = await updatePromotion(promotionID,defaultPromotionStatus.ACTIVE)
            if (!promotionResponse || promotionResponse.status !==  "OK") {
                return toast.error(promotionResponse.mesage)
            }else {
                props.data.forEach(d => {
                    if (d.promotionId === promotionID) {
                        return d.status = defaultPromotionStatus.ACTIVE
                    }
                })
                return toast.success('Cập nhật thành công')
            }
        }else {
            let promotionResponse = await updatePromotion(promotionID,defaultPromotionStatus.EXPIRED)
            if (!promotionResponse || promotionResponse.status !==  "OK") {
                return toast.error(promotionResponse.mesage)
            }else {
                props.data.forEach(d => {
                    if (d.promotionId === promotionID) {
                        return d.status = defaultPromotionStatus.EXPIRED
                    }
                })
                return toast.success('Cập nhật thành công')
            }
        }
    }

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

    return (
        <AppCRM select="/crm/promotion">
            <Head>
                <title>Danh sách khuyến mãi</title>
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
                                    id="promotionName"
                                    name="promotionName"
                                    className={styles.input}
                                    value={search}
                                    onChange={handleChange}
                                    inputRef={register}
                                    placeholder="Tìm kiếm khuyến mãi"
                                    inputProps={{'aria-label': 'Tìm kiếm khuyến mãi'}}
                                />
                                <IconButton className={styles.iconButton} aria-label="search"
                                            onClick={handleSubmit(onSearch)}>
                                    <SearchIcon/>
                                </IconButton>
                            </Paper>
                        </form>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                            <ButtonGroup color="primary" aria-label="contained primary button group"
                                         className={styles.rightGroup} onClick={() => setOpen({...open,openModalCreate: true})}>
                                <Button variant="contained" color="primary">Thêm khuyến mãi</Button>
                            </ButtonGroup>
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
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Tên</TableCell>
                            <TableCell align="left">Loại</TableCell>
                            <TableCell align="left">Áp dụng cho</TableCell>
                            <TableCell align="left">Chi tiết khuyến mãi</TableCell>
                            <TableCell align="left">Trạng Thái</TableCell>
                            <TableCell align="left">Đang chạy</TableCell>
                            <TableCell align="left">Thời gian</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    {props.data?.length > 0 ? (
                        <TableBody>
                            {props.data.map((row,index) => (
                                <TableRow key={index}>
                                    <TableCell align="left">{row.promotionName}</TableCell>
                                    <TableCell align="left">{displayPromotionType(row.promotionType)}</TableCell>
                                    <TableCell align="left">{getPromotionScope(row.objects)}</TableCell>
                                    <TableCell align="left">
                                        {
                                            displayRule(row.rule).length > 0 ? (
                                                displayRule(row.rule).map((rule,index) => (
                                                    index % 2 === 0 ?(
                                                        <div>{rule}</div>
                                                    ): (
                                                        <div style={{fontStyle: "italic"}}>{rule}</div>
                                                    )
                                            ))
                                            ): (
                                                <div></div>
                                            )
                                        }
                                    </TableCell>
                                    <TableCell align="left">{displayStatus(row.status)}</TableCell>
                                    <TableCell align="left">
                                        <Switch
                                            onChange={event => {handleActivePromotion(event,row.promotionId)}}
                                            checked={row.status  === "ACTIVE"? true : false}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell align="left">
                                        <div>Từ : {formatTime(row.startTime)}</div>
                                        <div>Đến : {formatTime(row.endTime)}</div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Link href={`/crm/promotion/edit?promotionId=${row.promotionId}`}>
                                            <ButtonGroup color="primary" aria-label="contained primary button group">
                                                <Button variant="contained" size="small" color="primary">Xem</Button>
                                            </ButtonGroup>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ): (
                        <div></div>
                    )}
                    {
                        props.count > 0 ? (
                            <MyTablePagination
                                labelUnit="khuyến mãi"
                                count={props.count}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                            />
                        ): (
                            <h3>Không tìm thấy danh sách chương trình khuyến mãi</h3>
                        )
                    }

                </Table>
            </TableContainer>

            <Modal open={open.openModalCreate} onClose={() => setOpen({...open,openModalCreate:  false})} className={styles.modal}>
                <div className={styles.modalBodyCreate}>
                    <h3 style={{textAlign: "center", marginBottom: "2rem"}}>
                        Chọn loại khuyến mãi cần tạo
                    </h3>
                    <div style={{margin: "auto"}}>
                        <ButtonGroup className={styles.buttonConfirm}>
                            <Link href={`/crm/promotion/create-code`}>
                                <Button  variant="contained" color="primary" onClick={() => setOpen({...open,openModalCreate: false})}>Tạo voucher Khuyến mãi</Button>
                            </Link>
                            <Link href={`/crm/promotion/new`}>
                                <Button className={styles.buttonConfirmRight} variant="contained" color="primary" onClick={() => setOpen({...open,openModalCreate: false})}>Tạo Combo khuyến mãi</Button>
                            </Link>
                        </ButtonGroup>
                    </div>
                </div>
            </Modal>
        </AppCRM>
    )
}
