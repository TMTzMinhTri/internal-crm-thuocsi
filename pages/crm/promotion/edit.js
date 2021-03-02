import {
  doWithLoggedInUser,
  renderWithLoggedInUser,
} from "@thuocsi/nextjs-components/lib/login";
import { getPromoClient } from "../../../client/promo";
import PromotionForm from "./form";

export async function getServerSideProps(ctx) {
  return await doWithLoggedInUser(ctx, async (ctx) => {
    return await loadDataBefore(ctx);
  });
}

export async function loadDataBefore(ctx) {
  let returnObject = {
    props: {
      promotionRes: null,
    },
  };
  let promotionId = ctx.query.promotionId;
  let _promotionClient = getPromoClient(ctx, {});
  let promotionRes = await _promotionClient.getPromotionByID(promotionId);

  if (promotionRes && promotionRes.status === "OK") {
    let data = promotionRes.data[0];
    returnObject.props.promotionRes = data;
  }

  return returnObject;
}

export default function NewPage(props) {
  return renderWithLoggedInUser(props, render);
}

function render(props) {
  return PromotionForm(props, "edit");
}
