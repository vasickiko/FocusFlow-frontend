import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

import { Provider } from "react-redux"
import { store } from "./app/store"
import { BrowserRouter } from "react-router-dom"

import { GoogleOAuthProvider } from "@react-oauth/google"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)