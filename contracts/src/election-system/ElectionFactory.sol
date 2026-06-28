// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Election} from "./Election.sol";
import {BallotGenerator} from "./ballots/BallotGenerator.sol";
import {ResultCalculator} from "./resultCalculators/ResultCalculator.sol";

import {BallotAndResultTypesValidator} from "./helpers/BallotAndResultTypesValidator.sol";

import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";
import {Multicall} from "openzeppelin-contracts/contracts/utils/Multicall.sol";
import {Initializable} from "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";
import {Clones} from "openzeppelin-contracts/contracts/proxy/Clones.sol";

bytes32 constant CREATOR_ROLE = keccak256("CREATOR_ROLE");

/**
 * @title Election Factory Contract v1.0
 * @author Kartik Kumbhar
 * This Contract Handles Creation of Elections.
 *
 * @notice
 *   1. Check BallotAndResultTypesValidator library for Valid Ballot and Result Type Numbers.
 *   2. Feature: Cross - chain voting is not yet implemented
 *   3. Security: Anonymous Candidate Voting is not yet implemented, votes can be tracked back to caller.
 */
contract ElectionFactory is Initializable, AccessControl, Multicall {
    // errors
    error ElectionFactory_FactoryOwnerRestricted();
    error ElectionFactory_InvalidCandidatesLength(uint256 candidateLength);

    // events
    event ElectionCreatedInfo(
        address indexed electionAddress,
        uint8 indexed ballotType,
        uint8 indexed resultType,
        Election.ElectionInfo electionInfo,
        Election.Candidate[] candidates
    );

    // types
    struct ElectionCreationInfo {
        uint64 startTime;
        uint64 endTime;
        string name;
        string description;
    }

    // state variables
    uint256 public electionCount = 0;

    address[] private publicElections;
    address[] private privateElections;

    mapping(address electionAddress => address owner) public electionAddressToOwner;

    uint256 private CREATED_AT;
    string private ORG_NAME;
    address private ORG_REGISTRY;
    address private ORG_ADMIN;
    address private RESULT_CALCULATOR;
    address private ELECTION_GENERATOR;
    BallotGenerator private BALLOT_GENERATOR;

    function initialize(address admin, address _electionGenerator, address _ballotGenerator, address _resultCalculator)
        external
        initializer
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        ORG_REGISTRY = msg.sender;
        ORG_ADMIN = admin;
        ELECTION_GENERATOR = _electionGenerator;
        BALLOT_GENERATOR = BallotGenerator(_ballotGenerator);
        RESULT_CALCULATOR = _resultCalculator;
    }

    // core functions

    /**
     * @dev electionCount is necessary to mantain consistent and verifiable electionIds
     */
    function createElection(
        bool isPrivate,
        ElectionCreationInfo memory _electionCreationInfo,
        Election.Candidate[] memory _candidates,
        uint8 _ballotType,
        uint8 _resultType
    ) external onlyRole(CREATOR_ROLE) {
        if (_candidates.length < 2) {
            revert ElectionFactory_InvalidCandidatesLength(_candidates.length);
        }

        Election.ElectionInfo memory _electionInfo = Election.ElectionInfo({
            startTime: _electionCreationInfo.startTime,
            endTime: _electionCreationInfo.endTime,
            electionId: electionCount,
            name: _electionCreationInfo.name,
            description: _electionCreationInfo.description
        });
        BallotAndResultTypesValidator.validateBallotAndResultTypes(_ballotType, _resultType);

        address electionAddress = Clones.clone(ELECTION_GENERATOR);
        address _ballot = BALLOT_GENERATOR.generateBallot(_ballotType, electionAddress);

        Election election = Election(electionAddress);

        election.initialize(
            isPrivate, address(this), msg.sender, _electionInfo, _candidates, _resultType, _ballot, RESULT_CALCULATOR
        );

        emit ElectionCreatedInfo(electionAddress, _ballotType, _resultType, _electionInfo, _candidates);

        if (isPrivate) {
            privateElections.push(electionAddress);
        } else {
            publicElections.push(electionAddress);
        }

        CREATED_AT = block.timestamp;
        electionAddressToOwner[electionAddress] = msg.sender;
        electionCount++;
    }

    function grantCreatorRoles(address[] calldata toAddresses) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 length = toAddresses.length;
        require(length > 0, "Array cannot be empty");
        require(length <= 100, "Batch too large");

        for (uint256 i = 0; i < length;) {
            _grantRole(CREATOR_ROLE, toAddresses[i]);
            unchecked {
                ++i;
            }
        }
    }

    function revokeCreatorRoles(address[] calldata fromAddresses) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 length = fromAddresses.length;

        require(length > 0, "Array cannot be empty");
        require(length <= 100, "Batch too large");

        for (uint256 i = 0; i < length;) {
            _revokeRole(CREATOR_ROLE, fromAddresses[i]);
            unchecked {
                ++i;
            }
        }
    }

    // getter functions

    function getPublicElections() external view returns (address[] memory) {
        return publicElections;
    }

    function getPrivateElections() external view returns (address[] memory) {
        return privateElections;
    }

    function getOrgRegistryAddress() external view returns (address) {
        return ORG_REGISTRY;
    }

    function getOrgAdmin() external view returns (address) {
        return ORG_ADMIN;
    }

    function getResultCalculatorAddress() external view returns (address) {
        return RESULT_CALCULATOR;
    }

    function getElectionContractGeneratorAddress() external view returns (address) {
        return ELECTION_GENERATOR;
    }
}
