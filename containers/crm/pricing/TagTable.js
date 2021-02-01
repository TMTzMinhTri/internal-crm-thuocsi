import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { useRouter } from "next/router";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";

import { ViewType } from ".";
import { TableFeeValueCell } from "./TableFeeValueCell";
import { getFeeClient } from "client/fee";
import { ConfirmDialog } from "./ConfirmDialog";
import { unknownErrorText } from "components/commonErrors";

/**
 * @param {object} props
 * @param {object[]} props.data
 * @param {string} props.data[].code
 * @param {string} props.data[].name
 * @param {string} props.data[].priority
 * @param {string} props.data[].style
 * @param {string} props.data[].description
 * @param {string} props.data[].feeValue
 * @param {string} props.q
 * @param {number} props.page
 * @param {number} props.limit
 * @param {number} props.total
 */
export const TagTable = (props) => {
    const router = useRouter();
    const toast = useToast();
    const [tableData, setTableData] = useState(props.data);
    const [openModal, setOpenModal] = useState(false);
    const [currentEditValue, setCurrentEditValue] = useState(null);

    useEffect(() => {
        setTableData(props.data);
    }, [props.data])

    const updateFee = async () => {
        try {
            const { code, fee } = currentEditValue;
            const feeClient = getFeeClient();
            const res = await feeClient.updateTagFee(code, fee);
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
                    <col width="16%"></col>
                    <col width="16%"></col>
                    <col width="16%"></col>
                    <col width="16%"></col>
                    <col width="16%"></col>
                    <col width="20%"></col>
                </colgroup>
                <TableHead>
                    <TableCell>Mã Tag</TableCell>
                    <TableCell>Tên Tag</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>style</TableCell>
                    <TableCell>Giá trị tính phí</TableCell>
                </TableHead>
                <TableBody>
                    {!tableData?.length && (
                        <TableRow>
                            <TableCell colSpan={3} align="left">{props.message}</TableCell>
                        </TableRow>
                    )}
                    {tableData?.map((row, i) => (
                        <TableRow key={`tr_${i}`}>
                            <TableCell>{row.code}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>{row.style}</TableCell>
                            <TableFeeValueCell
                                code={row.code}
                                initialFee={row.feeValue}
                                onUpdate={(values) => {
                                    setCurrentEditValue(values);
                                    setOpenModal(true);
                                }} />
                        </TableRow>
                    ))}
                </TableBody>
                <MyTablePagination
                    labelUnit="phường/xã"
                    count={props.total}
                    rowsPerPage={props.limit}
                    page={props.page}
                    onChangePage={(_, page, rowsPerPage) => {
                        router.push(`/crm/pricing?v=${ViewType.WARD}&page=${page}&limit=${rowsPerPage}&q=${props.q}`)
                    }}
                />
            </Table>
            <ConfirmDialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={() => updateFee()}
            />
        </TableContainer>
    )
}
