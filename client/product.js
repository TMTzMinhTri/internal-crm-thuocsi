import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { queryParamGetProductGift } from "../components/component/constant";
const PREFIX = `/marketplace/product/v1`;
// const PREFIX = ``

class ProductClient extends APIClient {
  constructor(ctx, data) {
    super(ctx, data);
  }

  getListProduct(query) {
    return this.callFromNextJS("GET", `${PREFIX}/product/list`, query);
  }

  getListProductByIdsOrCodes(ids, codes) {
    return this.callFromNextJS("POST", `${PREFIX}/product/list`, {
      productIds: ids,
      productCodes: codes,
    });
  }

  getListProductByIdsClient(ids) {
    console.log(ids, "ids");
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

  getProducerClient(q) {
    return this.callFromClient("GET", `${PREFIX}/manufacturer/list`, {
      q: q,
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
}

export function getProductClient(ctx, data) {
  return new ProductClient(ctx, data);
}
