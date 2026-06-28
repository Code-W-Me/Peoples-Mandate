"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useWallet } from "@/contexts/WalletContext";
import { pageHeadingStyle } from "@/lib/commonStyles";
import { electionTypesId } from "@/lib/mappings";
import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Toggle from "@/components/ui/Toggle";
import Info from "@/components/info";
import {
  Address,
  Bytes32,
  defaultChain,
  electionFactoryAbi,
  publicClient,
} from "@repo/shared";
import { useAuth } from "@/contexts/AuthContext";
import { useFactory } from "@/contexts/ElectionFactoryContext";
import { stringToBigInt } from "@/lib/util/helpers";
import { decodeEventLog } from "viem/utils";
import Link from "next/link";

interface CandidateInfo {
  name: string;
  desc: string;
  photoUri: string;
}

const INITIAL_CANDIDATES: CandidateInfo[] = [
  {
    name: "",
    desc: "",
    photoUri: "",
  },
  {
    name: "",
    desc: "",
    photoUri: "",
  },
];

export default function CreateElection() {
  const { activeAccount, walletClient, isConnecting } = useWallet();
  const { isSiweAuth, profileId } = useAuth();
  const { orgAddress, orgName } = useFactory();
  const electionTypes = Object.keys(electionTypesId);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const candidateDivRef = useRef<HTMLDivElement | null>(null);

  const setPage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [electionAddress, setElectionAddress] = useState<Address | null>(null);
  const [txHash, setTxHash] = useState<Bytes32 | null>(null);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [candidates, setCandidates] =
    useState<CandidateInfo[]>(INITIAL_CANDIDATES);
  const [elName, setelName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [elType, setElType] = useState<string>(electionTypes[0]);
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndtime] = useState<string>();

  const [isPrivate, setisPrivate] = useState<boolean>(false);

  const areCandidatesValid = candidates.every(
    (candidate) => candidate.name.trim() !== "" && candidate.desc.trim() !== "",
  );

  async function handleElectionCreation() {
    setIsDeploying(true);
    setError(null);
    setTxHash(null);

    if (!publicClient || !walletClient || !activeAccount || !isSiweAuth) {
      setError("Wallet Disconnected");
      setIsDeploying(false);
      return;
    }

    if (!profileId || !orgAddress) {
      console.log("profile", profileId, orgAddress);
      setError("Complete Account Registration");
      setIsDeploying(false);
      return;
    }

    if (!elName || !desc || !startTime || !endTime) {
      setError("Missing required values");
    }

    if (candidates.length < 2) {
      alert("You must have at least 2 candidates to create an election.");
      return;
    }

    if (!areCandidatesValid) {
      alert("Please fill out the name and description for all candidates.");
      return;
    }

    const formattedCandidates = candidates.map((candidate, index) => {
      return {
        candidateId: BigInt(index + 1),
        name: candidate.name,
        description: candidate.desc,
      };
    });

    const _type = electionTypesId[elType];
    try {
      // nneds fixing sire

      const txHash = await walletClient.writeContract({
        account: activeAccount,
        abi: electionFactoryAbi,
        chain: defaultChain,
        address: orgAddress as Address,
        functionName: "createElection",
        args: [
          isPrivate,
          {
            startTime: stringToBigInt(startTime as string),
            endTime: stringToBigInt(endTime as string),
            name: elName,
            description: desc,
          },
          formattedCandidates,
          _type,
          _type,
        ],
      });
      if (!txHash) {
        setError("Missing Tx Hash");
        return;
      }
      setTxHash(txHash);
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      console.log("election dep rec,", receipt);
      if (!receipt.logs || receipt.status === "reverted") {
        setError("Invalid Tx Receipt");
        return;
      }
      for (const log of receipt.logs) {
        try {
          const decodedLog = decodeEventLog({
            abi: electionFactoryAbi,
            data: log.data,
            topics: log.topics,
          });

          console.log("election logs decoded", decodedLog);
          if (decodedLog.eventName === "ElectionCreatedInfo") {
            // @ts-ignore - mapping viem inferred types
            const _electionAddress = decodedLog.args.electionAddress;
            console.log("election address decoded", _electionAddress);
            _electionAddress && setElectionAddress(_electionAddress);
            break;
          }
        } catch (e) {}
      }
    } catch (err) {
      console.error("election deploy error", err);
      setError("unknown error occured");
    } finally {
      setIsDeploying(false);
    }
  }
  const _startTime = startTime && new Date(startTime);
  const _endTime = endTime && new Date(endTime);

  const isValidPeriod =
    _startTime && _startTime > new Date() && _endTime && _startTime < _endTime;

  // todo ballot and result types
  return (
    <>
      <div className="absolute top-30 bottom-0 left-0 right-0 flex gap-x-2 justify-center pb-5 *:shadow-lg *:shadow-orange-500/50">
        <div
          className={`relative flex flex-col  w-[50%] pb-10 px-10 pt-6 ${elName === "" ? "rounded-3xl" : "rounded-l-3xl"} border-2 border-orange-700/60 `}
        >
          {/* page switch */}
          <div className="absolute right-5 top-2 flex flex-row items-center gap-x-2">
            <span className="font-mono text-orange-700">PAGE</span>

            <nav
              className="grid grid-cols-[1fr_1fr] rounded-lg border-2 border-orange-700 bg-orange-50 
        text-md/5 *:py-1 *:px-6 font-mono font-[500] text-orange-900"
              aria-label="Tabs"
            >
              <button
                type="button"
                onClick={() => setPage(1)}
                className={`${
                  currentPage === 1
                    ? "rounded-l-md bg-orange-500 font-[600] text-white"
                    : "hover:rounded-l-md hover:font-[600] hover:bg-orange-100"
                }`}
              >
                1
              </button>
              <button
                type="button"
                onClick={() => setPage(2)}
                className={`${
                  currentPage === 2
                    ? "rounded-r-md bg-orange-500 font-[600] text-white"
                    : "hover:rounded-r-md hover:font-[600] hover:bg-orange-100"
                }`}
              >
                2
              </button>
            </nav>
          </div>

          <p className={`mb-5 text-orange-600 font-medium text-5xl`}>
            Create New Election
          </p>

          {currentPage === 1 ? (
            <div className="justify-between flex flex-col gap-y-4">
              <Input
                onChange={(e) => setelName(e.target.value)}
                value={elName}
                label="Enter Election Name"
              />
              <Input
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
                label="Description"
                className="min-h-30"
              />
              <span className="text-3xl text-orange-800">Election Type</span>
              <div className="flex justify-start items-center gap-x-2 ">
                {/* election type dropdown */}
                <div className="w-[50%] py-2 pl-4 pr-2 group relative flex items-center justify-between font-bold text-sm text-orange-700 border-2 rounded-sm bg-orange-50">
                  <span className="peer font-[600] text-2xl">
                    {elType.toUpperCase()}
                  </span>
                  <div
                    className={`peer z-101 top-12 right-0 left-0 absolute hidden group-hover:flex flex-col 
                                  shadow-lg shadow-orange-500/50 bg-orange-100/50 backdrop-blur-sm rounded-b-sm rounded-t-sm border-2 
                                  font-[500] text-lg
                                  *:border-orange-700 *:py-2 *:border-t-2`}
                  >
                    {electionTypes.map((t) => (
                      <Button
                        onClick={() => {
                          setElType(t);
                        }}
                        className={
                          t === elType
                            ? "bg-orange-500 font-[600] text-white"
                            : "hover:bg-orange-200 hover:font-[600]"
                        }
                        key={t}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                  <span className="peer-hover:bg-orange-500 peer-hover:text-white mx-2 px-4 text-base rounded-full border-2 border-orange-700 text-orange-700 bg-orange-100">
                    ⯆
                  </span>
                </div>
                <Button
                  className={`px-5 flex items-center h-full rounded-full bg-orange-500 font-bold text-lg/5 text-white
        hover:bg-orange-600`}
                >
                  ABOUT
                </Button>
              </div>
              <span className="text-3xl text-orange-800">Election Period</span>

              {/* // election period inputs */}
              <div className="grid grid-cols-2 gap-x-2 ">
                <Input
                  onChange={(e) => setStartTime(e.target.value)}
                  value={startTime}
                  type="datetime-local"
                  label="START date and time"
                />
                <Input
                  onChange={(e) => setEndtime(e.target.value)}
                  value={endTime}
                  type="datetime-local"
                  label="END date and time"
                />
              </div>
              <span className="text-3xl text-orange-800">Access</span>
              <div
                className={`flex flex-row justify-between py-2 px-4 rounded-lg border-2 border-orange-100 bg-orange-100  ${isPrivate && "border-red-500"}`}
              >
                <span className="text-base font-bold text-orange-700">
                  {isPrivate
                    ? "Only Whitelisted Accounts are allowed to Vote."
                    : "All verified accounts can Vote."}
                </span>

                <Toggle
                  onValue="Private"
                  offValue="Public"
                  isValue={isPrivate}
                  onSetIsValue={setisPrivate}
                />
              </div>
              {isPrivate && (
                <Info>
                  Account can be whitelisted from Manage Election Page.
                </Info>
              )}
            </div>
          ) : (
            <>
              <div>
                <p className="flex items-center text-4xl text-orange-800">
                  Candidates{" "}
                  <span className="px-2 text-xl bg-orange-800 text-white rounded-full">
                    {candidates.length}
                  </span>
                </p>
                <Info>Minimum 2 Candidates must be added during creation</Info>
                <Info>Candidates Info Can be edited later</Info>
              </div>
              <div
                ref={candidateDivRef}
                className="overflow-y-scroll flex flex-col h-full pb-20 mt-4 border-y border-orange-700/60"
              >
                {candidates.map((c, i) => (
                  <div
                    className="relative m-2 px-6 pt-2 pb-5 flex flex-col rounded-lg border-2 border-orange-700/70"
                    key={i}
                  >
                    {i > 1 && (
                      <Button
                        onClick={() =>
                          setCandidates((prev) =>
                            prev.filter((_, index) => index !== i),
                          )
                        }
                        className="absolute top-4 right-4 px-2 rounded-full text-white"
                        variant="delete"
                      >
                        X
                      </Button>
                    )}
                    <p className="text-3xl text-orange-700 font-medium">
                      Candidate {i + 1}
                    </p>
                    <div className="grid grid-cols-[2fr_1fr] gap-x-2 items-end">
                      <Input
                        onChange={(e) =>
                          setCandidates((prev) =>
                            prev.map((candidate, index) =>
                              index === i
                                ? { ...candidate, name: e.target.value }
                                : candidate,
                            ),
                          )
                        }
                        label="Enter Candidate Name"
                      />
                      <Button variant="primary" className="h-[70%]">
                        Add Photo
                      </Button>
                    </div>
                    <Input
                      onChange={(e) =>
                        setCandidates((prev) =>
                          prev.map((candidate, index) =>
                            index === i
                              ? { ...candidate, desc: e.target.value }
                              : candidate,
                          ),
                        )
                      }
                      label="Description"
                    />
                  </div>
                ))}
                <Button
                  className="absolute bottom-12 flex items-center justify-center gap-x-4 rounded-lg py-4 px-3 bg-green-100/50 backdrop-blur-sm text-xl/5 font-bold border-2 text-green-800
                hover:bg-green-800 hover:text-white"
                  onClick={() => {
                    setCandidates((prev) => [
                      ...prev,
                      {
                        name: "",
                        desc: "",
                        photoUri: "",
                      },
                    ]);
                    setTimeout(() => {
                      candidateDivRef.current?.scrollTo({
                        top: candidateDivRef.current.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 50);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="35px"
                    viewBox="0 -960 960 960"
                    width="35px"
                    className="fill-green-50 bg-green-800 rounded-full"
                  >
                    <path d="M427.67-427.67H172v-104.66h255.67v-256.34h104.66v256.34h256.34v104.66H532.33V-172H427.67v-255.67Z" />
                  </svg>
                  ADD CANDIDATE
                </Button>
              </div>
            </>
          )}
        </div>
        {/* Election Summary */}
        {elName !== "" && (
          <>
            <div className="min-w-175 flex flex-col">
              <div className="flex flex-row justify-between px-5 py-2 text-white bg-orange-500 text-4xl rounded-tr-3xl">
                <span>pending election:</span>
                <Button
                  onClick={() => {
                    setelName("");
                    setDesc("");
                    setCandidates(INITIAL_CANDIDATES);
                    setTxHash(null);
                    setElectionAddress(null);
                  }}
                  className="bg-white flex items-center px-3 rounded-full text-red-500 font-bold border-2 border-red-500
                  hover:bg-red-500 hover:text-white"
                >
                  x
                </Button>
              </div>
              <div className="flex flex-col justify-between px-6 py-4 h-full rounded-br-3xl border-2 border-orange-700/60 text-2xl">
                <div className="flex flex-col gap-y-5">
                  <p>
                    <span className=" text-orange-800">Name: </span>
                    <span className="max-w-150 break-words whitespace-normal font-bold text-orange-700">
                      {elName}
                    </span>
                  </p>
                  <p className="flex flex-col">
                    <span className="text-orange-800">Description: </span>
                    <span
                      className={`max-w-150 max-h-50 break-words whitespace-normal ${desc && "border"} p-2 rounded-lg  font-bold text-orange-700`}
                    >
                      {desc}
                    </span>
                  </p>
                  <p className="flex flex-col">
                    <span className="text-orange-800">Election Type: </span>
                    <span className="font-bold text-orange-700">{elType}</span>
                  </p>
                  {error && (
                    <p className="flex flex-col">
                      <span className="text-orange-800">Error: </span>
                      <span className="font-bold text-orange-700">{error}</span>
                    </p>
                  )}
                  <span className="text-orange-800 ">Election Period: </span>
                  <div className="flex flex-col items-center text-white font-bold font-mono  *:bg-orange-600/80">
                    {startTime && (
                      <>
                        <div className="px-4 py-2 rounded-full  border-2">
                          {new Date(startTime).toLocaleString()}
                        </div>
                        <div className="border-2 rounded-full border-orange-700 min-h-40 w-0"></div>
                        {endTime && (
                          <div className="px-4 py-2 rounded-full text-white border-2 bg-orange-500">
                            {new Date(endTime).toLocaleString()}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {!isValidPeriod && (
                    <span className="text-red-500">
                      Error: Election Period is not valid. check start and end
                      time.
                    </span>
                  )}
                </div>
                {electionAddress && (
                  <Link
                    href={`/org/${orgName}:${orgAddress}/election/${electionAddress}`}
                    className="text-center py-4 rounded-md text-xl/5 font-bold text-white border-2 border-orange-700 bg-orange-500 hover:bg-orange-700"
                  >
                    GO TO ELECTION
                  </Link>
                )}
                <Button
                  onClick={() => handleElectionCreation()}
                  className="py-4 rounded-md text-xl/5 font-bold text-white border-2 border-orange-700 bg-orange-500 hover:bg-orange-700"
                  disabled={
                    !isValidPeriod ||
                    !elName ||
                    !!txHash ||
                    candidates.length < 2 ||
                    !areCandidatesValid
                  }
                  isLoading={isDeploying}
                >
                  DEPLOY ELECTION
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
