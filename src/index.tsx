import { AuthProvider } from "contexts/JWTAuthContext";
import SettingsProvider from "contexts/SettingsContext";
import TitleContextProvider from "contexts/TitleContext";
import "nprogress/nprogress.css";
import ReactDOM from "react-dom";
import "react-image-lightbox/style.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./__fakeApi__";

ReactDOM.render(
    <AuthProvider>
      <SettingsProvider>
        <TitleContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </TitleContextProvider>
      </SettingsProvider>
    </AuthProvider>,
  document.getElementById("root")
);
