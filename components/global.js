import moment from "moment";

export const SellPrices = [
    {
        label: "Đảm bảo doanh thu của người bán hàng",
        value: "FIXED_REVENUE"
    },
    {
        label: "Đảm bảo giá bán đến tay người mua",
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
        label: "Quầy thuốc"
    },
    {
        value: "CLINIC",
        label: "Phòng khám"
    },
    {
        value: "DRUGSTORE",
        label: "Nhà thuốc"
    },
]

export const statuses = [
    // {
    //     value: "ACTIVE",
    //     label: "Đang hoạt động",
    // },
    {
        value: "DRAFT",
        label: "Nháp",
    },
    {
        value: "NEW",
        label: "Mới",
    },
    {
        value: "GUEST",
        label: "Khách",
    },
    {
        value:"APPROVED",
        label:"Đã kích hoạt"
    }
]


export const ProductStatus = {
    "NEW": "Mới",
}

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
    if(text) {
        if(text.length > 50) {
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
