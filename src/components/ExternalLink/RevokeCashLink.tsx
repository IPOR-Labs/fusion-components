import { ExternalLink } from '@/components/external-link';
import { LINKS } from '@/utils/constants';
import { type Address } from 'viem';

interface Props {
  accountAddress: Address;
}

export const RevokeCashLink = (props: Props) => {
  const { accountAddress } = props;
  const href = `${LINKS.REVOKE_CASH}/address/${accountAddress}`;

  return <ExternalLink href={href}>Revoke</ExternalLink>;
};
