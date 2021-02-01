import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { getCategoryClient } from "client/category";
import { getCustomerClient } from "client/customer";
import { getProductClient } from "client/product";
import { getTagClient } from "client/tag";
import React, { useState } from "react";
import { defaultReward, defaultScope } from "../constant";

async function searchProductList(q) {
  return await getProductClient().searchProductListFromClient(q, "");
}

async function searchCustomerList(q) {
  return await getCustomerClient().getCustomerClient(q);
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
    "gift"
  );
}

const AutoCompleteField = (props) => {
  const { label, options, defaultValue, placeholder, type } = props;

  const { handleChange } = props;

  const [productList, setProductList] = useState([]);

  const fetchOptions = async (type, value) => {
    switch (type) {
      case defaultScope.product:
        return await searchProductList(value);
      case defaultScope.customer:
        return await searchCustomerList(value);
      case defaultScope.productCatergory:
        return await searchCategoryList(value);
      case defaultScope.productTag:
        return await searchTagList(value);
      case defaultReward.gift:
        return await searchGiftList(value);
      default:
        return { status: "ERROR" };
    }
  };

  const handleChangeTextField = async (event) => {
    setProductList([]);
    let value = event.target.value;
    if (value != "") {
      let res = await fetchOptions(type, value);
      console.log(res, "res");
      if (res?.status == "OK") {
        console.log(res, "res");
        setProductList(res.data);
      } else {
        setProductList([]);
      }
    }
  };

  return (
    <Autocomplete
      fullWidth
      multiple
      options={productList.length > 0 ? productList : options}
      onChange={handleChange}
      getOptionLabel={(option) => option.name}
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
