import { useAuth } from "react-oidc-context";
import { NavLink } from "react-router-dom";

const getLinkClassName = ({isActive}) => [
    isActive ? "text-orange-500" : "text-md",
];

export default function Header() {
    const auth = useAuth();

    return (<div className="grid grid-rows font-[family-name:var(--font-geist-sans)]">
        <header>
            <nav className="flex justify-between">
                <ul className="flex space-x-4 pt-8 pl-5">
                    <li><NavLink to="/" className={getLinkClassName}>Home</NavLink></li>
                    <li><NavLink to="/privacy" className={getLinkClassName}>Privacy</NavLink></li>
                    {auth.isAuthenticated ? <li><NavLink to="/profile" className={getLinkClassName}>Profile</NavLink></li> : null}
                </ul>
                <span className="justify-end pr-5">
                <NavLink to="/" > <img
                    className="md:w-[150px] md:h-[150px]"
                    src="/static/racetracelogot.png"
                    alt="Race Trace logo"
                    width={100}
                    height={100}
                /></NavLink></span>
            </nav>

            
        </header>
    </div>);
}