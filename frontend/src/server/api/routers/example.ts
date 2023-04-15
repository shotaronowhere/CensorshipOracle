import { z } from "zod";
import axios from "axios";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const GRAPHQL_ENDPOINT = "https://api.thegraph.com/subgraphs/name/shotaronowhere/censorship-oracle-merge";

const SUBGRAPH_QUERY = `
  blockRanges(first: 1000) {
    id
    blockNumberLow
    blockNumberHigh
    blockTimestampLow
  }
`;

interface Block {
  id: string
  blockNumberLow: string
  blockNumberHigh: string
  blockTimestampLow: string
}

interface GraphQLResponse {
  data: Block[]
}

const data = [
  {
    id: "0x0023730000000000",
    blockNumberLow: "7545600",
    blockNumberHigh: "7552800",
    blockTimestampLow: "1662529932",
    missingBlocks: "1458"
  },
  {
    id: "0x0042720000000000",
    blockNumberLow: "7488000",
    blockNumberHigh: "7495200",
    blockTimestampLow: "1661711736",
    missingBlocks: "2236"
  },
  {
    id: "0x0061710000000000",
    blockNumberLow: "7430400",
    blockNumberHigh: "7437600",
    blockTimestampLow: "1660875108",
    missingBlocks: "1248"
  },
  {
    id: "0x205e720000000000",
    blockNumberLow: "7495200",
    blockNumberHigh: "7502400",
    blockTimestampLow: "1661824968",
    missingBlocks: "2076"
  }
]

export const exampleRouter = createTRPCRouter({
  mock: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        data: data,
      };
    }),
    getSubgraphData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const variables = { id: input.id };
      try {
        const response = await axios.post<GraphQLResponse>(GRAPHQL_ENDPOINT, {
          query: SUBGRAPH_QUERY,
          variables: variables,
        });
        return { data: response.data.data };
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
