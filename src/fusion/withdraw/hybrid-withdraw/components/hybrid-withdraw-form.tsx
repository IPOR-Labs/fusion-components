import { Form } from '@/components/ui/form';
import { useHybridWithdrawContext } from '../hybrid-withdraw.context';
import { HybridWithdrawFooter } from './hybrid-withdraw-footer';
import { HybridWithdrawAmountInput } from './hybrid-withdraw-amount-input';
import { useSubmit } from '../hybrid-withdraw.hooks';
import { HybridWithdrawDetails } from './hybrid-withdraw-details';
import styles from './hybrid-withdraw-form.module.css';

export const HybridWithdrawForm = () => {
  const {
    form,
  } = useHybridWithdrawContext();
  const submit = useSubmit();

  return (
    <Form {...form}>
      <form className={styles.root} onSubmit={form.handleSubmit(submit)}>
        <HybridWithdrawAmountInput />
        <HybridWithdrawDetails />
        <HybridWithdrawFooter />
      </form>
    </Form>
  );
};
