import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "./constrant";
import { queryParamGetProductGift } from "../components/component/constant";

const PREFIX = `/marketplace/product/v1`;
const { PREFIX_PRODUCT } = constURL;

class ProductClient extends APIClient {
  constructor(ctx, data) {
    super(ctx, data);
  }

  getListProduct(query) {
    return this.callFromNextJS("GET", `${PREFIX}/product/list`, query);
  }

  getProductByCodeClient(productCode) {
    return this.callFromClient(
      "GET",
      `${PREFIX}/product`,
      { productCode }
    )
  }

  getListProductByIdsOrCodes(ids, codes) {
    return this.callFromNextJS("POST", `${PREFIX}/product/list`, {
      productIds: ids,
      productCodes: codes,
    });
  }

  getListProductByIdsOrCodesFromClient(ids, codes) {
    return this.callFromClient("POST", `${PREFIX}/product/list`, {
      productIds: ids,
      productCodes: codes,
    });
  }

  getListProductByIdsClient(ids) {
    return this.callFromClient("POST", `${PREFIX}/product/list`, {
      productIds: ids,
    });
  }

  getListSKUProduct(offset, limit, q) {
    return this.callFromNextJS("GET", `${PREFIX}/sku/list`, {
      q,
      offset,
      limit,
      getTotal: true,
    });
  }

  postListProducstWithCodes(productCodes) {
    return this.callFromNextJS("POST", `${PREFIX}/product/list`, {
      productCodes,
    });
  }

  getProductByCategoryCode(categoryCode) {
    return this.callFromClient("GET", `${PREFIX}/product/category/list`, {
      categoryCode,
    });
  }

  getProductList(offset, limit, q) {
    return this.callFromNextJS("GET", `${PREFIX}/product/list`, {
      q: q,
      offset: offset,
      limit: limit,
      getTotal: true,
    });
  }

  getProductListFromClient(offset, limit, q) {
    return this.callFromClient("GET", `${PREFIX}/product/list`, {
      q: q,
      offset: offset,
      limit: limit,
      getTotal: true,
    });
  }

  searchProductsFromClient({ q, limit, offset }) {
    return this.callFromClient("GET", `${PREFIX}/product/list`, {
      q, limit, offset,
    })
  }

  searchProductCategoryListFromClient(productName, categoryCode) {
    let data = {};
    if (productName) {
      data = {
        ...data,
        q: productName,
      };
    }
    if (categoryCode) {
      data = {
        ...data,
        categoryCode: categoryCode,
      };
    }
    return this.callFromClient("GET", `${PREFIX}/product/category/list`, data);
  }

  searchProductListFromClient(productName, categoryCode) {
    let data = {};
    if (productName) {
      data = {
        ...data,
        q: productName,
      };
    }
    if (categoryCode) {
      data = {
        ...data,
        categoryCode: categoryCode,
      };
    }
    return this.callFromClient("GET", `${PREFIX}/product/list`, data);
  }

  async getProductListWithCategoryFromClient(q) {
    return this.callFromClient("GET", `${PREFIX}/product/category/list`, {
      q: q,
    });
  }

  getProductHasPrice(offset, limit, q) {
    return this.callFromNextJS("GET", `${PREFIX}/product/list`, {
      q: q,
      offset: offset,
      limit: limit,
      filter: "hasPrice",
      getTotal: true,
    });
  }

  getProductNoPrice(offset, limit, q) {
    return this.callFromNextJS("GET", `${PREFIX}/product/list`, {
      q: q,
      offset: offset,
      limit: limit,
      filter: "noPrice",
      getTotal: true,
    });
  }

  getIngredientList(q) {
    return this.callFromClient("GET", `${PREFIX}/ingredient/list`, {
      q: q,
    });
  }

  getIngredientByIDs(ids) {
    return this.callFromClient("POST", `${PREFIX}/ingredient/list`, {
      ids,
    });
  }

  async uploadProductImage(formData) {
    const res = await fetch(`/backend/marketplace/product/v1/upload`, {
      method: "POST",
      body: JSON.stringify(formData),
    });
    return await res.json();
  }

  async SearchProductCache({ offset, limit, q }) {
    return this.callFromNextJS(
      "GET",
      `${PREFIX_PRODUCT}/products/list`,
      {
        offset, limit, q
      }
    )
  }
}

export function getProductClient(ctx, data) {
  return new ProductClient(ctx, data);
}
