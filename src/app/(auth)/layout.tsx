'use client'
import { useAuthRedirect } from "@/hooks";

export default function AuthSectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useAuthRedirect();
    return <>{children}</>;
}
