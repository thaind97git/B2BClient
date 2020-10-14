import { makeFetchAction } from "redux-api-call";

import { respondToSuccess } from "../middlewares/api-reaction";
import nfetch from "../libs/nfetch";
import { getResetter } from "../libs";

const GET_SOURCING_TYPE = "GetSourcingTypeAPI";
const GET_SOURCING_PURPOSE = "GetSourcingPurposeAPI";
const GET_UNIT_OF_MEASURE = "GetUnitOfMeasureAPI";
const GET_CURRENCY = "GetCurrencyAPI";
const GET_TRADE_TERM = "GetTradeTermsAPI";
const GET_SHIPPING_METHOD = "GetShippingMethodAPI";
const GET_PAYMENT_TERM = "GetPaymentTermAPI";
const GET_SUP_CERTIFICATION = "GetSubCertificationAPI";

// Get Sourcing Type
const GetSourcingTypeAPI = makeFetchAction(
  GET_SOURCING_TYPE,
  nfetch({
    endpoint: "/api/SubPack/SourcingType",
    method: "GET",
  })
);

export const getSourcingType = () =>
  respondToSuccess(GetSourcingTypeAPI.actionCreator());

export const GetSourcingTypeData = GetSourcingTypeAPI.dataSelector;
export const GetSourcingTypeError = GetSourcingTypeAPI.errorSelector;
export const GetSourcingTypeResetter = getResetter(GetSourcingTypeAPI);

// Get Sourcing Purpose
const GetSourcingPurposeAPI = makeFetchAction(
  GET_SOURCING_PURPOSE,
  nfetch({
    endpoint: "/api/SubPack/SourcingPurpose",
    method: "GET",
  })
);

export const getSourcingPurpose = () =>
  respondToSuccess(GetSourcingPurposeAPI.actionCreator());

export const GetSourcingPurposeData = GetSourcingPurposeAPI.dataSelector;
export const GetSourcingPurposeError = GetSourcingPurposeAPI.errorSelector;
export const GetSourcingPurposeResetter = getResetter(GetSourcingPurposeAPI);

// Get UnitOfMeasure
const GetUnitOfMeasureAPI = makeFetchAction(
  GET_UNIT_OF_MEASURE,
  nfetch({
    endpoint: "/api/SubPack/UnitOfMeasure",
    method: "GET",
  })
);

export const getUnitOfMeasure = () =>
  respondToSuccess(GetUnitOfMeasureAPI.actionCreator());

export const GetUnitOfMeasureData = GetUnitOfMeasureAPI.dataSelector;
export const GetUnitOfMeasureError = GetUnitOfMeasureAPI.errorSelector;
export const GetUnitOfMeasureResetter = getResetter(GetUnitOfMeasureAPI);

// Get UnitOfMeasure
const GetCurrencyAPI = makeFetchAction(
  GET_CURRENCY,
  nfetch({
    endpoint: "/api/SubPack/Currency",
    method: "GET",
  })
);

export const getCurrency = () =>
  respondToSuccess(GetCurrencyAPI.actionCreator());

export const GetCurrencyData = GetCurrencyAPI.dataSelector;
export const GetCurrencyError = GetCurrencyAPI.errorSelector;
export const GetCurrencyResetter = getResetter(GetCurrencyAPI);

// Get UnitOfMeasure
const GetTradeTermsAPI = makeFetchAction(
  GET_TRADE_TERM,
  nfetch({
    endpoint: "/api/SubPack/TradeTerms",
    method: "GET",
  })
);

export const getTradeTerms = () =>
  respondToSuccess(GetTradeTermsAPI.actionCreator());

export const GetTradeTermsData = GetTradeTermsAPI.dataSelector;
export const GetTradeTermsError = GetTradeTermsAPI.errorSelector;
export const GetTradeTermsResetter = getResetter(GetTradeTermsAPI);

// Get ShippingMethod
const GetShippingMethodAPI = makeFetchAction(
  GET_SHIPPING_METHOD,
  nfetch({
    endpoint: "/api/SubPack/ShippingMethod",
    method: "GET",
  })
);

export const getShippingMethod = () =>
  respondToSuccess(GetShippingMethodAPI.actionCreator());

export const GetShippingMethodData = GetShippingMethodAPI.dataSelector;
export const GetShippingMethodError = GetShippingMethodAPI.errorSelector;
export const GetShippingMethodResetter = getResetter(GetShippingMethodAPI);

// Get PaymentTerm
const GetPaymentTermAPI = makeFetchAction(
  GET_PAYMENT_TERM,
  nfetch({
    endpoint: "/api/SubPack/PaymentTerm",
    method: "GET",
  })
);

export const getPaymentTerm = () =>
  respondToSuccess(GetPaymentTermAPI.actionCreator());

export const GetPaymentTermData = GetPaymentTermAPI.dataSelector;
export const GetPaymentTermError = GetPaymentTermAPI.errorSelector;
export const GetPaymentTermResetter = getResetter(GetPaymentTermAPI);

// Get SupplierCertification
const GetSupplierCertificationAPI = makeFetchAction(
  GET_SUP_CERTIFICATION,
  nfetch({
    endpoint: "/api/SubPack/SupplierCertification",
    method: "GET",
  })
);

export const getSupplierCertification = () =>
  respondToSuccess(GetSupplierCertificationAPI.actionCreator());

export const GetSupplierCertificationData =
  GetSupplierCertificationAPI.dataSelector;
export const GetSupplierCertificationError =
  GetSupplierCertificationAPI.errorSelector;
export const GetSupplierCertificationResetter = getResetter(
  GetSupplierCertificationAPI
);
