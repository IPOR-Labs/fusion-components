import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { erc20Abi } from 'viem'
import { useReadContract } from 'wagmi';
import { Providers } from '@/app/providers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DepositAsset } from '@/fusion/deposit/deposit-asset/deposit-asset';
import { HybridWithdraw } from '@/fusion/withdraw/hybrid-withdraw/hybrid-withdraw';
import { useAppContext, type AppContextValue } from '@/app/app.context';

export const FusionDepositWidget = (appContext: AppContextValue) => {
  return (
    <div className="dark">
      <Providers appContext={appContext}>
        <Content />
      </Providers>
    </div>
  )
}

const Content = () => {
  const {
    chainId,
    fusionVaultAddress,
  } = useAppContext();
  const { data: name } = useReadContract({
    chainId,
    address: fusionVaultAddress,
    abi: erc20Abi,
    functionName: 'name',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit">
          <TabsList>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          <TabsContent value="deposit">
            <DepositAsset />
          </TabsContent>
          <TabsContent value="withdraw">
            <HybridWithdraw />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
