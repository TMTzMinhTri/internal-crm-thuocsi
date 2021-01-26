import React, { useEffect, useState } from "react";
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
 * @param {string} props.q
 * @param {number} props.page
 * @param {number} props.limit
 * @param {number} props.total
 */
export default function DistrictTable(props) {
    const router = useRouter();
    const toast = useToast();
    const [tableData, setTableData] = useState(props.data);

    useEffect(() => {
        setTableData(props.data);
    }, [props.data]);

    const updateFee = async ({ code, fee }) => {
        try {
            const feeClient = getFeeClient();
            const res = await feeClient.updateDistrictFee(code, fee);
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
                    <TableCell>Mã quận huyện</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Cấp</TableCell>
                    <TableCell>Mã tỉnh thành</TableCell>
                    <TableCell>Giá trị tính phí</TableCell>
                </TableHead>
                <TableBody>
                    {!tableData?.length && (
                        <TableRow>
                            <TableCell colSpan={3} align="left">{props.message}</TableCell>
                        </TableRow>
                    )}
                    {tableData?.map(row => (
                        <TableRow>
                            <TableCell>{row.code}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.level}</TableCell>
                            <TableCell>{row.provinceCode}</TableCell>
                            <TableFeeValueCell code={row.code} initialFee={row.feeValue} onUpdate={updateFee} />
                        </TableRow>
                    ))}
                </TableBody>
                <MyTablePagination
                    labelUnit="quận/huyện"
                    count={props.total}
                    rowsPerPage={props.limit}
                    page={props.page}
                    onChangePage={(_, page, rowsPerPage) => {
                        router.push(`/crm/pricing?v=${ViewType.DISTRICT}&page=${page}&limit=${rowsPerPage}&q=${props.q}`)
                    }}
                />
            </Table>

        </TableContainer>
    )
}
