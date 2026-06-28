import { NavigationMenu } from "@/components/Header";

export default async function OrgMainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
