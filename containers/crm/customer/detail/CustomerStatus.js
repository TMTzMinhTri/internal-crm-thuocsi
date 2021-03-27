import React from 'react'
import { Box, Button, Tooltip } from '@material-ui/core';
import { ConfirmActiveDialog } from 'containers/crm/customer/ConfirmActiveDialog';
import { getCustomerClient } from 'client/customer';
import { useToast } from '@thuocsi/nextjs-components/toast/useToast';

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
    },
    UNDEFINED: {
        label: "Không xác định",
        color: "grey"
    }
}

export default function CustomerStatus({ customer }) {

    const { error, success } = useToast();

    // state
    const [openActiveAccountDialog, setOpenActiveAccountDialog] = React.useState(false);
    const [customerStatus, setCustomerStatus] = React.useState(customer.status)

    React.useEffect(() => {

        if (!statusMap[customerStatus]) {
            setCustomerStatus("UNDEFINED")
        }

    }, [customerStatus])

    // handler
    async function activeAccount() {
        const _client = getCustomerClient();

        const resp = await _client.activeAccount({ code: customer.code, status: "ACTIVE" });
        if (resp.status !== "OK") {
            error(resp.message || 'Thao tác không thành công, vui lòng thử lại sau');
        } else {
            customer.status = "ACTIVE"
            setOpenActiveAccountDialog(false);
            success("Kích hoạt tài khoản thành công");
        }
    }

    // render
    return <Box>
        <Tooltip title={customerStatus == "INACTIVE" ? "Nhấn để kích hoạt khách hàng" : ""}>
            <Button
                disabled={customerStatus == "ACTIVE"}
                onClick={() => {
                    setOpenActiveAccountDialog(true);
                }}
                size="small"
                variant="outlined"
                style={{ color: statusMap[customerStatus].color, borderColor: statusMap[customerStatus].color }}
            >
                {statusMap[customerStatus].label}
            </Button>
        </Tooltip>
        {openActiveAccountDialog && <ConfirmActiveDialog
            open={true}
            onClose={() => setOpenActiveAccountDialog(false)}
            onConfirm={() => activeAccount()}
        />}
    </Box>
}