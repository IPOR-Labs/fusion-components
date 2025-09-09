import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { HybridWithdrawDetails } from './hybrid-withdraw-details';
import { HybridWithdrawContext } from '../hybrid-withdraw.context';
import { useHybridWithdrawForm } from '../hybrid-withdraw.form';
import { useTransactionState } from '@/app/transactions/hooks/use-transaction-state';
import type { Params } from '../hybrid-withdraw.params';
import type { Actions } from '../hybrid-withdraw.actions';
import { ONE_ETHER } from '@/lib/constants';

const meta = {
  component: HybridWithdrawDetails,
  tags: ['autodocs'],
} satisfies Meta<typeof HybridWithdrawDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

type WrapperProps = {
  params: Partial<Params>;
  amount?: string;
  isMax?: boolean;
};

const WithContext = ({ params, amount, isMax }: WrapperProps) => {
  const form = useHybridWithdrawForm();
  const txState = useTransactionState();

  useEffect(() => {
    if (amount !== undefined) {
      form.setValue('amount', amount, { shouldDirty: true });
      form.trigger(['amount']);
    }
    if (isMax !== undefined) {
      form.setValue('isMax', isMax, { shouldDirty: true });
    }
  }, [amount, isMax]);

  const contextValue = {
    params: params as unknown as Params,
    actions: {} as unknown as Actions,
    form,
    txState,
  };

  return (
    <HybridWithdrawContext.Provider value={contextValue}>
      <HybridWithdrawDetails />
    </HybridWithdrawContext.Provider>
  );
};

const FIVE_PERCENT = 5n * (10n ** 16n);
const TWO_PERCENT = 2n * (10n ** 16n);

const BASE_PARAMS: Partial<Params> = {
  assetDecimals: 18,
  assetSymbol: 'ETH',
  maxInstantWithdrawAmount: 8n * (10n ** 17n), // 0.8 ETH
  balanceToWithdraw: 10n * ONE_ETHER,
  withdrawWindowInSeconds: 86_400n, // 1 day
  withdrawFee: TWO_PERCENT,
  requestFee: FIVE_PERCENT,
};

export const Placeholder: Story = {
  render: () => (
    <WithContext
      params={BASE_PARAMS}
    />
  ),
};

export const InstantState: Story = {
  render: () => (
    <WithContext
      params={{
        ...BASE_PARAMS,
        maxInstantWithdrawAmount: ONE_ETHER, // 1 ETH
        withdrawFee: TWO_PERCENT,
      }}
      amount={'0.5'}
      isMax={false}
    />
  ),
};

export const ScheduledState: Story = {
  render: () => (
    <WithContext
      params={{
        ...BASE_PARAMS,
        maxInstantWithdrawAmount: 5n * (10n ** 17n), // 0.5 ETH
        requestFee: FIVE_PERCENT,
      }}
      amount={'2'}
      isMax={false}
    />
  ),
};


