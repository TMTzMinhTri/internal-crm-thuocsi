import {
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TableHead,
  TableRow,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  Dialog,
} from "@material-ui/core";
import MyTablePagination from "@thuocsi/nextjs-components/my-pagination/my-pagination";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import AppCRM from "pages/_layout";
import {
  doWithLoggedInUser,
  renderWithLoggedInUser,
} from "@thuocsi/nextjs-components/lib/login";
import React, { useState } from "react";
import styles from "./voucher.module.css";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import { useForm } from "react-hook-form";
import { getPromoClient } from "../../../client/promo";
import {
  displayPromotionType,
  displayRule,
  displayStatus,
  displayTime,
  displayUsage,
  formatTime,
  getPromotionOrganizer,
  getPromotionScope,
  limitText,
  removeElement,
} from "../../../components/component/util";
import Switch from "@material-ui/core/Switch";
import Modal from "@material-ui/core/Modal";
import UnfoldLessIcon from "@material-ui/icons/UnfoldLess";
import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleDown,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import {
  MyCard,
  MyCardContent,
  MyCardHeader,
} from "@thuocsi/nextjs-components/my-card/my-card";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { getVoucherClient } from "../../../client/voucher";
import {
  defaultPromotionStatus,
  defaultPromotionType,
} from "components/component/constant";
import ModalCustom from "../../../components/modal/dialogs";
import CloseIcon from "@material-ui/icons/Close";
import Tooltip from "@material-ui/core/Tooltip";

export async function getServerSideProps(ctx) {
  return await doWithLoggedInUser(ctx, (ctx) => {
    return loadPromoData(ctx);
  });
}

export async function loadPromoData(ctx) {
  // Fetch data from external API
  let returnObject = { props: {} };
  let query = ctx.query;
  let page = query.page || 0;
  let limit = query.limit || 20;
  let offset = page * limit;
  let search = query.search || "";

  let _voucherClient = getVoucherClient(ctx, {});
  let getVoucherResponse = await _voucherClient.getVoucherCode(
    search,
    limit,
    offset,
    true
  );
  if (getVoucherResponse && getVoucherResponse.status === "OK") {
    returnObject.props.voucher = getVoucherResponse.data;
    returnObject.props.voucherCount = getVoucherResponse.total;
  }
  // Pass data to the page via props
  return returnObject;
}

export default function VoucherPage(props) {
  return renderWithLoggedInUser(props, render);
}

