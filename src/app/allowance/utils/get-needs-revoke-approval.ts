interface Args {
  currentAllowance: bigint | undefined;
  newAllowance: bigint;
}

export const getNeedsRevokeApproval = ({
  currentAllowance,
  newAllowance,
}: Args) => {
  if (currentAllowance === undefined || currentAllowance === 0n) {
    return false;
  }

  return newAllowance > currentAllowance;
};
