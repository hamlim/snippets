function withTimeout(
  promise: Promise<unknown>,
  timeout: number,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), timeout);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export async function raceAllSettled(
  promises: Array<Promise<unknown>>,
  timeout: number,
): Promise<Array<PromiseSettledResult<unknown>>> {
  const wrappedPromises = promises.map((promise) =>
    withTimeout(promise, timeout),
  );

  // Combine the race (for the timeout) with allSettled for safe handling
  const results = await Promise.allSettled(wrappedPromises);

  // Separate the timeout errors from the actual results
  return results.map((result) => {
    if (
      result.status === "rejected" &&
      result.reason &&
      result.reason.message === "Timeout"
    ) {
      return {
        status: "rejected",
        reason: "Operation timed out",
      } as PromiseRejectedResult;
    }
    return result;
  });
}
