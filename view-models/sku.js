export const BrandType = {
    LOCAL: 'LOCAL',
    FOREIGN: 'FOREIGN',
};

export const BranText = {
    [BrandType.LOCAL]: 'Trong nước',
    [BrandType.FOREIGN]: 'Ngoại nhập',
};

export const SellingPriceType = {
    FIXED_REVENUE: 'FIXED_REVENUE',
    FIXED_PRICE: 'FIXED_PRICE',
};

export const SellingPriceText = {
    [SellingPriceType.FIXED_PRICE]: 'Đảm bảo giá bán đến tay người mua',
    [SellingPriceType.FIXED_REVENUE]: 'Đảm bảo doanh thu của người bán',
};