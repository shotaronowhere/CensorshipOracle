import { z } from "zod";
import axios from "axios";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type SubgraphData } from "../../../types"

const GRAPHQL_ENDPOINT = "https://api.studio.thegraph.com/query/21193/missedblocksethereum/version/latest";
const GRAPHQL_ENDPOINT_GNOSIS = "https://api.studio.thegraph.com/query/21193/missedblocksgnosis/version/latest";

export const exampleRouter = createTRPCRouter({
  getSubgraphData: publicProcedure
    .input(z.object({ chainid: z.number(), daySize: z.number(), monthSize: z.number(), orderByProperty: z.string(), orderDirection: z.string() }))
    .query(async ({ input }): Promise<SubgraphData> => {
  
      try {
        let graph = GRAPHQL_ENDPOINT
         if(input.chainid === 100)
         graph = GRAPHQL_ENDPOINT_GNOSIS
        const response = await axios.post(graph, {
          query: `{
            blockRangeDaily: blockRanges(first: ${input.daySize}, where:{isDay: true}, orderBy: ${input.orderByProperty}, orderDirection: ${input.orderDirection}) {
              id
              missingBlocks
              blockTimestampLow
              blockTimestampHigh
              blockNumberLow
              blockNumberHigh
              percentMissing
            }
            blockRangeMonthly: blockRanges(first: ${input.monthSize}, where:{isDay: false}, orderBy: ${input.orderByProperty}, orderDirection: ${input.orderDirection}) {
              id
              missingBlocks
              blockTimestampLow
              blockTimestampHigh
              percentMissing
            }
          }
          `
        });
        
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        return response.data.data;
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
