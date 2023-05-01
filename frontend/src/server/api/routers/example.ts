import { z } from "zod";
import axios from "axios";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type BlockRange } from "../../../types"

const GRAPHQL_ENDPOINT = "https://api.thegraph.com/subgraphs/name/shotaronowhere/censorship-oracle-mainnet-30d";

export const exampleRouter = createTRPCRouter({
  getSubgraphData: publicProcedure
    .input(z.object({ datasetSize: z.number(), orderByProperty: z.string(), orderDirection: z.string() }))
    .query(async ({ input }): Promise<BlockRange[]> => {
  
      try {
        const response = await axios.post(GRAPHQL_ENDPOINT, {
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
