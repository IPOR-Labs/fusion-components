import { Form } from '@/components/ui/form';
import { useDepositAssetContext } from '../deposit-asset.context';
import { DepositAssetFooter } from './deposit-asset-footer';
import { DepositAssetAmountInput } from './deposit-asset-amount-input';
import { useSubmit } from '../deposit-asset.hooks';

export const DepositAssetForm = () => {
  const { form } = useDepositAssetContext();

  const submit = useSubmit();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8 justify-between h-full"
        onSubmit={form.handleSubmit(submit)}
      >
        <DepositAssetAmountInput />
        <DepositAssetFooter />
      </form>
    </Form>
  );
};
