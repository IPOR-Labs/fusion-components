export const minBigInt = (first: bigint, ...args: bigint[]) => {
  return args.reduce((min, current) => {
    return current < min ? current : min;
  }, first);
};
