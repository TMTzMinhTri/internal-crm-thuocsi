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

export const defaultRulePromotion = {
    MIN_QUANTITY: "min_quantity",
    MIN_ORDER_VALUE: "min_order_value"
}

export const defaultTypeConditionsRule = {
    DISCOUNT_ORDER_VALUE: "discount_order_value",
    GIFT: "gift",
    PRODUCT_GIFT: "product_gift",
    DISCOUNT_PERCENT: "percent",
}

export const mapNamePromotionDefaultRule = {
    minQuantity: "min_quantity",
    minOrderValue: "min_order_value",
}


export const defaultNameRulesValue = {
    priceMinValue: "priceMinValue",
    priceMinValuePercent: "priceMinValuePercent",
    priceMaxDiscountValue: "priceMaxDiscountValue",
    percentValue: "percentValue",
    priceDiscountValue: "priceDiscountValue",
}

export const defaultNameRulesQuantity = {
    priceMinValue: "minQuantity",
    priceMinValuePercent: "quantityMinValuePercent",
    priceMaxDiscountValue: "quantityMaxDiscountValue",
    percentValue: "quantityPercentValue",
    priceDiscountValue: "quantityDiscountValue"
}

export const defaultConditionInfo = {
    percent: "percent",
    maxDiscountValue: "maxDiscountValue",
    minOrderValue: "minOrderValue",
    minQuantity: "minQuantity",
    discountValue: "discountValue",
    products: "products"
}

export const defaultValidateNameRuleValue = {

}

export function setRulesPromotion(typePromotion,typeRule,value,index,listProduct) {
    console.log('value',value)
    let result = {}
    let conditions = []
    switch (typePromotion){
        case defaultRulePromotion.MIN_QUANTITY:
            result = {
                ...result,
                minOrderValue: {},
                minQuantity: {
                    field: defaultRulePromotion.MIN_QUANTITY,
                }
            }
            if (typeRule === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE) {
                for (let i = 0; i < index; i ++) {
                    conditions.push({
                        minQuantity: parseInt(value[defaultNameRulesQuantity.priceMinValuePercent + i]),
                        discountValue: parseInt(value[defaultNameRulesQuantity.priceDiscountValue + i]),
                        products: listProduct,
                    })
                }
                result = {
                    ...result,
                    minQuantity: {
                        ...result.minQuantity,
                        type: defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE,
                        conditions: conditions,
                    }
                }
            }else if (typeRule === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                for (let i = 0; i < index; i ++) {
                    conditions.push({
                        minQuantity: parseInt(value[defaultNameRulesQuantity.percentValue + i]),
                        maxDiscountValue: parseInt(value[defaultNameRulesQuantity.priceMaxDiscountValue + i]),
                        percent: parseInt(value[defaultNameRulesQuantity.priceMinValuePercent+i]),
                        products: listProduct,
                    })
                }
                result = {
                    ...result,
                    minQuantity: {
                        ...result.minQuantity,
                        type: defaultTypeConditionsRule.DISCOUNT_PERCENT,
                        conditions: conditions,
                    }
                }
            }
            break
        case defaultRulePromotion.MIN_ORDER_VALUE:
            result = {
                ...result,
                minQuantity: {},
                minOrderValue: {
                    field: defaultRulePromotion.MIN_ORDER_VALUE,
                }
            }
            if (typeRule === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE) {
                for (let i = 0; i < index; i ++) {
                    conditions.push({
                        minOrderValue: parseInt(value[defaultNameRulesValue.priceMinValue + i]),
                        discountValue: parseInt(value[defaultNameRulesValue.priceDiscountValue + i]),
                        products: listProduct,
                    })
                }
                result = {
                    ...result,
                    minOrderValue: {
                        ...result.minOrderValue,
                        type: defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE,
                        conditions: conditions,
                    }
                }
            }else if (typeRule === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                for (let i = 0; i < index; i ++) {
                    conditions.push({
                        minOrderValue: parseInt(value[defaultNameRulesValue.priceMinValuePercent + i]),
                        maxDiscountValue: parseInt(value[defaultNameRulesValue.priceMaxDiscountValue + i]),
                        percent: parseInt(value[defaultNameRulesValue.percentValue+i]),
                        products: listProduct,
                    })
                }
                result = {
                    ...result,
                    minOrderValue: {
                        ...result.minOrderValue,
                        type: defaultTypeConditionsRule.DISCOUNT_PERCENT,
                        conditions: conditions,
                    }
                }
            }
            break
    }
    return result
}

