"use client";

import Info from "@/components/info";
import Button from "@/components/ui/Button";
import HashBadge from "@/components/ui/HashBadge";
import Input from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { validAddressCheck } from "@/lib/util/helpers";
import {
  Address,
  Bytes32,
  defaultChain,
  electionFactoryAbi,
  orgRegistryAbi,
  orgRegistryAddress,
  publicClient,
} from "@repo/shared";
import Link from "next/link";
import { useEffect, useState } from "react";
import { decodeEventLog, parseAbi, parseEventLogs } from "viem";

export default function OrgRegisterPage() {
  const { activeAccount, walletClient, isConnecting } = useWallet();
  const { progress, isSiweAuth, profileId } = useAuth();
  const [txHash, setTxHash] = useState<Bytes32 | null>(null);
  const [factoryAddress, setFactoryAddress] = useState<Address | null>(null);
  const [postOrgName, setPostOrgName] = useState<string | null>(null);
  const [orgName, setOrgName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [creators, setCreators] = useState<string[]>([]);
  const [currentCreator, setCurrentCreator] = useState<string>("");

  const [creatorInputStatus, setCreatorInputStatus] = useState<string | null>(
    null,
  );

  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentCreator) {
      setCreatorInputStatus("Enter Creator Address");
    } else {
      const addressResult = validAddressCheck(currentCreator);
      setCreatorInputStatus(
        addressResult === "valid" ? "Creator Address" : addressResult,
      );
    }
  }, [currentCreator]);

  const isLoading = isConnecting || progress;

  async function handleFactoryDeployement() {
    setIsDeploying(true);
    setError(null);
    setTxHash(null);

    if (!publicClient || !walletClient || !activeAccount || !isSiweAuth) {
      setError("Wallet Disconnected");
      setIsDeploying(false);
      return;
    }

    if (!profileId) {
      setError("Complete Account Registration");
      setIsDeploying(false);

      return;
    }

    try {
      const txHash = await walletClient.writeContract({
        address: orgRegistryAddress,
        chain: defaultChain,
        abi: orgRegistryAbi,
        functionName: "registerNewOrg",
        args: [orgName, activeAccount],
        account: activeAccount,
      });
      if (!txHash) {
        setError("Missing Tx Hash");
        return;
      }
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      let factoryAddress: string | null = null;
      console.log("factory dep rec,", receipt);
      if (!receipt.logs) {
        setError("Invalid Tx Receipt");
        return;
      }
      for (const log of receipt.logs) {
        try {
          const decodedLog = decodeEventLog({
            abi: orgRegistryAbi,
            data: log.data,
            topics: log.topics,
          });

          if (decodedLog.eventName === "OrgRegistered") {
            // @ts-ignore - mapping viem inferred types
            factoryAddress = decodedLog.args.electionFactory;
            break;
          }
        } catch (e) {}
      }

      if (!factoryAddress) {
        setError("Factory Address not found");
        return;
      }

      console.log("New Election Factory deployed at:", factoryAddress);

      if (creators.length > 0) {
        const { request: rolesRequest } = await publicClient.simulateContract({
          address: factoryAddress as `0x${string}`,
          abi: electionFactoryAbi,
          functionName: "grantCreatorRoles",
          args: [creators],
          account: activeAccount,
        });

        const rolesTxHash = await walletClient.writeContract(rolesRequest);
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: rolesTxHash,
        });

        if (!receipt || receipt.status === "reverted") {
          setError("Creator Roles were not granted");
        }

        const decodedLogs = parseEventLogs({
          abi: parseAbi([
            "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)",
          ]),
          logs: receipt.logs,
          eventName: "RoleGranted",
        });

        console.log(
          `Successfully granted roles to ${decodedLogs.length} accounts!`,
        );

        decodedLogs.forEach((log, index) => {
          console.log(`--- Grant #${index + 1} ---`);
          console.log("Role Hash:", log.args.role);
          console.log("Granted To:", log.args.account);
          console.log("Granted By:", log.args.sender);
        });
      }

      setPostOrgName(orgName);
      setFactoryAddress(factoryAddress as Address);
      setTxHash(txHash);
      setOrgName("");
      setCreators([]);
    } catch (err: any) {
      console.error("Contract deploy error:", err);
      setError(err.shortMessage || err.message || "An unknown error occurred");
    } finally {
      setIsDeploying(false);
    }
  }

  return (
    <div className="absolute top-30 bottom-0 left-0 right-0 flex justify-center pb-5 gap-x-2">
      <div className="flex flex-col gap-y-4 w-[50%] p-10 rounded-3xl border-2 border-orange-700/60 shadow-lg shadow-orange-500/50">
        <span className="text-orange-700 text-5xl">
          {isLoading ? "Connecting" : "Register New Organisation"}
        </span>

        <Input
          onChange={(e) => setOrgName(e.target.value)}
          value={orgName}
          label="Enter Organisation Name"
        />
        <Input
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          label="Description"
          className="min-h-30"
        />
        <span className="text-3xl text-orange-800">Roles</span>

        <div className="flex justify-between items-end gap-x-2 ">
          <Input
            onChange={(e) => setCurrentCreator(e.target.value)}
            value={currentCreator}
            className="rounded-r-none"
            label={creatorInputStatus}
          />
          <Button
            onClick={() => {
              setCurrentCreator("");
              setCreators((prev) => {
                const alreadyPresent = creators.some(
                  (a) => a === currentCreator,
                );
                if (alreadyPresent) return prev;
                return [...prev, currentCreator];
              });
            }}
            variant="add"
            disabled={creatorInputStatus !== "Creator Address"}
            className={`h-[64%] text-3xl/5 text-center px-3`}
          >
            +
          </Button>
          <Button
            onClick={() => setCurrentCreator("")}
            className={`h-[64%] px-2 rounded-r-md bg-orange-50 border-2 border-orange-700 font-bold text-sm text-red-500 
        hover:bg-red-500 hover:text-white`}
          >
            X
          </Button>
        </div>
        <div className="text-3xl text-orange-800">
          Granting Creator Roles:
          <Info>
            Creator Role can be granted later from manage election page.
          </Info>
        </div>
        <div className="h-full overflow-y-scroll">
          {creators.length > 0 ? (
            <ul className="p-4 rounded-md border-2 border-orange-800 bg-orange-50">
              {creators.map((a, i) => (
                <div key={a} className="flex flex-row gap-x-2 items-center ">
                  <li className="text-xl font-bold text-orange-800 border-b">
                    {i + 1}. {a}
                  </li>
                  <Button
                    onClick={() =>
                      setCreators((prev) =>
                        prev.filter((_, index) => index !== i),
                      )
                    }
                    className={`h-[64%] px-2 rounded-r-md bg-orange-50 border-2 border-orange-700 font-bold text-sm text-red-500 
        hover:bg-red-500 hover:text-white`}
                  >
                    X
                  </Button>
                </div>
              ))}
            </ul>
          ) : (
            <span className="text-3xl text-orange-600/60">
              No Creator Role Granted
            </span>
          )}
        </div>
        <Button
          onClick={() => handleFactoryDeployement()}
          disabled={!orgName || !desc}
          className="py-4 rounded-md text-xl/5 font-bold text-white border-2 border-orange-700 bg-orange-500 hover:bg-orange-700"
          isLoading={isDeploying}
        >
          DEPLOY ELECTION FACTORY
        </Button>
      </div>
      {isDeploying ||
        (txHash && (
          <div className="flex flex-col gap-y-4 w-[25%] p-10 rounded-3xl border-2 border-orange-700/60 shadow-lg shadow-orange-500/50">
            <p className="text-3xl text-green-800">
              {isDeploying ? "Deploying..." : "Organisation Registered"}
            </p>
            {txHash && (
              <>
                <p className="flex flex-col text-orange-700 text-xl">
                  Transaction:
                  <HashBadge style="font-bold" hash={txHash as string} />
                </p>{" "}
                <p className="flex flex-col text-orange-700 text-xl">
                  Name: <span className="font-bold">{postOrgName}</span>
                </p>
                <p className="flex flex-col text-orange-700 text-xl">
                  Contract:
                  <HashBadge
                    style="font-bold"
                    hash={factoryAddress as string}
                  />
                </p>
                <Link
                  href={`/org/${postOrgName}:${factoryAddress}`}
                  className="rounded-lg px-4 py-3 text-white font-bold text-xl/6 bg-orange-600/80"
                >
                  Go To Elections
                </Link>
              </>
            )}
          </div>
        ))}
    </div>
  );
}
