import { useEffect, useState } from "react";
import { useAccount } from "../context/AccountContext";
import ErrorMessage from "./ErrorMessage";
import { useMutation } from "react-query";
import { apiRootUrl } from "../config";
import { useAuth } from "react-oidc-context";
import ShadowBox from "./ShadowBox";
import LoadingSpinner from "./LoadingSpinner";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function patchEmail(email, optIn, token) {
  const response = await fetch(apiRootUrl + 'api/account/me', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 
      Authorization: `Bearer ${token}` },
    body: JSON.stringify({ email, marketing_opt_in: optIn }),
  });

  if (!response.ok) {
    throw new Error('Email verification failed');
  }

  return response.json(); // assuming response has JSON payload
}

async function verifyEmail(code, token) {
  const response = await fetch(apiRootUrl + 'api/account/verify_email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error('Email verification failed');
  }

  return await response.json();
}

export function VerifyEmail() {
  const acc = useAccount();
  const auth = useAuth();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(true);
  const [verificationCode, setVerificationCode] = useState("");
  
  useEffect(() => {
    if (acc.account && acc.account.email && !email) {
      setEmail(acc.account.email);
    }
  }, [acc.account, email]);

  const setEmailMutation = useMutation({
    mutationFn: ({email, optIn = null}) => patchEmail(email, optIn, auth.user?.access_token),
    onSuccess: async () => {
      // Proceed to the next step
      acc.fetchAccountData();
      //await acc.onSetEmail(email);
    },
    onError: (error) => {
      console.error('Verification failed:', error.message);
      setError('Verification failed');
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (code) => verifyEmail(code, auth.user?.access_token),
    onSuccess: (data) => {
      if (data.status === "success") {
        // Proceed to the next step
        acc.fetchAccountData();
      } else {
        setError('Verification failed');
      }
    },
    onError: (error) => {
      console.error('Verification failed:', error.message);
      setError('Verification failed');
    },
  });
  
  const emailIsValid = emailRegex.test(email);
  const verificationIsValid = verificationCode.length === 4;

  function verifyAndSubmitEmail(e) {
    if (!setEmailMutation.isIdle) {
      return;
    }
    setError("");
    e.preventDefault();
    if (emailIsValid) {
      setEmailMutation.mutate({email, optIn});
    } else {
      setError("Please enter a valid email address");
    }
  }

  function formVerificationSubmit(e) {
    e.preventDefault();
    if (verificationIsValid) {
      acc.clearError();
      verifyEmailMutation.mutate(verificationCode);
    } else {
        setError("Please enter a valid verification code");
    }
  }

  function applyVerificationCode(value) {
    const sanitisedValue = value.replace(/[^0-9]/g, "");
    setVerificationCode(sanitisedValue);
  }

  if (acc.isLoading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }
  if (acc.account === null) {
    return <div></div>;
  }
  if (!acc.account.email) {
    return (
      <>
        <ShadowBox title="Step 1: Let&apos;s Keep In Touch">
            {error && <ErrorMessage title="Error" message={error} />}
            <p className="text-lg">
              Before we can begin, we need your email to verify your account. 
              We promise not to spam you, we just want to pop you a natty code
              to prove you&#39;re you!
            </p>
            <form onSubmit={verifyAndSubmitEmail}>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <div>
                <input
                  type="email"
                  id="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`px-4 w-10/12 py-2 border ${
                    !email || emailIsValid
                      ? "border-gray-300"
                      : "border-red-700"
                  } rounded`}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="text-red-500 text-sm">
                {!email || emailIsValid
                  ? ""
                  : "Please enter a valid email address"}
              </div>
              <div className="flex items-center mt-5">
                <input
                  type="checkbox"
                  id="marketing-emails"
                  className="mr-2"
                  checked={optIn}
                    onChange={(e) => setOptIn(e.target.checked)}
                />
                <label htmlFor="marketing-emails" className="text-sm">
                  I&#39;m happy to hear about new features
                </label>
              </div>
              <div>
                <button
                  disabled={!emailIsValid && setEmailMutation.isIdle}
                  className="px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded hover:bg-orange-600 mt-5"
                >
                  Send me my code
                </button>
              </div>
            </form>
          </ShadowBox>
      </>
    );
  }
  if (acc.account.email_verified === false) {
    return (
      <>
        <ShadowBox title="Step 2: Verify Your Email">
        {error && <ErrorMessage title="Error" message={error} />}
            <p className="text-lg">
              We have sent an email to <strong>{email}</strong> containing a secret number! Please
              enter it here:
            </p>
            <form onSubmit={formVerificationSubmit}>
              <label htmlFor="verification-code" className="sr-only">
                Verification Code
              </label>
              <div>
                <input
                  type="text"
                  id="verification-code"
                  className="px-4 py-2 border border-gray-300 rounded"
                  maxLength={4}
                  value={verificationCode}
                  onChange={(e) => applyVerificationCode(e.target.value)}
                />
              </div>
              <div>
                <button className="px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded hover:bg-orange-600 mt-5">
                  Verify
                </button>
                <button
                onClick={() => acc.onSetEmail({email: null})}
                className="px-6 py-3 bg-gray-500 text-white text-lg font-semibold rounded hover:bg-gray-600 ml-4"
              >
                Change Email
              </button>
            
              </div>
            </form>
          </ShadowBox>
      </>
    );
  } else {
    return <div>Email verified!</div>;
  }
}
