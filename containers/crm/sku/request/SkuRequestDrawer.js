import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    Checkbox,
    Drawer,
    Grid,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";
import { BranText, SellingPriceText } from "view-models/sku";
import { MyCardContent, MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";
import { getPricingClient } from "client/pricing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ProductStatus } from "components/global";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { unknownErrorText } from "components/commonErrors";

const useStyles = makeStyles((theme) => ({
    container: {
        boxSizing: "border-box",
        [theme.breakpoints.up("xs")]: {
            minWidth: "90vw",
        },
        [theme.breakpoints.up("sm")]: {
            minWidth: "580px",
        },
        [theme.breakpoints.up("md")]: {
            minWidth: "880px",
        },
    },
    card: {
        minHeight: "100vh",
    },
    wholesaleTable: {
        maxHeight: "calc(100vh - 175px)",
        overflowY: 'auto',
    },
    rowGroupTitle: {
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: theme.typography.body2,
    },
    ticketTitle: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: theme.typography.body2,
    }
}));

const RenderWholesalePrice = ({ data }) => {
    const classes = useStyles();
    return (
        <TableContainer className={classes.wholesaleTable}>
            <Table size="small">
                <colgroup>
                    <col width="60%"></col>
                    <col width="40%"></col>
                </colgroup>
                <TableBody>
                    {data?.map((price, i) => (
                        <>
                            <TableRow key={`trwsp_${i}`}>
                                <TableCell colSpan={5}>
                                    <Box fontWeight="fontWeightBold" fontSize="body2.fontSize">
                                        Thứ: {i + 1}
                                    </Box>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Loại cài đặt</TableCell>
                                <TableCell>{SellingPriceText[price.type]}</TableCell>
                                <TableCell />
                            </TableRow>
                            <TableRow>
                                <TableCell>Giá bán</TableCell>
                                <TableCell>{price.price}</TableCell>
                                <TableCell />
                            </TableRow>
                            <TableRow>
                                <TableCell>Số lượng tối thiểu áp dụng</TableCell>
                                <TableCell>{price.minNumber}</TableCell>
                                <TableCell />
                            </TableRow>
                            <TableRow>
                                <TableCell>Tỉ lệ phần trăm giảm giá</TableCell>
                                <TableCell>{price.absoluteDiscount}</TableCell>
                                <TableCell />
                            </TableRow>
                            <TableRow>
                                <TableCell>Giảm giá tuyệt đối</TableCell>
                                <TableCell>{price.absoluteDiscount}</TableCell>
                                <TableCell />
                            </TableRow>
                        </>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const checkUpdated = (oldValue, newValue) => {
    if (!(newValue ?? false)) return false;
    return oldValue !== newValue;
};

const checkTagsUpdated = (list1, list2) => {
    if (!(list2 ?? false)) return false;
    if (list1.length !== list2.length) return true;
    const comparer = (a = "", b = "") => a.localeCompare(b) > 0;
    list1.sort(comparer);
    list2.sort(comparer);
    for (let i = 0; i < list1.length; i++) {
        if (list1[i] !== list2[1]) return true;
    }
    return false;
};

const TicketRow = ({ previous, next, name, selected, onSelect }) => {
    const classes = useStyles();
    const statusUpdated = checkUpdated(previous.status, next.status);
    const tagsUpdated = checkTagsUpdated(previous.tags, next.tags);
    const brandUpdated = checkUpdated(previous.brand, next.brand);
    const maxQuantityUndated = checkUpdated(previous.maxQuantity, next.maxQuantity);
    const retailTypeUpdated = checkUpdated(previous.retailPrice?.type, next.retailPrice?.type);
    const retailPriceUpdated = checkUpdated(previous.retailPrice?.price, next.retailPrice?.price);
    const wholesalePriceUpdated = !!next.wholesalePrice;
    let rowSpan = 1;
    if (statusUpdated) rowSpan++;
    if (tagsUpdated) rowSpan++;
    if (brandUpdated) rowSpan++;
    if (maxQuantityUndated) rowSpan++;
    if (retailTypeUpdated) rowSpan++;
    if (retailPriceUpdated) rowSpan++;
    if (retailTypeUpdated || retailPriceUpdated) rowSpan++;
    if (wholesalePriceUpdated) rowSpan += 2;
    return (
        <>
            <TableRow>
                <TableCell valign="top" rowSpan={rowSpan}>
                    <Checkbox color="primary" size="small" checked={selected} onClick={onSelect} />
                </TableCell>
                <TableCell className={classes.ticketTitle} colSpan={4}>
                    {name}
                </TableCell>
            </TableRow>
            {statusUpdated && (
                <TableRow>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>{ProductStatus[previous.status]}</TableCell>
                    <TableCell>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </TableCell>
                    <TableCell>{ProductStatus[next.status]}</TableCell>
                </TableRow>
            )}
            {tagsUpdated && (
                <TableRow>
                    <TableCell>Thẻ</TableCell>
                    <TableCell>{previous.tag}</TableCell>
                    <TableCell>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </TableCell>
                    <TableCell>{next.tag}</TableCell>
                </TableRow>
            )}
            {brandUpdated && (
                <TableRow>
                    <TableCell>Brand</TableCell>
                    <TableCell>{BranText[previous.brand]}</TableCell>
                    <TableCell>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </TableCell>
                    <TableCell>{BranText[next.brand]}</TableCell>
                </TableRow>
            )}
            {maxQuantityUndated && (
                <TableRow>
                    <TableCell>Số lượng tối đa</TableCell>
                    <TableCell>{previous.maxQuantity}</TableCell>
                    <TableCell>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </TableCell>
                    <TableCell>{next.maxQuantity}</TableCell>
                </TableRow>
            )}
            {(retailTypeUpdated || retailPriceUpdated) && (
                <>
                    <TableRow>
                        <TableCell className={classes.rowGroupTitle} colSpan={4}>
                            Giá bán lẻ
                        </TableCell>
                    </TableRow>
                    {retailTypeUpdated && (
                        <TableRow>
                            <TableCell>Loại cài đặt</TableCell>
                            <TableCell>{SellingPriceText[previous.retailPrice?.type]}</TableCell>
                            <TableCell>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </TableCell>
                            <TableCell>{SellingPriceText[next.retailPrice?.type]}</TableCell>
                        </TableRow>
                    )}
                    {retailPriceUpdated && (
                        <TableRow>
                            <TableCell>Giá bán</TableCell>
                            <TableCell>{previous.retailPrice?.price}</TableCell>
                            <TableCell>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </TableCell>
                            <TableCell>{next.retailPrice?.price}</TableCell>
                        </TableRow>
                    )}
                </>
            )}
            {wholesalePriceUpdated && (
                <>
                    <TableRow>
                        <TableCell className={classes.rowGroupTitle} colSpan={4}>
                            Giá bán buôn
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <RenderWholesalePrice data={previous.wholesalePrice} />
                                </Grid>
                                <Grid item xs={6}>
                                    <RenderWholesalePrice data={next.wholesalePrice} />
                                </Grid>
                            </Grid>
                        </TableCell>
                    </TableRow>
                </>
            )}
        </>
    );
};

/**
 * @param {object} props
 * @param {string[]} props.ticketCodes
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {Function} props.onUpdate
 */
const SkuRequestDrawer = ({ ticketCodes, open, onClose, onUpdate }) => {
    const toast = useToast();

    const [tickets, setTickets] = useState([]);
    const [selectedTickets, setSelectedTickets] = useState(ticketCodes ?? []);
    const classes = useStyles();

    const loadSellingData = useCallback(async () => {
        if (!ticketCodes) return;
        const pricingClient = getPricingClient();
        const resps = await Promise.all(ticketCodes?.map?.(ticketCode => pricingClient.getPricingTicketByCodeFromClient(ticketCode)) ?? []);
        const data = resps.reduce((acc, cur) => {
            if (cur.status === "OK") acc.push(cur.data[0]);
            return acc;
        }, []);
        setTickets(data);
    }, [ticketCodes]);

    const resolveTickets = useCallback(async () => {
        const unselectedTickets = ticketCodes?.filter?.(ticket => !selectedTickets.find(selectedTicket => selectedTicket === ticket));

        const pricingClient = getPricingClient();
        const resp = await pricingClient.updatePricingTicket({
            approveCodes: selectedTickets.length === 0 ? undefined : selectedTickets,
            cancelCodes: unselectedTickets.length === 0 ? undefined : unselectedTickets,
        });
        if (resp.status === "OK") {
            toast.success("Cập nhật sku thành công");
            onUpdate?.({
                approveCodes: selectedTickets,
                cancelCodes: unselectedTickets,
            });
        } else {
            throw new Error(resp.message);
        }
    }, [selectedTickets, tickets]);

    useEffect(() => {
        loadSellingData();
        setSelectedTickets(ticketCodes);
    }, [ticketCodes]);

    const handleTicketSelect = ({ code }) => {
        const existedIndex = selectedTickets.findIndex(ticketCode => ticketCode === code);
        const newSelectedTickets = [...selectedTickets];
        if (existedIndex == -1) {
            newSelectedTickets.push(code);
        } else {
            newSelectedTickets.splice(existedIndex, 1);
        }
        setSelectedTickets(newSelectedTickets);
    };

    const handleResolveTickets = async () => {
        try {
            await resolveTickets();
            onClose?.();
        } catch (e) {
            toast.error(e.message ?? unknownErrorText);
        }
    };

    return (
        <Drawer
            PaperProps={{
                className: classes.container
            }}
            anchor="right"
            open={open}
            onClose={onClose}
        >
            <Card className={classes.card}>
                <MyCardHeader title="Cập nhật trạng thái" />
                <MyCardContent>
                    <TableContainer>
                        <Table size="small">
                            <colgroup>
                                <col width="5%" />
                                <col width="20%" />
                                <col width="35%" />
                                <col width="5%" />
                                <col width="35%" />
                            </colgroup>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Chọn</TableCell>
                                    <TableCell align="center" colSpan={4}>Thay đổi</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tickets.map(ticket => (
                                    <TicketRow
                                        key={ticket.code}
                                        previous={ticket.previous}
                                        next={ticket.next}
                                        name={ticket.name}
                                        selected={!!selectedTickets.find(ticketCode => ticketCode === ticket.code)}
                                        onSelect={() => handleTicketSelect(ticket)}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </MyCardContent>
                <MyCardContent>
                    <Box paddingTop={1} clone>
                        <Grid container spacing={1} justify="flex-end">
                            <Grid item>
                                <Button
                                    variant="contained"
                                    onClick={onClose}
                                >
                                    Quay lại
                                </Button>
                            </Grid>
                            <Grid item>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleResolveTickets}
                                >
                                    Chấp nhận
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </MyCardContent>

            </Card>
        </Drawer>
    );
};

export default SkuRequestDrawer;
