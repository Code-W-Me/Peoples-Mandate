"use client";

import useFetchSingleElection from "@/contexts/useSingleElection";
import { Address, AddressSchema } from "@repo/shared";

export const mockElections = {
  electionId: 1,
  creator: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  name: "Board of Directors Q3 2026",
  description:
    "Annual election to appoint the new executive board of directors for the organization's next fiscal cycle. r the organization's next fiscal cycle.",
  startTime: new Date("2026-06-25T00:00:00Z"),
  endTime: new Date("2026-06-30T23:59:59Z"),
};

export default function ElectionDetails({
  electionAddress,
}: {
  electionAddress: Address;
}) {
  const parsed = AddressSchema.safeParse(electionAddress);
  if (!parsed.success) return <div>Invalid</div>;
  const address = parsed.data;
  const { electionDetails, isLoadingElection, error } =
    useFetchSingleElection(address);

  console.log(electionDetails);
  return (
    <div className=" p-4 absolute top-30 bottom-6 left-6 right-6 flex flex-col gap-y-3">
      {isLoadingElection ? (
        <div className="text-5xl text-orange-600 animate-pulse">
          Loading Election...
        </div>
      ) : electionDetails === null ? (
        <div className="text-5xl text-orange-600 animate-pulse">
          Election Not Found On chain. {error || ""}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[4fr_1fr]">
            <div className="">
              <p className="flex flex-rows items-center gap-x-4 text-orange-600 text-6xl">
                {electionDetails.name}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="47px"
                  viewBox="0 -960 960 960"
                  width="47px"
                  className="rounded-full p-1 bg-orange-500 "
                >
                  <path
                    className="fill-white"
                    d="M684.78-73.3q-50.79 0-86.45-35.61-35.67-35.61-35.67-86.29 0-7.26 4.09-30.14l-286.14-167.3q-16.9 16.49-38.5 25.75-21.6 9.27-46.67 9.27-50.89 0-86.51-35.52-35.63-35.53-35.63-86.84 0-51.32 35.63-86.86 35.62-35.54 86.51-35.54 24.48 0 46.02 9.03 21.55 9.04 38.37 24.97l286.68-165.45q-1.76-7.35-2.8-14.99-1.05-7.63-1.05-15.74 0-50.78 35.68-86.54 35.68-35.76 86.47-35.76t86.46 35.77q35.66 35.76 35.66 86.55t-35.64 86.45q-35.65 35.67-86.57 35.67-24.32 0-45.65-9.07-21.33-9.08-38.13-24.39L313.06-513.89q2.66 7.89 3.83 16.59t1.17 17.12q0 8.42-.88 15.98-.87 7.57-3.03 15.32l287.14 164.66q16.8-15.57 38.06-24.47 21.26-8.89 45.56-8.89 51.16 0 86.59 35.66 35.43 35.65 35.43 86.59 0 50.93-35.68 86.48-35.68 35.55-86.47 35.55Zm-.11-73.84q20.57 0 34.5-13.89 13.92-13.88 13.92-34.41 0-20.52-13.91-34.41-13.92-13.89-34.65-13.89-20.52 0-34.28 13.95-13.75 13.95-13.75 34.37 0 20.42 13.8 34.35 13.81 13.93 34.37 13.93ZM195.44-431.46q20.52 0 34.65-13.9 14.13-13.9 14.13-34.61t-14.14-34.64q-14.13-13.93-34.7-13.93-20.58 0-34.41 13.9-13.83 13.9-13.83 34.61t13.89 34.64q13.88 13.93 34.41 13.93Zm523.69-298.7q13.88-13.89 13.88-34.43 0-20.48-13.9-34.45-13.9-13.97-34.45-13.97-20.54 0-34.47 13.98t-13.93 34.65q0 20.47 14.07 34.3 14.07 13.82 34.49 13.82t34.31-13.9Zm-34.09 534.72ZM195.68-480ZM684.8-764.56Z"
                  />
                </svg>
              </p>
              <p className="max-h-20 overflow-y-scroll p-1 text-orange-800 text-3xl">
                {electionDetails.desc}
              </p>
              <div className="border-2 w-50 text-center rounded-full bg-orange-500 font-bold py-2 px-4 text-lg  text-white">
                <span>Type: General</span>
              </div>
            </div>
            <div
              className={`p-5 flex flex-col rounded-xl text-3xl border-2 text-green-800 border-green-600 bg-green-100`}
            >
              <p>Starts in </p>
              <p>{new Date().toDateString()}</p>
            </div>
          </div>
          <p className="mt-3 text-5xl text-orange-700">
            Candidates ({electionDetails.candidateList.length})
          </p>
          <div
            className={`h-full grid grid-cols-2 rounded-lg border border-orange-600/40 shadow-sm shadow-orange-500/60  `}
          >
            <div className="border-r-2"></div>
            <div></div>
          </div>
        </>
      )}
    </div>
  );
}
