import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { tokenAmountStringSchema } from '@/utils/schema';

export const formSchema = z.object({
  amount: tokenAmountStringSchema,
});

export const useDepositForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      amount: '',
    },
    mode: 'onChange',
  });

  return form;
};

export type DepositForm = ReturnType<typeof useDepositForm>;
