type PromiseResolvedType<T> = T extends Promise<infer R> ? R : never;
export type ReturnedPromiseResolvedType<T> = PromiseResolvedType<ReturnType<T>>;
