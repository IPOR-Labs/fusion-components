import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type ChainId } from '@/app/config/wagmi';
import { cn } from "@/lib/utils"
import { type Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';
import { useConfigContext } from '@/app/config/config.context';

interface TokenPathProps {
  chainId: ChainId;
  address: Address;
}

const ASSETS_API_URL = 'https://assets.mainnet.ipor.io';
const CREATE_ICON_API_URL = 'https://api-assets.mainnet.ipor.io';
const CREATE_ICON_API_KEY = 'VmnFCf1qiS254TLZmxFcY6g5Y7gy0mL112zYrY7v';

const BASE_URL = ASSETS_API_URL;
const tokenIconClient = axios.create({
  baseURL: BASE_URL,
});
const createIconClient = axios.create({
  baseURL: CREATE_ICON_API_URL,
  headers: {
    'X-API-Key': CREATE_ICON_API_KEY,
  },
});
const getTokenPath = ({ chainId, address }: TokenPathProps) => {
  return `images/icons/tokens/${chainId}/${address.toLowerCase()}.png`;
};

interface Props {
  address: Address | undefined;
  className?: string;
  showTitle?: boolean;
}

export const TokenIcon = ({ address, ...props }: Props) => {
  const { chainId } = useConfigContext();
  if (address === undefined) return <TokenIconPlaceholder {...props} chainId={chainId} />;
  return <TokenIconContent {...props} address={address} chainId={chainId} />;
};

type ContentProps = Props & TokenPathProps;

const TokenIconContent = (props: ContentProps) => {
  const { chainId, address } = props;
  const result = useTokenIcon({ chainId, address });

  if (result.isError) return <TokenIconCreator {...props} />;
  if (result.data) return <TokenIconDisplay {...props} />;
  return <TokenIconPlaceholder {...props} />;
};

const useTokenIcon = ({
  chainId,
  address,
  retry = false,
}: TokenPathProps & {
  retry?: boolean;
}) => {
  return useQuery({
    queryKey: ['useTokenIcon', chainId, address],
    queryFn: async () => {
      return await tokenIconClient.get(getTokenPath({ chainId, address }));
    },
    retry,
  });
};

const useCreateTokenIcon = ({ chainId, address }: TokenPathProps) => {
  return useQuery({
    queryKey: ['useCreateTokenIcon', chainId, address],
    queryFn: async () => {
      return await createIconClient.get(getTokenPath({ chainId, address }));
    },
  });
};

const useSymbol = (args: {
  address: Address | undefined;
  chainId: ChainId;
}) => {
  const { data: symbol } = useReadContract({
    ...args,
    abi: erc20Abi,
    functionName: 'symbol',
  });
  return symbol;
};

const TokenIconDisplay = (props: ContentProps) => {
  const { chainId, address, className, showTitle } = props;
  const symbol = useSymbol({ chainId, address });
  const { data } = useTokenIcon({ chainId, address, retry: true });

  if (data) {
    const path = getTokenPath({ chainId, address });

    return (
      <img
        className={cn('rounded-full', className)}
        src={`${BASE_URL}/${path}`}
        alt={symbol}
        title={showTitle ? symbol : undefined}
      />
    );
  }

  return <TokenIconPlaceholder {...props} />;
};

const TokenIconCreator = (props: ContentProps) => {
  const { address, chainId } = props;
  const { data } = useCreateTokenIcon({ address, chainId });

  if (data) return <TokenIconDisplay {...props} />;
  return <TokenIconPlaceholder {...props} />;
};

const TokenIconPlaceholder = ({
  address,
  chainId,
  className,
}: {
  chainId: ChainId;
  address?: Address;
  className?: string;
}) => {
  const symbol = useSymbol({ chainId, address });

  return (
    <div
      className={cn(
        'w-5 h-5 rounded-full bg-muted text-xs text-muted-foreground flex items-center justify-center',
        className,
      )}
    >
      {symbol && <p className="truncate">{symbol}</p>}
    </div>
  );
};
