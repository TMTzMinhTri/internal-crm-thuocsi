import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { getAreaClient } from "client/area";
import { getCategoryClient } from "client/category";
import { getCustomerClient } from "client/customer";
import { getProductClient } from "client/product";
import { getSellerClient } from "client/seller";
import { getTagClient } from "client/tag";
import React, { useEffect, useState } from "react";
import { defaultReward, defaultScope } from "../constant";

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

async function searchSellerList(q) {
  return await getProductClient().getProducerClient(q);
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
  } = props;

  const { handleChange } = props;

  const [productList, setProductList] = useState(defaultValue);

  const fetchOptions = async (type, value) => {
    switch (type) {
      case defaultScope.product:
        return await searchProductList(value);
      case defaultScope.customer:
        return await searchCustomerList();
      case defaultScope.productCatergory:
        return await searchCategoryList(value);
      case defaultScope.productTag:
        return await searchTagList(value);
      case defaultScope.area:
        return await searchAreaList(value);
      case defaultScope.producer:
        return await searchSellerList(value);
      case defaultScope.ingredient:
        return await searchIngredientList(value);
      case defaultReward.gift:
        return await searchGiftList(value);

      default:
        return { status: "ERROR" };
    }
  };

  const handleChangeTextField = async (event) => {
    setProductList([]);
    let value = event.target.value;
    let res = await fetchOptions(type, value);
    if (res?.status == "OK") {
      setProductList(res.data);
    } else {
      setProductList([]);
    }
  };

  useEffect(() => {
    handleChangeTextField({ target: { value: "" } });
  }, [type]);

  console.log(defaultValue, "defaultValue");

  return (
    <Autocomplete
      fullWidth
      multiple={multiple}
      options={productList.length > 0 ? productList : options}
      onChange={handleChange}
      getOptionLabel={(option) => option.name}
      value={defaultValue}
      defaultValue={defaultValue}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          required
          {...params}
          variant="standard"
          label={label}
          placeholder={placeholder}
          onChange={handleChangeTextField}
        />
      )}
    />
  );
};

export default AutoCompleteField;
