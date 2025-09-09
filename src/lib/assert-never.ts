export const assertNever = (never: never, message: string) => {
  throw new Error(`${message}: ${never}`);
};
