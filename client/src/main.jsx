import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import { AuthProvider } from "./AuthContext";
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
   <AuthProvider>
    <App />
  </AuthProvider>
  </BrowserRouter>
)