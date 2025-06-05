import { NUMBER_REGEX } from "@/utils/regex";
import type { Address, Hex } from "viem";
import { isAddress, isHex } from "viem";
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