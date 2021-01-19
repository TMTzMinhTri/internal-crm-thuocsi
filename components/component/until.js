import {
    defaultConditionInfo,
    defaultNameRulesQuantity,
    defaultNameRulesValue,
    defaultPromotionScope,
    defaultPromotionStatus,
    defaultPromotionType,
    defaultRulePromotion,
    defaultTypeConditionsRule,
    defaultTypeProduct,
} from "./constant";

export function setRulesPromotion(
    typePromotion,
    typeRule,
    value,
    index,
    listGiftPromotion,
    listGiftProductPromotion
) {
    let result = {};
    let conditions = [];
    switch (typePromotion) {
        case defaultRulePromotion.MIN_QUANTITY:
            result = {
                ...result,
                field: defaultRulePromotion.MIN_QUANTITY,
            };
            if (typeRule === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE) {
                for (let i = 0; i < index; i++) {
                    conditions.push({
                        minQuantity: parseInt(
                            value[defaultNameRulesQuantity.priceMinValue + i]
                        ),
                        discountValue: parseInt(
                            value[defaultNameRulesQuantity.priceDiscountValue + i]
                        ),
                    });
                }
                result = {
                    ...result,
                    type: defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE,
                    conditions: conditions,
                };
            } else if (typeRule === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                for (let i = 0; i < index; i++) {
                    conditions.push({
                        minQuantity: parseInt(
                            value[defaultNameRulesQuantity.priceMinValuePercent + i]
                        ),
                        maxDiscountValue: parseInt(
                            value[defaultNameRulesQuantity.priceMaxDiscountValue + i]
                        ),
                        percent: parseInt(value[defaultNameRulesQuantity.percentValue + i]),
                    });
                }
                result = {
                    ...result,
                    type: defaultTypeConditionsRule.DISCOUNT_PERCENT,
                    conditions: conditions,
                };
            } else if (typeRule === defaultTypeConditionsRule.GIFT) {
            }
            break;
        case defaultRulePromotion.MIN_ORDER_VALUE:
            result = {
                ...result,
                field: defaultRulePromotion.MIN_ORDER_VALUE,
            };
            if (typeRule === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE) {
                for (let i = 0; i < index; i++) {
                    conditions.push({
                        minOrderValue: parseInt(
                            value[defaultNameRulesValue.priceMinValue + i]
                        ),
                        discountValue: parseInt(
                            value[defaultNameRulesValue.priceDiscountValue + i]
                        ),
                    });
                }
                result = {
                    ...result,
                    type: defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE,
                    conditions: conditions,
                };
            } else if (typeRule === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                for (let i = 0; i < index; i++) {
                    conditions.push({
                        minOrderValue: parseInt(
                            value[defaultNameRulesValue.priceMinValuePercent + i]
                        ),
                        maxDiscountValue: parseInt(
                            value[defaultNameRulesValue.priceMaxDiscountValue + i]
                        ),
                        percent: parseInt(value[defaultNameRulesValue.percentValue + i]),
                    });
                }
                result = {
                    ...result,
                    type: defaultTypeConditionsRule.DISCOUNT_PERCENT,
                    conditions: conditions,
                };
            }
            break;
    }
    return result;
}

export function setScopeObjectPromontion(promotionScope, listProducts, categoryCodes) {
    let result = [{
        scope: promotionScope,
        type: listProducts?.length > 0 || categoryCodes?.length > 0 ? defaultTypeProduct.MANY : defaultTypeProduct.ALL,
    }]
    if (listProducts?.length > 0) {
        result[0].products = listProducts
    }
    if (categoryCodes?.length > 0) {
        result[0].categoryCodes = categoryCodes
    }
    return result
}

export function parseRuleToObject(promotion) {
    let result = {
        promotionOption: "",
        promotionTypeRule: "",
        promotionScope: promotion.objects[0].scope,
        listGiftPromotion: [{
            gift: {},
            quantity: 0,
        }],
        promotionRulesLine: [],
        listProductPromotion: [],
        listProductIDs: [],
        listProductDefault: [],
        listCategoryCodes: [],
        promotionUseType: promotion.useType,
        listCategoryPromotion: [],
        conditions: [],
    }
    let rule = promotion.rule
    if (rule.field === defaultRulePromotion.MIN_QUANTITY) {
        result.promotionOption = defaultRulePromotion.MIN_QUANTITY
        result.promotionTypeRule = rule.type
    } else {
        result.promotionOption = defaultRulePromotion.MIN_ORDER_VALUE
        result.promotionTypeRule = rule.type
    }
    let {conditions} = rule
    conditions?.forEach((condition, index) => {
        result.promotionRulesLine.push({id: index})
    })
    result = {
        ...result,
        conditions: conditions,
        listProductIDs: promotion.objects[0].products || [],
        listCategoryCodes: promotion.objects[0].categoryCodes || []
    }
    return result
}

