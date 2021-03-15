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
import styles from "./promotion.module.css";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import { useForm } from "react-hook-form";
import { getPromoClient } from "../../../client/promo";
import {
  displayPromotionScope,
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
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
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

  console.log("search", search);

  let _promotionClient = getPromoClient(ctx, {});
  let getPromotionResponse = await _promotionClient.getPromotion(
    search,
    limit,
    offset,
    true
  );
  if (getPromotionResponse && getPromotionResponse.status === "OK") {
    returnObject.props.promotion = getPromotionResponse.data;
    returnObject.props.promotionCount = getPromotionResponse.total;
  }

  // Pass data to the page via props
  return returnObject;
}

export default function PromotionPage(props) {
  return renderWithLoggedInUser(props, render);
}

export function formatNumber(num) {
  return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

async function updatePromotion(promotionId, status) {
  return getPromoClient().updateStatusPromotion({ promotionId, status });
}

function render(props) {
  const toast = useToast();

  let router = useRouter();

  const { register, getValues, handleSubmit, errors } = useForm({
    defaultValues: {
      search: router.query.search || "",
    },
  });

  let [openModal, setOpenModal] = useState({
    open: false,
    promotionId: 0,
    promotionName: "",
    promotionStatus: "",
    checked: false,
  });

  let textSearch = router.query.search || "";

  const [page, setPage] = useState(parseInt(router.query.page || 0));

  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(router.query.perPage) || 20
  );

  const [typePromotion, setTypePromotion] = useState(
    router.query.type || defaultPromotionType.PROMOTION
  );

  function searchPromotion() {
    let value = getValues();
    setPage(0);
    router.query.page = 0;
    router.push({
      pathname: `/crm/promotion`,
      query: {
        ...router.query,
        search: value.search,
      },
    });
  }

  const handleChangePage = (event, newPage, rowsPerPage) => {
    setPage(newPage);
    setRowsPerPage(rowsPerPage);

    router.push({
      pathname: "/crm/promotion",
      query: {
        ...router.query,
        limit: rowsPerPage,
        page: newPage,
        perPage: rowsPerPage,
        offset: newPage * rowsPerPage,
      },
    });
  };

  const handleActivePromotion = async () => {
    let { checked, promotionId } = openModal;
    if (checked) {
      let promotionResponse = await updatePromotion(
        promotionId,
        defaultPromotionStatus.ACTIVE
      );
      if (!promotionResponse || promotionResponse.status !== "OK") {
        setOpenModal({ ...openModal, open: false });
        return toast.error(promotionResponse.message);
      } else {
        props.promotion.forEach((d) => {
          if (d.promotionId === promotionId) {
            return (d.status = defaultPromotionStatus.ACTIVE);
          }
        });
        setOpenModal({ ...openModal, open: false });
        return toast.success("Cập nhật thành công");
      }
    } else {
      let promotionResponse = await updatePromotion(
        promotionId,
        defaultPromotionStatus.HIDE
      );
      if (!promotionResponse || promotionResponse.status !== "OK") {
        setOpenModal({ ...openModal, open: false });
        return toast.error(promotionResponse.message);
      } else {
        props.promotion.forEach((d) => {
          if (d.promotionId === promotionId) {
            return (d.status = defaultPromotionStatus.HIDE);
          }
        });
        setOpenModal({ ...openModal, open: false });
        return toast.success("Cập nhật thành công");
      }
    }
  };

  const handleConfirm = (promotionId, checked, open, promotionName, status) => {
    setOpenModal({
      open: open,
      promotionName: promotionName,
      promotionId: promotionId,
      checked: checked,
      promotionStatus: status,
    });
  };

  async function handleChange(event) {
    if (event.target.value === "") {
      router
        .push({
          pathname: "/crm/promotion",
          query: {
            ...router.query,
            search: "",
          },
        })
        .then();
    }
  }

  return (
    <AppCRM select="/crm/promotion">
      <Head>
        <title>Danh sách chương trình khuyến mãi</title>
      </Head>
      <MyCard>
        <MyCardHeader title="Danh sách chương trình khuyến mãi">
          <Link
            href={`/crm/promotion/${
              typePromotion === defaultPromotionType.PROMOTION
                ? "new"
                : "new-voucher"
            }`}
          >
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
                    name="search"
                    autoComplete="off"
                    className={styles.input}
                    defaultValue={textSearch}
                    onChange={handleChange}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        searchPromotion();
                      }
                    }}
                    placeholder="Nhập mã hoặc tên chương trình cần tìm"
                    inputRef={register}
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
                  <TableCell align="left">Mã chương trình</TableCell>
                  <TableCell align="left">Chương trình khuyến mãi</TableCell>
                  <TableCell align="left">Bên tổ chức</TableCell>
                  <TableCell align="left">Hình thức áp dụng</TableCell>
                  <TableCell align="left">Thời gian áp dụng</TableCell>
                  <TableCell align="left">Trạng Thái</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.promotion?.length > 0 ? (
                  props.promotion.map((row, index) => (
                    <TableRow key={row.promotionId}>
                      <TableCell align="left">{row.promotionId}</TableCell>
                      <TableCell align="left">
                        {limitText(row.promotionName, 50)}
                      </TableCell>
                      <TableCell align="left">
                        {getPromotionOrganizer(row.promotionOrganizer)}
                      </TableCell>
                      <TableCell align="left">
                        {displayPromotionType(row.promotionType)}
                      </TableCell>
                      <TableCell align="left">
                        <div>Từ : {formatTime(row.startTime)}</div>
                        <div>Đến : {formatTime(row.endTime)}</div>
                      </TableCell>
                      <TableCell align="left">
                        <Switch
                          onChange={(event) => {
                            handleConfirm(
                              row.promotionId,
                              event.target.checked,
                              true,
                              row.promotionName,
                              row.status
                            );
                          }}
                          checked={row.status === "ACTIVE" ? true : false}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Link
                          href={`/crm/promotion/edit?promotionId=${row.promotionId}`}
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
                      Không tìm thấy chương trình khuyến mãi
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              {props.promotionCount > 0 && (
                <MyTablePagination
                  labelUnit="khuyến mãi"
                  count={props.promotionCount}
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
              {openModal.promotionStatus == defaultPromotionStatus.EXPIRED ? (
                <b>Chương trình khuyến mãi đã hết hạn</b>
              ) : (
                <div>
                  Bạn muốn{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {openModal.checked === true ? "bật" : "tắt"}
                  </span>{" "}
                  trạng thái của chương trình{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {openModal.promotionId + " - " + openModal.promotionName}
                  </span>{" "}
                  hay không?
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenModal({ ...openModal, open: false })}
                variant={"contained"}
              >
                Thoát
              </Button>
              {openModal.promotionStatus != defaultPromotionStatus.EXPIRED && (
                <Button
                  autoFocus
                  color="primary"
                  variant={"contained"}
                  onClick={handleActivePromotion}
                >
                  Đồng ý
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </MyCardContent>
      </MyCard>
    </AppCRM>
  );
}
