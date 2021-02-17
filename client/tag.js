import { APIClient } from "@thuocsi/nextjs-components/lib/utils";
import { constURL } from "../components/component/constant";
const prefix = constURL.PREFIX_PRODUCT;

class TagClient extends APIClient {
  constructor(ctx, data) {
    super(ctx, data);
  }

  getListTag(offset, limit, q) {
    return this.callFromNextJS("GET", `${prefix}/tags/list`, {
      q: q,
      offset: offset,
      limit: limit,
      getTotal: true,
    });
  }

  getTagByTagCode(tagCode) {
    return this.callFromNextJS("GET", `${prefix}/tags`, {
      tagCode: tagCode,
    });
  }

  getTagByTagCodeClient(tagCode) {
    return this.callFromClient("GET", `${prefix}/tags`, {
      tagCode: tagCode,
    });
  }

  getTagByTagCode(tagCodes) {
    return this.callFromNextJS("POST", `${prefix}/tags/list`, {
      tagCodes,
    });
  }
  getTagByTagCodesClient(tagCodes) {
    return this.callFromClient("POST", `${prefix}/tags/list`, {
      tagCodes,
    });
  }

  createTag(body) {
    return this.callFromClient("POST", `${prefix}/tags`, body);
  }

  updateTag(data) {
    return this.callFromClient("PUT", `${prefix}/tags`, data);
  }

  getListTagClient(offset, limit, q) {
    return this.callFromClient("GET", `${prefix}/tags/list`, {
      q: q,
      offset: offset,
      limit: limit,
      getTotal: true,
    });
  }
}

export function getTagClient(ctx, data) {
  return new TagClient(ctx, data);
}
