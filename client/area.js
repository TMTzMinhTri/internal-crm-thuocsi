import { APIClient } from "@thuocsi/nextjs-components/lib/utils";

const PREFIX = `/core/master-data/v1`;
// const PREFIX = ``

class AreaClient extends APIClient {
  constructor(ctx, data) {
    super(ctx, data);
  }

  getListArea(q) {
    return this.callFromClient("GET", `${PREFIX}/region/list`, q);
  }
}

export function getAreaClient(ctx, data) {
  return new AreaClient(ctx, data);
}
