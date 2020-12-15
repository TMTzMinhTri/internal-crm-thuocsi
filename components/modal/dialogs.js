import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";

const ModalCustom = ({
                children,
                name,
                title,
                open,
                onClose,
                onExcute,
                closeText,
                primaryText,
            }) => {

    if(typeof(primaryText) === 'undefined' || primaryText==="") {
        primaryText = "Lưu"
    }
    function handleClose() {
        // TODO
    }

    function handleBtnClose() {
        onClose(false);
        handleClose();
    }

    function handleExcute(data) {
        onExcute(data)
    }

    return (
        <div>
            <Dialog open={open} scroll="body" fullWidth={true}>
                <DialogTitle id={name+"-dialog-title"} onClose={handleClose}>
                    {title}
                </DialogTitle>
                <DialogContent dividers>
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleBtnClose}>
                        Đóng
                    </Button>
                    <Button autoFocus onClick={handleExcute} color="primary">
                        {primaryText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ModalCustom;