type PromiseResolvedType<T> = T extends Promise<infer R> ? R : never;
export type ReturnedPromiseResolvedType<T> = PromiseResolvedType<ReturnType<T>>;

// https://stackoverflow.com/a/61412099
type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];
type ExcludeEmpty<T> = T extends AtLeastOne<T> ? T : never;
