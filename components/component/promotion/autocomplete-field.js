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
import { displayNameBasedOnCondition } from "../util";

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
    multiple,
    required,
    name,
    useForm,
    disabled,
    condition,
    reward,
    arr,
    index,
  } = props;

  const { control, errors, getValues } = useForm;

  let [productList, setProductList] = useState(
    defaultValue ? defaultValue : []
  );

  const validateDuplicateCondition = () => {
    let value = getValues();
    let status = "";
    let itemName = displayNameBasedOnCondition(value.condition) + index;
    if (value["seller" + index].length != 0 && value[itemName] != "") {
      let sellerString = "";
      let itemString = "";
      let objString = "";

      value["seller" + index]
        .sortBy("name")
        .map((seller) => (sellerString += JSON.stringify(seller)));
      itemString = JSON.stringify(value[itemName]);
      objString = sellerString + itemString;

      arr.map((_o, idx) => {
        let _itemName = displayNameBasedOnCondition(value.condition) + idx;

        let _sellerString = "";
        let _itemString = "";
        let _objString = "";

        if (
          value["seller" + idx].length != 0 &&
          value[_itemName] != "" &&
          idx != index
        ) {
          value["seller" + idx]
            .sortBy("name")
            .map((seller) => (_sellerString += JSON.stringify(seller)));
          _itemString = JSON.stringify(value[_itemName]);
          _objString = _sellerString + _itemString;

          if (objString == _objString) {
            status = "Điều kiện bị trùng";
          }
        }
      });
    }

    return status == "" ? true : status;
  };

  const validateDuplicateGift = () => {
    let value = getValues();
    let status = "";
    if (value["gift" + index] != "") {
      let itemString = "";

      itemString = JSON.stringify(value["gift" + index]);

      arr.map((_o, idx) => {
        let _itemString = "";

        if (value["gift" + idx] != "" && idx != index) {
          _itemString = JSON.stringify(value["gift" + idx]);

          if (itemString == _itemString) {
            status = "Điều kiện bị trùng";
          }
        }
      });
    }

    return status == "" ? true : status;
  };

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
    let value = event.target.value;
    let res = await fetchOptions(type, value);
    if (res?.status == "OK") {
      let arr = res.data;
      if (
        (multiple &&
          Array.isArray(value[name]) &&
          value[name].length > 0 &&
          value[name][0].name != "Chọn tất cả") ||
        (multiple && Array.isArray(value[name]) && value[name].length == 0)
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
    let codeList = [];
    let newArr = [];
    let _value = getValues();

    if (Array.isArray(_value[name])) {
      _value[name].map(({ code, name }) => {
        codeList.push(name == "Chọn tất cả" ? null : code);
      });
      newArr = productList.filter((val) => !codeList.includes(val.code));

      if (multiple && productList[0].name != "Chọn tất cả") {
        newArr.unshift({
          name: "Chọn tất cả",
        });
      }
      if (_value[name].length > 0 && _value[name][0].name == "Chọn tất cả")
        newArr = newArr.filter((o) => o.name != "Chọn tất cả");

      return newArr;
    }

    return productList;
  };

  return (
    <Controller
      name={name}
      render={(render) => (
        <Autocomplete
          disabled={disabled}
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
            render.onChange(value);
          }}
          getOptionLabel={(option) => (option?.name ? option.name : "")}
          value={render.value}
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
      rules={{
        validate: (d) => {
          if (required && (d == "" || (multiple && d.length == 0))) {
            return "Không được bỏ trống";
          } else if (condition) {
            return validateDuplicateCondition();
          } else if (reward) {
            return validateDuplicateGift();
          }
        },
      }}
      control={control}
      defaultValue={defaultValue}
    />
  );
};

export default AutoCompleteField;
