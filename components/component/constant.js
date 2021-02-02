export const constURL = {
    PREFIX_PRODUCT: `/marketplace/product/v1`,
    PREFIX_MASTER: `/core/master-data/v1`,
    PREFIX_PRICING: `/marketplace/pricing/v1`,
    PREFIX_PROMOTION: `/marketplace/promotion/v1`,
    PREFIX_CUSTOMER: `/marketplace/customer/v1`
}

export const queryParamGetProductGift = "GIFT"
export const defaultPromotionType = {
    COMBO: "COMBO",
    VOUCHER_CODE: "VOUCHERCODE",
    FREESHIP: " FREESHIP",
    PROMOTION: "PROMOTOTION",
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

