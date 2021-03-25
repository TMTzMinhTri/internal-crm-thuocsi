import {
  Button,
  FormGroup,
  Paper,
  ButtonGroup,
  CircularProgress,
} from "@material-ui/core";
import Head from "next/head";
import AppCRM from "pages/_layout";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useToast } from "@thuocsi/nextjs-components/toast/useToast";
import { getProductClient } from "../../../client/product";
import { getCategoryClient } from "../../../client/category";
import {
  defaultCondition,
  defaultPromotion,
  defaultPromotionType,
  defaultReward,
  defaultScope,
} from "../../../components/component/constant";
import {
  formatUTCTime,
  onSubmitPromotion,
} from "../../../components/component/util";
import { useRouter } from "next/router";
import InfomationFields from "components/component/promotion/infomation-fields";
import ConditionFields from "components/component/promotion/condition-fields";
import {
  MyCard,
  MyCardActions,
  MyCardContent,
  MyCardHeader,
} from "@thuocsi/nextjs-components/my-card/my-card";
import { getCustomerClient } from "client/customer";
import { getTagClient } from "client/tag";
import { getAreaClient } from "client/area";
import { getProducerClient } from "client/producer";
import { getIngredientClient } from "client/ingredient";
import { getSellerClient } from "client/seller";
import ModalCustom from "components/modal/dialogs";

async function getListProductByIdsClient(q) {
  return getProductClient().getListProductByIdsClient(q);
}

async function getListCategoryByCodesClient(q) {
  return getCategoryClient().getListCategoryByCodesClient(q);
}

async function getProductTagByCodeClient(q) {
  return getTagClient().getTagByTagCodesClient(q);
}

async function getListAreaClient() {
  return getAreaClient().getListArea();
}

async function getListLevelClient() {
  return getCustomerClient().getLevel();
}

async function getListProducerByCodesClient(q) {
  return getProducerClient().getProducerByCodesClient(q);
}

async function getListSellerByCodesClient(q) {
  return getSellerClient().getSellerBySellerCodesClient(q);
}

async function getListIngredientByCodesClient(q) {
  return getIngredientClient().getIngredientByCodesClient(q);
}

