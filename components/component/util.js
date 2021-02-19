import {
  defaultNameRulesQuantity,
  defaultNameRulesValue,
  defaultPromotionOrganizer,
  defaultPromotionStatus,
  defaultPromotionType,
  defaultReward,
  defaultRulePromotion,
  defaultScope,
  defaultTypeConditionsRule,
} from "./constant";

export function currencyFormat(num) {
  return formatNumber(num) + "đ";
}

export function formatNumber(num) {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function displayRule(rule) {
  let result = [];
  if (rule.field === defaultRulePromotion.MIN_QUANTITY) {
    let { conditions, field, type } = rule;
    conditions?.forEach((condition) => {
      if (type === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
        result.push(
          `+ Giảm giá: ${condition.percent}% tối đa ${currencyFormat(
            condition.maxDiscountValue
          )}`
        );
        result.push(
          <div>
            &nbsp;&nbsp;&nbsp;Số lượng sản phẩm từ:{" "}
            {formatNumber(condition.minQuantity)}
          </div>
        );
      } else if (type === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE) {
        result.push(`+ Giảm giá: ${currencyFormat(condition.discountValue)}`);
        result.push(
          <div>
            &nbsp;&nbsp;&nbsp;Số lượng sản phẩm từ:{" "}
            {formatNumber(condition.minQuantity)}
          </div>
        );
      }
    });
  } else {
    let { conditions, field, type } = rule;
    conditions?.forEach((condition) => {
      if (type === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
        result.push(`+ Giảm giá: ${condition.percent}%`);
        result.push(
          <div>
            &nbsp;&nbsp;&nbsp;Cho đơn hàng từ:{" "}
            {currencyFormat(condition.minOrderValue)}
          </div>
        );
      } else if (type === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE) {
        result.push(`+ Giảm giá: ${currencyFormat(condition.discountValue)}`);
        result.push(
          <div>
            &nbsp;&nbsp;&nbsp;Cho đơn hàng từ:{" "}
            {currencyFormat(condition.minOrderValue)}
          </div>
        );
      }
    });
  }

  return result;
}

export function formatTime(time) {
  if (!time || time === "") {
    return "Không giới hạn";
  }
  if (Number.isInteger(time)) {
    return new Intl.DateTimeFormat("vi", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(time * 1000));
  } else {
    if (time) {
      return new Intl.DateTimeFormat("vi", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date(time));
    } else {
      return "Không xác định...";
    }
  }
}

export function formatUTCTime(time) {
  let result = "";
  let date = new Date(time);
  let year = date.getUTCFullYear();
  let month =
    date.getMonth() + 1 < 10
      ? ("0" + (date.getMonth() + 1)).slice(-2)
      : date.getMonth() + 1;
  let day =
    date.getDate() < 10 ? ("0" + date.getDate()).slice(-2) : date.getDate();
  let hour =
    date.getHours() < 10 ? ("0" + date.getHours()).slice(-2) : date.getHours();
  let minute =
    date.getMinutes() < 10
      ? ("0" + date.getMinutes()).slice(-2)
      : date.getMinutes();
  result = year + "-" + month + "-" + day + "T" + hour + ":" + minute;
  return result;
}

export function getPromotionOrganizer(organizer) {
  let scope = "Không xác định";
  switch (organizer) {
    case defaultPromotionOrganizer.COORPORATE:
      return "Chương trình hợp tác của 2 bên";
    case defaultPromotionOrganizer.MARKETPLACE:
      return "Chương trình của riêng sàn";
    case defaultPromotionOrganizer.SELLER:
      return "Chương trình của riêng nhà bán hàng";
  }
  return scope;
}

export function getPromotionScope(objects) {
  let scope = "Không xác định";
  objects?.forEach((obj) => {
    if (obj.scope) {
      scope = displayLabelBasedOnScope(obj.scope);
      return scope;
    }
  });
  return scope;
}

export function displayStatus(status) {
  switch (status) {
    case defaultPromotionStatus.WAITING:
      return "Chờ kích hoạt";
    case defaultPromotionStatus.ACTIVE:
      return "Đang chạy";
    case defaultPromotionStatus.FULL:
      return "Hết số lượng";
    case defaultPromotionStatus.DELETED:
      return "Đã xóa";
    case defaultPromotionStatus.EXPIRED:
      return "Hết hạn";
    default:
      return "Không xác định";
  }
}

export function displayTime(time) {
  return time?.substring(0, time.length - 4) || "";
}

export function displayPromotionType(type) {
  switch (type) {
    case defaultPromotionType.COMBO:
      return "Combo linh hoạt";
    case defaultPromotionType.FREESHIP:
      return "Miễn phí vận chuyển";
    case defaultPromotionType.VOUCHER_CODE:
      return "Mã khuyến mãi (Voucher)";
    default:
      return "Không xác định";
  }
}

export function displayLabelBasedOnScope(type) {
  switch (type) {
    case defaultScope.customerLevel:
      return "Áp dụng cho đối tượng khách hàng";
    case defaultScope.area:
      return "Khu vực áp dụng";
    default:
      return "";
  }
}

export function displayNameBasedOnScope(type) {
  switch (type) {
    case defaultScope.customerLevel:
      return "customerLevel";
    case defaultScope.area:
      return "area";
    default:
      return "";
  }
}

export function displayLabelBasedOnCondition(type) {
  switch (type) {
    case "PRODUCT_CATEGORY":
      return "Danh mục sản phẩm";
    case "PRODUCT":
      return "Tên sản phẩm";
    case "PRODUCER":
      return "Nhà sản xuất";
    case "INGREDIENT":
      return "Thành phần";
    case "PRODUCT_TAG":
      return "Tag sản phẩm";
    default:
      return "";
  }
}

export function displayNameBasedOnCondition(type) {
  switch (type) {
    case "PRODUCT_CATEGORY":
      return "productCategory";
    case "PRODUCT":
      return "product";
    case "PRODUCER":
      return "producer";
    case "INGREDIENT":
      return "ingredient";
    case "PRODUCT_TAG":
      return "productTag";
    default:
      return "";
  }
}

export function displayNameBasedOnReward(type) {
  switch (type) {
    case defaultReward.absolute:
      return "absolute";
    case defaultReward.gift:
      return "gift";
    case defaultReward.percentage:
      return "percentage";
    case defaultReward.point:
      return "point";
    default:
      break;
  }
}

export function limitText(text, size) {
  if (text?.length > size) {
    text = text.slice(0, size) + "...";
  }
  return text;
}

export const renderScopeOptionName = (option, index) => {
  let text = option + index;
  return text;
};

export const renderConditionVariableName = (option, variableName, index) => {
  let text = option + variableName + index;
  return text;
};

export function displayNameRule(promotionOption, nameValue, index) {
  switch (promotionOption) {
    case defaultRulePromotion.MIN_ORDER_VALUE:
      return defaultNameRulesValue[nameValue] + index;
    case defaultRulePromotion.MIN_QUANTITY:
      return defaultNameRulesQuantity[nameValue] + index;
  }
}

export function removeElement(array, elem) {
  let index = array.indexOf(elem);
  if (index > -1) {
    array.splice(index, 1);
  }
}

export function displayUsage(usage) {
  if (usage === 0) {
    return "Không giới hạn";
  }
  return usage;
}

export function displayPromotionReward(type) {
  switch (type) {
    case defaultReward.absolute:
      return "Giảm giá tuyệt đối";
    case defaultReward.gift:
      return "Quà tặng";
    case defaultReward.point:
      return "Điểm thành viên";
    case defaultReward.precentage:
      return "Giảm giá theo %";
  }
}
