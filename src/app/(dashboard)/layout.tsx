'use client'
import { useAuthRedirect } from "@/hooks";
import { DashboardLayout } from "@/layouts";

export default function DashboardSectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useAuthRedirect(); 
    return <DashboardLayout>{children}</DashboardLayout>;
}
