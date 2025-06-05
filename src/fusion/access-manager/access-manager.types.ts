import { z } from 'zod';

const ACCESS_MANAGER_ROLE_KEYS = [
  'ADMIN_ROLE',
  'OWNER_ROLE',
  'GUARDIAN_ROLE',
  'TECH_PLASMA_VAULT_ROLE',
  'IPOR_DAO_ROLE',
  'TECH_CONTEXT_MANAGER_ROLE',
  'TECH_WITHDRAW_MANAGER_ROLE',
  'ATOMIST_ROLE',
  'ALPHA_ROLE',
  'FUSE_MANAGER_ROLE',
  'PRE_HOOKS_MANAGER_ROLE',
  'TECH_PERFORMANCE_FEE_MANAGER_ROLE',
  'TECH_MANAGEMENT_FEE_MANAGER_ROLE',
  'CLAIM_REWARDS_ROLE',
  'TECH_REWARDS_CLAIM_MANAGER_ROLE',
  'TRANSFER_REWARDS_ROLE',
  'WHITELIST_ROLE',
  'CONFIG_INSTANT_WITHDRAWAL_FUSES_ROLE',
  'WITHDRAW_MANAGER_REQUEST_FEE_ROLE',
  'WITHDRAW_MANAGER_WITHDRAW_FEE_ROLE',
  'UPDATE_MARKETS_BALANCES_ROLE',
  'UPDATE_REWARDS_BALANCE_ROLE',
  'PRICE_ORACLE_MIDDLEWARE_MANAGER_ROLE',
] as const;

const accessManagerRoleSchema = z.enum(ACCESS_MANAGER_ROLE_KEYS);

export type AccessManagerRole = z.infer<typeof accessManagerRoleSchema>;

interface RoleConfig {
  value: bigint;
  description: string;
  label: string;
  whoCanGrant: AccessManagerRole | undefined;
}

