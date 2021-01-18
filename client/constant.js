export const constURL = {
    PREFIX_PRODUCT: `/marketplace/product/v1`,
    PREFIX_MASTER: `/core/master-data/v1`,
    PREFIX_PRICING: `/marketplace/pricing/v1`,
    PREFIX_PROMOTION: `/marketplace/promotion/v1`
}

export const queryParamGetProductGift = "GIFT"

export const defaultPromotionType = {
    COMBO: "COMBO",
    VOUCHER_CODE: "VOUCHERCODE",
    FREESHIP: " FREESHIP",
}

export const defaultPromotionScope = {
    GLOBAL: "GLOBAL",
    SELLER: "SELLER",
    CATEGORY: "CATEGORY",
    PRODUCT: "PRODUCT",
    SKU: "SKU",
}

export const defaultPromotionStatus = {
    WAITING: "WAITING",
    ACTIVE: "ACTIVE",
    FULL: "FULL",
    HIDE: "HIDE",
    EXPIRED: "EXPIRED",
    DELETED: "DELETED",
}

export const defaultRulePromotion = {
    MIN_QUANTITY: "MIN_QUANTITY",
    MIN_ORDER_VALUE: "MIN_ORDER_VALUE"
}

export const defaultTypeConditionsRule = {
    DISCOUNT_ORDER_VALUE: "VALUE",
    GIFT: "GIFT",
    PRODUCT_GIFT: "PRODUCT_GIFT",
    DISCOUNT_PERCENT: "PERCENT",
}

export const defaultTypeProduct = {
    ALL: "ALL",
    MANY: "MANY"
}

export const defaultUseTypePromotion = {
    ALONE: "ALONE",
    MANY: "MANY"
}

export const defaultNameRulesValue = {
    priceMinValue: "priceMinValue",
    priceMinValuePercent: "priceMinValuePercent",
    priceMaxDiscountValue: "priceMaxDiscountValue",
    percentValue: "percentValue",
    priceDiscountValue: "priceDiscountValue",
    gift: "gift",
    productGift: "productGift"
}

export const defaultNameRulesQuantity = {
    priceMinValue: "minQuantity",
    priceMinValuePercent: "quantityMinValuePercent",
    priceMaxDiscountValue: "quantityMaxDiscountValue",
    percentValue: "quantityPercentValue",
    priceDiscountValue: "quantityDiscountValue",
    gift: "quantityGift",
    productGift: "quantityProductGift"
}

export const defaultConditionInfo = {
    percent: "percent",
    maxDiscountValue: "maxDiscountValue",
    minOrderValue: "minOrderValue",
    minQuantity: "minQuantity",
    discountValue: "discountValue",
    products: "products"
}

