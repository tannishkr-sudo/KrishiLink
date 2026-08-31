import { BrowserRouter, Route, Routes } from "react-router-dom";
import Shell from "@/components/Shell";
import { AppProvider } from "@/store/AppStore";
import Home from "@/pages/Home";
import Produce from "@/pages/Produce";
import Requests from "@/pages/Requests";
import Marketplace from "@/pages/Marketplace";
import Prices from "@/pages/Prices";
import Storage from "@/pages/Storage";
import Transport from "@/pages/Transport";
import Orders from "@/pages/Orders";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import "@/styles/theme.css";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Shell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/listings" element={<Marketplace />} />
            <Route path="/prices" element={<Prices />} />
            <Route path="/prices/forecast" element={<Prices />} />
            <Route path="/produce" element={<Produce />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/storage" element={<Storage />} />
            <Route path="/storage/locations" element={<Storage />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/transport/schedule" element={<Transport />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/history" element={<Orders />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/new" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/settings" element={<Profile />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Shell>
      </AppProvider>
    </BrowserRouter>
  );
}
