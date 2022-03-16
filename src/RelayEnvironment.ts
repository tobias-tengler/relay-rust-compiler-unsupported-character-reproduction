// import type { ExecutionPatchResult } from "graphql";
import { meros } from "meros/browser";
import type { FetchFunction } from "relay-runtime";
import { Environment, Network, Observable, RecordSource, Store } from "relay-runtime";

const hostname = window.location.hostname;

const fetchQuery: FetchFunction = (params, variables, _cacheConfig) => {
  return Observable.create((sink) => {
    (async () => {
      try {
        const response = await fetch(`http://${hostname}:5000/graphql`, {
          body: JSON.stringify({
            query: params.text,
            variables,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        const parts = await meros<ExecutionPatchResult>(response);

        if (isAsyncIterable(parts)) {
          for await (const part of parts) {
            if (!part.json) {
              sink.error(new Error("Failed to parse part as json."));
              break;
            }

            // @ts-ignore
            sink.next(part.body);
          }
        } else {
          sink.next(await parts.json());
        }

        sink.complete();
      } catch (error) {
        sink.error(error as Error);
      }
    })();
  });
};

export interface ObjMap<T> {
  [key: string]: T;
}

export interface ExecutionPatchResult<TData = ObjMap<unknown> | unknown, TExtensions = ObjMap<unknown>> {
  errors?: ReadonlyArray<any>; // GraphQLError
  data?: TData | null;
  path?: ReadonlyArray<string | number>;
  label?: string;
  hasNext: boolean;
  extensions?: TExtensions;
}

// const fetchQuery: FetchFunction = async (params, variables, _cacheConfig) => {
//   const response = await fetch(http://${hostname}:5000/graphql, {
//     body: JSON.stringify({
//       query: params.text,
//       variables,
//     }),
//     headers: {
//       "Content-Type": "application/json",
//     },
//     method: "POST",
//   });

//   return await response.json();
// };

export const RelayEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

function isAsyncIterable(input: unknown): input is AsyncIterable<unknown> {
  return (
    typeof input === "object" &&
    input !== null &&
    // Some browsers still don't have Symbol.asyncIterator implemented (iOS Safari)
    // That means every custom AsyncIterable must be built using a AsyncGeneratorFunction
    // (async function * () {})
    ((input as any)[Symbol.toStringTag] === "AsyncGenerator" || Symbol.asyncIterator in input)
  );
}