export function setRulesPromotion(typePromotion,typeRule,value,index,listGiftPromotion,listGiftProductPromotion) {
    console.log('value',value)
    let result = {}
    let conditions = []
    switch (typePromotion){
        case defaultRulePromotion.MIN_QUANTITY:
            result = {
                ...result,
                field: defaultRulePromotion.MIN_QUANTITY,
            }
            if (typeRule === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE) {
                for (let i = 0; i < index; i ++) {
                    conditions.push({
                        minQuantity: parseInt(value[defaultNameRulesQuantity.priceMinValue + i]),
                        discountValue: parseInt(value[defaultNameRulesQuantity.priceDiscountValue + i]),
                    })
                }
                result = {
                    ...result,
                    type: defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE,
                    conditions: conditions,
                }
            }else if (typeRule === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                for (let i = 0; i < index; i ++) {
                    conditions.push({
                        minQuantity: parseInt(value[defaultNameRulesQuantity.priceMinValuePercent + i]),
                        maxDiscountValue: parseInt(value[defaultNameRulesQuantity.priceMaxDiscountValue + i]),
                        percent: parseInt(value[defaultNameRulesQuantity.percentValue+i]),
                    })
                }
                result = {
                    ...result,
                    type: defaultTypeConditionsRule.DISCOUNT_PERCENT,
                    conditions: conditions,
                }
            }else if (typeRule === defaultTypeConditionsRule.GIFT) {

            }
            break
        case defaultRulePromotion.MIN_ORDER_VALUE:
            result = {
                ...result,
                field: defaultRulePromotion.MIN_ORDER_VALUE,
            }
            if (typeRule === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE) {
                for (let i = 0; i < index; i ++) {
                    conditions.push({
                        minOrderValue: parseInt(value[defaultNameRulesValue.priceMinValue + i]),
                        discountValue: parseInt(value[defaultNameRulesValue.priceDiscountValue + i]),
                    })
                }
                result = {
                    ...result,
                    type: defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE,
                    conditions: conditions,
                }
            }else if (typeRule === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                for (let i = 0; i < index; i ++) {
                    conditions.push({
                        minOrderValue: parseInt(value[defaultNameRulesValue.priceMinValuePercent + i]),
                        maxDiscountValue: parseInt(value[defaultNameRulesValue.priceMaxDiscountValue + i]),
                        percent: parseInt(value[defaultNameRulesValue.percentValue+i]),
                    })
                }
                result = {
                    ...result,
                    type: defaultTypeConditionsRule.DISCOUNT_PERCENT,
                    conditions: conditions,
                }
            }
            break
    }
    return result
}

export function setScopeObjectPromontion(promotionScope,listProducts) {
    return [{
        scope: promotionScope,
        type: listProducts.length > 0 ? defaultTypeProduct.MANY : defaultTypeProduct.ALL,
        products: listProducts
    }]
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
        promotionUseType: promotion.useType,
        listCategoryPromotion: [],
        conditions: [],
    }
    let rule = promotion.rule
    if (rule.field === defaultRulePromotion.MIN_QUANTITY) {
        result.promotionOption = defaultRulePromotion.MIN_QUANTITY
        result.promotionTypeRule = rule.type
    }else {
        result.promotionOption = defaultRulePromotion.MIN_ORDER_VALUE
        result.promotionTypeRule = rule.type
    }
    let {conditions} = rule.conditions
    conditions?.forEach((condition,index) => {
        result.promotionRulesLine.push({id: index})
    })
    result = {
        ...result,
        conditions: conditions,
        listProductIDs: promotion.objects[0].products || []
    }
    return result
}

export function parseConditionValue(conditions,typePromotion,promotionTypeCondition,conditionInfo,index) {
    switch (typePromotion) {
        case defaultRulePromotion.MIN_ORDER_VALUE:
            if (promotionTypeCondition === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE){
                if (conditionInfo === defaultNameRulesValue.priceMinValue+index) {
                    return conditions[index]?conditions[index][defaultConditionInfo.minOrderValue] : ""
                }
                if (conditionInfo === defaultNameRulesValue.priceDiscountValue+index) {
                    return conditions[index]?conditions[index][defaultConditionInfo.discountValue] : ""
                }
            }
            if (promotionTypeCondition === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                if (conditionInfo === defaultNameRulesValue.priceMinValuePercent+index) {
                    return conditions[index]?conditions[index][defaultConditionInfo.minOrderValue] : ""
                }
                if (conditionInfo === defaultNameRulesValue.percentValue+index) {
                    return conditions[index]?conditions[index][defaultConditionInfo.percent]: ""
                }
                if (conditionInfo === defaultNameRulesValue.maxDiscountValue+index) {
                    return conditions[index]?conditions[index][defaultConditionInfo.maxDiscountValue] : ""
                }
            }
            break
        case defaultRulePromotion.MIN_QUANTITY:
            if (promotionTypeCondition === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE){
                if (conditionInfo === defaultNameRulesQuantity.priceMinValue+index) {
                    return conditions[index]?conditions[index][defaultConditionInfo.priceMinValuePercent]: ""
                }
                if (conditionInfo === defaultNameRulesQuantity.priceDiscountValue+index) {
                    return conditions[index]?conditions[index][defaultConditionInfo.discountValue]: ""
                }
            }
            if (promotionTypeCondition === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                if (conditionInfo === defaultNameRulesQuantity.priceMinValuePercent+index) {
                    return conditions[index]?conditions[index][defaultConditionInfo.minQuantity]: ""
                }
                if (conditionInfo === defaultNameRulesQuantity.percentValue+index) {
                    return conditions[index]?conditions[index][defaultConditionInfo.percent]: ""
                }
                if (conditionInfo === defaultNameRulesQuantity.priceMaxDiscountValue+index) {
                    return conditions[index]?conditions[index][defaultConditionInfo.maxDiscountValue]: ""
                }
            }
            break
    }
}

