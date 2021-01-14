export const constURL = {
    PREFIX_PRODUCT: `/marketplace/product/v1`,
    PREFIX_MASTER: `/core/master-data/v1`,
    PREFIX_PRICING: `/marketplace/pricing/v1`,
    PREFIX_PROMOTION: `/marketplace/promotion/v1`
}

export const queryParamGetProductGift = "GIFT"

export const defaultPromotionType = {
    COMBO: "COMBO",
    VOUCHER_CODE: " VOUCHERCODE",
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
    MIN_QUANTITY: "minQuantity",
    MIN_ORDER_VALUE: "minOrderValue"
}

export const defaultTypeConditionsRule = {
    DISCOUNT_ORDER_VALUE: "discountOrderValue",
    GIFT: "gift",
    PRODUCT_GIFT: "productGift",
    DISCOUNT_PERCENT: "percent",
}

export const defaultNameRules = {
    priceMinValueAndQuantity: "priceMinValueAndQuantity",
    priceMinValuePercent: "priceMinValuePercent",
    priceMaxDiscountValue: "priceMaxDiscountValue",
    percentValue: "percentValue",
    priceDiscountValue: "priceDiscountValue",
}

export const defaultConditionInfo = {
    percent: "percent",
    maxDiscountValue: "maxDiscountValue",
    minOrderValue: "minOrderValue",
    minQuantity: "minQuantity",
    discountValue: "discountValue",
    products: "products"
}

export function setRulesPromotion(typePromotion,typeRule,value,index,listProduct) {
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
                        minQuantity: parseInt(value[defaultNameRules.priceMinValueAndQuantity + i]),
                        discountValue: parseInt(value[defaultNameRules.priceDiscountValue + i]),
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
                        minQuantity: parseInt(value[defaultNameRules.priceMinValuePercent + i]),
                        maxDiscountValue: parseInt(value[defaultNameRules.priceMaxDiscountValue + i]),
                        percent: parseInt(value[defaultNameRules.percentValue+i]),
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
                        minOrderValue: parseInt(value[defaultNameRules.priceMinValueAndQuantity + i]),
                        discountValue: parseInt(value[defaultNameRules.priceDiscountValue + i]),
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
                        minOrderValue: parseInt(value[defaultNameRules.priceMinValuePercent + i]),
                        maxDiscountValue: parseInt(value[defaultNameRules.priceMaxDiscountValue + i]),
                        percent: parseInt(value[defaultNameRules.percentValue+i]),
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

export function displayRule(rule) {
    console.log("rule",rule)
    let result = ""
    let {minQuantity,minOrderValue} = rule
    console.log('rule',rule)
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

