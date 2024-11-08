import { primaryButtonClass, secondaryButtonClass } from "../config";
import { useAccount } from "../context/AccountContext";
import ShadowBox from "./ShadowBox";

export default function UnlinkParkrun() {
    const acc = useAccount();

    const unlinkParkrun = (f) => {
        f.preventDefault();
        acc.unlinkParkrunner();
    }

    const enableAccount = (f) => {
        f.preventDefault();
        acc.resumeAccount();
    }

    const pauseAccount = (f) => {
        f.preventDefault();
        acc.pauseAccount();
    }

    return (
        <ShadowBox title="Links">
            <p>Strava user <strong>{acc.account.strava_username}</strong> is linked to parkrun member <strong>A{acc.account.parkrunner_id}</strong> 
            {acc.account.parkrunner_name && <span className="text-slate-600" > ({acc.account.parkrunner_name})</span>}</p>
            {acc.account.sync_active && <p className="bg-green-100 p-2">🔄 Live updates enabled</p> }
            {!acc.account.sync_active && <p className="bg-gray-200 p-2">⏸️ Live updates paused</p> }
            <form>
            {acc.account.sync_active && <button className={`${primaryButtonClass} mr-5`} onClick={pauseAccount}>Pause</button>}
            {!acc.account.sync_active && <button className={`${primaryButtonClass} mr-5`} onClick={enableAccount}>Resume</button>}
                <button className={secondaryButtonClass} onClick={unlinkParkrun}>Unlink</button>
            </form>
        </ShadowBox>
    );
}