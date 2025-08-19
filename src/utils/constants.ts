import { parseEther } from "viem";

export const BLOCK_INTERVAL = 14 * 1000; // 14 seconds

export const DATE_FORMAT_WITH_HOUR = 'dd/MM/yy HH:mm';

export const ONE_ETHER = parseEther('1');

export const DEFAULT_DECIMALS = 18;

export const LINKS = {
  UTILIZATION:
    'https://docs.ipor.io/automated-market-maker/liquidity-provisioning#utilization',
  REVENUE_STREAMS:
    'https://docs.ipor.io/automated-market-maker/liquidity-provisioning#revenue-streams',
  FEES: 'https://docs.ipor.io/automated-market-maker/ipor-swaps#fees',
  LINKEDIN: 'https://www.linkedin.com/company/ipor-labs/',
  DISCORD: 'https://discord.com/invite/bSKzq6UMJ3',
  GITHUB: 'https://github.com/IPOR-Labs',
  X_PLATFORM: 'https://x.com/ipor_io',
  TELEGRAM: 'https://t.me/IPOR_official_broadcast',
  SNAPSHOT: 'https://snapshot.org/#/ipordao.eth',
  LEARN_WALLET: 'https://ethereum.org/en/wallets/',
  TERMS_OF_USE: 'https://ipor.io/terms-of-use',
  PRIVACY_POLICY: 'https://ipor.io/privacy-policy',
  MEDIUM: 'https://blog.ipor.io/',
  DOCUMENTATION: 'https://docs.ipor.io/',
  TRADING_FEES:
    'https://docs.ipor.io/ipor-faq/using-the-ipor-protocol#4.-what-are-the-fees-associated-with-trading-swaps-on-the-ipor-protocol',
  WITHDRAWING_LIQUIDITY:
    'https://docs.ipor.io/automated-market-maker/liquidity-provisioning#withdrawing-liquidity',
  LIQUIDITY_PROVISIONING:
    'https://docs.ipor.io/automated-market-maker/liquidity-provisioning',
  ASSET_MANAGEMENT:
    'https://docs.ipor.io/automated-market-maker/asset-management',
  AUDIT_REPORTS: 'https://docs.ipor.io/audits',
  BUY_IPOR_ETHEREUM:
    'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x1e4746dC744503b53b4A082cB3607B169a289090',
  BUY_IPOR_ARBITRUM:
    'https://info.camelot.exchange/pair/arbitrum/v3/0xbb1bdf90a4ab42622f6fa0b28861b23c0d67e7c6',
  BUY_IPOR_BASE:
    'https://app.paraswap.xyz/#/swap/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE-0xbd4e5c2f8de5065993d29a9794e2b7cefc41437a/1/SELL?network=base',
  REVOKE_CASH: 'https://revoke.cash',
  SEPOLIA_FAUCET: 'https://sepoliafaucet.com/',
  IPOR_DAO: 'https://docs.ipor.io/ipor-dao/ipor-dao-governance',
  LIQUIDITY_MINING_DOCS: 'https://docs.ipor.io/ipor-faq/liquidity-mining',
  SWAPS_DOCS:
    'https://docs.ipor.io/interest-rate-derivatives/interest-rate-derivative',
  UNWINDING_SWAPS:
    'https://docs.ipor.io/automated-market-maker/ipor-swaps#closing-and-liquidations',
  IPOR_FUSION: 'https://ipor.io/ipor-fusion',
  FUSION_TOKEN_SNAPSHOT: 'https://docs.ipor.io/ipor-faq/fusn-snapshot-22446433',
} as const;