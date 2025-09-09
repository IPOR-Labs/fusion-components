import { ExternalLink } from '@/components/external-link';
import { type Address } from 'viem';

const REVOKE_CASH_URL = 'https://revoke.cash';

interface Props {
  accountAddress: Address;
}

export const RevokeCashLink = (props: Props) => {
  const { accountAddress } = props;
  const href = `${REVOKE_CASH_URL}/address/${accountAddress}`;

  return <ExternalLink href={href}>Revoke</ExternalLink>;
};
