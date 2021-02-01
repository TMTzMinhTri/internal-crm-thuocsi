import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getFeeClient } from "client/fee";
import { unknownErrorText } from "components/commonErrors";
import React, { useEffect, useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { TableFeeValueCell } from "./TableFeeValueCell";

/**
 * @param {object} props
 * @param {object[]} props.data
 * @param {string} props.data[].code
 * @param {string} props.data[].name
 * @param {string} props.data[].decription
 * @param {string} props.data[].levelId
 * @param {string} props.data[].feeValue
 */
export const CustomerLevelTable = (props) => {
    const toast = useToast();
    const [tableData, setTableData] = useState(props.data);
    const [openModal, setOpenModal] = useState(false);
    const [currentEditValue, setCurrentEditValue] = useState(null);

    useEffect(() => {
        setTableData(props.data);
    }, [props.data]);

    const updateFee = async () => {
        try {
            const { code, fee } = currentEditValue;
            const feeClient = getFeeClient();
            const res = await feeClient.updateCustomerLevelFee(code, fee);
            if (res.status === "OK") {
                toast.success("Cập nhật giá trị tính phí thành công.");
                const data = [...tableData];
                data.find((v, i) => {
                    const found = v.code === code;
                    if (found) {
                        data[i].feeValue = fee;
                    }
                });
                setTableData(data);
                setCurrentEditValue(null);
            } else {
                toast.error(res.message ?? unknownErrorText);
            }
        } catch (err) {
            toast.error(err.message ?? unknownErrorText);
        }
    };

    return (
        <>
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
                        <TableCell>Level</TableCell>
                        <TableCell>Giá trị tính phí</TableCell>
                    </TableHead>
                    <TableBody>
                        {!tableData?.length && (
                            <TableRow>
                                <TableCell colSpan={5} align="left">
                                    {props.message}
                                </TableCell>
                            </TableRow>
                        )}
                        {tableData?.map((row, i) => (
                            <TableRow key={`tr_${i}`}>
                                <TableCell>{row.code}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.decription}</TableCell>
                                <TableCell>{row.levelId}</TableCell>
                                <TableFeeValueCell
                                    code={row.code}
                                    initialFee={row.feeValue}
                                    onUpdate={(values) => {
                                        setCurrentEditValue(values);
                                        setOpenModal(true);
                                    }}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ConfirmDialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={() => updateFee()}
            />
        </>
    );
};
