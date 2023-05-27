import { z } from "zod";
import axios from "axios";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type BlockRange } from "../../../types"

const GRAPHQL_ENDPOINT = "https://api.thegraph.com/subgraphs/name/shotaronowhere/censorship-oracle-mainnet";
const GRAPHQL_ENDPOINT_GNOSIS = "https://api.thegraph.com/subgraphs/name/shotaronowhere/censorship-oracle-gnosis";
const GRAPHQL_ENDPOINT_TESTNET = "https://api.thegraph.com/subgraphs/name/shotaronowhere/censorship-oracle-merge";
const GRAPHQL_ENDPOINT_GNOSIS_TESTNET = "https://api.goldsky.com/api/public/project_clh3hizxpga0j49w059761yga/subgraphs/censorship-oracle-chiado/latest/gn";

export const exampleRouter = createTRPCRouter({
  getSubgraphData: publicProcedure
    .input(z.object({ chainid: z.number(), datasetSize: z.number(), orderByProperty: z.string(), orderDirection: z.string() }))
    .query(async ({ input }): Promise<BlockRange[]> => {
  
      try {
        let graph = GRAPHQL_ENDPOINT
        if(input.chainid === 5)
         graph = GRAPHQL_ENDPOINT_TESTNET
         if(input.chainid === 10200)
         graph = GRAPHQL_ENDPOINT_GNOSIS_TESTNET
         if(input.chainid === 100)
         graph = GRAPHQL_ENDPOINT_GNOSIS
        const response = await axios.post(graph, {
          query: `{
            blockRanges(first: ${input.datasetSize}, orderBy: ${input.orderByProperty}, orderDirection: ${input.orderDirection}) {
              id
              missingBlocks
              blockTimestampLow
              blockTimestampHigh
              blockNumberLow
              blockNumberHigh
            }
          }
          `
        });
        
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        return response.data.data.blockRanges;
      } 
      catch (error) {
          if (error instanceof Error) {
            throw new Error(`Failed to fetch data from subgraph: ${error.message}`);
          } else {
            throw new Error('Failed to fetch data from subgraph');
          }
      }
        
    }),
});
