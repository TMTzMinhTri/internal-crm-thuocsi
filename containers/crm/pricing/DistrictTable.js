import React from "react";
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
 * @param {string} props.data[].level
 * @param {string} props.data[].provinceCode
 * @param {string} props.data[].provinceName
 * @param {string} props.data[].regionCode
 * @param {string} props.data[].regionName
 * @param {string} props.data[].feeValue
 * @param {string} q
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

    const updateFee = async ({ code, fee }) => {
        try {
            const feeClient = getFeeClient();
            const res = await feeClient.updateCustomerLevelFee(code, fee);
            if (res.status === 'OK') {
                toast.success(res.message ?? 'Cập nhật giá trị tính phí thành công.');
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
                    <TableCell>Mã quận huyện</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Cấp</TableCell>
                    <TableCell>Mã tỉnh thành</TableCell>
                    <TableCell>Giá trị tính phí</TableCell>
                </TableHead>
                <TableBody>
                    {!data.length && (
                        <TableRow>
                            <TableCell colSpan={3} align="left">{message}</TableCell>
                        </TableRow>
                    )}
                    {data.map(row => (
                        <TableRow>
                            <TableCell>{row.code}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.level}</TableCell>
                            <TableCell>{row.provinceCode}</TableCell>
                            <TableFeeValueCell initialFee={row.feeValue} onUpdate={updateFee} />
                        </TableRow>
                    ))}
                </TableBody>
                <MyTablePagination
                    labelUnit="quận/huyện"
                    count={total}
                    rowsPerPage={limit}
                    page={page}
                    onChangePage={(_, page, rowsPerPage) => {
                        router.push(`/crm/pricing?v=${ViewType.DISTRICT}&page=${page}&limit=${rowsPerPage}&q=${q}`)
                    }}
                />
            </Table>

        </TableContainer>
    )
}