export function parseRuleToObject(promotion) {
    let result = {
        promotionOption: "",
        promotionTypeRule: "",
        promotionScope: promotion.scope,
        listGiftPromotion: [{
            gift: {},
            quantity: 0,
        }],
        promotionRulesLine: [],
        listProductPromotion: [],
        listProductDefault: [],
        listCategoryPromotion: [],
        conditions: [],
    }
    let {minOrderValue,minQuantity} = promotion.rule
    if (minQuantity.field) {
        result.promotionOption = defaultRulePromotion.MIN_QUANTITY
        result.promotionTypeRule = minQuantity.type
    }else {
        result.promotionOption = defaultRulePromotion.MIN_ORDER_VALUE
        result.promotionTypeRule = minOrderValue.type
    }
    let {conditions} = minQuantity.field? minQuantity : minOrderValue
    result.conditions = conditions
    conditions.forEach((condition,index) => {
        result.promotionRulesLine.push({id: index})
        if (condition.products) {
            return result.listProductPromotion.concat(condition.products)
        }
    })
    result.listProductPromotion = [... new Set(result.listProductPromotion)]
    return result
}

export function parseConditionValue(conditions,typePromotion,promotionTypeCondition,conditionInfo,index) {
    switch (typePromotion) {
        case defaultRulePromotion.MIN_ORDER_VALUE:
            if (promotionTypeCondition === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE){
                if (conditionInfo === defaultNameRulesValue.priceMinValue+index) {
                    return conditions[index][defaultConditionInfo.minOrderValue]
                }
                if (conditionInfo === defaultNameRulesValue.priceDiscountValue+index) {
                    return conditions[index][defaultConditionInfo.discountValue]
                }
            }
            if (promotionTypeCondition === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                if (conditionInfo === defaultNameRulesValue.priceMinValuePercent+index) {
                    return conditions[index][defaultConditionInfo.minOrderValue]
                }
                if (conditionInfo === defaultNameRulesValue.percentValue+index) {
                    return conditions[index][defaultConditionInfo.percent]
                }
                if (conditionInfo === defaultNameRulesValue.maxDiscountValue+index) {
                    return conditions[index][defaultConditionInfo.maxDiscountValue]
                }
            }
            break
        case defaultRulePromotion.MIN_QUANTITY:
            console.log('condition',conditionInfo,promotionTypeCondition,index)
            if (promotionTypeCondition === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE){
                if (conditionInfo === defaultNameRulesQuantity.priceMinValue+index) {
                    console.log('1',conditions[index][defaultConditionInfo.priceMinValuePercent])
                    return conditions[index][defaultConditionInfo.priceMinValuePercent]
                }
                if (conditionInfo === defaultNameRulesQuantity.priceDiscountValue+index) {
                    console.log('2',conditions[index][defaultConditionInfo.discountValue])
                    return conditions[index][defaultConditionInfo.discountValue]
                }
            }
            if (promotionTypeCondition === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                if (conditionInfo === defaultNameRulesQuantity.priceMinValuePercent+index) {
                    console.log('3',conditions[index][defaultConditionInfo.minQuantity])
                    return conditions[index][defaultConditionInfo.minQuantity]
                }
                if (conditionInfo === defaultNameRulesQuantity.percentValue+index) {
                    console.log('4', conditions[index][defaultConditionInfo.percent])
                    return conditions[index][defaultConditionInfo.percent]
                }
                console.log(defaultNameRulesQuantity.maxDiscountValue+index)
                if (conditionInfo === defaultNameRulesQuantity.maxDiscountValue+index) {
                    console.log('5',conditions[index][defaultConditionInfo.maxDiscountValue])
                    return conditions[index][defaultConditionInfo.maxDiscountValue]
                }
            }
            break
    }
}

export function displayRule(rule) {
    let result = ""
    let {minQuantity,minOrderValue} = rule
    if (minQuantity?.field) {
        let {conditions,field,type} = minQuantity
        conditions.forEach(condition => {
            if (type === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                result +=result +`Giảm giá: ${condition.percent}% \\n Số lượng sản phẩm từ: ${condition.minQuantity}\\n`
            }else if (type === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE) {
                result +=result +`Giảm giá: ${condition.discountValue}đ \n Số lượng sản phẩm từ: ${condition.minQuantity} \m `
            }
        })
    }else {
        let {conditions,field,type} = minOrderValue
        conditions.forEach(condition => {
            if (type === defaultTypeConditionsRule.DISCOUNT_PERCENT) {
                result +=result +`Giảm giá: ${condition.percent}% \n Cho đơn hàng từ: ${condition.minOrderValue} \n`
            }else if (type === defaultTypeConditionsRule.DISCOUNT_ORDER_VALUE) {
                result +=result +`Giảm giá: :${condition.discountValue}đ \n Cho đơn hàng từ: ${condition.minOrderValue} \n`
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
