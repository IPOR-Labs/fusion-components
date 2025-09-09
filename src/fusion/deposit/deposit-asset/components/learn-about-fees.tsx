import { ExternalLinkIcon } from 'lucide-react';
import { useConfigContext } from '@/app/config/config.context';
import { ExternalLink } from '@/components/external-link';
import { FUSION_DAPP_URL } from '@/lib/constants';
import { getChainKey } from '@/lib/get-chain-key';

export const LearnAboutFees = () => {
  const {
    chainId,
    fusionVaultAddress,
  } = useConfigContext();
  
  const settingsHref = `${FUSION_DAPP_URL}/fusion/${getChainKey(chainId)}/${fusionVaultAddress}/settings`;

  return (
    <ExternalLink
      href={settingsHref}
      className="theme-default inline-flex items-center text-sm gap-1"
    >
      Learn about the fees
      <ExternalLinkIcon className="w-4 h-4" />
    </ExternalLink>
  );
};
