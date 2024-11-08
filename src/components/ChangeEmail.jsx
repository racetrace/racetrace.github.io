//Display email and display opt-out checkbox - allowing the user to unsubscribe from emails
//Display a button to submit the email address
//Display a button to verify the email address
//Display a button to resend the verification email

import { useState } from "react";
import { disabledButtonClass, secondaryButtonClass } from "../config";
import { useAccount } from "../context/AccountContext";
import ShadowBox from "./ShadowBox";

export default function ChangeEmail() {
    const acc = useAccount();
    const [optIn, setOptIn] = useState(null);

    const submitOptOut = (f) => {
        f.preventDefault();
        acc.setEmailOptIn({ optIn });
        setOptIn(null);
    }

    return (<ShadowBox title="Email">
        <p>We are currently sending emails to <strong>{acc.account?.email}</strong></p>
        <form onSubmit={submitOptOut}>
            <div className="flex items-center mb-5">
                <input
                  type="checkbox"
                  id="marketing-emails"
                  className="mr-2"
                  disabled={acc.account?.email === null}
                  checked={optIn ?? acc.account?.marketing_opt_in ?? true}
                  onChange={(e) => setOptIn(Boolean(e.target.checked))}
                />
                <label htmlFor="marketing-emails" className="text-sm">
                  I&#39;m happy to hear about new features
                </label>
              </div>
            {!acc.isLoading && optIn !== null && <button className={optIn !== null ? secondaryButtonClass : disabledButtonClass}>Save</button>}
            {acc.isLoading && <button className={disabledButtonClass}>Saving...</button>}
        </form>

    </ShadowBox>)
}