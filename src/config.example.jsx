export const apiRootUrl = "http://localhost:8000/";
export const wsRootUrl = "ws://localhost:8000/";
export const facebookUrl = "https://www.facebook.com/racetraceworld";

import { WebStorageStateStore } from 'oidc-client-ts';

export const oidcConfig = {
    userStore: new WebStorageStateStore({
      store: localStorage
    }),
    onSigninCallback: () => {
      window.location = "/profile";
    },
    onSignoutCallback: () => {
      window.location = "/";
    },
    authority: "http://localhost:8000/o",
    client_id: "mRsT9rH0f7fneKZPP96XPEIigfwxa5TGf6cG1y6S",
    response_type: "code",
    redirect_uri: "http://localhost:5173/",
    scope: "read write",
    autoSignIn: false,
  };

  export const primaryButtonClass = "px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded hover:bg-orange-700";
  export const secondaryButtonClass = "px-6 py-3 bg-gray-500 text-white text-lg font-semibold rounded hover:bg-gray-600";
  export const disabledButtonClass = "px-6 py-3 bg-gray-400 text-white text-lg font-semibold rounded cursor-not-allowed";
  export const dangerButtonClass = "px-6 py-3 bg-red-500 text-white text-lg font-semibold rounded hover:bg-red-600";