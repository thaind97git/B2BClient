import currencyList from "./currencyList";
const locale = "vn-VN";
const currencyOptions = currencyList.data.map((c) => ({
  label: c.CcyNm,
  value: `${c.CtryNm}::${c.Ccy}`,
}));
export const currencyValue = currencyOptions[0].value;

export const currencyFormatter = (selectedCurrOpt) => (value) => {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: selectedCurrOpt.split("::")[1],
  }).format(value);
  return formatted;
};

export const currencyParser = (val) => {
  try {
    // for when the input gets clears
    if (typeof val === "string" && !val.length) {
      val = "0.0";
    }

    // detecting and parsing between comma and dot
    var group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, "");
    var decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, "");
    var reversedVal = val.replace(new RegExp("\\" + group, "g"), "");
    reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");
    //  => 1232.21 €

    // removing everything except the digits and dot
    reversedVal = reversedVal.replace(/[^0-9.]/g, "");
    //  => 1232.21

    // appending digits properly
    const digitsAfterDecimalCount = (reversedVal.split(".")[1] || []).length;
    const needsDigitsAppended = digitsAfterDecimalCount > 2;

    if (needsDigitsAppended) {
      reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount - 2);
    }

    return Number.isNaN(reversedVal) ? 0 : reversedVal;
  } catch (error) {
    console.error(error);
  }
};
