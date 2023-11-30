import { isEmpty, isNil } from "ramda";

export function getToken(name = "auth_token") {
  try {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match[2];
  } catch (e) {
    return "";
  }
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  document.cookie = "auth_token=;max-age=0";
  window.location.reload();
}

export async function saveAuthToken(authToken, rememberMe = false) {
  if (authToken === undefined) {
    return false;
  }
  try {
    if (!isNil(authToken) && !isEmpty(authToken)) {
      const days = rememberMe ? 30 : 1;
      const expireTime = days * 24 * 60 * 60;
      document.cookie = `auth_token=${authToken};max-age=${expireTime};SameSite=Strict;`;
    }
  } catch (e) {
    return false;
  }
  return true;
}
