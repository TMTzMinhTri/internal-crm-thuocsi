
import MuiSingleAuto from '@thuocsi/nextjs-components/muiauto/single';
import { getCustomerClient } from 'client/customer';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@material-ui/core';
import { useRouter } from 'next/router';

export function CustomerAutoSearch(props) {
    let router = useRouter()
    const filterForm = useForm({
        defaultValues: {

        },
        mode: "onChange"
    });

    const [customerOptions, setCustomerOptions] = React.useState([]);
    async function searchCustomer(q = "") {
        const customerClient = getCustomerClient();
        const customerResp = await customerClient.getCustomerByFilter({ q, limit: 10, offset: 0 });
        setCustomerOptions(customerResp.data?.map(({ name, code }) => ({ label: name, value: code })) ?? []);
    }

    return <Box style={{ marginBottom: 12 }}>
        <MuiSingleAuto
            name="customer"
            placeholder="Tìm kiếm khách hàng"
            onFieldChange={searchCustomer}
            options={customerOptions}
            onValueChange={(e) => {
                if (e && typeof e.value == "string") {
                    router.push(`/crm/customer/detail?customerCode=${e.value}`)
                }
            }}
            errors={filterForm.errors}
            control={filterForm.control}
        />
    </Box>
}