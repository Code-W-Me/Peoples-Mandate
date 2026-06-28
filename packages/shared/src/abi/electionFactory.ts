export const electionFactoryAbi = [
  {
    type: "function",
    name: "DEFAULT_ADMIN_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createElection",
    inputs: [
      { name: "isPrivate", type: "bool", internalType: "bool" },
      {
        name: "_electionCreationInfo",
        type: "tuple",
        internalType: "struct ElectionFactory.ElectionCreationInfo",
        components: [
          { name: "startTime", type: "uint64", internalType: "uint64" },
          { name: "endTime", type: "uint64", internalType: "uint64" },
          { name: "name", type: "string", internalType: "string" },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
        ],
      },
      {
        name: "_candidates",
        type: "tuple[]",
        internalType: "struct Election.Candidate[]",
        components: [
          {
            name: "candidateId",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "name", type: "string", internalType: "string" },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
        ],
      },
      { name: "_ballotType", type: "uint8", internalType: "uint8" },
      { name: "_resultType", type: "uint8", internalType: "uint8" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "electionAddressToOwner",
    inputs: [
      {
        name: "electionAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [{ name: "owner", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "electionCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getElectionContractGeneratorAddress",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOrgAdmin",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOrgRegistryAddress",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPrivateElections",
    inputs: [],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPublicElections",
    inputs: [],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getResultCalculatorAddress",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRoleAdmin",
    inputs: [{ name: "role", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "grantCreatorRoles",
    inputs: [
      {
        name: "toAddresses",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "grantRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "hasRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      { name: "admin", type: "address", internalType: "address" },
      {
        name: "_electionGenerator",
        type: "address",
        internalType: "address",
      },
      {
        name: "_ballotGenerator",
        type: "address",
        internalType: "address",
      },
      {
        name: "_resultCalculator",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "multicall",
    inputs: [{ name: "data", type: "bytes[]", internalType: "bytes[]" }],
    outputs: [{ name: "results", type: "bytes[]", internalType: "bytes[]" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      {
        name: "callerConfirmation",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revokeCreatorRoles",
    inputs: [
      {
        name: "fromAddresses",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revokeRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "ElectionCreatedInfo",
    inputs: [
      {
        name: "electionAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "ballotType",
        type: "uint8",
        indexed: true,
        internalType: "uint8",
      },
      {
        name: "resultType",
        type: "uint8",
        indexed: true,
        internalType: "uint8",
      },
      {
        name: "electionInfo",
        type: "tuple",
        indexed: false,
        internalType: "struct Election.ElectionInfo",
        components: [
          { name: "startTime", type: "uint64", internalType: "uint64" },
          { name: "endTime", type: "uint64", internalType: "uint64" },
          {
            name: "electionId",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "name", type: "string", internalType: "string" },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
        ],
      },
      {
        name: "candidates",
        type: "tuple[]",
        indexed: false,
        internalType: "struct Election.Candidate[]",
        components: [
          {
            name: "candidateId",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "name", type: "string", internalType: "string" },
          {
            name: "description",
            type: "string",
            internalType: "string",
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleAdminChanged",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "previousAdminRole",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "newAdminRole",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleGranted",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleRevoked",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "AccessControlBadConfirmation", inputs: [] },
  {
    type: "error",
    name: "AccessControlUnauthorizedAccount",
    inputs: [
      { name: "account", type: "address", internalType: "address" },
      { name: "neededRole", type: "bytes32", internalType: "bytes32" },
    ],
  },
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [{ name: "target", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "BallotAndResultTypes_InvalidRange",
    inputs: [
      { name: "value", type: "uint8", internalType: "uint8" },
      { name: "reason", type: "string", internalType: "string" },
    ],
  },
  {
    type: "error",
    name: "ElectionFactory_FactoryOwnerRestricted",
    inputs: [],
  },
  {
    type: "error",
    name: "ElectionFactory_InvalidBallotAndResultTypeCombination",
    inputs: [
      { name: "ballotType", type: "uint8", internalType: "uint8" },
      { name: "resultType", type: "uint8", internalType: "uint8" },
    ],
  },
  {
    type: "error",
    name: "ElectionFactory_InvalidCandidatesLength",
    inputs: [
      {
        name: "candidateLength",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  { type: "error", name: "FailedCall", inputs: [] },
  { type: "error", name: "FailedDeployment", inputs: [] },
  {
    type: "error",
    name: "InsufficientBalance",
    inputs: [
      { name: "balance", type: "uint256", internalType: "uint256" },
      { name: "needed", type: "uint256", internalType: "uint256" },
    ],
  },
  { type: "error", name: "InvalidInitialization", inputs: [] },
  { type: "error", name: "NotInitializing", inputs: [] },
];