export const ACCESS_MANAGER_ROLE = {
  ADMIN_ROLE: {
    value: 0n,
    description:
      'An account with this role has rights to manage the Ipor Fusion Access Manager in general.',
    label: 'Admin',
    whoCanGrant: undefined,
  },
  OWNER_ROLE: {
    value: 1n,
    description:
      'The highest permission level role, it can manage Guardians and Atomists.',
    label: 'Owner',
    whoCanGrant: undefined,
  },
  GUARDIAN_ROLE: {
    value: 2n,
    description:
      'An account with this role has rights to cancel time-locked operations, pause restricted methods in Plasma Vault contracts in case of emergency.',
    label: 'Guardian',
    whoCanGrant: 'OWNER_ROLE',
  },
  TECH_PLASMA_VAULT_ROLE: {
    value: 3n,
    description:
      'Technical role to limit access to methods only from the Plasma Vault contract.',
    label: 'Tech Plasma Vault',
    whoCanGrant: undefined,
  },
  IPOR_DAO_ROLE: {
    value: 4n,
    description: 'Technical role for IPOR DAO operations.',
    label: 'IPOR DAO',
    whoCanGrant: undefined,
  },
  TECH_CONTEXT_MANAGER_ROLE: {
    value: 5n,
    description:
      'Technical role to limit access to methods only from the Context Manager contract.',
    label: 'Tech Context Manager',
    whoCanGrant: undefined,
  },
  TECH_WITHDRAW_MANAGER_ROLE: {
    value: 6n,
    description:
      'Technical role to limit access to methods only from the WithdrawManager contract.',
    label: 'Tech Withdraw Manager',
    whoCanGrant: undefined,
  },
  ATOMIST_ROLE: {
    value: 100n,
    description:
      'An account with this role has rights to manage the Plasma Vault.',
    label: 'Atomist',
    whoCanGrant: 'OWNER_ROLE',
  },
  ALPHA_ROLE: {
    value: 200n,
    description:
      'An account with this role has rights to execute the alpha strategy on the Plasma Vault using execute method.',
    label: 'Alpha',
    whoCanGrant: 'ATOMIST_ROLE',
  },
  FUSE_MANAGER_ROLE: {
    value: 300n,
    description:
      'An account with this role has rights to manage the Fuse Manager contract, add or remove fuses, balance fuses and reward fuses.',
    label: 'Fuse Manager',
    whoCanGrant: 'ATOMIST_ROLE',
  },
  PRE_HOOKS_MANAGER_ROLE: {
    value: 301n,
    description:
      'Account with this role has rights to manage the PreHooksManager contract, add or remove pre-hooks.',
    label: 'PreHooks Manager',
    whoCanGrant: 'OWNER_ROLE',
  },
  TECH_PERFORMANCE_FEE_MANAGER_ROLE: {
    value: 400n,
    description:
      'An account with this role has rights to manage the performance fee, define the performance fee rate and manage the performance fee recipient.',
    label: 'Tech Performance Fee Manager',
    whoCanGrant: 'TECH_PERFORMANCE_FEE_MANAGER_ROLE',
  },
  TECH_MANAGEMENT_FEE_MANAGER_ROLE: {
    value: 500n,
    description:
      'An account with this role has rights to manage the management fee, define the management fee rate and manage the management fee recipient.',
    label: 'Tech Management Fee Manager',
    whoCanGrant: 'TECH_MANAGEMENT_FEE_MANAGER_ROLE',
  },
  CLAIM_REWARDS_ROLE: {
    value: 600n,
    description:
      'Account with this role has rights to claim rewards from the Plasma Vault.',
    label: 'Claim Rewards',
    whoCanGrant: 'ATOMIST_ROLE',
  },
  TECH_REWARDS_CLAIM_MANAGER_ROLE: {
    value: 601n,
    description: 'Technical role for the Rewards Claim Manager contract.',
    label: 'Tech Rewards Claim Manager',
    whoCanGrant: undefined,
  },
  TRANSFER_REWARDS_ROLE: {
    value: 700n,
    description:
      'Account with this role has rights to transfer rewards from the PlasmaVault to the Rewards Claim Manager.',
    label: 'Transfer Rewards',
    whoCanGrant: 'ATOMIST_ROLE',
  },
  WHITELIST_ROLE: {
    value: 800n,
    description:
      'An account with this role has rights to deposit / mint and withdraw / redeem assets from the Plasma Vault.',
    label: 'Whitelisted',
    whoCanGrant: 'ATOMIST_ROLE',
  },
  CONFIG_INSTANT_WITHDRAWAL_FUSES_ROLE: {
    value: 900n,
    description:
      'An account with this role has rights to configure instant withdrawal fuses order.',
    label: 'Instant Withdrawal Fuses',
    whoCanGrant: 'ATOMIST_ROLE',
  },
  WITHDRAW_MANAGER_REQUEST_FEE_ROLE: {
    value: 901n,
    description:
      'Account with this role has rights to update request fee in the WithdrawManager contract.',
    label: 'Withdraw Manager Request Fee',
    whoCanGrant: 'ATOMIST_ROLE',
  },
  WITHDRAW_MANAGER_WITHDRAW_FEE_ROLE: {
    value: 902n,
    description:
      'Account with this role has rights to update withdraw fee in the WithdrawManager contract.',
    label: 'Withdraw Manager Withdraw Fee',
    whoCanGrant: 'ATOMIST_ROLE',
  },
  UPDATE_MARKETS_BALANCES_ROLE: {
    value: 1000n,
    description:
      'Account with this role has rights to update the markets balances in the PlasmaVault.',
    label: 'Update Markets Balances',
    whoCanGrant: 'ATOMIST_ROLE',
  },
  UPDATE_REWARDS_BALANCE_ROLE: {
    value: 1100n,
    description:
      'Account with this role has rights to update balance in the RewardsClaimManager contract.',
    label: 'Update Rewards Balance',
    whoCanGrant: 'ATOMIST_ROLE',
  },
  PRICE_ORACLE_MIDDLEWARE_MANAGER_ROLE: {
    value: 1200n,
    description:
      'Account with this role has rights to manage the PriceOracleMiddlewareManager contract.',
    label: 'Price Oracle Middleware Manager',
    whoCanGrant: 'ATOMIST_ROLE',
  },
} as const satisfies Record<AccessManagerRole, RoleConfig>;
