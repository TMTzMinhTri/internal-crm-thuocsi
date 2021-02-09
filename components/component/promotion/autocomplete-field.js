import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { getAreaClient } from "client/area";
import { getCategoryClient } from "client/category";
import { getCustomerClient } from "client/customer";
import { getProductClient } from "client/product";
import { getSellerClient } from "client/seller";
import { getTagClient } from "client/tag";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { defaultCondition, defaultReward, defaultScope } from "../constant";
import { displayNameBasedOnCondition } from "../until";

async function searchProductList(q) {
  return await getProductClient().searchProductListFromClient(q, "");
}

async function searchCustomerList() {
  return await getCustomerClient().getLevel();
}

async function searchCategoryList(q) {
  return await getCategoryClient().getListCategoryFromClient(0, 20, q);
}

async function searchTagList(q) {
  return await getTagClient().getListTagClient(0, 20, q);
}

async function searchGiftList(q) {
  return await getProductClient().searchProductCategoryListFromClient(
    q,
    "GIFT"
  );
}

async function searchAreaList(q) {
  return await getAreaClient().getListArea(q);
}

async function searchProducerList(q) {
  return await getProductClient().getProducerClient(q);
}

async function searchSellerList(q) {
  return await getSellerClient().getSellerClient(0, 20, q);
}

async function searchIngredientList(q) {
  return await getProductClient().getIngredientList(q);
}

const AutoCompleteField = (props) => {
  const {
    label,
    options,
    defaultValue,
    placeholder,
    type,
    multiple = true,
    required,
    control,
    name,
  } = props;

  const { handleChange } = props;

  const [productList, setProductList] = useState(defaultValue);

  const fetchOptions = async (type, value) => {
    switch (type) {
      case defaultCondition.product:
        return await searchProductList(value);
      case defaultScope.area:
        return await searchAreaList(value);
      case defaultScope.customerLevel:
        return await searchCustomerList();
      case defaultCondition.productCatergory:
        return await searchCategoryList(value);
      case defaultCondition.productTag:
        return await searchTagList(value);
      case defaultCondition.producer:
        return await searchProducerList(value);
      case defaultCondition.ingredient:
        return await searchIngredientList(value);
      case defaultReward.gift:
        return await searchGiftList(value);
      case "SELLER":
        return await searchSellerList(value);
      default:
        return { status: "ERROR" };
    }
  };

  const handleChangeTextField = async (event) => {
    setProductList([]);
    let value = event.target.value;
    let res = await fetchOptions(type, value);
    if (res?.status == "OK") {
      console.log(res);
      let arr = productList.concat(res.data);
      if (multiple)
        arr.unshift({
          name: "Chọn tất cả",
        });
      setProductList(arr);
    } else {
      setProductList([]);
    }
  };

  useEffect(() => {
    handleChangeTextField({ target: { value: "" } });
  }, [type]);

  console.log(defaultValue, "defaultValue", type);

  return (
    <Controller
      name={name}
      render={(props) => (
        <Autocomplete
          fullWidth
          multiple={multiple}
          options={productList.length > 0 ? productList : options}
          onChange={(event, value) => {
            if (multiple) {
              let isAll = false;
              isAll = value.filter((o) => o.name == "Chọn tất cả");
              if (isAll.length > 0) {
                value = isAll;
              }
            }
            handleChange(event, value);
            console.log(value, "valuevalue");
            props.onChange(value);
          }}
          getOptionLabel={(option) => option.name}
          value={defaultValue}
          defaultValue={defaultValue}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              required={required}
              {...params}
              variant="standard"
              label={label}
              placeholder={placeholder}
              onChange={handleChangeTextField}
            />
          )}
        />
      )}
      control={control}
      defaultValue={defaultValue}
    />
  );
};

export default AutoCompleteField;
