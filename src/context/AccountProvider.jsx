import { useCallback, useEffect, useReducer } from "react";
import { useAuth } from "react-oidc-context";
import { AccountContext } from "./AccountContext";
import { apiRootUrl, oidcConfig } from "../config";

// eslint-disable-next-line react/prop-types
export function AccountProvider({children}) {
    const auth = useAuth();
    const [accountState, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "SET_ACCOUNT_INFO":
                return {...state, account: action.payload, isLoading: false, status: 'loggedIn'}
            case "SET_ACCOUNT_ERROR":
                return {...state, error: action.payload, isLoading: false}
            case "FETCHING_ACCOUNT_INFO":
                return {...state, isLoading: true}
            case "SET_EMAIL":
                return {...state, account: {...state.account, email: action.payload.email, 
                        marketing_opt_in: action.payload.marketing_opt_in ?? state.account?.marketing_opt_in ?? false, 
                        email_verified: false}}
            case "SET_ACCOUNT_ENABLED":
                return {...state, account: {...state.account, sync_active: action.payload}}
            case "LINKED_PARKRUNNER":
                return {...state, account: {...state.account, parkrunner_id: action.payload}}
            case "UNLINKED_PARKRUNNER":
                return {...state, account: {...state.account, parkrunner_id: null}}
            case "LOGGING_OUT":
                return {...state, status: 'loggingOut', isLoading: true}
            case "LOGGED_OUT":
                return {...state, status: 'loggedOut', account: null, isLoading: false}
            case "VERIFIED_EMAIL":
                if (!state.account || !state.account.email) {
                    return state;
                }
                return {...state, account: {...state.account, email_verified: true}}
            default:
                return state;
        }
    }, {
        status: 'loggedOut',
        account: null,
        isLoading: false,
        error: null,
    });

    const onSetEmail = ({email, marketing_opt_in = null}) => {
        dispatch({type: 'SET_EMAIL', payload: {
            email,
            marketing_opt_in
        }});
    };

    const onVerifiedEmail = () => {
        dispatch({type: 'VERIFIED_EMAIL'});
    };

    const onLinkedParkrunner = (id) => {
        dispatch({type: 'LINKED_PARKRUNNER', payload: id});
    }

    const clearError = () => {  
        dispatch({type: 'SET_ACCOUNT_ERROR', payload: null});
    }

    const logout = useCallback(async () => {
        if (auth.user?.access_token) {
            dispatch({type: 'LOGGING_OUT'});
            try {
                const token = auth.user?.access_token;
                const response = await fetch(apiRootUrl + 'o/revoke_token/', {
                    method: 'POST',
                    body: new URLSearchParams({
                        token: token,
                        client_id: oidcConfig.client_id,
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw response;
                }
                await auth.removeUser();
                dispatch({type: 'LOGGED_OUT'});
            } catch (e) {
                console.log(e);
                dispatch({type: 'SET_ACCOUNT_ERROR', payload: 'Failed to logout'});
            };
        }
    }, [auth]);

    const fetchAccountData = useCallback(async () => {
        dispatch({type: 'FETCHING_ACCOUNT_INFO', payload: null});
        try {
            const token = auth.user?.access_token;
            const response = await fetch(apiRootUrl + "api/account/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw response;
            }
            const data = await response.json();
            dispatch({type: 'SET_ACCOUNT_INFO', payload: data});
        } catch (e) {
            //If it's a 401 error, the token has expired, so log out
            if (e.status === 401) {
                auth.removeUser();
                dispatch({type: 'SET_ACCOUNT_ERROR', payload: 'Please log in again'});
            } else {
                console.log(e);
                dispatch({type: 'SET_ACCOUNT_ERROR', payload: 'Failed to fetch account information, please refresh the page to try again'});
            }
        }
    }, [auth]);

    const setEmailOptIn = useCallback(async ({optIn}) => {
        dispatch({type: 'FETCHING_ACCOUNT_INFO'});
        try {
            const token = auth.user?.access_token;
            const response = await fetch(apiRootUrl + "api/account/me", {
                method: 'PATCH',
                body: JSON.stringify({marketing_opt_in: optIn}),
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw response;
            }
            dispatch({type: 'SET_ACCOUNT_INFO', payload: await response.json()});
        } catch (e) {
            console.log(e);
            dispatch({type: 'SET_ACCOUNT_ERROR', payload: 'Failed to update email preferences'});
        }
    }
    , [auth]);

    const setAccountStatus = useCallback(async ({enabled}) => {
        dispatch({type: 'SET_ACCOUNT_ERROR', payload: null});
        try {
            const token = auth.user?.access_token;
            const response = await fetch(apiRootUrl + "api/account/status", {
                method: 'POST',
                body: JSON.stringify({active: enabled}),
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw response;
            }
            dispatch({type: 'SET_ACCOUNT_ENABLED', payload: enabled});
        } catch (e) {
            console.log(e);
            dispatch({type: 'SET_ACCOUNT_ERROR', payload: 'Failed to set account status'});
        }
    }, [auth.user?.access_token]);

    const unlinkParkrunner = useCallback(async () => {
        dispatch({type: 'SET_ACCOUNT_ERROR', payload: null});
        try {
            const token = auth.user?.access_token;
            const response = await fetch(apiRootUrl + "api/account/links", {
                method: 'PATCH',
                body: JSON.stringify({parkrunner_id: null}),
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw response;
            }
            dispatch({type: 'UNLINKED_PARKRUNNER'});
        } catch (e) {
            console.log(e);
            dispatch({type: 'SET_ACCOUNT_ERROR', payload: 'Failed to unlink parkrunner - please try again'});
        }
    }, [auth.user?.access_token]);

    useEffect(() => {
        //If we haven't got an account but are logged in, fetch it
        if (auth.user && !accountState.account && !accountState.isLoading && !accountState.error) {
            fetchAccountData();
        }
        if (!auth.user?.access_token && accountState.account) {
            dispatch({type: 'SET_ACCOUNT_INFO', payload: null});
        }
    }, [auth, accountState, fetchAccountData]);

    useEffect(() => {
        if (accountState?.account?.email && !accountState.account.email_verified) {
            //Trigger fetch of strava activities and try to link them up with a parkrun account
        }

    }, [accountState])

    function pauseAccount() {
        setAccountStatus({enabled: false});
    }

    function resumeAccount() {
        setAccountStatus({enabled: true});
    }

    const deleteAccount = useCallback(async () => {
        if (!auth.user?.access_token) {
            return;
        }
        console.log('Delete account');
        dispatch({type: 'LOGGING_OUT'});
        try {
            const token = auth.user?.access_token;
            const response = await fetch(apiRootUrl + "api/account/delete", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw response;
            }
            auth.removeUser();
        } catch (e) {
            console.log(e);
            dispatch({type: 'SET_ACCOUNT_ERROR', payload: 'Failed to delete account'});
        }
    }, [auth]);

    return (
        <AccountContext.Provider value={{...accountState, 
            onSetEmail, 
            onVerifiedEmail, 
            logout, 
            clearError,
            fetchAccountData, 
            onLinkedParkrunner, 
            unlinkParkrunner,
            pauseAccount,
            resumeAccount,
            setEmailOptIn,
            deleteAccount}}>
            {children}
        </AccountContext.Provider>
    )
}