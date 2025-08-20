import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { tokenAmountStringSchema } from '@/lib/schema';

const formSchema = z.object({
  amount: tokenAmountStringSchema,
  isMax: z.boolean(),
});

export const useHybridWithdrawForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      amount: '',
      isMax: false,
    },
    mode: 'onChange',
  });

  return form;
};

export type HybridWithdrawForm = ReturnType<typeof useHybridWithdrawForm>;
