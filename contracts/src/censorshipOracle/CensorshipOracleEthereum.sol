// SPDX-License-Identifier: MIT

/**
 *  @authors: [@shotaronowhere]
 *  @reviewers: []
 *  @auditors: []
 *  @bounties: []
 *  @deployments: []
 */

pragma solidity ^0.8.19;

import "../interfaces/ICensorshipOracle.sol";

contract CensorshipOracleEthereum is ICensorshipOracle{

    struct Test{
        uint64 startTimestamp;
        uint32 startBlockNumber;
        uint64 resultAvailableTimestamp;
        uint64 maxMissingBlocks;
        bool finished;
        bool passed;
    }

    mapping(bytes32 => Test) public tests;
    uint64 public constant slotTime = 12; // Ethereum slot time 12 seconds


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
            startBlockNumber: uint32(block.number),
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

        uint64 actualBlocksSinceTestStarted = uint64(block.number) - test.startBlockNumber;
        uint64 expectedBlocksSinceTestStarted = (uint64(block.timestamp) - test.startTimestamp) / slotTime;

        if (test.maxMissingBlocks <= expectedBlocksSinceTestStarted - actualBlocksSinceTestStarted){
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

    // on aveage, ~%1.5 of blocks are missing due to network latency, validator downtime, etc.
    // test sensitivity is set at 2% of missing blocks over a minimum duration.
    // duration is calculated via the scripts in scripts/notebooks/calculate_k_max.ipynb

    /**
     * @dev helper function to fetch constant test parameters
     */
    function getPrecalculatedTestParams(
        uint64 inversePercentNoncensoringValidators,
        uint64 inverseConfidenceLevel
     ) pure internal returns (uint64 slots, uint64 maxMissingBlocks){
        if (inversePercentNoncensoringValidators == 10){
            if (inverseConfidenceLevel == 1e3){
                return (uint64(150), uint64(4)); // 2.67% missing blocks in 30 minutes
            } else if (inverseConfidenceLevel == 1e6){
                return (uint64(300), uint64(8)); // 2.67% missing blocks in 1 hour
            } else if (inverseConfidenceLevel == 1e9){
                return (uint64(450), uint64(11)); // 2.44% missing blocks in 1 hour 30 minutes
            } else if (inverseConfidenceLevel == 1e12){
                return (uint64(600), uint64(15)); // 2.5% missing blocks in 2 hours
            } else if (inverseConfidenceLevel == 1e24){
                return (uint64(1200), uint64(29)); // 2.42% missing blocks in 4 hours
            } 
        }

        return(type(uint64).max, 0);
    }
}