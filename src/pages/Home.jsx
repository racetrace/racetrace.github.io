import { useAuth } from 'react-oidc-context';
import ScrollingBackground from '../components/ScrollingBackground';
import { useNavigate } from 'react-router';
import { useAccount } from '../context/AccountContext';
import ErrorMessage from '../components/ErrorMessage';
import { disabledButtonClass, facebookUrl, primaryButtonClass } from '../config';

export default function Home() {
  const auth = useAuth();
  const accData = useAccount();
  const navigate = useNavigate();
  // Docs: https://github.com/authts/react-oidc-context

  switch (auth.activeNavigator) {
    case "signinSilent":
        return <div>Signing you in...</div>;
    case "signoutRedirect":
        return <div>Signing you out...</div>;
    }

  return (
      <main>
        {auth.error && <ErrorMessage title='Error' message={auth.error.message} />}
        <div className="font-[family-name:var(--font-geist-sans)]">
        <section className="w-full grid grid-rows-1 grid-cols-1">
            <ScrollingBackground className="row-start-1 col-start-1" />
            <div className="grid items-center justify-center col-start-1 row-start-1 z-10">
              <div className="flex justify-center items-center flex-col">
              <h1 className="text-4xl font-bold mb-4 z-10 text-center pl-5 pr-5">Share your race results with Strava, automatically.</h1>
              {
                auth?.isLoading ? <button className={disabledButtonClass}>
                  Loading ...
                </button> :
                auth?.isAuthenticated ?
                <button onClick={() => navigate("profile")} className={primaryButtonClass}>
                  {accData.account ? `${accData.account.first_name}'s Profile →` : 'Profile →'}
                  </button> :
                <button onClick={() => auth.signinRedirect()}>
                  <img src="/static/btn_strava_connectwith_orange.svg" alt="Connect with Strava" width={300} />
                </button>
              }
              </div>
          </div>
        </section>
        <section className="flex flex-col md:flex-row bg-gray-600 p-5 justify-center mt-5 items-center">
          <div className="xl:w-1/3 lg:w-1/2 text-left text-white">
            <h2 className="text-3xl font-bold mb-4">How does it work?</h2>
              <p className="text-lg mb-2">
                1. Connect your Strava account to Race Trace.
              </p>
              <p className="text-lg mb-2">
                2. Link your parkrun profile. 🌳
              </p>
              <p className="text-lg mb-2">
                3. Go for a run and upload it to Strava 🏃
              </p>
              <p className="text-lg mb-2">
                4. We find your parkrun results and update your Strava activity description.
              </p>
              <p className="text-lg mb-2">
                5. Your friends give you at least 50% more kudos! 🎉
              </p>
          </div>
          <div className="mt-5 md:mt-0 xl:w-1/3 lg:w-1/2 md:ml-5">
              <img
                src="/static/racetrace-example1.png"
                alt="Example Strava Description"
                width={500}
                height={263}
              />
          </div>    
        </section>
        <section className="flex flex-col md:flex-row p-5 justify-center">
          <div className="xl:w-1/3 lg:w-1/2 text-left">
            <h2 className="text-3xl font-bold mb-4">About Race Trace</h2>
            <p className="text-lg mb-5">
              Race Trace automatically links your race results with Strava. 
              Our &quot;race tracing&quot; system allows us to identify races and find your results automatically.
            </p>
            <p className="text-lg mb-5">
              At the moment we only support parkrun events, but we have big plans for the future!{accData?.account ? null : ' So sign up now and stay tuned.'}
            </p>
            <p className="text-sm italic">
              Confession: When I say &quot;we&quot;, I really mean &quot;me&quot;. I&apos;m a solo developer working on this project in my spare time 
              because I wanted it to exist. You can chat to me on various parkrun-related <a href={facebookUrl} className="underline">Facebook Groups</a>.
            </p>
          </div>
          <div className="mt-5 md:mt-0 lg:w-1/2 xl:w-1/3 md:ml-5">
            <img
              src="/static/steve.jpg"
              alt="Steve Mayne - Creator of Race Trace"
              width={500}
              height={410}
            />
          </div>
        </section>
        
        </div>        
      </main>
    
  );
}
