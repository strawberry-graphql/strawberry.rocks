import { setGraphQLSchema } from "@/components/editor/graphql-language";
import { buildSchema } from "graphql";
import { useEffect, useMemo } from "react";

/**
 * Builds a graphql-js schema from the SDL printed by Strawberry, for the
 * schema explorer and query autocompletion.
 */
export const useGraphQLSchema = (sdl: string | null) => {
  const schema = useMemo(() => {
    if (!sdl) {
      return null;
    }

    try {
      return buildSchema(sdl);
    } catch (error) {
      console.warn("Could not parse the schema", error);
      return null;
    }
  }, [sdl]);

  useEffect(() => {
    setGraphQLSchema(schema);
  }, [schema]);

  return schema;
};
