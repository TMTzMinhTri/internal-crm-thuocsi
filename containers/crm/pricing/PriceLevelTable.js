import React, { useEffect, useState } from "react";
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { useRouter } from "next/router";

import { ViewType } from "./enum";
import { TableFeeValueCell } from "./TableFeeValueCell";
import { getFeeClient } from "client/fee";
import { unknownErrorText } from "components/commonErrors";
import { ConfirmDialog } from "./ConfirmDialog";
import Link from "next/link";

/**
 * @param {object} props
 * @param {object[]} props.data
 * @param {string} props.data[].code
 * @param {string} props.data[].name
 * @param {string} props.data[].fromPrice
 * @param {string} props.data[].toPrice
 * @param {string} props.data[].feeValue
 * @param {string} props.q
 * @param {number} props.page
 * @param {number} props.limit
 * @param {number} props.total
 */
export const PriceLevelTable = (props) => {
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
            const res = await feeClient.updateThresholdFee(code, fee);
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
            <Table size="small">
                <colgroup>
                    <col width="15%"></col>
                    <col width="25%"></col>
                    <col width="15%"></col>
                    <col width="15%"></col>
                    <col width="20%"></col>
                    <col width="15%"></col>
                </colgroup>
                <TableHead>
                    <TableCell>Mã ngưỡng giá</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell align="right">Giá mua từ</TableCell>
                    <TableCell align="right">Giá mua đến</TableCell>
                    <TableCell>Giá trị tính phí</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
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
                        <TableRow key={`tr_${i}`}>
                            <TableCell>{row.code}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell align="right">{row.fromPrice}</TableCell>
                            <TableCell align="right">{row.toPrice}</TableCell>
                            <TableFeeValueCell
                                code={row.code}
                                initialFee={row.feeValue}
                                onUpdate={(values) => {
                                    setCurrentEditValue(values);
                                    setOpenModal(true);
                                }}
                            />
                            <TableCell align="center">
                                <Link href={`/crm/pricing/price-level/edit?priceLevelCode=${row.code}`}>
                                    <IconButton>
                                        <Edit />
                                    </IconButton>
                                </Link>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <MyTablePagination
                    labelUnit="ngưỡng giá"
                    count={props.total}
                    rowsPerPage={props.limit}
                    page={props.page}
                    onChangePage={(_, page, rowsPerPage) => {
                        router.push(
                            `/crm/pricing?v=${ViewType.PRICE_LEVEL}&page=${page}&limit=${rowsPerPage}&q=${props.q}`
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
