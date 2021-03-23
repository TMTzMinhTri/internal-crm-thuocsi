import React from 'react'
import { Box, Button, Tooltip } from '@material-ui/core';
import { ConfirmActiveDialog } from 'containers/crm/customer/ConfirmActiveDialog';
import { getCustomerClient } from 'client/customer';

const statusMap = {
    ACTIVE: {
        value: "ACTIVE",
        label: "Đang hoạt động",
        color: "green"
    },
    INACTIVE: {
        value: "INACTIVE",
        label: "Chưa kích hoạt",
        color: "grey"
    }
}

export default function CustomerStatus({ status, customerCode }) {

    // setup display
    let statusInfo = statusMap[status]
    if (!statusInfo) {
        statusInfo = {
            label: "Không xác định",
            color: "grey"
        }
    }

    // state
    const [openActiveAccountDialog, setOpenActiveAccountDialog] = React.useState(false);
    const [activeCustomerCode, setActiveCustomerCode] = React.useState();

    // handler
    async function activeAccount() {
        const _client = getCustomerClient();

        const resp = await _client.activeAccount({ code: activeCustomerCode.code, status: "ACTIVE" });
        if (resp.status !== "OK") {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau');
        } else {
            setOpenActiveAccountDialog(false);
            props.data.filter(row => row.code === activeCustomerCode.code)[0].status = "ACTIVE";
            setActiveCustomerCode(null);
            success("Kích hoạt tài khoản thành công");
        }
    }

    // render
    return <Box>
        <Tooltip title={status == "INACTIVE" ? "Nhấn để kích hoạt khách hàng" : ""}>
            <Button
                disabled={status == "ACTIVE"}
                onClick={() => {
                    setOpenActiveAccountDialog(true);
                    setActiveCustomerCode(customerCode);
                }}
                size="small"
                variant="outlined"
                style={{ color: `${statusInfo.color}`, borderColor: `${statusInfo.color}` }}
            >
                {statusInfo.label}
            </Button>
        </Tooltip>
        {openActiveAccountDialog && <ConfirmActiveDialog
            open={openActiveAccountDialog}
            onClose={() => setOpenActiveAccountDialog(false)}
            onConfirm={() => activeAccount()}
        />}
    </Box>
}