export function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + "đ"
 }

export function displayRule(rule) {
    let result = ""
    if (rule.field === defaultRulePromotion.MIN_QUANTITY) {
        let {conditions,field,type} = rule
        conditions?.forEach(condition => {
            if (type === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                result +=result +`Giảm giá: ${condition.percent}% \\n Số lượng sản phẩm từ: ${condition.minQuantity}\\n`
            }else if (type === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE) {
                result +=result +`Giảm giá: ${currencyFormat(condition.discountValue)}đ \n Số lượng sản phẩm từ: ${condition.minQuantity} \n`
            }
        })
    } else {
        let {conditions,field,type} = rule
        conditions?.forEach(condition => {
            if (type === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                result +=result +`Giảm giá: ${condition.percent}% \n Cho đơn hàng từ: ${condition.minOrderValue} \n`
            }else if (type === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE) {
                result +=result +`Giảm giá: ${currencyFormat(condition.discountValue)} \n Cho đơn hàng từ: ${currencyFormat(condition.minOrderValue)} \n`
            }
        })
    }

    return result
}

export function displayPromotionScope(promotionScope) {
    switch (promotionScope) {
        case defaultPromotionScope.GLOBAL:
            return "Toàn sàn"
        case defaultPromotionScope.CATEGORY:
            return "Danh mục sản phẩm"
        case defaultPromotionScope.PRODUCT:
            return "Sản phẩm được chọn"
        case defaultPromotionScope.SELLER:
            return "Toàn gian hàng"
        case defaultPromotionScope.SKU:
            return "Sản phẩm của gian hàng"
        default:
            return "Không xác định"
    }
}

export function getPromotionScope(objects) {
    let scope = "Không xác định";
    objects?.forEach(obj => {
        if (obj.scope) {
            scope = displayPromotionScope(obj.scope)
            return scope
        }
    });
    return scope;
}

export function displayStatus(status) {
    switch (status) {
        case defaultPromotionStatus.WAITING:
            return "Chờ kích hoạt"
        case defaultPromotionStatus.ACTIVE:
            return "Đang chạy"
        case defaultPromotionStatus.FULL:
            return "Hết số lượng"
        case defaultPromotionStatus.DELETED:
            return "Đã xóa"
        case defaultPromotionStatus.EXPIRED:
            return "Hết hạn"
        default:
            return "Không xác định"
    }
}

export function displayTime(time) {
    return time.substring(0,time.length-4)
}

export function displayPromotionType(type) {
    switch (type){
        case defaultPromotionType.COMBO:
            return "Combo linh hoạt"
        case defaultPromotionType.FREESHIP:
            return "Miễn phí vận chuyển"
        case defaultPromotionType.VOUCHER_CODE:
            return "Mã giảm giá"
        default:
            return "Không xác định"
    }
}


export function limitText(text, size) {
    if (text?.length > size) {
        text = text.slice(0, size) + '...';
    }
    return text
}

export function displayNameRule(promotionOption,nameValue,index) {
    switch (promotionOption){
        case defaultRulePromotion.MIN_ORDER_VALUE:
            return defaultNameRulesValue[nameValue] + index
        case defaultRulePromotion.MIN_QUANTITY:
            return defaultNameRulesQuantity[nameValue] + index
    }
}
