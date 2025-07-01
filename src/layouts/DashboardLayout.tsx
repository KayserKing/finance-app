import { ReactNode } from "react";
import { Header, NavBar } from "@/components";
import { useIsFetching } from "@tanstack/react-query";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const isFetching = useIsFetching();

    return (
        <div className="flex flex-col-reverse sm:flex-row min-h-screen">
            {/* NavBar */}
            <div className="fixed bottom-0 w-full sm:static sm:w-24 sm:h-screen z-50">
                <NavBar />
            </div>

            {/* Main Content */}
            <div className="flex-1 px-8 max-sm:px-4 relative">
                {/* Optional Global Loader */}
                {isFetching > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#efefef] bg-opacity-70 z-40">
                        <div className="animate-spin h-8 w-8 border-4 border-[#004aad] border-t-transparent rounded-full"></div>
                    </div>
                )}

                {/* Header + Page Content */}
                <div>
                    <Header />
                </div>
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
