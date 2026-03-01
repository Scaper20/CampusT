'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

export function SubmitButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className={className} disabled={pending} {...props}>
      {pending ? 'Please wait...' : children}
    </Button>
  )
}
