import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";

export default function BaseLayout() {
    return (
        <div className="flex flex-col min-h-screen antialiased *:flex-shrink-0">
            <Header />
            <Outlet />
        </div>
    );
}