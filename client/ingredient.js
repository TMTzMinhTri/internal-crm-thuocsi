import { APIClient } from "@thuocsi/nextjs-components/lib/utils";

const PREFIX = `/marketplace/product/v1`;

class IngredientClient extends APIClient {
  constructor(ctx, data) {
    super(ctx, data);
  }

  getIngredientByCodesClient(ingredientCodes) {
    return this.callFromClient("POST", `${PREFIX}/ingredient/list`, {
      ingredientCodes,
    });
  }
}

export function getIngredientClient(ctx, data) {
  return new IngredientClient(ctx, data);
}
