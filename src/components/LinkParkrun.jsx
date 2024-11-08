import { useState } from "react";
import ShadowBox from "./ShadowBox";
import { useMutation } from "react-query";
import { useAccount } from "../context/AccountContext";
import { useAuth } from "react-oidc-context";
import { apiRootUrl } from "../config";
import ErrorMessage from "./ErrorMessage";

async function verifyParkrunnerIdRemote(id, apply, token) {
  console.log('verifyParkrunnerIdRemote', id, apply, token);
    const response = await fetch(apiRootUrl + 'api/account/verify_parkrunner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` },
        body: JSON.stringify({ parkrunner_id: id, 'apply': apply }),
    });

    if (!response.ok) {
        throw new Error('Parkrunner verification failed');
    }

    return response.json();
}

// eslint-disable-next-line react/prop-types
export default function LinkParkrun({matches}) {
    const acc = useAccount();
    const auth = useAuth();
    const [userProvidedId, setUserProvidedId] = useState(false);
    const [verifiedRunners, setVerifiedRunners] = useState(matches || []);
    // eslint-disable-next-line react/prop-types
    const initialMatchId = matches && matches.length > 0 ? matches[0]?.id : 0;
    const [selectedId, setSelectedId] = useState(initialMatchId ? initialMatchId : null);
    const [error, setError] = useState('');

    const isValid = selectedId && selectedId.toString().match(/^[0-9]{3,10}$/);
    const selectedRunner = verifiedRunners.filter((m) => m.id == selectedId)[0];
    
    const verifyParkrunnerIdMutation = useMutation({
        mutationFn: () => verifyParkrunnerIdRemote(selectedId, 
            selectedRunner ? true : false, 
            auth.user?.access_token),
        onSuccess: (data) => {
          if (data.status === "success") {
            // Proceed to the next step
            // acc.onLinkedParkrunner(selectedId);
            // add data.parkrunner to verifiedRunners if the id doesn't already exist
            if (selectedRunner) {
              acc.onLinkedParkrunner(selectedId);
            }
            if (!verifiedRunners.find((r) => r.id === data.parkrunner.id)) {
              setVerifiedRunners([...verifiedRunners, data.parkrunner]);
            }
          } else {
            setError('Verification failed');
          }
        },
        onError: (error) => {
          console.error('Verification failed:', error.message);
          setError('Verification failed');
        },
      });

    const setParkrunnerId = (id) => {
        if (id.startsWith('A')) {
            id = id.substring(1);
        }
        //Strip any non-numeric characters
        id = id.replace(/\D/g, '');
        setUserProvidedId(true);
        setSelectedId(id);
    }

    const verifyParkrunnerId = (f) => {
      f.preventDefault();
      // if (!verifyParkrunnerIdMutation.isIdle) {
      //   return;
      // }
      setError("");
      if (isValid) {
          verifyParkrunnerIdMutation.mutate();
      } else {
          setError('Invalid parkrunner ID');
      }
    }

    return (
      <>
        <ShadowBox title="Step 3: Link parkrun">
            {error && <ErrorMessage message={error} />}
            <p>Race Trace automatically links your parkrun results with Strava activities.</p>
              <form onSubmit={(f) => verifyParkrunnerId(f)}>
              <label htmlFor="parkrunner-id" className="sr-only">
                parkrun number
              </label>
              <div>
                {initialMatchId && initialMatchId == selectedId && !userProvidedId ? <p className="text-sm text-gray-500">We have found this one, is it you?</p> : null}
                <input
                  type="text"
                  id="parkrunner-id"
                  className="px-4 py-2 border border-gray-300 rounded mr-2 w-28"
                  maxLength={10}
                  value={selectedId ? `A${selectedId}` : 'A'}
                  onChange={(e) => setParkrunnerId(e.target.value)}
                /> <span className="text-nowrap">{selectedRunner?.first_name} {selectedRunner?.last_name}</span>
              </div>
              <div>
                {
                verifyParkrunnerIdMutation.isLoading ?
                <button className="px-6 py-3 bg-gray-500 text-white text-lg font-semibold rounded mt-5" disabled={true}>
                  Verifying...</button> :
                
                selectedRunner ? 
                <button className="px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded hover:bg-orange-600 mt-5">
                  I confirm this is me
                </button> : 
                <button className="px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded hover:bg-orange-600 mt-5">
                  Verify
              </button>}
              </div>
            </form>
        </ShadowBox>
        </>
    );
}