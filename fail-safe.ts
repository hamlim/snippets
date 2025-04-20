type Result<T> = Error | T;
type Operation<T> = () => T;
type AsyncOperation<T> = () => Promise<T>;

function wrapError(e: unknown) {
  if (e instanceof Error) {
    return e;
  }
  return new Error(`Unknown error: ${(e as any).toString()}`);
}

export async function failsafe<T>(
  operation: AsyncOperation<T>,
): Promise<Result<T>> {
  try {
    let value = await operation();
    return value;
  } catch (e) {
    return wrapError(e);
  }
}

export function failsafeSync<T>(operation: Operation<T>): Result<T> {
  try {
    return operation();
  } catch (e) {
    return wrapError(e);
  }
}

export function isError(result: Result<unknown>): result is Error {
  return result instanceof Error;
}

failsafe.isError = isError;
failsafeSync.isError = isError;

export function isValue(result: Result<unknown>): result is unknown {
  return !isError(result);
}

failsafe.isValue = isValue;
failsafeSync.isValue = isValue;