const PromotionForm = (props, type) => {
  let edit = type == "edit";

  const toast = useToast();

  const router = useRouter();

  const { promotionRes } = props;

  const {
    description,
    endTime,
    startTime,
    publicTime,
    promotionName,
    promotionOrganizer,
    promotionType,
    conditions,
    rewards,
    scopes,
    status,
  } = promotionRes
    ? promotionRes
    : {
        description: "",
        endTime: "",
        startTime: "",
        publicTime: "",
        promotionName: "",
        promotionOrganizer: defaultPromotion.MARKETPLACE,
        promotionType: defaultPromotionType.VOUCHER_CODE,
        scopes: null,
        conditions: null,
        rewards: null,
        status: "ACTIVE",
      };

  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    errors,
    control,
  } = useForm({
    defaultValues: {
      description: description,
      endTime: formatUTCTime(endTime),
      startTime: formatUTCTime(startTime),
      publicTime: formatUTCTime(publicTime),
      promotionName: promotionName,
      promotionOrganizer: promotionOrganizer,
      promotionType: promotionType,
      status: status == "ACTIVE" ? true : false,
      minOrderValue: conditions ? conditions[0].minOrderValue : "",
      registeredBefore:
        scopes && scopes[0].registeredBefore
          ? formatUTCTime(scopes[0].registeredBefore)
          : new Date(),
      registeredAfter:
        scopes && scopes[0].registeredAfter
          ? formatUTCTime(scopes[0].registeredAfter)
          : new Date(),
      percentageDiscount: rewards && rewards[0]?.percentageDiscount,
      absoluteDiscount: rewards && rewards[0]?.absoluteDiscount,
      maxDiscount: rewards && rewards[0]?.maxDiscount,
      pointValue: rewards && rewards[0]?.pointValue,
    },
  });

  let disabled = edit && new Date() >= new Date(startTime);

  console.log("props", props);

  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const [promotionId, setPromotionId] = useState(
    promotionRes ? promotionRes.promotionId : ""
  );

  const [textField, setTextField] = useState({
    descriptionField: "",
    promotionOrganizer: "",
    promotionType: "",
  });

  const [scopeObject, setScopeObject] = useState([
    {
      selectField: defaultScope.customerLevel,
      registeredBefore: new Date(),
      registeredAfter: new Date(),
      list: [{ name: "Chọn tất cả" }],
    },
    {
      selectField: defaultScope.area,
      list: [{ name: "Chọn tất cả" }],
    },
  ]);

  const [conditionObject, setConditionObject] = useState({
    selectField:
      conditions && conditions[1] && conditions[1].type
        ? conditions[1].type
        : defaultCondition.noRule,
    minTotalValue: 0,
    seller: [""],
    productList: !conditions
      ? [""]
      : conditions[1] && conditions[1].type == defaultCondition.noRule
      ? [""]
      : conditions[1] && conditions[1].productConditions?.map((o) => ""),
    item: {},
  });

  const [rewardObject, setRewardObject] = useState({
    selectField: rewards && rewards[0].type ? rewards[0].type : "",
    percentageDiscount: "",
    maxDiscount: "",
    absoluteDiscount: "",
    attachedProduct:
      rewards && rewards[0].type == defaultReward.gift
        ? rewards[0].gifts.map((o) => "")
        : {
            product: "",
            number: 0,
          },
    pointValue: "",
  });

  const handleChangeTextField = (key) => (event) => {
    setTextField({ ...textField, [key]: event.target.value });
  };

  const handleAddAttachedProduct = () => {
    rewardObject.attachedProduct.push("");
    setRewardObject({ ...rewardObject });
  };

  const handleRemoveAttachedProduct = (index) => {
    let value = getValues();
    for (let i = index; i < rewardObject.attachedProduct.length - 1; i++) {
      setValue("gift" + i, value["gift" + (i + 1)]);
      setValue("quantity" + i, value["quantity" + (i + 1)]);
    }
    rewardObject.attachedProduct.splice(index, 1);
    setRewardObject({ ...rewardObject });
  };

  const handleChangeRewardField = (key) => (event) => {
    if (event.target.value == defaultReward.gift) {
      rewardObject.attachedProduct = [""];
      setRewardObject({ ...rewardObject });
    }
    setRewardObject({ ...rewardObject, [key]: event.target.value });
  };

  const handleChangeConditionField = (key) => (event) => {
    conditionObject.productList = [""];
    setConditionObject({ ...conditionObject, [key]: event.target.value });
  };

  const handleAddProductOfProductList = () => {
    conditionObject.productList.push("");
    setConditionObject({ ...conditionObject });
  };

  const handleRemoveProductOfProductList = (index) => {
    let value = getValues();
    for (let i = index; i < conditionObject.productList.length - 1; i++) {
      setValue("seller" + i, value["seller" + (i + 1)]);
      setValue("product" + i, value["product" + (i + 1)]);
      setValue("minQuantity" + i, value["minQuantity" + (i + 1)]);
      setValue("minTotalValue" + i, value["minTotalValue" + (i + 1)]);
    }
    conditionObject.productList.splice(index, 1);
    setConditionObject({ ...conditionObject });
  };

  const fillDefaultData = async () => {
    setIsLoadingPage(true);
    //---------- Scope ---------

    // ** CustomerLevel
    if (scopes[0].quantityType == "ALL") {
      setValue("customerLevel", [{ name: "Chọn tất cả" }]);
    } else {
      let arr = [];
      let res = await getListLevelClient();
      if (res?.status == "OK") {
        scopes[0].customerLevelCodes.map((code) =>
          arr.unshift(res.data.find((v) => v.code == code))
        );
        console.log(arr, "arrrrr");
        scopeObject[0].list = arr;
      }
    }

    // ** Area
    if (scopes[1].quantityType == "ALL") {
      setValue("area", [{ name: "Chọn tất cả" }]);
    } else {
      let arr = [];
      let res = await getListAreaClient();
      if (res?.status == "OK") {
        scopes[1].areaCodes.map((code) =>
          arr.unshift(res.data.find((v) => v.code == code))
        );
        scopeObject[1].list = arr;
      }
    }

    setScopeObject([...scopeObject]);

    //---------- Condition ---------

    conditions.map(async (o, index) => {
      if (o.type != defaultCondition.noRule && index != 0) {
        let res;

        o.productConditions.map(async (ob, i) => {
          // Handle Sellers, Quantity, Value
          if (ob.sellerQuantityType == "ALL") {
            setValue("seller" + i, [{ name: "Chọn tất cả" }]);
          } else {
            let response = await getListSellerByCodesClient(ob.sellerCodes);
            if (response?.status == "OK") {
              setValue("seller" + i, response.data);
            }
          }
          setValue("minQuantity" + i, ob.minQuantity);
          setValue("minTotalValue" + i, ob.minTotalValue);

          // Handle Item
          switch (o.type) {
            case defaultCondition.product:
              res = await getListProductByIdsClient([ob.productId]);
              if (res?.status == "OK") {
                setValue("product" + i, res.data[0]);
              }
              break;
            case defaultCondition.productTag:
              res = await getProductTagByCodeClient([ob.productTag]);
              if (res?.status == "OK") {
                setValue("productTag" + i, res.data[0]);
              }
              break;
            case defaultCondition.productCategory:
              res = await getListCategoryByCodesClient([ob.categoryCode]);
              if (res?.status == "OK") {
                setValue("productCategory" + i, res.data[0]);
              }
              break;
            case defaultCondition.ingredient:
              res = await getListIngredientByCodesClient([ob.ingredientCode]);
              if (res?.status == "OK") {
                setValue("ingredient" + i, res.data[0]);
              }
              break;
            case defaultCondition.producer:
              res = await getListProducerByCodesClient([ob.producerCode]);
              if (res?.status == "OK") {
                setValue("producer" + i, res.data[0]);
              }
              break;
            default:
              break;
          }
        });
      }
    });

    //---------- Reward ---------

    if (rewards[0].type == defaultReward.gift) {
      rewards[0].gifts.map(async (gift, index) => {
        setValue("quantity" + index, gift.quantity);
        let res = await getListProductByIdsClient([gift.productId]);
        if (res?.status == "OK") {
          setValue("gift" + index, res.data[0]);
        }
      });
    }
    setIsLoadingPage(false);
    return;
  };

  const onSubmitUpdate = async () => {
    setIsLoading(true);
    await onSubmitPromotion(
      getValues,
      toast,
      router,
      conditionObject,
      rewardObject,
      false,
      promotionId
    );
    setIsLoading(false);
  };

  const onSubmitCreate = async () => {
    setIsLoading(true);
    let res = await onSubmitPromotion(
      getValues,
      toast,
      router,
      conditionObject,
      rewardObject,
      true,
      null
    );
    if (res && res.status == "OK") {
      if (getValues().promotionType == defaultPromotionType.VOUCHER_CODE) {
        setPromotionId(res.data[0].promotionId);
        setOpenModal(true);
      } else {
        router.push("/crm/promotion");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (edit) fillDefaultData();
  }, []);

  console.log(getValues(), "getValues()");
  return (
    <AppCRM select="/crm/promotion">
      <Head>
        <title>{edit ? "Chỉnh sửa khuyến mãi" : "Tạo khuyến mãi"}</title>
      </Head>
      <ModalCustom
        title="Thông báo"
        open={openModal}
        onClose={(val) => {
          setOpenModal(val), router.push(`/crm/promotion`);
        }}
        primaryText="Đồng ý"
        onExcute={() =>
          router.push(`/crm/voucher/new?promotionId=${promotionId}`)
        }
      >
        <p>
          Bạn có muốn tiếp tục tạo Mã khuyến mãi cho chương trình{" "}
          <b>{getValues().promotionName}</b> này không?
        </p>
      </ModalCustom>
      <MyCard component={Paper} style={{ padding: "0 3rem", height: "100%" }}>
        <FormGroup style={{ width: "100%" }}>
          <MyCardHeader
            title={
              edit
                ? "CHỈNH SỬA CHƯƠNG TRÌNH KHUYẾN MÃI"
                : "TẠO CHƯƠNG TRÌNH KHUYẾN MÃI"
            }
          ></MyCardHeader>
          {isLoadingPage ? (
            <MyCardContent>
              <center>
                <CircularProgress />
              </center>
            </MyCardContent>
          ) : (
            <MyCardContent>
              <InfomationFields
                status={status}
                disabled={disabled}
                useForm={{ errors, register, getValues, control, setValue }}
                textField={textField}
                handleChangeTextField={handleChangeTextField}
              />
              <ConditionFields
                disabled={disabled}
                useForm={{ errors, register, getValues, control }}
                object={{ scopeObject, conditionObject, rewardObject }}
                handleAddAttachedProduct={handleAddAttachedProduct}
                handleRemoveAttachedProduct={handleRemoveAttachedProduct}
                handleChangeTextField={handleChangeTextField}
                handleChangeConditionField={handleChangeConditionField}
                handleChangeRewardField={handleChangeRewardField}
                handleAddProductOfProductList={handleAddProductOfProductList}
                handleRemoveProductOfProductList={
                  handleRemoveProductOfProductList
                }
              />
            </MyCardContent>
          )}
          {!isLoadingPage && status != "EXPIRED" && (
            <MyCardActions>
              <ButtonGroup>
                {isLoading ? (
                  <Button variant="contained" style={{ margin: 8 }}>
                    <CircularProgress color="secondary" size={20} />
                  </Button>
                ) : edit ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(onSubmitUpdate)}
                    style={{ margin: 8 }}
                  >
                    cập nhật
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(onSubmitCreate)}
                    style={{ margin: 8 }}
                  >
                    thêm chương trình khuyến mãi
                  </Button>
                )}
                <Button
                  variant="contained"
                  style={{ margin: 8 }}
                  onClick={() => router.reload()}
                >
                  Làm mới
                </Button>
              </ButtonGroup>
            </MyCardActions>
          )}
        </FormGroup>
      </MyCard>
    </AppCRM>
  );
};

export default PromotionForm;
