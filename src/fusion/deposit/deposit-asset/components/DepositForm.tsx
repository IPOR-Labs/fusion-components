import { Form } from '@/components/ui/form';
import { useDeposit } from '@/fusion/deposit/deposit-asset/deposit-asset.context';
import { DepositFooter } from '@/fusion/deposit/deposit-asset/components/DepositFooter';
import { DepositAmountInput } from '@/fusion/deposit/deposit-asset/components/DepositAmountInput';
import { useSubmit } from '@/fusion/deposit/deposit-asset/deposit-asset.hooks';

export const DepositForm = () => {
  const { form } = useDeposit();

  const submit = useSubmit();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8 justify-between h-full"
        onSubmit={form.handleSubmit(submit)}
      >
        <DepositAmountInput />
        <DepositFooter />
      </form>
    </Form>
  );
};
