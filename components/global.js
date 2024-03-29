import moment from "moment";

export const SellPrices = [
    {
        tooltip: "Đảm bảo doanh thu của người bán hàng",
        label: "Doanh thu bán hàng",
        value: "FIXED_REVENUE"
    },
    {
        tooltip: "Đảm bảo giá bán đến tay người mua",
        label: "Giá bán cuối",
        value: "FIXED_PRICE"
    }
];

export const ErrorCode = {
    "NOT_FOUND": "không tồn tại",
    "NOT_FOUND_TABLE": "Tìm kiếm không có kết quả phù hợp"
}

export const noOptionsText = "Không có tùy chọn!";



export const condUserType = [
    // {
    //     label: "Mặc định",
    //     value: "all",
    // },

    {
        label: "Kim cương",
        value: "Diamond",
    },
    {
        label: "Platinum",
        value: "Platinum",
    },
    {
        label: "Vàng",
        value: "Gold",
    },
    {
        label: "Bạc",
        value: "Sliver",
    },
    {
        label: "Không giới hạn",
        value: "Infinity",
    },
]

export const Brand = {
    'LOCAL': {
        value: 'Trong nước'
    },
    'FOREIGN': {
        value: 'Ngoại nhập'
    }
}

export const ProductTypes = [
    {
        value: "all",
        label: "Tất cả"
    },
    {
        value: "hasPrice",
        label: "Đã được cài giá"
    },
    {
        value: "noPrice",
        label: "Chưa được cài giá"
    }
]

export const scopes = [
    {
        value: "PHARMACY",
        label: "Nhà thuốc"
    },
    {
        value: "CLINIC",
        label: "Phòng khám"
    },
    {
        value: "DRUGSTORE",
        label: "Quầy thuốc"
    },
]

export const orderStatus = [
    {
        value: "CONFIRMED",
        label: "Đã xác nhận",
    },
    {
        value: "PROCESSING",
        label: "Đang xử lý",
    },
    {
        value: "DELIVERING",
        label: "Đang giao hàng",
    },
    {
        value: "COMPLETED",
        label: "Hoàn tất",
    },
    {
        value: "WAIT_TO_CONFIRM",
        label: "Chờ xác nhận",
    },
    {
        value: "CANCEL",
        label: "Hủy bỏ",
    }
]

export const statuses = [
    {
        value: "ACTIVE",
        label: "Đang hoạt động",
        color: "green"
    },
    {
        value: "INACTIVE",
        label: "Chưa kích hoạt",
        color: "grey"
    }
]

export const sellerStatuses = [
    {
        value: "ACTIVE",
        label: "Đang hoạt động",
        color: "green"
    },
    {
        value: "INACTIVE",
        label: "Chưa kích hoạt",
        color: "grey"
    }
]

export const OrderLog = {
    "totalItems": "Số lượng sản phẩm",
    "totalPrice": "Tổng giá trị đơn hàng",
    "status": "Trạng thái đơn hàng",
    "customerDistrictCode": "Quận/Huyện",
    "customerName": "Tên khách hàng",
    "customerPhone": "Số điện thoại khách hàng",
    "customerProvinceCode": "Tỉnh/Thành",
    "customerShippingAddress": "Địa chỉ giao hàng",
    "customerWardCode": "Phường/Xã",
    "deliveryDate": "Ngày giao hàng",
    "deliveryPlatform": "Hình thức vận chuyển",
    "deliveryPlatformFee": "Phí vận chuyển",
    "deliveryStatus": "Trạng thái vận chuyển",
    "note": "Ghi chú đơn hàng",
    "paymentMethod": "Hình thức thanh toán",
    "privateNote": "Ghi chú nội bộ",
    "redeemCode": "Mã redeem",
}

export const OrderAction = {
    "UPDATE_ORDER_INFO": "Cập nhật thông tin đơn hàng",
    "UPDATE_QUANTITY_ITEM": "Cập nhật số lượng sản phẩm",
    "REMOVE_ORDER_ITEM": "Xóa sản phẩm",
    "UPDATE_ORDER_STATUS": "Cập nhật trạng thái đơn hàng",
}

export const OrderItemLog = {
    "quantity": "Số lượng sản phẩm",
    "totalPrice": "Tổng giá trị mặt hàng",
}


