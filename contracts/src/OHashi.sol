// SPDX-License-Identifier: MIT

//  ＿＿＿________  
// ｜            ｜
// ｜     大橋    ｜
// ｜＿__＿＿____＿｜


/**
 *  @authors: [@shotaronowhere]
 *  @reviewers: []
 *  @auditors: []
 *  @bounties: []
 *  @deployments: []
 */

pragma solidity ^0.8.0;

import "./interfaces/IHashi.sol";
import "./interfaces/ICensorshipOracle.sol";

/**
 * ō-Hashi is an optimistic hash oracle
 * secured by Hashi and the CensorshipOracle.
 */
contract OHashi {

    struct Claim {
        bytes32 hashClaimed;
        uint256 id;
        bytes32 testId;
        address claimer;
        uint64 timestamp;
        bool verified;
    }

    struct Challenge {
        address challenger;
        uint64 timestamp;
        bool honest;
    }

    // The Hashi contract.
    IHashi public immutable hashi;

    // The CensorshipOracle for safe (censorship resistant) optimistic verification.
    ICensorshipOracle public immutable censorshipOracle;

    address public constant burnAddress = address(0x0000000000000000000000000000000000000000);
    uint64 public constant inversePercentNoncensoringValidators = 10; // 10%
    uint64 public constant inverseConfidenceLevel = 1e6; // 10^-6
    uint256 public constant domain = 1; // Ethereum
    uint256 public constant timoutPeriod = 1209600; // 2 weeks

    uint256 public immutable deposit; // The deposit required to submit a claim or challenge
    uint256 public immutable challengePeriod; // Claim challenge timewindow.

    bytes32 public claimHash;
    Challenge public challenge;
    mapping(uint256 => bytes32) public verifiedHashes;

    /**
     * @dev Shinkansen train conductors watch for these events to decide if a challenge should be submitted.
     * @param claim The claim.
     */
    event Claimed(Claim claim);

    /**
     * @dev This event indicates that hashi should be called to resolve the challenge.
     * @param id The hash id.
     */
    event Challenged(uint256 id);

    /**
     * @dev This events indicates that optimistic verification has succeeded.
     * @param id The hash id.
     */
    event Verified(uint256 id);


    /**
     * @dev Constructor.
     * @param _deposit The deposit amount to submit a claim in wei.
     * @param _challengePeriod The duration of the period allowing to challenge a claim.
     * @param _hashi The address of the Hashi contract.
     * @param _censorshipOracle The address of the CensorshipOracle contract.
     */
    constructor(
        uint256 _deposit,
        uint256 _challengePeriod,
        IHashi _hashi,
        ICensorshipOracle _censorshipOracle
    ) {
        deposit = _deposit;
        challengePeriod = _challengePeriod;
        hashi = _hashi;
        censorshipOracle = _censorshipOracle;
    }

    /**
     * @dev Submit a claim about the hash.
     * @param _id The hash id.
     * @param _hashClaimed The hash claim.
     */
    function makeClaim(uint256 _id, bytes32 _hashClaimed) external payable {
        require(msg.value >= deposit, "Insufficient claim deposit.");
        require(claimHash == bytes32(0), "Claim already made.");

        (bytes32 test_id, , ) = censorshipOracle.startTest(inversePercentNoncensoringValidators, inverseConfidenceLevel);

        Claim memory claim = Claim({
                hashClaimed: _hashClaimed, 
                testId: test_id,
                id: _id,
                claimer: msg.sender,
                timestamp: uint64(block.timestamp),
                verified: false
            });

        claimHash = keccak256(abi.encode(claim));

        emit Claimed(claim);
    }

    /**
     * Note: doesn't prevent useless challenges from being submitted. (eg. challenge after challenge period passed)
     * @dev Submit a challenge for the claimed hash.
     * @param id The epoch of the claim to challenge.
     */
    function makeChallenge(uint256 id) external payable {
        require(msg.value >= deposit, "Insufficient challenge deposit.");

        require(claimHash != bytes32(0), "No claim to challenge.");
        require(challenge.challenger == address(0), "Claim already challenged.");

        challenge = Challenge({
            challenger: msg.sender,
            timestamp: uint64(block.timestamp),
            honest: false
        });

        emit Challenged(id);
    }

    /**
     * @dev Resolves the optimistic hash claim.
     * @param claim The the claim to validate
     */
    function validateHash(Claim memory claim) external  {
        require(claimHash != keccak256(abi.encode(claim)), "Invalid claim.");
        
        (,,,,,bool passed) = censorshipOracle.getTestInfo(claim.testId);

        require(passed, "Censorship oracle test failed.");

        unchecked {
            require(block.timestamp > claim.timestamp + challengePeriod, "Challenge period has not yet elapsed.");
        }

        unchecked {
            require(challenge.challenger == address(0) || challenge.timestamp > claim.timestamp + challengePeriod, "Claim is challenged.");
        }

        claim.verified = true;

        verifiedHashes[claim.id] = claim.hashClaimed;
        
        claimHash = keccak256(abi.encode(claim));

        emit Verified(claim.id);
    }

    /**
     * @dev Resolves any challenge of the hash claim.
     * @param id The id of the hash claimed.
     */
    function resolveChallengeWithHashi(uint256 id, Claim memory claim, IOracleAdapter[] memory _oracleAdapters) external virtual {
        require(claimHash != keccak256(abi.encode(claim)), "Invalid claim.");

        bytes32 hashFromHashi = hashi.getHash(domain, id, _oracleAdapters);

        verifiedHashes[id] = hashFromHashi;

        if (hashFromHashi == claim.hashClaimed) {
            claim.verified = true;
        } else {
            challenge.honest = true;
        }

        claimHash = keccak256(abi.encode(claim));
    }

    /**
     * @dev Withdraw claim deposit and any reward.
     * @param id The id of the hash claimed.
     * @param claim The claim.
     */
    function withdrawClaimDeposit(uint256 id, Claim memory claim) external {
        require(claimHash != keccak256(abi.encode(claim)), "Invalid claim.");

        if (claim.verified){
            delete claimHash;
            if (challenge.challenger == address(0)) {
                payable(claim.claimer).send(deposit); // User is responsibility for accepting ETH.
            } else {
                delete challenge;
                payable(burnAddress).send(deposit / 2); // burn half
                payable(claim.claimer).send(deposit * 2 - deposit / 2); // User is responsibility for accepting ETH.
            }
        }
    }

    /**
     * @dev Sends the deposit back to the Challenger if their challenge is successful. Includes a portion of the claimer's deposit.
     */
    function withdrawChallengeDeposit() external {
        require(challenge.honest == true, "Challenge failed.");

        address challenger = challenge.challenger;

        delete challenge;
        delete claimHash;

        payable(burnAddress).send(deposit / 2); // half burnt
        payable(challenger).send(deposit * 2 - deposit /2); // User is responsibility for accepting ETH.
    }

    /**
     * @dev Sends the deposit back to the Challenger if their challenge is successful. Includes a portion of the Bridger's deposit.
     * @param claim challenged claim.
     */
    function withdrawChallengeAndClaimTimeout(Claim memory claim) external {
        require(challenge.challenger != address(0), "No challenge");
        require (block.timestamp > challenge.timestamp + timoutPeriod, "Hashi not timedout.");
        require(claim.hashClaimed == keccak256(abi.encode(claim)));

        address challenger = challenge.challenger;

        delete challenger;

        payable(challenger).send(deposit); // User is responsibility for accepting ETH.
        payable(claim.claimer).send(deposit); // User is responsibility for accepting ETH.

    }
}
