export const constURL = {
  PREFIX_PRODUCT: `/marketplace/product/v1`,
  PREFIX_MASTER: `/core/master-data/v1`,
  PREFIX_PRICING: `/marketplace/pricing/v1`,
  PREFIX_PROMOTION: `/marketplace/promotion/v1`,
  PREFIX_CUSTOMER: `/marketplace/customer/v1`,
};

export const queryParamGetProductGift = "GIFT";

export const defaultPromotionType = {
  COMBO: "COMBO",
  VOUCHER_CODE: "VOUCHERCODE",
  FREESHIP: " FREESHIP",
  PROMOTION: "PROMOTOTION",
};

export const defaultPromotionOrganizer = {
  MARKETPLACE: "MARKETPLACE",
  SELLER: "SELLER",
  COORPORATE: "COORPORATE ",
};

export const defaultPromotionScope = {
  GLOBAL: "GLOBAL",
  SELLER: "SELLER",
  CATEGORY: "CATEGORY",
  PRODUCT: "PRODUCT",
  SKU: "SKU",
};

export const defaultPromotionStatus = {
  WAITING: "WAITING",
  ACTIVE: "ACTIVE",
  FULL: "FULL",
  HIDE: "HIDE",
  EXPIRED: "EXPIRED",
  DELETED: "DELETED",
};

export const defaultRulePromotion = {
  MIN_QUANTITY: "MIN_QUANTITY",
  MIN_ORDER_VALUE: "MIN_ORDER_VALUE",
};

export const defaultTypeConditionsRule = {
  DISCOUNT_ORDER_VALUE: "VALUE",
  GIFT: "GIFT",
  PRODUCT_GIFT: "PRODUCT_GIFT",
  DISCOUNT_PERCENT: "PERCENT",
};

export const defaultTypeProduct = {
  ALL: "ALL",
  MANY: "MANY",
};

export const defaultUseTypePromotion = {
  ALONE: "ALONE",
  MANY: "MANY",
};

export const defaultNameRulesValue = {
  priceMinValue: "priceMinValue",
  priceMinValuePercent: "priceMinValuePercent",
  priceMaxDiscountValue: "priceMaxDiscountValue",
  percentValue: "percentValue",
  priceDiscountValue: "priceDiscountValue",
  gift: "gift",
  productGift: "productGift",
};

export const defaultNameRulesQuantity = {
  priceMinValue: "minQuantity",
  priceMinValuePercent: "quantityMinValuePercent",
  priceMaxDiscountValue: "quantityMaxDiscountValue",
  percentValue: "quantityPercentValue",
  priceDiscountValue: "quantityDiscountValue",
  gift: "quantityGift",
  productGift: "quantityProductGift",
};

export const defaultConditionInfo = {
  percent: "percent",
  maxDiscountValue: "maxDiscountValue",
  minOrderValue: "minOrderValue",
  minQuantity: "minQuantity",
  discountValue: "discountValue",
  products: "products",
};

export const defaultScope = {
  customer: "CUSTOMER",
  product: "PRODUCT",
  productCatergory: "PRODUCT_CATEGORY",
  producer: "PRODUCER",
  ingredient: "INGREDIENT",
  area: "AREA",
  productTag: "PRODUCT_TAG",
};

export const defaultCondition = {
  orderValue: "ORDER_VALUE",
  product: "PRODUCT",
};

export const defaultReward = {
  precentage: "PRECENTAGE",
  absolute: "ABSOLUTE",
  gift: "GIFT",
  point: "POINT",
};

export const defaultPromotion = {
  marketPlace: "MARKETPLACE",
  seller: "SELLER",
  coorporate: "COORPORATE",
};

export const scopes = [
  {
    value: "",
    label: "Chọn loại phạm vi",
  },
  {
    value: "CUSTOMER",
    label: "Theo khách hàng",
  },
  {
    value: "PRODUCT",
    label: "Theo sản phẩm",
  },
  {
    value: "PRODUCT_CATEGORY",
    label: "Theo danh mục sản phẩm",
  },
  {
    value: "PRODUCER",
    label: "Theo nhà sản xuất",
  },
  {
    value: "INGREDIENT",
    label: "Theo hoạt chất",
  },
  {
    value: "AREA",
    label: "Theo khu vực",
  },
  {
    value: "PRODUCT_TAG",
    label: "Theo tag sản phẩm",
  },
];

export const conditions = [
  {
    value: "",
    label: "Chọn loại điều kiện",
  },

  {
    value: "ORDER_VALUE",
    label: "Theo giá trị đơn hàng",
  },
  {
    value: "PRODUCT",
    label: "Theo sản phẩm",
  },
  {
    value: "NO_RULE",
    label: "Không có điều kiện",
  },
];

export const rewards = [
  {
    value: "",
    label: "Chọn loại khuyến mãi",
  },
  {
    value: "PERCENTAGE",
    label: "Giảm giá theo %",
  },
  {
    value: "ABSOLUTE",
    label: "Giảm giá tuyệt đối",
  },
  {
    value: "GIFT",
    label: "Quà tặng",
  },
  {
    valie: "POINT",
    label: "Điểm thành viên (loyalty)",
  },
];

export const promotions = [
  {
    value: "",
    label: "Chọn chương trình khuyến mãi",
  },
  {
    value: defaultPromotion.marketPlace,
    label: "Chương trình riêng của sàn",
  },
  {
    value: defaultPromotion.coorporate,
    label: "Chương trình hợp tác của 2 bên",
  },
  {
    value: defaultPromotion.seller,
    label: "Chương trình của riêng nhà bán hàng",
  },
];

export const promotionTypes = [
  {
    value: "",
    label: "Chọn loại khuyến mãi",
  },
  {
    value: defaultPromotionType.VOUCHER_CODE,
    label: "Mã khuyến mãi (Voucher)",
  },
  {
    value: defaultPromotionType.FREESHIP,
    label: "Miễn phí vận chuyển",
  },
  {
    value: defaultPromotionType.COMBO,
    label: "Combo",
  },
];
