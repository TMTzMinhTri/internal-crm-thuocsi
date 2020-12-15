export const SellPrices = [
    {
        label: "Giá sản phẩm",
        value: "PRICE"
    },
    {
        label: "Khuyến mãi",
        value: "PROMO"
    },
    {
        label: "Ngành hàng",
        value: "BRAND"
    }
];

export const condUserType = [
    {
        label: "Mặc định",
        value: "",
    },
    {
        label: "Hạng cao nhất",
        value: "Infinity",
    },
    {
        label: "Hạng Diamond",
        value: "Diamond",
    },
    {
        label: "Hạng Platinum",
        value: "Platinum",
    },
    {
        label: "Hạng Gold",
        value: "Gold",
    },
    {
        label: "Hạng Sliver",
        value: "Sliver",
    },
]


export function filterObjectName(obj) {
    let tags = []
    if(typeof(obj) == 'undefined') {
        return tags
    }
    for(let k in obj) {
        if (k.startsWith("cond") && obj.hasOwnProperty(k)) {
            tags.push(k)
        }
    }
    return tags
}

export function filterListObjectName(obj) {
    let tags = []
    if(typeof(obj) == 'undefined') {
        return tags
    }
    for(let k in obj) {
        if (k.startsWith("cond")  && obj.hasOwnProperty(k) && typeof(obj[k]?.name) != 'undefined') {
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
    switch(tag) {
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
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}