export const ProductStatus = {
    "NEW": "Chờ duyệt",
    "ACTIVE": "Đang hoạt động",
    "INACTIVE": "Tạm ngưng",
    "STOPPED": "Đã hủy",
}

export const SkuStatuses = [
    {
        label: "Duyệt",
        value: "APPROVED"
    },
    {
        label: "Chờ duyệt",
        value: "NEW"
    },
    {
        label: "Hủy",
        value: "CANCEL"
    }
]

export function formatUrlSearch(str) {
    return str.trim().replace(/\s+/g, ' ')
        .replace(/[&]/, '%26')
        .replace(/[+]/, '%2B')
        .replace(/[#]/, '%23');
}

export function formatDateTime(datetime) {
    if (datetime) {
        return moment(datetime).utcOffset('+0700').format("DD-MM-YYYY HH:mm:ss")
    }
    return ''
}

export function formatDatetimeFormType(datetime) {
    if (datetime) {
        return moment(datetime).utcOffset('+0700').format("YYYY-MM-DDTHH:mm")
    }
    return ''
}

export function filterObjectName(obj) {
    let tags = []
    if (typeof (obj) == 'undefined') {
        return tags
    }
    for (let k in obj) {
        if (k.startsWith("cond") && obj.hasOwnProperty(k)) {
            tags.push(k)
        }
    }
    return tags
}

export function formatNumber(num) {
    return num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function formatEllipsisText(text, len = 100) {
    if (text) {
        if (text.length > 50) {
            return text.substring(0, len) + "..."
        }
        return text
    }
    return '-'
}

export function filterListObjectName(obj) {
    let tags = []
    if (typeof (obj) == 'undefined') {
        return tags
    }
    for (let k in obj) {
        if (k.startsWith("cond") && obj.hasOwnProperty(k) && typeof (obj[k]?.name) != 'undefined') {
            tags.push({
                label: obj[k].name,
                value: k,
                index: obj[k]?.index,
            })
        }
    }
    return tags.sort(mSort("index"))
}

export function loadTag(tag) {
    switch (tag) {
        case "condUserType": {
            return {
                default: condUserType[0].value,
                label: "Loại khách hàng",
                data: condUserType
            };
        }
        default: {
            return {
                default: "Không xác định",
                label: "Không xác định",
                data: []
            };
        }
    }
}

function mSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

export const ssrPipe = (...functions) => async (input) => {
    return {
        props: await functions.reduce((chain, func) => chain.then(func), Promise.resolve(input)),
    }
}

export const MoneyToText = function () {
    var t = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"],
        r = function (r, n) {
            var o = "",
                a = Math.floor(r / 10),
                e = r % 10;
            return a > 1 ? (o = " " + t[a] + " mươi", 1 == e && (o += " mốt")) : 1 == a ? (o = " mười", 1 == e && (o += " một")) : n && e > 0 && (o = " lẻ"), 5 == e && a >= 1 ? o += " lăm" : 4 == e && a >= 1 ? o += " tư" : (e > 1 || 1 == e && 0 == a) && (o += " " + t[e]), o
        },
        n = function (n, o) {
            var a = "",
                e = Math.floor(n / 100),
                n = n % 100;
            return o || e > 0 ? (a = " " + t[e] + " trăm", a += r(n, !0)) : a = r(n, !1), a
        },
        o = function (t, r) {
            var o = "",
                a = Math.floor(t / 1e6),
                t = t % 1e6;
            a > 0 && (o = n(a, r) + " triệu", r = !0);
            var e = Math.floor(t / 1e3),
                t = t % 1e3;
            return e > 0 && (o += n(e, r) + " ngàn", r = !0), t > 0 && (o += n(t, r)), o
        };
    return {
        convert: function (r) {
            if (0 == r) return t[0];
            var n = "",
                a = "", ty;
            do ty = r % 1e9, r = Math.floor(r / 1e9), n = r > 0 ? o(ty, !0) + a + n : o(ty, !1) + a + n, a = " tỷ"; while (r > 0);
            return n.trim()
        }
    }
}();

export function isValid(resp) {
    return resp && resp.status && resp.status === "OK" && resp.data && resp.data[0];
}
