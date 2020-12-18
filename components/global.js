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

export const ssrPipe = (...functions) => async (input) => {
    return {
        props: await functions.reduce((chain, func) => chain.then(func), Promise.resolve(input)),
    }
}

export const ProductStatus = {
    "NEW" : "Mới",
}