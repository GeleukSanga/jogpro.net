'use client'

import { Suspense } from 'react'
import PaymentContent from './content'
import { Loader2 } from 'lucide-react'

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <main className="grid min-h-screen place-items-center bg-[#fbfbf8]">
        <Loader2 className="size-8 animate-spin text-[#999]" />
      </main>
    }>
      <PaymentContent />
    </Suspense>
  )
}
