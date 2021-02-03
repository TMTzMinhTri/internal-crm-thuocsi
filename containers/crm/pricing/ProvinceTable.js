import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { useRouter } from "next/router";
import { ViewType } from "./enum";
import { TableFeeValueCell } from "./TableFeeValueCell";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getFeeClient } from "client/fee";
import { ConfirmDialog } from "./ConfirmDialog";
import { unknownErrorText } from "components/commonErrors";

/**
 * @param {object} props
 * @param {object[]} props.data
 * @param {string} props.data[].code
 * @param {string} props.data[].name
 * @param {string} props.data[].level
 * @param {string} props.data[].feeValue
 * @param {string} props.q
 * @param {number} props.page
 * @param {number} props.limit
 * @param {number} props.total
 */
export const ProvinceTable = (props) => {
    const router = useRouter();
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
            const res = await feeClient.updateProvinceFee(code, fee);
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
            } else {
                toast.error(res.message ?? unknownErrorText);
            }
        } catch (err) {
            toast.error(err.message ?? unknownErrorText);
        }
    };

    return (
        <TableContainer>
            <Table  size="small">
                <colgroup>
                    <col width="25%"></col>
                    <col width="25%"></col>
                    <col width="25%"></col>
                    <col width="20%"></col>
                </colgroup>
                <TableHead>
                    <TableCell>Mã tỉnh thành</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Cấp</TableCell>
                    <TableCell>Giá trị tính phí</TableCell>
                </TableHead>
                <TableBody>
                    {!tableData?.length && (
                        <TableRow>
                            <TableCell colSpan={3} align="left">
                                {props.message}
                            </TableCell>
                        </TableRow>
                    )}
                    {tableData?.map((row, i) => (
                        <TableRow key={`row_id_${i}`}>
                            <TableCell>{row.code}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.level}</TableCell>
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
                <MyTablePagination
                    labelUnit="tỉnh thành"
                    count={props.total}
                    rowsPerPage={props.limit}
                    page={props.page}
                    onChangePage={(_, page, rowsPerPage) => {
                        router.push(
                            `/crm/pricing?v=${ViewType.PROVINCE}&page=${page}&limit=${rowsPerPage}&q=${props.q}`
                        );
                    }}
                />
            </Table>
            <ConfirmDialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={() => updateFee()}
            />
        </TableContainer>
    );
};
