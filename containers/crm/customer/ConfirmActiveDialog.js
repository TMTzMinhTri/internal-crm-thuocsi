import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@material-ui/core";
import React from "react";

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {Function} props.onConfirm
 * @param {Function} props.onClose
 */
export const ConfirmActiveDialog = ({ open, onConfirm, onClose }) => {
    const handleOk = () => {
        onConfirm();
        onClose();
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Kích hoạt tài khoản</DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    Bạn có chắc muốn kích hoạt tài khoản này không?
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
