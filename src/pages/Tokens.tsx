// src/pages/Tokens.tsx
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { currentUser, tokenPackages } from '@/api/data'
import { Ticket, ShoppingCart } from 'lucide-react'

const Tokens = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Ticket size={32} className="text-primary" />
            <Badge variant="gradient" className="text-lg">Token Shop</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-4">Purchase Tokens</h1>
          <p className="text-text-secondary">Buy token packages to unlock premium study materials, advanced career tools, and exclusive content.</p>
          <p className="mt-4 text-lg"><span className="font-bold text-primary">{currentUser.tokens.toLocaleString()} tokens</span> currently available</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tokenPackages.map((pkg) => (
            <Card key={pkg.id} variant="gradient" className={`h-full flex flex-col text-center transition-all duration-300 ${pkg.popular ? 'border-2 border-primary shadow-glow' : 'hover:shadow-glow'}`}>
              {pkg.popular && <Badge variant="gradient" className="mx-auto -mt-3 w-fit">Most Popular</Badge>}
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="text-4xl font-bold text-gradient">₹ {pkg.price.toLocaleString()}</div>
                <div className="text-2xl font-bold">{pkg.tokens.toLocaleString()} Tokens</div>
                <p className="text-xs text-text-secondary">≈ ₹ {Math.round(pkg.price / pkg.tokens)} per token</p>
              </CardContent>
              <CardFooter>
                <Button variant={pkg.popular ? 'primary' : 'secondary'} className="w-full gap-2">
                  <ShoppingCart size={16} /> Purchase
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tokens
