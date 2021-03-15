import { doWithLoggedInUser, renderWithLoggedInUser } from "@thuocsi/nextjs-components/lib/login";
import AppHRM from "../../_layout";
import Head from "next/head";
import {
    Box, Button, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    TextField
} from "@material-ui/core";
import styles from "./account.module.css";
import { getAccountClient } from "client/account";
import React, { useEffect } from "react";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { MyCard, MyCardContent, MyCardHeader, MyCardActions } from "@thuocsi/nextjs-components/my-card/my-card";



export async function getServerSideProps(ctx) {
    return await doWithLoggedInUser(ctx, loadData)
}

export async function loadData(ctx) {
    let data = { props: {} }

    // load parameters
    let query = ctx.query

    // load data from backend API
    let reqs = []
    let accClient = getAccountClient(ctx, data)
    data.props.account = await accClient.getAccountByUsername(query.username)

    return data
}

export default function EditPage(props) {
    return renderWithLoggedInUser(props, renderEditPage)
}

export function renderEditPage(props) {

    if (!props.account || props.account.status != "OK") {
        return <NotFound></NotFound>
    }

    // setup
    let router = useRouter();
    let editObject = props.account?.data && props.account.data[0]
    const [openDialog, setOpenDialog] = React.useState(false);
    const [buttonLoading, setButtonLoading] = React.useState(false);
    let { error, success } = useToast();
    const { register, handleSubmit, errors, setError, reset, getValues, clearErrors } = useForm({
        defaultValues: editObject
    });

    // handle actions
    const onSave = async (data) => {
        if (buttonLoading) {
            return
        }
        setButtonLoading(true)

        // validation
        let validated = 0
        let acceptedChars = "0123456789@qwertyuiopasdfghjklzxcvbnm."

        data.username = data.username || editObject?.username
        switch (true) {
            case !data.username:
                setError("username", { message: "Yêu cầu điền tên tài khoản." })
                break;
            case data.username.length < 6:
                setError("username", { message: "Tên tài khoản tối thiểu 6 kí tự." })
                break;
            case data.username.length > 30:
                setError("username", { message: "Tên tài khoản tối đa 30 kí tự." })
                break;
            case data.username.indexOf(" ") >= 0:
                setError("username", { message: "Tên tài khoản không được chứa khoảng trắng." })
                break;
            default: {
                let lower = data.username.toLowerCase()
                for (let i = 0; i < lower.length; i++) {
                    if (acceptedChars.indexOf(lower[i]) < 0) {
                        setError("username", { message: "Tên tài khoản không được chứa kí tự đặc biệt." })
                        break
                    }
                }
                validated++
            }
        }

        switch (true) {
            case !data.fullname:
                setError("fullname", { message: "Yêu cầu điền họ tên." })
                break;
            case data.fullname.length < 6:
                setError("fullname", { message: "Họ tên tối thiểu 6 kí tự." })
                break;
            case data.fullname.length > 50:
                setError("fullname", { message: "Họ tên tối đa 50 kí tự." })
                break;
            default:
                validated++
        }
        switch (true) {
            case !data.phoneNumber:
                setError("phoneNumber", { message: "Yêu cầu điền số điện thoại." })
                break;
            case data.phoneNumber.length < 10:
                setError("phoneNumber", { message: "Số điện thoại phải có tối thiểu 10 số." })
                break;
            default:
                validated++
        }

        if (validated != 3) {
            setButtonLoading(false)
            return
        }


        let accClient = getAccountClient()
        data.username = data.username || editObject?.username
        let result = await accClient.updateCustomerAccount(data)
        setTimeout(() => {
            setButtonLoading(false)
        }, 500)

        if (result && result.status === "OK") {
            if (editObject) {
                success("Cập nhật thông tin tài khoản thành công!")
            } else {
                setOpenDialog(true)
            }

        } else {
            switch (result.errorCode) {
                case "ACCOUNT_EXISTED":
                    error(`Tên tài khoản ${data.username} đã tồn tại.`)
                    setError("username", { message: "Tài khoản đã tồn tại" })
                    break
                case "USERNAME_INVALID_CHAR":
                    error("Tên tài khoản không được chứa ký tự đặc biệt, trừ @")
                    setError("username", { message: "Tên tài khoản không được chứa ký tự đặc biệt" })
                    break
                case "EMAIL_EXISTED":
                    error("Email này đã tồn tại.")
                    setError("email", { message: "Email đã tồn tại" })
                    break
                case "EMAIL_DOMAIN_INVALID":
                    error("Email phải có tên miền là thuocsi.vn")
                    setError("email", { message: "Email yêu cầu tên miền thuocsi.vn" })
                    break
                case "PHONE_EXISTED":
                    error("Số điện thoại này đã tồn tại.")
                    setError("phoneNumber", { message: "Số điện thoại đã tồn tại" })
                    break
                case "DEPARTMENT_ROLE_REQUIRED":
                    error("Yêu cầu chọn phòng ban và chức vụ của nhân viên.")
                    break
                default:
                    error(result.errorCode + " " + result.message)
            }

        }
    }

    const closeAndContinue = async () => {
        setOpenDialog(false)
        reset()
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    let breadcrumb = [
        {
            name: "Khách hàng",
            link: "/crm/customer"
        },
        {
            name: "Tài khoản",
            link: "/crm/account"
        },
        {
            name: editObject ? "Cập nhật thông tin" : "Thêm" + " tài khoản",
        }
    ]
    return (
        <AppHRM select="/crm/account/edit"
            breadcrumb={breadcrumb}>
            <Head>
                <title >{editObject ? "Cập nhật thông tin" : "Thêm"}  tài khoản</title>
            </Head>
            <MyCard>
                <MyCardHeader
                    title={(editObject ? "Cập nhật thông tin" : "Thêm") + "  tài khoản"}
                >
                </MyCardHeader>
                <form onSubmit={handleSubmit(onSave)} noValidate>
                    <MyCardContent>
                        <Box>
                            <TextField
                                id="username"
                                label="Tên tài khoản"
                                name="username"
                                placeholder=""
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: 280 }}
                                defaultValue={editObject?.username || ""}
                                disabled={!!editObject}
                                inputRef={register}
                                helperText={errors.username?.message || "Dùng để đăng nhập vào hệ thống"}
                                error={!!errors.username?.message}
                                onFocus={() => { clearErrors("username") }}
                            />
                            <TextField
                                id="email"
                                name="email"
                                label="Email"
                                placeholder=""
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: 280 }}
                                defaultValue={editObject?.email || ""}
                                inputRef={register}
                                helperText={errors.email?.message || ""}
                                error={!!errors.email?.message}
                                onFocus={() => { clearErrors("email") }}
                            />
                        </Box>
                        <Box>
                            <TextField
                                id="fullname"
                                name="fullname"
                                label="Họ tên"
                                placeholder=""
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: 280 }}
                                defaultValue={editObject?.fullname || ""}
                                inputRef={register}
                                helperText={errors.fullname?.message || ""}
                                error={!!errors.fullname?.message}
                                onFocus={() => { clearErrors("fullname") }}
                            />
                            <TextField
                                id="phonenumber"
                                label="Số điện thoại"
                                name="phoneNumber"
                                placeholder=""
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                style={{ margin: 12, width: 280 }}
                                defaultValue={editObject?.phoneNumber || ""}
                                inputRef={register}
                                helperText={errors.phoneNumber?.message || ""}
                                error={!!errors.phoneNumber?.message}
                                onFocus={() => { clearErrors("phoneNumber") }}
                            />
                        </Box>
                    </MyCardContent>
                    <MyCardActions>
                        <Button
                            onClick={handleSubmit(onSave)}
                            variant="contained"
                            color="primary"
                            style={{ backgroundColor: buttonLoading && "gray", cursor: buttonLoading && "no-drop" }}>
                            {buttonLoading && <CircularProgress size={22} style={{ color: "white", marginRight: 7 }} />}
                            {editObject ? "Lưu thay đổi" : "Thêm tài khoản"}
                        </Button>
                    </MyCardActions>
                </form>
            </MyCard>
            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Thêm tài khoản thành công</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn muốn quay trở về danh sách tài khoản hay thêm mới tài khoản khác ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAndContinue} color="primary">
                        Tiếp tục thêm
                    </Button>
                    <Button onClick={() => {
                        router.push("/crm/account")
                    }} color="primary" autoFocus>
                        Về trang danh sách
                    </Button>
                </DialogActions>
            </Dialog>
        </AppHRM>
    )
}