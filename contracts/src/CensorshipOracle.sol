// SPDX-License-Identifier: MIT

/**
 *  @authors: [@shotaronowhere]
 *  @reviewers: []
 *  @auditors: []
 *  @bounties: []
 *  @deployments: []
 */

pragma solidity ^0.8.19;

import "./interfaces/ICensorshipOracle.sol";

contract CensorshipOracle is ICensorshipOracle{

    struct Test{
        uint64 startTimestamp;
        uint64 resultAvailableTimestamp;
        uint64 maxMissingBlocks;
        bool finished;
        bool passed;
    }

    mapping(bytes32 => Test) public tests;
    // Gnosis Chain 5 seconds
    // Ethereum 12 seconds
    uint64 public constant slotTime = 5;


    /**
     * @dev Start a censorship test
     * @param inversePercentNoncensoringValidators Percent of non-censoring validators
     * @param inverseConfidenceLevel Inverse confidence level
     * @return testId Test ID
     */
    function startTest(
        uint64 inversePercentNoncensoringValidators,
        uint64 inverseConfidenceLevel
    ) external returns (bytes32 testId, uint64 duration, uint64 maxMissingBlocks){

        (duration, maxMissingBlocks) = testParameters(inversePercentNoncensoringValidators, inverseConfidenceLevel);

        testId = keccak256(
            abi.encodePacked(
                uint64(block.timestamp),
                uint64(block.timestamp + duration),
                uint64(maxMissingBlocks)
            )
        );

        tests[testId] = Test({
            startTimestamp: uint64(block.timestamp),
            resultAvailableTimestamp: uint64(block.timestamp + duration),
            maxMissingBlocks: uint64(maxMissingBlocks),
            finished: false,
            passed: false
        });
        
    }

    /**
     * @dev Get test info
     * @param testId Test ID
     * @return inversePercentNoncensoringValidators Inverse percent of non-censoring validators
     * @return inverseConfidenceLevel Inverse confidence level
     * @return startTimestamp Test start timestamp
     * @return resultAvailableTimestamp Test result available timestamp
     * @return finished Test has finished
     * @return passed (test has finished) && (non-censored block was included)
     */
    function getTestInfo(
        bytes32 testId
     ) view external returns (
        uint64 inversePercentNoncensoringValidators,  // inverse percent non-censoring validators
        uint64 inverseConfidenceLevel,  // inverse confidence level
        uint64 startTimestamp,
        uint64 resultAvailableTimestamp,
        bool finished,
        bool passed
     ){

        Test memory test = tests[testId];

        // TODO reverse look up inversePercentNoncensoringValidators and inverseConfidenceLevel

        return (
            uint64(10),
            uint64(1e6),
            test.startTimestamp, 
            test.resultAvailableTimestamp, 
            test.finished, 
            test.passed);
    }

    /**
     * @dev Finish a test and get test info
     * @param testId Test ID
     * @return startTimestamp Test start timestamp
     * @return resultAvailableTimestamp Test result available timestamp
     * @return finished Test has finished (will be false if result not available yet)
     * @return passed (test has finished) && (non-censored block was included)
     */
    function finishAndGetTestInfo(bytes32 testId) external returns (
        uint64 startTimestamp,
        uint64 resultAvailableTimestamp,
        bool finished,
        bool passed
     ){

        Test storage test = tests[testId];

        require(uint64(block.timestamp) > test.resultAvailableTimestamp, "Test result not available yet");

        test.finished = true;

        uint64 missingBlocks = uint64(block.number) - (uint64(block.timestamp) - test.startTimestamp) / slotTime;

        if (missingBlocks <= test.maxMissingBlocks){
            test.passed = true;
        }

        return (test.startTimestamp, test.resultAvailableTimestamp, test.finished, test.passed);
     }

    function testParameters(
        uint64 inversePercentNoncensoringValidators,
        uint64 inverseConfidenceLevel
    ) pure public returns (
			uint64,  // test duration
			uint64  // max missing blocks allowing test to pass
	){
        (uint64 slots, uint64 maxMissingBlocks) = getPrecalculatedTestParams(inversePercentNoncensoringValidators, inverseConfidenceLevel);
        return (slots * slotTime, maxMissingBlocks);
    }
    
    // precalculated test params from scripts/src/censorshipOracle.py
    // Sensitivity set 50% above current 

    /**
     * @dev helper function to fetch constant test parameters
     */
    function getPrecalculatedTestParams(
        uint64 inversePercentNoncensoringValidators,
        uint64 inverseConfidenceLevel
     ) pure internal returns (uint64 slots, uint64 maxMissingBlocks){
        if (inversePercentNoncensoringValidators == 10){
            if (inverseConfidenceLevel == 1e3){
                return (uint64(150), uint64(4));
            } else if (inverseConfidenceLevel == 1e6){
                return (uint64(225), uint64(4));
            } else if (inverseConfidenceLevel == 1e9){
                return (uint64(300), uint64(3));
            } else if (inverseConfidenceLevel == 1e12){
                return (uint64(450), uint64(7));
            } else if (inverseConfidenceLevel == 1e24){
                return (uint64(1200), uint64(29));
            } 
        } else if (inversePercentNoncensoringValidators == 100){
            if (inverseConfidenceLevel == 1e3){
                return (uint64(14400), uint64(108));
            } else if (inverseConfidenceLevel == 1e6){
                return (uint64(225), uint64(4));
            } else if (inverseConfidenceLevel == 1e9){
                return (uint64(300), uint64(3));
            } else if (inverseConfidenceLevel == 1e12){
                return (uint64(450), uint64(7));
            } else if (inverseConfidenceLevel == 1e24){
                return (uint64(1200), uint64(29));
            } 

        return(type(uint64).max, 0);

        }
    }
}