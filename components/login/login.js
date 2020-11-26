import { Box, Button, Paper, TextField } from "@material-ui/core";
import Head from "next/head";
import styles from "./login.module.css"

export default function LoginForm(props) {
    return <div>
        <Head>Đăng nhập vào hệ thống nội bộ</Head>
        <Paper className={styles.loginForm}>
            <h1>Đăng nhập</h1>
            <form method="POST" action="/login">
                <input type="hidden" name="url" value={props.url} />
                <Box>
                    <TextField
                        id="username"
                        label="Tên tài khoản"
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        style={{ margin: 12, width: 280 }}
                        autoFocus={true}
                        name="username"
                    />
                </Box>
                <Box>
                    <TextField
                        id="password"
                        label="Mật khẩu"
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        style={{ margin: 12, width: 280 }}
                        name="password"
                        type="password"
                    />
                </Box>
                <Box>
                    <Button type="submit" variant="contained" color="primary" style={{ margin: 8 }}>Đăng nhập</Button>
                </Box>
            </form>
        </Paper>
    </div>
}
