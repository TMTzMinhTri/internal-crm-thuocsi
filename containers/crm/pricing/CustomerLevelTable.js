import React, { useState } from "react";
import { useRouter } from "next/router";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";

import { ViewType } from ".";
import { TableFeeValueCell } from "./TableFeeValueCell";
import { getFeeClient } from "client/fee";

/**
 * @param {object} props
 * @param {object[]} props.data
 * @param {string} props.data[].code
 * @param {string} props.data[].name
 * @param {string} props.data[].decription
 * @param {string} props.data[].levelId
 * @param {string} props.data[].feeValue
 */
export default function DistrictTable({
    data = [],
    total = 0,
    page = 0,
    limit = 10,
    q,
    message,
}) {
    const router = useRouter();
    const toast = useToast();
    const [tableData, setTableData] = useState(data);

    const updateFee = async ({ code, fee }) => {
        try {
            const feeClient = getFeeClient();
            const res = await feeClient.updateCustomerLevelFee(code, fee);
            if (res.status === 'OK') {
                toast.success('Cập nhật giá trị tính phí thành công.');
                const data = [...tableData];
                data.find((v, i) => {
                    const found = v.code === code;
                    if (found) {
                        data[i].feeValue = fee;
                    }
                })
                setTableData(data);
            } else {
                toast.error(res.message ?? unknownErrorText);
            }
        } catch (err) {
            toast.error(err.message ?? unknownErrorText);
        }
    }

    return (
        <TableContainer>
            <Table>
                <colgroup>
                    <col width="20%"></col>
                    <col width="20%"></col>
                    <col width="20%"></col>
                    <col width="20%"></col>
                    <col width="20%"></col>
                </colgroup>
                <TableHead>
                    <TableCell>Mã hạng</TableCell>
                    <TableCell>Tên hạng</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>ID cấp</TableCell>
                    <TableCell>Giá trị tính phí</TableCell>
                </TableHead>
                <TableBody>
                    {!tableData.length && (
                        <TableRow>
                            <TableCell colSpan={3} align="left">{message}</TableCell>
                        </TableRow>
                    )}
                    {tableData.map(row => (
                        <TableRow>
                            <TableCell>{row.code}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.decription}</TableCell>
                            <TableCell>{row.levelId}</TableCell>
                            <TableFeeValueCell code={row.code} initialFee={row.feeValue} onUpdate={updateFee} />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </TableContainer>
    )
}
