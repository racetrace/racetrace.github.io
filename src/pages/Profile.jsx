import { useAuth } from "react-oidc-context";
import { useAccount } from "../context/AccountContext";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { VerifyEmail } from "../components/VerifyEmail";
import LinkParkrun from "../components/LinkParkrun";
import LogoutButton from "../components/LogoutButton";
import UnlinkParkrun from "../components/UnlinkParkrun";
import ForgetMeButton from "../components/ForgetMeButton";
import LoadingSpinner from "../components/LoadingSpinner";
import ChangeEmail from "../components/ChangeEmail";

export default function Profile() {
    const accountInfo = useAccount();
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isAuthenticated && !auth.isLoading) {
            //auth.signinRedirect();
            navigate("/");
        }
    }, [auth, navigate]);

    // useEffect(() => {
    //     accountInfo.refresh();
    // }, [accountInfo]);

    if (!accountInfo || accountInfo?.isLoading) {
        return <LoadingSpinner>Loading...</LoadingSpinner>;
    }

    const emailDone = (accountInfo?.account?.email && accountInfo?.account?.email_verified) ? true : false;
    
    return (
        <div className="flex flex-col xl:flex-row xl:max-w-30">
            {!emailDone && <VerifyEmail />}
        {emailDone && !accountInfo?.account?.parkrunner_id && <LinkParkrun matches={accountInfo.account.parkrunner_matches} />}
        {emailDone && accountInfo?.account?.parkrunner_id && <UnlinkParkrun />}
        {emailDone && <ChangeEmail />}
        <LogoutButton />
        <ForgetMeButton />
        </div>
    );
}