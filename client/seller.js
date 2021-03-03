import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
const URI = `/seller/profiler/v1`;
// const URI = ``

class SellerClient extends APIClient {
  constructor(ctx, data) {
    super(ctx, data);
  }

  getSeller(offset, limit, q) {
    return this.callFromNextJS("GET", `${URI}/account/list`, {
      q: q,
      offset: offset,
      limit: limit,
      getTotal: true,
    });
  }

  getSellerByFilter({
    q,
    code,
    name,
    email,
    phone,
    status,
    limit,
    offset,
  }) {
    return this.callFromClient(
      "POST",
      `${URI}/account/search`,
      {
        q,
        code,
        name,
        email,
        phone,
        status,
        limit,
        offset,
        getTotal: true,
      }
    );
  }

  getSellerClient(offset, limit, q) {
    return this.callFromClient("GET", `${URI}/account/list`, {
      q: q,
      offset: offset,
      limit: limit,
      getTotal: true,
    });
  }

  getSellerBySellerID(sellerID) {
    return this.callFromNextJS("GET", `${URI}/account`, {
      sellerID: sellerID,
    });
  }

  getSellerBySellerCode(sellerCode) {
    return this.callFromNextJS("GET", `${URI}/account`, {
      sellerCode: sellerCode,
    });
  }

  getSellerBySellerCodes(codes) {
    return this.callFromNextJS("POST", `${URI}/account/list`, {
      codes,
    });
  }

  getSellerBySellerCodesClient(codes) {
    return this.callFromClient("POST", `${URI}/account/list`, {
      codes,
    });
  }

  createNewSeller(data) {
    return this.callFromClient("POST", `${URI}/account`, data);
  }

  updateSeller(data) {
    return this.callFromClient("PUT", `${URI}/account`, data);
  }

  activeAccount(data) {
    return this.callFromClient("PUT", `${URI}/account/active`, data);
  }
}

export function getSellerClient(ctx, data) {
  return new SellerClient(ctx, data);
}
