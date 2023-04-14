// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

interface ICensorshipOracle {
    function testParameters(
        uint64 percentNoncensoringValidators,
        uint64 inverseConfidenceLevel
    ) pure external returns (
			uint64,  // test duration
			uint64  // max missing blocks allowing test to pass
	);

    function startTest(
        uint64 percentNoncensoringValidators,
        uint64 inverseConfidenceLevel
    ) external returns (bytes32, uint64, uint64);

    function getTestInfo(
        bytes32 testId
     ) view external returns (
        uint64,  // percent non-censoring validators
        uint64,  // inverse confidence level
        uint64,  // test start timestamp
        uint64,  // test result available timestamp
        bool,    // test has finished
        bool     // (test has finished) && (non-censored block was included)
        );
}