import { Providers } from "@/app/providers"
import type { ChainId } from "@/app/wagmi";
import { PlasmaVaultProvider } from "@/fusion/plasma-vault/plasma-vault.context";
import { AddressTypeSchema } from "@/utils/schema";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { Decorator } from "@storybook/react-vite";

export const ConnectedDecorator: Decorator = (Story) => {
  return (
    <Providers>
      <div style={{ marginBottom: '24px' }}>
        <ConnectButton />
      </div>
      <Story />
    </Providers>
  );
};

export const PlasmaVaultDecorator: Decorator = (Story, context) => {
  return (
    <PlasmaVaultProvider
      chainId={context.args.chainId as ChainId}
      plasmaVaultAddress={AddressTypeSchema.parse(
        context.args.plasmaVaultAddress,
      )}
    >
      <Story />
    </PlasmaVaultProvider>
  );
};