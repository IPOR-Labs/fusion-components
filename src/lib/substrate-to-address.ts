import { type Hex, pad, size, trim } from 'viem';

export const substrateToAddress = (substrate: Hex) => {
  const trimmed = trim(substrate);

  if (size(trimmed) > 20) return;

  return pad(trim(substrate), { size: 20 });
};
