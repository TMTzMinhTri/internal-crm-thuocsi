import { makeStyles, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { getAreaClient } from "client/area";
import { getCategoryClient } from "client/category";
import { getCustomerClient } from "client/customer";
import { getProducerClient } from "client/producer";
import { getProductClient } from "client/product";
import { getSellerClient } from "client/seller";
import { getTagClient } from "client/tag";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { defaultCondition, defaultReward, defaultScope } from "../constant";

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
  return await getProducerClient().getProducerClient(q);
}

async function searchSellerList(q) {
  return await getSellerClient().getSellerClient(0, 20, q);
}

async function searchIngredientList(q) {
  return await getProductClient().getIngredientList(q);
}

const useStyles = makeStyles({
  inputRoot: {
    marginTop: "30px !important",
  },
});

const AutoCompleteField = (props) => {
  const classes = useStyles();
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
    errors,
  } = props;

  const { handleChange } = props;

  let [productList, setProductList] = useState(
    defaultValue ? defaultValue : []
  );

  const fetchOptions = async (type, value) => {
    switch (type) {
      case defaultCondition.product:
        return await searchProductList(value);
      case defaultScope.area:
        return await searchAreaList(value);
      case defaultScope.customerLevel:
        return await searchCustomerList();
      case defaultCondition.productCategory:
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
    console.log(defaultValue);
    setProductList([]);
    let value = event.target.value;
    let res = await fetchOptions(type, value);
    if (res?.status == "OK") {
      let arr = res.data;
      if (
        (multiple &&
          Array.isArray(defaultValue) &&
          defaultValue.length > 0 &&
          defaultValue[0].name != "Chọn tất cả") ||
        (multiple && defaultValue.length == 0)
      )
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

  const renderOptions = () => {
    console.log("renderOptions");
    console.log("defaultValue", defaultValue, name);
    let codeList = [];
    let newArr = [];

    if (Array.isArray(defaultValue)) {
      defaultValue.map(({ code, name }) => {
        codeList.push(name == "Chọn tất cả" ? null : code);
      });
      newArr = productList.filter((val) => !codeList.includes(val.code));
      console.log(newArr, "newArr Before");
      if (multiple && defaultValue.length == 0) {
        console.log("reAdd");
        newArr.unshift({
          name: "Chọn tất cả",
        });
      }
      console.log(newArr, "newArr After");
      if (defaultValue.length > 0 && defaultValue[0].name == "Chọn tất cả")
        newArr = newArr.filter((o) => o.name != "Chọn tất cả");
      console.log(newArr, "newArr Final");
      return newArr;
    }

    return productList;
  };

  return (
    <Controller
      name={name}
      render={(render) => (
        <Autocomplete
          fullWidth
          multiple={multiple}
          classes={{
            inputRoot: classes.inputRoot,
          }}
          options={productList.length > 0 ? renderOptions() : options}
          onChange={(event, value) => {
            if (multiple) {
              let isAll = false;
              isAll = value.filter((o) => o.name == "Chọn tất cả");
              if (isAll.length > 0) {
                value = isAll;
              }
            }
            console.log(value, "value");
            handleChange(event, value);
            render.onChange(value);
            console.log(render.value, "render.value");
          }}
          getOptionLabel={(option) => option.name}
          value={defaultValue}
          defaultValue={defaultValue}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              error={!!errors?.[name]}
              helperText={errors?.[name]?.message}
              required={required}
              {...params}
              InputLabelProps={{
                shrink: true,
                style: {
                  color: "#353434",
                  fontSize: "20px",
                },
              }}
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
