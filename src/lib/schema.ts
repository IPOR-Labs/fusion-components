import { NUMBER_REGEX } from "@/lib/regex";
import type { Address } from "viem";
import { isAddress } from "viem";
import z from "zod";

export const AddressTypeSchema = z.custom<Address>(
  (address) => isAddress(address, { strict: false }),
  {
    message: 'Incorrect address',
  },
);

export const tokenAmountStringSchema = z
  .string({ required_error: 'You have to enter amount' })
  .refine((value) => value !== '', 'You have to enter amount')
  .refine((value) => NUMBER_REGEX.test(value), 'Amount must be a valid number')
  .refine(async (value) => +value > 0, 'Amount must be greater than 0');