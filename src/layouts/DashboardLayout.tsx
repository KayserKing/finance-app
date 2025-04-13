import { ReactNode } from "react";
import { Header, NavBar } from "@/components";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="flex flex-col-reverse sm:flex-row min-h-screen">
            <div className="fixed bottom-0 w-full sm:static sm:w-24 sm:h-screen z-50">
                <NavBar />
            </div>
            <div className="flex-1 px-8 max-sm:px-4">
                <div>
                    <Header />
                </div>
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;