import { mainnet, base, arbitrum, unichain, tac, ink } from 'viem/chains';

export const UNIVERSAL_READER_PREHOOKS_INFO_ADDRESSES = {
  [mainnet.id]: '0x1Ecd96FD20f2c1a32e5906CCcAEc87e8aFe19821',
  [base.id]: '0x79D31b98382C5D325aB42353Ce1aE7081757C89A',
  [arbitrum.id]: '0x2774465A0BA2cf97F8b3624d59964FfC41b7ff0f',
  [unichain.id]: '0x0d828bb5bde258055674e55a343a18b0d756e5bf',
  [tac.id]: '0x817d48141e8b140d313acB670db01CE0B9A0D0Db',
  [ink.id]: '0xF27f66525004481Ce2fC0dc7e2E3BA12Fe4B089C',
} as const;

export const PAUSE_FUNCTIONS_PREHOOKS_ADDRESSES = {
  [mainnet.id]: '0x7846BeD0b55048dB0e6A5388B89E92f091984D59',
  [base.id]: '0x10e64e5F2f2BD098F31849B48d0BA1B92331cE88',
  [arbitrum.id]: '0x2635f5AB58E64690974533F1903378a9B3cA1C9f',
  [unichain.id]: '0x76fA5832f36F488084E5889CAda081F9D34dF3Fc',
  [tac.id]: '0x97cAA1a25a1c37a8b748E53DDe48fc44C18E7e2B',
  [ink.id]: '0x7B9Ca73aC9afB4119D4823e9b0E906B1abe5d16C',
} as const;
