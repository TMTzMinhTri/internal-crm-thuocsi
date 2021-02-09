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
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { useRouter } from "next/router";

import { ViewType } from "./enum";
import { TableFeeValueCell } from "./TableFeeValueCell";
import { ConfirmDeliveryTimeDialog } from "./ConfirmDeliveryTimeDialog";
import { TableDeliveryTimeValueCell } from "./TableDeliveryTimeValueCell";
import { getFeeClient } from "client/fee";
import { unknownErrorText } from "components/commonErrors";
import { ConfirmDialog } from "./ConfirmDialog";

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
export const RegionTable = (props) => {
    const router = useRouter();
    const toast = useToast();
    const [tableData, setTableData] = useState(props.data);
    const [openEstThuocSiModal, setOpenEstThuocSiModal] = useState(false);
    const [openEstLogisticModal, setOpenEstLogisticModal] = useState(false);
    const [openFeeModal, setOpenFeeModal] = useState(false);
    const [currentEditValue, setCurrentEditValue] = useState(null);
    const [estThuocSi, setEstThuocSi] = useState(null);
    const [estLogistic, setEstLogistic] = useState(null);

    useEffect(() => {
        setTableData(props.data);
    }, [props.data]);

    const updateFee = async () => {
        try {
            const { code, fee } = currentEditValue;
            const feeClient = getFeeClient();
            const res = await feeClient.updateRegionFee({ code, feeValue: fee });
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

    const updateEstThuocSi = async () => {
        try {
            const { code, deliveryTime } = estThuocSi;
            const feeClient = getFeeClient();
            const res = await feeClient.updateRegionFee({ code, estThuocSi: deliveryTime });
            if (res.status === "OK") {
                toast.success("Cập nhật thời gian giao hàng thành công");
                window.location.reload()
            } else {
                toast.error(res.message ?? unknownErrorText);
            }
        } catch (err) {
            toast.error(err.message ?? unknownErrorText);
        }
    };

    const updateEstLogistic = async () => {
        try {
            const { code, deliveryTime } = estLogistic;
            const feeClient = getFeeClient();
            const res = await feeClient.updateRegionFee({ code, estLogistic: deliveryTime });
            if (res.status === "OK") {
                toast.success("Cập nhật thời gian giao hàng thành công");
                window.location.reload()
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
                    <col width="10%"></col>
                    <col width="15%"></col>
                    <col width="20%"></col>
                    <col width="20%"></col>
                    <col width="20%"></col>
                    <col width="15%"></col>
                </colgroup>
                <TableHead>
                    <TableCell>Mã vùng</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Thời gian giao hàng từ thuốc sỉ</TableCell>
                    <TableCell>Thời gian giao hàng từ DVGH</TableCell>
                    <TableCell align="center">Tổng thời gian dự kiến</TableCell>
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
                        <TableRow key={`tr_${i}`}>
                            <TableCell>{row.code}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableDeliveryTimeValueCell
                                code={row.code}
                                initialDeliveryTime={row.estThuocSi}
                                onUpdate={(values) => {
                                    setEstThuocSi(values);
                                    setOpenEstThuocSiModal(true);
                                }}
                            />
                            <TableDeliveryTimeValueCell
                                code={row.code}
                                initialDeliveryTime={row.estLogistic}
                                onUpdate={(values) => {
                                    setEstLogistic(values);
                                    setOpenEstLogisticModal(true);
                                }}
                            />
                            <TableCell align="center">{row.estThuocSi + row.estLogistic} ngày</TableCell>
                            <TableFeeValueCell
                                code={row.code}
                                initialFee={row.feeValue}
                                onUpdate={(values) => {
                                    setCurrentEditValue(values);
                                    setOpenFeeModal(true);
                                }}
                            />
                        </TableRow>
                    ))}
                </TableBody>
                <MyTablePagination
                    labelUnit="vùng"
                    count={props.total}
                    rowsPerPage={props.limit}
                    page={props.page}
                    onChangePage={(_, page, rowsPerPage) => {
                        router.push(
                            `/crm/pricing?v=${ViewType.REGION}&page=${page}&limit=${rowsPerPage}&q=${props.q}`
                        );
                    }}
                />
            </Table>
            <ConfirmDialog
                open={openFeeModal}
                onClose={() => setOpenFeeModal(false)}
                onConfirm={() => updateFee()}
            />
            <ConfirmDeliveryTimeDialog
                open={openEstThuocSiModal}
                onClose={() => setOpenEstThuocSiModal(false)}
                onConfirm={() => updateEstThuocSi()}
            />
            <ConfirmDeliveryTimeDialog
                open={openEstLogisticModal}
                onClose={() => setOpenEstLogisticModal(false)}
                onConfirm={() => updateEstLogistic()}
            />
        </TableContainer>
    );
};
