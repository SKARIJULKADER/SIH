// src/pages/dashboard/Tokens.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { currentUser, tokenPackages } from '@/api/data'
import { Ticket, ShoppingCart, History } from 'lucide-react'

const DashboardTokens = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-heading">Token Wallet</h1>
            <p className="text-text-secondary mt-1">Purchase tokens to access premium resources and career tools.</p>
          </div>
          <Badge variant="gradient" className="text-lg"><Ticket size={18} /> {currentUser.tokens.toLocaleString()} tokens</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tokenPackages.map((pkg) => (
            <Card key={pkg.id} variant="gradient" className={`h-full flex flex-col text-center transition-all duration-300 ${pkg.popular ? 'border-2 border-primary shadow-glow' : 'hover:shadow-glow'}`}>
              {pkg.popular && <Badge variant="gradient" className="mx-auto -mt-3 w-fit">Most Popular</Badge>}
              <CardHeader><CardTitle>{pkg.name}</CardTitle></CardHeader>
              <CardContent className="flex-1 space-y-3">
                <div className="text-3xl font-bold text-gradient">₹ {pkg.price}</div>
                <div className="text-xl font-bold">{pkg.tokens} Tokens</div>
              </CardContent>
              <CardFooter>
                <Button variant={pkg.popular ? 'primary' : 'secondary'} className="w-full gap-2"><ShoppingCart size={16} /> Purchase</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><History size={20} />Transaction History</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border"><span>Purchase: Elite Package</span><span className="text-success">— 6,000 tokens · Jul 15</span></div>
              <div className="flex justify-between py-2 border-b border-border"><span>Redeemed: Premium DSA Notes</span><span className="text-warning">— 500 tokens · Jul 10</span></div>
              <div className="flex justify-between py-2"><span>Purchase: Popular Package</span><span className="text-success">— 1,200 tokens · Jun 28</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default DashboardTokens
