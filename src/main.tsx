// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";

// createRoot(document.getElementById("root")!).render(<App />);

// import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";
// import { AuthProvider } from "react-oidc-context";

// const cognitoAuthConfig = {
//   authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_abkju3TOn", // your region + user pool id
//   client_id: "2mdsov6q0up9jhfml2k5o9tdgi", // your app client id
//   redirect_uri: "http://localhost:5173", // matches your callback URL
//   response_type: "code",
//   scope: "email openid phone",
// };

// createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <AuthProvider {...cognitoAuthConfig}>
//       <App />
//     </AuthProvider>
//   </React.StrictMode>
// );

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  // issuer URL: region + userPoolId
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_abkju3TOn",
  client_id: "2mdsov6q0up9jhfml2k5o9tdgi", // your app client id
  redirect_uri: "https://d3t9ac16dxeckl.cloudfront.net",
  response_type: "code",
  scope: "openid email",
};

// const cognitoAuthConfig = {
//   authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_abkju3TOn",
//   client_id: "2mdsov6q0up9jhfml2k5o9tdgi",
//   redirect_uri: import.meta.env.VITE_REDIRECT_URI,
//   response_type: "code",
//   scope: "openid email",
// };



createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider
      {...cognitoAuthConfig}
      onSigninCallback={() => {
        // remove ?code=... from the URL after login
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }}
    >
      <App />
    </AuthProvider>
  </React.StrictMode>
);
