import { secondaryButtonClass } from "../config";
import { useAccount } from "../context/AccountContext";
import ShadowBox from "./ShadowBox";

export default function LogoutButton() {
    const acc = useAccount();

    return (
        <ShadowBox title="Logout">
            <p>You are currently logged in using Strava account <strong>{acc.account?.strava_username}</strong></p>
            <form>
            <button className={secondaryButtonClass} onClick={() => acc.logout()}>Logout</button>
            </form>
        </ShadowBox>
    );
}