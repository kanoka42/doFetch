// In order to use the doFetch hook, one can either use the async lifestyle of fetch
// Or wrap the function in a library like React-Query for additional benefits.

import { apiBackend, doFetch, postOptions } from "./api";

// This is an example of the hook in React-Query
const loginUser = (loginDetails) =>
  doFetch(`${apiBackend}/api/auth/login`, postOptions(loginDetails)).then(
    (data) => data
  );

export const useLoginUser = () =>
  useMutation(postUserByDetails, {
    mutationKey: "postUserByDetails",
    onSuccess: (data) => data,
  });

const updateUser = (userUpdate) =>
  doFetch(`${apiBackend}/api/user/update`, patchOptions(userUpdate)).then(
    (data) => data
  );

export const useUpdateUser = () =>
  useMutation(updateUser, {
    mutationKey: "useUpdateUser",
    onSuccess: (data) => data,
  });
