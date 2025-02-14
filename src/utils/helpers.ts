export const wait = (ms: number = 3000) =>
  new Promise((r) => setTimeout(r, ms));

export const retry = async <T>(
  fn: () => Promise<T>,
  retries = 2,
  delay = 3000
): Promise<T> =>
  fn().catch(async (err) => {
    console.error("Failed:", err);
    if (retries) {
      console.log("Waiting", delay / 1000, "seconds...");
      await wait(delay);
      console.log("Retrying...");
      return retry(fn, --retries, delay * 2);
    } else {
      throw new Error();
    }
  });

export const timeoutablePromise = <T>(
  promise: Promise<T>,
  ms: number = 5000
): Promise<T> => {
  const timeout = new Promise<T>((_, reject) => {
    setTimeout(() => reject("Timeout..."), ms);
  });
  return Promise.race([promise, timeout]);
};
