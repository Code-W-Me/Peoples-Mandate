export const orgRegistryAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

export const orgRegistryAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "profiles_registry",
        type: "address",
        internalType: "address",
      },
      {
        name: "org_generator",
        type: "address",
        internalType: "address",
      },
      {
        name: "election_generator",
        type: "address",
        internalType: "address",
      },
      {
        name: "ballot_generator",
        type: "address",
        internalType: "address",
      },
      {
        name: "result_calculator",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "BALLOT_GENERATOR",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "CREATOR",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ELECTION_GENERATOR",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ORG_GENERATOR",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "PROFILES_REGISTRY",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "RESULT_CALCULATOR",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOrgAdmin",
    inputs: [
      {
        name: "factoryAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOrgName",
    inputs: [
      {
        name: "factoryAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getProfileRegistryAddress",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "registerNewOrg",
    inputs: [
      { name: "orgName", type: "string", internalType: "string" },
      { name: "admin", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "OrgRegistered",
    inputs: [
      {
        name: "electionFactory",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "orgAdmin",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "time",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "name",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "FailedDeployment", inputs: [] },
  {
    type: "error",
    name: "InsufficientBalance",
    inputs: [
      { name: "balance", type: "uint256", internalType: "uint256" },
      { name: "needed", type: "uint256", internalType: "uint256" },
    ],
  },
];
