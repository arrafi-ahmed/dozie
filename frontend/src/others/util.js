import {toast} from "vue-sonner";
import {countries} from "@/others/country-list";

export const appInfo = {name: "Dozie Events", version: 1.0};
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const clientBaseUrl = import.meta.env.VITE_BASE_URL;
export const stripePublic =
  import.meta.env.VITE_STRIPE_PUBLIC ||
  "pk_live_51PkVUZP8Mi3pFx1CQX7p4pgznT26qaZsY7wAy1PPixNiTqYbarHIhQ3lzg3kDOCwgtk01sgx3fOhTFfz4zqefB8O00B2sXbdUj";
export const isProd = import.meta.env.PROD;

export const sendToWhatsapp = (phone, message) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappShareLink = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
  window.open(whatsappShareLink, "_blank");
};

export const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// get iso datetime offset with timezone
export const toLocalISOString = (inputDate) => {
  const date = new Date(inputDate);
  const tzoffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(date - tzoffset).toISOString().slice(0, -1);
  return localISOTime;
};

export const formatDateTime = (inputDateTime) => {
  const formattedDate = formatDate(inputDateTime);
  const date = new Date(inputDateTime);
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  // const seconds = `0${date.getSeconds()}`.slice(-2);
  return `${formattedDate} ${hours}:${minutes}`;
};

export const getClientPublicImgUrl = (imageName) =>
  imageName ? `/img/${imageName}` : null;

export const getApiPublicImgUrl = (imageName, type) =>
  `${apiBaseUrl}/${type}/${imageName}`;

export const getUserImageUrl = (imageName) => {
  return imageName === "null" || !imageName
    ? getClientPublicImgUrl("default-user.jpg")
    : getApiPublicImgUrl(imageName, "user");
};

export const getClubImageUrl = (imageName) => {
  return imageName === "null" || !imageName
    ? getClientPublicImgUrl("default-user.jpg")
    : getApiPublicImgUrl(imageName, "club-logo");
};

export const getEventImageUrl = (imageName) => {
  return imageName === "null" || !imageName
    ? getClientPublicImgUrl("default-event.jpg")
    : getApiPublicImgUrl(imageName, "event-banner");
};

export const padStr = (str, num) => String(str).padStart(num, "0");

export const getToLink = (item) => {
  if (item.to.params) {
    const paramKey = Object.keys(item.to.params)[0];
    const paramVal = item.to.params[paramKey];
    return {
      name: item.to.name,
      params: {[paramKey]: paramVal},
    };
  }
  return item.to;
};

export const checkinItems = [
  {title: "Pending", value: false},
  {title: "Checked-in", value: true},
];

export const extrasItems = [
  {title: "", value: null},
  {title: "Not Redeemed", value: false},
  {title: "Redeemed", value: true},
];

export const getQueryParam = (param) => {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get(param);
};

export const removeQueryParams = (url, paramsToRemove) => {
  const parsedUrl = new URL(url);

  // Create a URLSearchParams object from the URL's search parameters
  const searchParams = new URLSearchParams(parsedUrl.search);

  // Remove the specified query parameters
  paramsToRemove.forEach((param) => {
    searchParams.delete(param);
  });

  // Construct the new URL with the updated search parameters
  parsedUrl.search = searchParams.toString();

  // Return the updated URL as a string
  return parsedUrl.toString();
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidImage = (file) => {
  if (!file || typeof file !== "object") return false;
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  return allowedTypes.includes(file.type);
};

export const deepCopy = (aObject) => {
  // Prevent undefined objects
  if (!aObject) return aObject;
  let bObject = Array.isArray(aObject) ? [] : {};
  let value;
  for (const key in aObject) {
    // Prevent self-references to parent object
    if (Object.is(aObject[key], aObject)) continue;
    value = aObject[key];
    bObject[key] = typeof value === "object" ? deepCopy(value) : value;
  }
  return bObject;
};

export const deepMerge = (target, source) => {
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (!target[key] || typeof target[key] !== "object") {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};

export const isValidPass = [
  (v) => !!v || "Password is required!",
  (v) => v.length >= 8 || "Password must be 8 or more characters!",
  (v) => /\d/.test(v) || "Password must include at least one number!",
];

export const showApiQueryMsg = (color = "blue") => {
  if (localStorage.hasOwnProperty("apiQueryMsg")) {
    toast(localStorage.getItem("apiQueryMsg"), {
      cardProps: {color},
      action: {
        label: "Close",
        buttonProps: {
          color: "white",
        },
        onClick() {
        },
      },
    });
    localStorage.removeItem("apiQueryMsg");
  }
};

export const input_fields = [
  {id: 0, title: "Short answer"},
  {id: 1, title: "Paragraph"},
  {id: 2, title: "Multiple choice"},
  {id: 3, title: "Checkboxes"},
  {id: 4, title: "Dropdown"},
];

export const getInputType = (typeId) => {
  return input_fields.find((item) => item.id == typeId);
};

export const getCountryList = (filterName) => {
  if (filterName === "all") return countries;
  return countries.map((item) => item[filterName]);
};

export const getCurrencySymbol = (currencyCode, type) => {
  const currencyCodeLower = currencyCode.toString().toLowerCase();

  const currencyMap = {
    usd: {icon: "mdi-currency-usd", symbol: "$"},
    gbp: {icon: "mdi-currency-gbp", symbol: "£"},
    eur: {icon: "mdi-currency-eur", symbol: "€"},
  };

  return currencyMap[currencyCodeLower][type];
};

export const handleRedirect = ({ param, hardRedirect = true }) => {
  const paramValue = getQueryParam({ param });
  if (paramValue) {
    let newUrl = paramValue;

    if (hardRedirect) window.location.replace(newUrl);
    else window.history.replaceState({}, document.title, newUrl); // Corrected: Use .replace() as a method
    return true; // Indicates a redirect happened
  }
  return false;
};

export const handleRemoveQueriesNRedirect = ({
                                               params = [], // Array of param names to check/remove
                                               saveToLocalStorage = true,
                                               hardRedirect = true,
                                             }) => {
  let found = false;
  let queryParamsToRemove = [];

  params.forEach((paramName) => {
    const paramValue = getQueryParam({ param: paramName });

    if (paramValue) {
      found = true;
      queryParamsToRemove.push(paramName);

      if (saveToLocalStorage) {
        localStorage.setItem(paramName, paramValue);
      }
    }
  });

  if (found) {
    const newUrl = removeQueryParams({ paramsToRemove: queryParamsToRemove });

    if (hardRedirect) {
      window.location.replace(newUrl);
    } else {
      window.history.replaceState({}, document.title, newUrl);
    }
    return true;
  }
  return false;
};
