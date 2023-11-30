import { isEmpty, isNil, mergeDeepRight } from "ramda";
import { getToken } from "../authorization";

const contentTypeJson = "application/json";

export const apiBackend = process.env.REACT_APP_API;

const DEFAULT_OPTIONS = {
  method: "GET",
  headers: {
    accept: contentTypeJson,
  },
  urlParams: {},
  jsonOutput: true,
};

export const postOptions = (body, methodName = "POST") => ({
  method: methodName,
  mode: "cors",
  cache: "no-cache",
  headers: {
    ...(!isNil(body) && !isEmpty(body) && { "Content-Type": contentTypeJson }),
    Accept: "application/json",
  },
  redirect: "follow",
  referer: "no-referrer",
  body: JSON.stringify(body),
});

export const postImageOptions = (body, methodName = "POST") => ({
  method: methodName,
  mode: "cors",
  cache: "no-cache",
  headers: {
    Accept: "application/json",
  },
  redirect: "follow",
  referer: "no-referrer",
  body,
});

export const patchOptions = (
  body,
  methodName = "PATCH",
  jsonOutput = true
) => ({
  method: methodName,
  mode: "cors",
  cache: "no-cache",
  headers: {
    ...(!isNil(body) && !isEmpty(body) && { "Content-Type": contentTypeJson }),
    Accept: "application/json",
  },
  redirect: "follow",
  referer: "no-referrer",
  body: JSON.stringify(body),
  jsonOutput,
});

const headerConfig = (options = {}) => {
  const authToken = getToken();
  const header = {
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  };
  return mergeDeepRight(header, options);
};

export async function checkStatus(fetchResponse) {
  if (fetchResponse.ok) {
    return fetchResponse;
  }
  const data = await fetchResponse.json();
  const error = new Error(
    `${fetchResponse.status}: "${fetchResponse.statusText}"`
  );

  // eslint-disable-next-line no-throw-literal
  throw {
    error,
    data,
  };
}

export async function doFetch(route, options = {}) {
  const fetchOptions = mergeDeepRight(DEFAULT_OPTIONS, headerConfig(options));
  const jsonOutput = fetchOptions?.jsonOutput;
  try {
    const response = await fetch(route, fetchOptions);
    const fetchResponse = await checkStatus(response);
    const data = await fetchResponse.json();

    return { status: fetchResponse.status, ...data, jsonOutput };
  } catch (error) {
    const errorMessage = `${DEFAULT_OPTIONS.method} ${route} failed with ${error?.data?.messageDetails}`;
    const errorCode = error?.data?.status || 400;

    // eslint-disable-next-line no-console
    console.error(errorMessage);

    return { status: errorCode, data: { stuff: "empty" }, ...error };
  }
}

export async function validateToken() {
  const response = await doFetch(`${apiBackend}/api/auth`).then(
    (data) => data?.user
  );

  return response.status;
}
