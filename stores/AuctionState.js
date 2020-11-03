import { makeFetchAction } from "redux-api-call";

import { respondToSuccess } from "../middlewares/api-reaction";
import nfetch from "../libs/nfetch";
import { generateQuery, getResetter } from "../libs";

export const CREATE_REVERSE_AUCTION = "CreateReverseAuctionAPI";

const CreateReverseAuctionAPI = makeFetchAction(
  CREATE_REVERSE_AUCTION,
  (values) =>
    nfetch({
      endpoint: "/api/ReversAuction",
    })(values)
);

export const createReverseAuction = (values) =>
  respondToSuccess(CreateReverseAuctionAPI.actionCreator(values));
export const CreateReverseAuctionData = CreateReverseAuctionAPI.dataSelector;
export const CreateReverseAuctionError = CreateReverseAuctionAPI.errorSelector;
export const CreateReverseAuctionResetter = getResetter(
  CreateReverseAuctionAPI
);
