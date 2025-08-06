import { decodeToken } from "./jwtUtils";
import NepaliDate from "nepali-date-converter";

export const convertAdToBs = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    console.warn("Invalid A.D. date:", dateObj);
    return "";
  }

  try {
    return new NepaliDate(dateObj).format("YYYY-MM-DD");
  } catch (error) {
    console.error("Failed to convert A.D. to B.S:", error);
    return "";
  }
};

export const convertBsToAd = (bsStr) => {
  if (!bsStr || typeof bsStr !== "string") {
    console.warn("Invalid B.S. string:", bsStr);
    return null;
  }

  try {
    const bsDate = new NepaliDate(bsStr);
    const ad = bsDate.getAD();

    // Ensure ad is properly parsed
    if (!ad || !ad.year || !ad.month || !ad.date) {
      console.warn("Invalid A.D. conversion from B.S:", bsStr, ad);
      return null;
    }

    // Adjust for proper month indexing (since the month should be 1-12)
    const adDate = new Date(ad.year, ad.month, ad.date); // month is zero-indexed in JS Date
    console.log("Converted A.D. Date:", adDate);

    return adDate;
  } catch (error) {
    console.error("Failed to convert B.S. to A.D:", error);
    return null;
  }
};

export const getNepaliFiscalYear = () => {
  const today = new NepaliDate(new Date());
  const year = today.getYear();
  const month = today.getMonth(); // 0-based: 0 = Baisakh, 11 = Chaitra

  if (month >= 3) {
    return `${year}-${year + 1}`; // from Ashad (3) onwards, new fiscal year
  } else {
    return `${year - 1}-${year}`; // before Ashad = still last fiscal year
  }
};

export const generateBillNumber = (billCount,accessToken) => {
  const fiscalYear = getNepaliFiscalYear();
  const decoded = decodeToken(accessToken);
  const orgCode = decoded?.OrganizationCode ?? "xxx";
  const nextSerial = (billCount + 1).toString().padStart(3, "0");
  return `${fiscalYear}-${orgCode}-${nextSerial}`;
};

export const generateQuoteNumber = (quoteCount,accessToken) => {
  const fiscalYear = getNepaliFiscalYear();
  const decoded = decodeToken(accessToken);
  const orgCode = decoded?.OrganizationCode ?? "xxx";
  const nextSerial = (quoteCount + 1).toString().padStart(3, "0");
  return `${fiscalYear}-${orgCode}/QN-${nextSerial}`;
};



export const getChargeValue = (term,otherChargesData) => {
    const charge = otherChargesData.find(
      (item) => item.termDescription.toLowerCase() === term.toLowerCase()
    );
    return {
      percentage: charge?.percentage || "0",
      amount: charge?.amount || "0",
    };
  };

  export const generateReturnNumber = (returnCount, accessToken) => {
    const fiscalYear = getNepaliFiscalYear();
    const decoded = decodeToken(accessToken);
    const orgCode = decoded?.OrganizationCode ?? "xxx";
    const nextSerial = (returnCount + 1).toString().padStart(3, "0");
    return `${fiscalYear}-${orgCode}/SR-${nextSerial}`;
  };
  