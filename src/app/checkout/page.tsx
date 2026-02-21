import { Navbar } from '@/components/layout/navbar'
import { CheckoutContent } from './checkout-content'

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <CheckoutContent />
    </div>
  )
}
