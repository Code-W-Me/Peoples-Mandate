// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {Election} from "../src/election-system/Election.sol";
import {BallotGenerator} from "../src/election-system/ballots/BallotGenerator.sol";
import {ResultCalculator} from "../src/election-system/resultCalculators/ResultCalculator.sol";
import {ElectionFactory} from "../src/election-system/ElectionFactory.sol";
import {OrgRegistry} from "../src/election-system/OrgRegistry.sol";

contract DeployAll is Script {
    address constant PROFILES_REGISTRY = 0x5FbDB2315678afecb367f032d93F642f64180aa3;

    function run() external {
        uint256 deployerPrivateKey =
            vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));

        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Deploy standalone implementation instances
        Election electionImp = new Election();
        BallotGenerator ballotGenImp = new BallotGenerator();
        ResultCalculator resultCalcImp = new ResultCalculator();

        // Step 2: Deploy the main Election Factory implementation
        ElectionFactory electionFactoryImp = new ElectionFactory();

        // Step 3: Deploy OrgRegistry, linking all previously deployed instances
        OrgRegistry orgRegistry = new OrgRegistry(
            PROFILES_REGISTRY,
            address(electionFactoryImp),
            address(electionImp),
            address(ballotGenImp),
            address(resultCalcImp)
        );

        vm.stopBroadcast();

        // Log all addresses clearly in the console
        console.log("================ DEPLOYMENT REPORT ================");
        console.log("Election Implementation:     ", address(electionImp));
        console.log("Ballot Generator:            ", address(ballotGenImp));
        console.log("Result Calculator:           ", address(resultCalcImp));
        console.log("Election Factory Imp:        ", address(electionFactoryImp));
        console.log("---------------------------------------------------");
        console.log(">>> ORG REGISTRY DEPLOYED AT:", address(orgRegistry));
        console.log("===================================================");
    }
}
