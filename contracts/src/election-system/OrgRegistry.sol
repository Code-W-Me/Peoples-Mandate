// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Clones} from "openzeppelin-contracts/contracts/proxy/Clones.sol";
import {ElectionFactory} from "./ElectionFactory.sol";

contract OrgRegistry {
    event OrgRegistered(address indexed electionFactory, address indexed orgAdmin, uint256 indexed time, string name);

    address public immutable ORG_GENERATOR;
    address public immutable PROFILES_REGISTRY;
    address public immutable CREATOR;
    address public immutable ELECTION_GENERATOR;
    address public immutable BALLOT_GENERATOR;
    address public immutable RESULT_CALCULATOR;

    mapping(address electionFactory => address orgAdmin) private electionFactoryToOrgAdmin;
    mapping(address electionFactory => string orgName) private orgToName;

    constructor(
        address profiles_registry,
        address org_generator,
        address election_generator,
        address ballot_generator,
        address result_calculator
    ) {
        PROFILES_REGISTRY = profiles_registry;
        ORG_GENERATOR = org_generator;
        ELECTION_GENERATOR = election_generator;
        BALLOT_GENERATOR = ballot_generator;
        RESULT_CALCULATOR = result_calculator;
        CREATOR = msg.sender;
    }

    function registerNewOrg(string memory orgName, address admin) external {
        address orgAddress = Clones.clone(ORG_GENERATOR);
        ElectionFactory electionFactory = ElectionFactory(orgAddress);

        electionFactory.initialize(admin, ELECTION_GENERATOR, BALLOT_GENERATOR, RESULT_CALCULATOR);

        emit OrgRegistered(orgAddress, admin, block.timestamp, orgName);
        electionFactoryToOrgAdmin[orgAddress] = admin;
    }

    function getProfileRegistryAddress() external view returns (address) {
        return PROFILES_REGISTRY;
    }

    function getOrgAdmin(address factoryAddress) external view returns (address) {
        return electionFactoryToOrgAdmin[factoryAddress];
    }

    function getOrgName(address factoryAddress) external view returns (string memory) {
        return orgToName[factoryAddress];
    }
}
