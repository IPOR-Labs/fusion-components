const BASE_OFFSET_0X = 2;

export const truncate = (address: string, visibleChars = 4) => {
  return `${address.slice(0, BASE_OFFSET_0X + visibleChars)}...${address.slice(
    -1 * visibleChars,
  )}`;
};
