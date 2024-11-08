import { secondaryButtonClass } from "../config";
import { useAccount } from "../context/AccountContext";
import ShadowBox from "./ShadowBox";

export default function ForgetMeButton() {
    const acc = useAccount();

    const deleteAccount = (e) => {
        e.preventDefault();
        acc.deleteAccount();
    }

    return (
        <ShadowBox title="Forget Me">
            <p>Clicking here will remove your user and all of your data from our servers. 
                It&apos;s a one-way trip, so please be sure!</p>
            <form onSubmit={deleteAccount}>
                <button className={secondaryButtonClass}>Delete it all and logout 😢</button>
            </form>
        </ShadowBox>
    );
}