export function parseConditionValue(conditions, typePromotion, promotionTypeCondition, conditionInfo, index) {
    switch (typePromotion) {
        case defaultRulePromotion.MIN_ORDER_VALUE:
            if (promotionTypeCondition === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE) {
                if (conditionInfo === defaultNameRulesValue.priceMinValue + index) {
                    return conditions[index] ? conditions[index][defaultConditionInfo.minOrderValue] : "";
                }
                if (conditionInfo === defaultNameRulesValue.priceDiscountValue + index) {
                    return conditions[index] ? conditions[index][defaultConditionInfo.discountValue] : "";
                }
            }
            if (promotionTypeCondition === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                if (conditionInfo === defaultNameRulesValue.priceMinValuePercent + index) {
                    return conditions[index] ? conditions[index][defaultConditionInfo.minOrderValue] : "";
                }
                if (conditionInfo === defaultNameRulesValue.percentValue + index) {
                    return conditions[index] ? conditions[index][defaultConditionInfo.percent] : "";
                }
                if (conditionInfo === defaultNameRulesValue.priceMaxDiscountValue + index) {
                    return conditions[index] ? conditions[index][defaultConditionInfo.maxDiscountValue] : "";
                }
            }
            break;
        case defaultRulePromotion.MIN_QUANTITY:
            if (promotionTypeCondition === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE) {
                if (conditionInfo === defaultNameRulesQuantity.priceMinValue + index) {
                    return conditions[index] ? conditions[index][defaultConditionInfo.minQuantity] : "";
                }
                if (conditionInfo === defaultNameRulesQuantity.priceDiscountValue + index) {
                    return conditions[index] ? conditions[index][defaultConditionInfo.discountValue] : "";
                }
            }
            if (promotionTypeCondition === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                if (conditionInfo === defaultNameRulesQuantity.priceMinValuePercent + index) {
                    return conditions[index] ? conditions[index][defaultConditionInfo.minQuantity] : "";
                }
                if (conditionInfo === defaultNameRulesQuantity.percentValue + index) {
                    return conditions[index] ? conditions[index][defaultConditionInfo.percent] : "";
                }
                if (conditionInfo === defaultNameRulesQuantity.priceMaxDiscountValue + index) {
                    return conditions[index] ? conditions[index][defaultConditionInfo.maxDiscountValue] : "";
                }
            }
            break;
    }
}

export function currencyFormat(num) {
    return formatNumber(num) + "đ";
}

export function formatNumber(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function displayRule(rule) {
    let result = [];
    if (rule.field === defaultRulePromotion.MIN_QUANTITY) {
        let {conditions, field, type} = rule;
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
        let {conditions, field, type} = rule;
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
    time = time.substring(0, time.length - 4);
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

export function displayPromotionScope(promotionScope) {
    switch (promotionScope) {
        case defaultPromotionScope.GLOBAL:
            return "Toàn sàn";
        case defaultPromotionScope.CATEGORY:
            return "Danh mục sản phẩm";
        case defaultPromotionScope.PRODUCT:
            return "Sản phẩm được chọn";
        case defaultPromotionScope.SELLER:
            return "Toàn gian hàng";
        case defaultPromotionScope.SKU:
            return "Sản phẩm của gian hàng";
        default:
            return "Không xác định";
    }
}

export function getPromotionScope(objects) {
    let scope = "Không xác định";
    objects?.forEach((obj) => {
        if (obj.scope) {
            scope = displayPromotionScope(obj.scope);
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
    return time.substring(0, time.length - 4);
}

export function displayPromotionType(type) {
    switch (type) {
        case defaultPromotionType.COMBO:
            return "Combo linh hoạt";
        case defaultPromotionType.FREESHIP:
            return "Miễn phí vận chuyển";
        case defaultPromotionType.VOUCHER_CODE:
            return "Mã giảm giá";
        default:
            return "Không xác định";
    }
}

export function limitText(text, size) {
    if (text?.length > size) {
        text = text.slice(0, size) + "...";
    }
    return text;
}

export function displayNameRule(promotionOption, nameValue, index) {
    switch (promotionOption) {
        case defaultRulePromotion.MIN_ORDER_VALUE:
            return defaultNameRulesValue[nameValue] + index;
        case defaultRulePromotion.MIN_QUANTITY:
            return defaultNameRulesQuantity[nameValue] + index;
    }
}