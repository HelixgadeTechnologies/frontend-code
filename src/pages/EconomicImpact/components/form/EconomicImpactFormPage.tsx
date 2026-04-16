import { createContext, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";

import EconomicImpactForm from "./EconomicImpactForm";
import { economicImpactStore as EconomicImpactStore } from "../../store/economicImpactStore";
import { trustStore as TrustStore } from "../../../trust/store/trustStore";
import { GoBack } from "../../../../components/elements";

const EconomicImpactStoreCtx = createContext(EconomicImpactStore);
const TrustStoreCtx = createContext(TrustStore);

const EconomicImpactFormPage = observer(() => {
  const economicImpactStore = useContext(EconomicImpactStoreCtx);
  const trustStore = useContext(TrustStoreCtx);
  const navigate = useNavigate();
  const { name } = useParams();

  useEffect(() => {
    let selectedTrustId = window.sessionStorage.getItem("selectedTrustId");
    if (selectedTrustId) {
       trustStore.selectedTrustId = selectedTrustId;
    }
  }, [trustStore]);

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="mx-auto p-4 sm:p-8">
      <GoBack action={handleClose} trustName={name || ""} page="Economic Impact Report" />
      <div className="mt-8">
        <EconomicImpactForm
          close={handleClose}
          economicImpactStore={economicImpactStore}
          trustStore={trustStore}
        />
      </div>
    </div>
  );
});

export default EconomicImpactFormPage;
