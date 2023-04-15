# O-Hashi

An optimistic hash bridge for Ethereum and Gnosis which fallsback on the security of the Gnosis [Hashi](https://github.com/gnosis/hashi) bridge aggregator. Optimistic hash claims are accepted as long as the on-chain censorship oracle test passes!

We built a forking censorship oracle for Gnosis chain and Ethereum to speed up the settlement of optimistic rollups and optimistic bridging.

Ontop of the censorship oracle, we built an optimistic hash bridge ontop of Hashi. Hash claims are accepted if the censorship oracle test passes, otherwise, we fallback on Hashi regardless if there is a challenge or not.

# O-Hashi x Censorship Oracle

The censorship oracle is based on an eth research forum post made last month by Ed Felten, the chief scientist at Arbitrum. In the post (https://ethresear.ch/t/reducing-challenge-times-in-rollups/14997), Ed proposes a statistical test to determine censorship using on-chain information in block headers alone. The test is based on ethereum consensus mechanisms, and as Ed suggests, can speed up optimistic systems.

We implement Ed's spec and create an optimistic hash bridge called O-Hashi integrating our censorship oracle and Gnosis' Hashi bridge to resolve disputes. Here's how O-Hashi works,

1. Anyone can make a claim about a hash by leaving a deposit, and automatically starting a censorship test in the censorship oracle.

2.

a) Anyone can challenge the claim by leaving a deposit. We call the Gnosis Hashi bridge to resolve the challenge bridging the true hash securely. If Hashi never responds, we refund both the claimant and the challenger, and no hash is validated.

OR

b) After the challenge period elapses, the claim can be optimistically accepted if the censorship test passes. If the censorship test fails, Hashi is called to validate the hash.

# Censorship Oracle

Proof of Stake Censorship Oracle

## Background

This censorship oracle is based on an eth research [post](https://ethresear.ch/t/reducing-challenge-times-in-rollups/14997) by Ed Felten.

The idea is that ETH Proof of Stake consensus chains, eg Ethereum mainnet and Gnosis Chain, contain enough information in block headers to make statistical conclusions about censorship --- critical when determining the challenge period in optimistic mechanisms (eg rollups, economic games about data curation).

## Formula and examples

X-posting from Ed's [post](https://ethresear.ch/t/reducing-challenge-times-in-rollups/14997),

Assume that each slot is assigned to a non-censoring validator with probability p . Then the probability of seeing k or fewer non-censored blocks in n blocks is equivalent to the probability of getting k or fewer heads when flipping a biased coin that comes up heads with probability p .

The cumulative distribution function is

$$
\operatorname{Pr}(X \leq k)=\sum_{i=0}^k\left(\begin{array}{c}
n \\
i
\end{array}\right) p^i(1-p)^{n-i}
$$

which we can calculate numerically in practical cases.

For example, this implies that with n=688 and p=0.1 , we can conclude that Pr(X≤34)<10−6 .

In other words, if we see 34 or fewer missing blocks out of 688 slots, we can conclude that a non-censored block was included with very high confidence. 688 slots is about 2 hours, 18 minutes.

Alternatively, if we see 4 or fewer missing blocks out of 225 slots, we can conclude that a non-censored block was included with very high ( 10−6 ) confidence. 225 slots is 45 minutes.
Observed rate of missing blocks

## Missing Blocks

### Ethereum Mainnet

Over a recent series of 500,000 blocks, 3346 blocks were missing, a rate of 0.67%.

### Gnosis Chain

Over a series ~1,975,776 blocks since the merge, ~90,000 blocks were missing, a rate of 4.3%. 

### Goerli

Over ~7,405,227 blocks missing since the merge, a rate of 4.2%
