import { useNavigate, useParams } from "react-router-dom";
import NicsTraderApp from "@/pages/NicsTraderApp";
import { useCabinetOutletContext } from "./CabinetLayout";

// The Telegram Mini App, screen for screen, inside the web cabinet.
const CabinetTrader = () => {
  const { session, language, logout } = useCabinetOutletContext();
  const { screen } = useParams();
  const navigate = useNavigate();

  return (
    <NicsTraderApp
      cabinetSession={session}
      cabinetLanguage={language}
      cabinetScreen={screen}
      onCabinetNavigate={(next) =>
        navigate(next === "dashboard" ? "/cabinet/trader" : `/cabinet/trader/${next}`)
      }
      onCabinetSessionInvalid={logout}
    />
  );
};

export default CabinetTrader;
