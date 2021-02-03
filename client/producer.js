import { APIClient } from "@thuocsi/nextjs-components/lib/utils";

const PREFIX = `/marketplace/product/v1`;

class ProducerClient extends APIClient {
  constructor(ctx, data) {
    super(ctx, data);
  }

  getProducerClient(q) {
    return this.callFromClient("GET", `${PREFIX}/manufacturer/list`, {
      q: q,
    });
  }

  getProducerByCodesClient(manufacturerCodes) {
    return this.callFromClient("POST", `${PREFIX}/manufacturer/list`, {
      manufacturerCodes,
    });
  }
}

export function getProducerClient(ctx, data) {
  return new ProducerClient(ctx, data);
}
