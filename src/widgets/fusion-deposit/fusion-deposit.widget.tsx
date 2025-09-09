import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DepositAsset } from '@/fusion/deposit/deposit-asset/deposit-asset';
import { HybridWithdraw } from '@/fusion/withdraw/hybrid-withdraw/hybrid-withdraw';
import { type ConfigContextValue } from '@/app/config/config.context';
import { Providers } from '@/app/config/providers';
import { ArrowDownToLineIcon, ArrowUpFromLineIcon } from 'lucide-react';

export const FusionDepositWidget = (config: ConfigContextValue) => {
  return (
    <Providers config={config}>
      <Content />
    </Providers>
  )
}

const Content = () => {
  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="deposit">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="deposit">
              <ArrowDownToLineIcon />
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw">
              <ArrowUpFromLineIcon />
              Withdraw
            </TabsTrigger>
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
