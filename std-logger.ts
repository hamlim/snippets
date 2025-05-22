type LogOpts = {
  message: any;
};

type ErrorOpts = {
  message: any;
  error: Error;
  full?: boolean;
};

export class StdLogger {
  namespace: string;
  constructor(namespace: string) {
    this.namespace = namespace;
  }
  log({ message, ...rest }: LogOpts) {
    console.log(`[${this.namespace}] ${message}`, rest);
  }

  info({ message, ...rest }: LogOpts) {
    console.info(`[${this.namespace}] ${message}`, rest);
  }

  error({ message, error, full = false, ...rest }: ErrorOpts) {
    console.error(
      `[${this.namespace}] ${message} ${error.message}${
        full ? JSON.stringify(error) : ""
      }`,
      error,
      rest,
    );
  }

  warn({ message, ...rest }: LogOpts) {
    console.warn(`[${this.namespace}] ${message}`, rest);
  }
}