export function formatNumber(num) {
  return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

async function updateVoucher(voucherId, status) {
  return getVoucherClient().updateVoucherStatus(voucherId, status);
}

function render(props) {
  const toast = useToast();
  let router = useRouter();
  const { register, getValues, handleSubmit, errors } = useForm();
  let [search, setSearch] = useState("");
  let textSearch = router.query.search || "";

  const [page, setPage] = useState(parseInt(router.query.page || 0));
  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(router.query.perPage) || 20
  );
  let [openModal, setOpenModal] = useState({
    open: false,
    voucherId: 0,
    code: "",
    checked: false,
  });

  function searchPromotion() {
    router.query.page = 0;
    setPage(0);
    router.push({
      pathname: `/crm/voucher`,
      query: {
        ...router.query,
        search: search,
      },
    });
  }

  const handleChangePage = (event, newPage, rowsPerPage) => {
    setPage(newPage);
    setRowsPerPage(rowsPerPage);

    router.push({
      pathname: "/crm/voucher",
      query: {
        ...router.query,
        limit: rowsPerPage,
        page: newPage,
        perPage: rowsPerPage,
        offset: newPage * rowsPerPage,
      },
    });
  };

  const handleConfirm = (voucherId, checked, open, code) => {
    setOpenModal({
      open: open,
      voucherId: voucherId,
      code: code,
      checked: checked,
    });
  };

  async function handleChange(event) {
    setSearch(event.target.value.replace(/\s/g, "").trim().toUpperCase());
    if (event.target.value === "") {
      router
        .push({
          pathname: "/crm/voucher",
          query: {
            ...router.query,
            search: "",
          },
        })
        .then(setSearch(""));
    }
  }

  const handleActiveVoucher = async () => {
    let { checked, voucherId } = openModal;
    if (checked) {
      let voucherResponse = await updateVoucher(
        voucherId,
        defaultPromotionStatus.ACTIVE
      );
      if (!voucherResponse || voucherResponse.status !== "OK") {
        setOpenModal({ ...openModal, open: false });
        return toast.error(voucherResponse.message);
      } else {
        props.voucher.forEach((d) => {
          if (d.voucherId === voucherId) {
            return (d.status = defaultPromotionStatus.ACTIVE);
          }
        });
        setOpenModal({ ...openModal, open: false });
        return toast.success("Cập nhật thành công");
      }
    } else {
      let voucherResponse = await updateVoucher(
        voucherId,
        defaultPromotionStatus.WAITING
      );
      if (!voucherResponse || voucherResponse.status !== "OK") {
        setOpenModal({ ...openModal, open: false });
        return toast.error(voucherResponse.message);
      } else {
        props.voucher.forEach((d) => {
          if (d.voucherId === voucherId) {
            return (d.status = defaultPromotionStatus.EXPIRED);
          }
        });
        setOpenModal({ ...openModal, open: false });
        return toast.success("Cập nhật thành công");
      }
    }
  };

  return (
    <AppCRM select="/crm/voucher">
      <Head>
        <title>Danh sách mã khuyến mãi</title>
      </Head>
      <MyCard>
        <MyCardHeader title="Danh sách mã khuyến mãi">
          <Link href={`/crm/voucher/new`}>
            <Button variant="contained" color="primary">
              Thêm mới
            </Button>
          </Link>
        </MyCardHeader>

        <MyCardContent>
          <div className={styles.grid}>
            <Grid container direction={"row"} spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <Paper className={styles.search}>
                  <InputBase
                    id="search"
                    name="search"
                    autoComplete="off"
                    className={styles.input}
                    value={search}
                    onChange={handleChange}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        searchPromotion();
                      }
                    }}
                    placeholder="Tìm kiếm mã khuyến mãi"
                    inputProps={{ "aria-label": "Tìm kiếm khuyến mãi" }}
                  />
                  <IconButton
                    className={styles.iconButton}
                    aria-label="search"
                    onClick={searchPromotion}
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </Grid>
            </Grid>
          </div>
          {textSearch === "" ? (
            <span />
          ) : (
            <div className={styles.textSearch}>
              Kết quả tìm kiếm cho <i>'{textSearch}'</i>
            </div>
          )}
        </MyCardContent>
      </MyCard>

      <MyCard>
        <MyCardContent>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Mã khuyến mãi</TableCell>
                  <TableCell align="left">Tên chương trình</TableCell>
                  <TableCell align="left">Loại mã</TableCell>
                  <TableCell align="center">
                    Tổng số lần sử dụng toàn hệ thống
                  </TableCell>
                  <TableCell align="center">
                    Khách được sử dụng tối đa
                  </TableCell>
                  <TableCell align="left">Hạn sử dụng</TableCell>
                  <TableCell align="left">Thời gian hiển thị</TableCell>
                  <TableCell align="left">Trạng thái</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.voucher?.length > 0 ? (
                  props.voucher.map((row, index) => (
                    <TableRow key={row.voucherId + "_" + index}>
                      <TableCell align="left">
                        <div>{limitText(row.code, 20)}</div>
                      </TableCell>
                      <TableCell align="left">
                        {limitText(row.promotionName, 50)}
                      </TableCell>
                      <TableCell align="left">{row.type}</TableCell>
                      <TableCell align="center">
                        <div>{displayUsage(row.maxUsage)}</div>
                      </TableCell>
                      <TableCell align="center">
                        <div>{displayUsage(row.maxUsagePerCustomer)}</div>
                      </TableCell>
                      <TableCell align="left">
                        <div>Từ : {formatTime(row.startTime)}</div>
                        <div>Đến : {formatTime(row.endTime)}</div>
                      </TableCell>
                      <TableCell align="left">
                        <div>{formatTime(row.publicTime)}</div>
                      </TableCell>
                      <TableCell align="left">
                        <Tooltip
                          title={
                            row.status === "ACTIVE"
                              ? "Đang hoạt động"
                              : "Ngưng hoạt động"
                          }
                        >
                          <div>
                            <Switch
                              onChange={(event) => {
                                handleConfirm(
                                  row.voucherId,
                                  event.target.checked,
                                  true,
                                  row.code
                                );
                              }}
                              checked={row.status === "ACTIVE"}
                              color="primary"
                            />
                          </div>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Link
                          href={`/crm/voucher/edit?voucherId=${row.voucherId}`}
                        >
                          <ButtonGroup
                            color="primary"
                            aria-label="contained primary button group"
                          >
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                            >
                              Xem
                            </Button>
                          </ButtonGroup>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="left">
                      Không tìm thấy mã khuyến mãi
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              {props.voucherCount > 0 && (
                <MyTablePagination
                  labelUnit="khuyến mãi"
                  count={props.voucherCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                />
              )}
            </Table>
          </TableContainer>
          <Dialog open={openModal.open} scroll="body" fullWidth={true}>
            <DialogTitle
              id={"modal" + "-dialog-title"}
              onClose={() => setOpenModal({ ...openModal, open: false })}
            >
              <Typography variant="h6">Thông báo!</Typography>
              <IconButton
                aria-label="close"
                onClick={() => setOpenModal({ ...openModal, open: false })}
                style={{ position: "absolute", top: "1px", right: "1px" }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <div>
                Bạn muốn{" "}
                <span style={{ fontWeight: "bold" }}>
                  {openModal.checked === true ? "Bật" : "Tắt"}
                </span>{" "}
                trạng thái của khuyến mãi{" "}
                <span style={{ fontWeight: "bold" }}>{openModal.code}</span> hay
                không?
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenModal({ ...openModal, open: false })}
                variant={"contained"}
              >
                Thoát
              </Button>
              <Button
                autoFocus
                color="primary"
                variant={"contained"}
                onClick={handleActiveVoucher}
              >
                Đồng ý
              </Button>
            </DialogActions>
          </Dialog>
        </MyCardContent>
      </MyCard>
    </AppCRM>
  );
}
