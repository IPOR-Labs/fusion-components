import { useConfigContext } from '@/app/config/config.context';
import { PAUSE_FUNCTIONS_PREHOOKS_ADDRESSES } from '../prehooks.addresses';
import { usePrehooksInfo } from './use-prehooks-info';
import { getPlasmaVaultWriteFunctionSelectorByFunctionName, type WriteFunctionName } from '@/abi/plasma-vault-write-function-signatures';

export const useIsFunctionPaused = ({
  writeFunctionName,
}: {
  writeFunctionName: WriteFunctionName;
}) => {
  const {
    chainId,
  } = useConfigContext();
  const { data: prehooks = [] } = usePrehooksInfo();

  const isPaused = prehooks.some(
    ({ selector: prehookSelector, implementation }) => {
      return (
        prehookSelector ===
          getPlasmaVaultWriteFunctionSelectorByFunctionName(
            writeFunctionName,
          ) && implementation === PAUSE_FUNCTIONS_PREHOOKS_ADDRESSES[chainId]
      );
    },
  );

  return isPaused;
};
