"use client";

import Link from "next/link";
import ConnectWalletButton from "./ConnectWalletButton";
import { usePathname } from "next/navigation";

export function NavigationMenu() {
  const pathname = usePathname();

  const orgId = pathname.split("/")[2];
  const orgName = orgId ? orgId.split(":")[0] : undefined;

  const homePage = orgId ? `/org/${orgId}` : "/";
  const createPage = orgId ? `/org/${orgId}/create` : "/create";

  const isHomePage = pathname === homePage;
  const isCreatePage = pathname === createPage;

  return (
    <div className="px-6 py-2">
      <div className="min-h-[95px] px-4 flex flex-row justify-between items-center bg-green-100 backdrop-blur-lg shadow-xl shadow-orange-500/20 rounded-xl border-2 border-green-700">
        <div className="flex flex-row items-center gap-x-2">
          <Link href="/" className="text-4xl/6 font-[600] text-green-800/90">
            People's Mandate
          </Link>
          <span className="text-5xl/6 text-green-700">|</span>
          {orgName && (
            <>
              <span className="text-4xl/6 font-[600] text-orange-700/90">
                ORG: {orgName}
              </span>
              <span className="text-5xl/6 text-green-700">|</span>
            </>
          )}

          {/* HOME LINK */}
          <Link
            className={`p-1 border-2 border-green-800 rounded-full ${
              isHomePage
                ? "bg-green-800 fill-orange-50 pointer-events-none" // Active state
                : "cursor-pointer fill-green-800 bg-orange-50 hover:fill-orange-50 hover:bg-green-800" // Inactive state
            }`}
            href={homePage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="35px"
              viewBox="0 -960 960 960"
              width="35px"
            >
              <path d="M160-186.67v-380q0-15.83 7.08-30 7.09-14.16 19.59-23.33L440-810q17.45-13.33 39.89-13.33T520-810l253.33 190q12.5 9.17 19.59 23.33 7.08 14.17 7.08 30v380q0 27.5-19.58 47.09Q760.83-120 733.33-120h-140q-14.16 0-23.75-9.58-9.58-9.59-9.58-23.75v-213.34q0-14.16-9.58-23.75-9.59-9.58-23.75-9.58h-93.34q-14.16 0-23.75 9.58-9.58 9.59-9.58 23.75v213.34q0 14.16-9.58 23.75-9.59 9.58-23.75 9.58h-140q-27.5 0-47.09-19.58Q160-159.17 160-186.67Z" />
            </svg>
          </Link>

          {/* CREATE NEW ELECTION LINK */}
          <Link
            className={`p-1 border-2 border-green-800 rounded-full ${
              isCreatePage
                ? "bg-green-800 fill-orange-50 pointer-events-none"
                : "cursor-pointer fill-green-800 bg-green-50 hover:fill-orange-50 hover:bg-green-800"
            }`}
            href={createPage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="35px"
              viewBox="0 -960 960 960"
              width="35px"
            >
              <path d="M427.67-427.67H172v-104.66h255.67v-256.34h104.66v256.34h256.34v104.66H532.33V-172H427.67v-255.67Z" />
            </svg>
          </Link>
        </div>
        <ConnectWalletButton />
      </div>
    </div>
  );
}
