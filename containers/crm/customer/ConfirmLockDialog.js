import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {Function} props.onConfirm
 * @param {Function} props.onClose
 */
export const ConfirmLockDialog = ({ open, onConfirm, onClose }) => {
    const handleOk = () => {
        onConfirm();
        onClose();
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Khóa tài khoản</DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    Bạn có chắc muốn khóa tài khoản này không?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="default"
                    onClick={() => onClose()}
                >
                    Đóng
                </Button>
                <Button variant="contained" color="primary" onClick={handleOk}>
                    Đồng ý
                </Button>
            </DialogActions>
        </Dialog>
    );
};
