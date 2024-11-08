import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAccount } from "../context/AccountContext";
import ErrorMessage from "../components/ErrorMessage";

export default function Layout() {
    const acc = useAccount();
    return (<div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {acc.error ? <div className="m-5"><ErrorMessage title='Account Error' message={acc.error} /></div> : null}
        <Outlet/>
      </main>
      {<Footer />}
    </div>);
}