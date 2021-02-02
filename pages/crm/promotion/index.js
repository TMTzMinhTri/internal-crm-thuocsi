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
  removeElement,
} from "../../../components/component/until";
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
  let type = query.type;

  if (type === defaultPromotionType.PROMOTION || !type) {
    let _promotionClient = getPromoClient(ctx, {});
    let getPromotionResponse = await _promotionClient.getPromotion(
      search,
      limit,
      offset,
      true
    );
    console.log("1234", getPromotionResponse);
    if (getPromotionResponse && getPromotionResponse.status === "OK") {
      returnObject.props.promotion = getPromotionResponse.data;
      returnObject.props.promotionCount = getPromotionResponse.total;
    }
  } else {
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
  return getPromoClient().updatePromotion({ promotionId, status });
}

function render(props) {
  const toast = useToast();
  let router = useRouter();
  const { register, getValues, handleSubmit, errors } = useForm();
  let [stateTypePromotion, setStateTypePromotion] = useState(
    defaultPromotionType.VOUCHER_CODE
  );
  let [search, setSearch] = useState("");
  let [open, setOpen] = useState({
    openModalCreate: false,
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
    router.push({
      pathname: `/crm/promotion`,
      query: {
        type: stateTypePromotion,
        search: search,
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

  const handleChangeTypePromotion = (event) => {
    setStateTypePromotion(event.target.value);
  };

  const handleClickShowItem = (promotionId) => {
    let listItem = document.getElementsByName("hideItem" + promotionId);
    let buttonDown = document.getElementById("buttonDown" + promotionId);
    let buttonUp = document.getElementById("buttonUp" + promotionId);
    if (buttonDown.style.display === "") {
      buttonDown.style.display = "none";
      buttonUp.style.display = "";
    } else {
      buttonDown.style.display = "";
      buttonUp.style.display = "none";
    }
    listItem.forEach((item) => {
      if (item.style.display === "none") {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  };

  const handleActivePromotion = async (event, promotionID) => {
    if (event.target.checked) {
      let promotionResponse = await updatePromotion(
        promotionID,
        defaultPromotionStatus.ACTIVE
      );
      if (!promotionResponse || promotionResponse.status !== "OK") {
        return toast.error(promotionResponse.mesage);
      } else {
        props.promotion.forEach((d) => {
          if (d.promotionId === promotionID) {
            return (d.status = defaultPromotionStatus.ACTIVE);
          }
        });
        return toast.success("Cập nhật thành công");
      }
    } else {
      let promotionResponse = await updatePromotion(
        promotionID,
        defaultPromotionStatus.EXPIRED
      );
      if (!promotionResponse || promotionResponse.status !== "OK") {
        return toast.error(promotionResponse.mesage);
      } else {
        props.promotion.forEach((d) => {
          if (d.promotionId === promotionID) {
            return (d.status = defaultPromotionStatus.EXPIRED);
          }
        });
        return toast.success("Cập nhật thành công");
      }
    }
  };

  async function handleChange(event) {
    const target = event.target;
    const value = target.value;
    setSearch(value);
  }

  async function handleChange(event) {
    setSearch(event.target.value);
    if (event.target.value === "") {
      router
        .push({
          pathname: "/crm/promotion",
          query: {
            ...router.query,
            search: "",
          },
        })
        .then(setSearch(""));
    }
  }

  function handleChangeTab(event, value) {
    setTypePromotion(value);
    setSearch("");
    setPage(0);
    setRowsPerPage(20);
    router.push({
      pathname: "/crm/promotion",
      query: {
        type: value,
      },
    });
  }

  return (
    <AppCRM select="/crm/promotion">
      <div>
        <title>Danh sách khuyến mãi</title>
      </div>
      <MyCard>
        <MyCardHeader title="Danh sách khuyến mãi">
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
                    id="search"
                    name="search"
                    autoComplete="off"
                    className={styles.input}
                    value={search}
                    onChange={handleChange}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        router.push({
                          pathname: `/crm/promotion`,
                          query: {
                            ...router.query,
                            search: search,
                          },
                        });
                      }
                    }}
                    placeholder="Tìm kiếm khuyến mãi"
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
              <Grid item xs={12} sm={6} md={6}>
                <Tabs
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  value={typePromotion}
                  onChange={handleChangeTab}
                >
                  <Tab
                    value={defaultPromotionType.PROMOTION}
                    label="Chương trình khuyến mãi"
                  />
                  <Tab
                    value={defaultPromotionType.VOUCHER_CODE}
                    label="Mã khuyến mãi"
                  />
                </Tabs>
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
          {typePromotion === defaultPromotionType.PROMOTION ? (
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Chương trình khuyến mãi</TableCell>
                    <TableCell align="left">Bên tổ chức</TableCell>
                    <TableCell align="left">Hình thức áp dụng</TableCell>
                    <TableCell align="left">Thời gian áp dụng</TableCell>
                    <TableCell align="left">Trạng Thái</TableCell>
                    {/* <TableCell align="center">Thao tác</TableCell> */}
                  </TableRow>
                </TableHead>
                {props.promotion?.length > 0 ? (
                  <TableBody>
                    {props.promotion.map((row, index) => (
                      <TableRow key={row.promotionId}>
                        <TableCell align="left">
                          <div>{row.promotionName}</div>
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
                              handleActivePromotion(event, row.promotionId);
                            }}
                            checked={row.status === "ACTIVE" ? true : false}
                            color="primary"
                          />
                        </TableCell>
                        {/* <TableCell align="center">
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
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                ) : (
                  <div></div>
                )}
                {props.promotionCount > 0 ? (
                  <MyTablePagination
                    labelUnit="khuyến mãi"
                    count={props.promotionCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                  />
                ) : (
                  textSearch && (
                    <h3>Không tìm thấy danh sách chương trình khuyến mãi</h3>
                  )
                )}
              </Table>
            </TableContainer>
          ) : (
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Mã khuyến mãi</TableCell>
                    <TableCell align="left">Tên chương trình</TableCell>
                    <TableCell align="left">Loại mã</TableCell>
                    <TableCell align="left">
                      Tổng số lần sử dụng toàn hệ thống
                    </TableCell>
                    <TableCell align="left">
                      Khách được sử dụng tối đa
                    </TableCell>
                    <TableCell align="left">Hạn sử dụng</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                {props.voucher?.length > 0 ? (
                  <TableBody>
                    {props.voucher.map((row, index) => (
                      <TableRow key={row.voucherId + "_" + index}>
                        <TableCell align="left">
                          <div>{row.code}</div>
                        </TableCell>
                        <TableCell align="left">{row.promotionName}</TableCell>
                        <TableCell align="left">{row.type}</TableCell>
                        <TableCell align="center">
                          <div>{displayUsage(row.maxUsage)}</div>
                        </TableCell>
                        <TableCell align="center">
                          <div>{displayUsage(row.maxUsagePerCustomer)}</div>
                        </TableCell>
                        <TableCell align="left">
                          <div>{formatTime(row.expiredDate)}</div>
                        </TableCell>
                        <TableCell align="center">
                          <Link
                            href={`/crm/promotion/edit-voucher?voucherId=${row.voucherId}`}
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
                    ))}
                  </TableBody>
                ) : (
                  <div></div>
                )}
                {props.voucherCount > 0 ? (
                  <MyTablePagination
                    labelUnit="khuyến mãi"
                    count={props.voucherCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                  />
                ) : (
                  textSearch && (
                    <h3>Không tìm thấy danh sách chương trình khuyến mãi</h3>
                  )
                )}
              </Table>
            </TableContainer>
          )}
        </MyCardContent>
      </MyCard>
    </AppCRM>
  );
}
