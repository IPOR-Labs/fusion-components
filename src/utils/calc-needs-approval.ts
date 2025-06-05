interface Args {
  allowance: bigint | undefined;
  amount: bigint;
}

export const calcNeedsApproval = ({ allowance, amount }: Args) => {
  if (allowance === undefined) {
    return true;
  }

  if (allowance <= 0n && amount <= 0n) {
    return true;
  }

  const needsApproval = amount > allowance;

  return needsApproval;
};
