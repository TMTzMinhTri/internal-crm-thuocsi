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
export const ConfirmDialog = ({ open, onConfirm, onClose }) => {
    const handleOk = () => {
        onConfirm();
        onClose();
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Cập nhật trạng thái phí dịch vụ</DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    Bạn có chắc muốn cập nhật trạng thái phí dịch vụ?
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
