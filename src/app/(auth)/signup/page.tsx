import { SubmitButton } from '@/components/SubmitButton'
import Link from 'next/link'
import type { Metadata } from 'next'
import { signUp } from '../actions'
import { btn, input, Notice } from '@/components/ui'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
export const metadata: Metadata = { title: 'Start free trial' }

export default async function Signup({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return (
    <>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Create your workspace</h1>
      <p className="mb-6 mt-2 text-sm text-muted">Start with your business profile. No credit card required.</p>
      {error && <Notice kind="error">{error}</Notice>}
      <form action={signUp}>
        <FieldGroup className="mb-5">
          <Field>
            <FieldLabel htmlFor="name" className="text-sm text-ink">Your name</FieldLabel>
            <Input id="name" name="name" required autoComplete="name" className={`${input} h-11 text-sm`} />
          </Field>
          <Field>
            <FieldLabel htmlFor="email" className="text-sm text-ink">Work email</FieldLabel>
            <Input id="email" name="email" type="email" required autoComplete="email" className={`${input} h-11 text-sm`} />
          </Field>
          <Field>
            <FieldLabel htmlFor="password" className="text-sm text-ink">Password</FieldLabel>
            <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className={`${input} h-11 text-sm`} />
          </Field>
        </FieldGroup>
        <SubmitButton className={`${btn.primary} w-full`}>Create account</SubmitButton>
      </form>
      <p className="mt-4 text-center text-xs leading-relaxed text-muted">By continuing, you agree to our <Link href="/terms" className="font-medium text-primary underline underline-offset-2">Terms</Link> and <Link href="/privacy" className="font-medium text-primary underline underline-offset-2">Privacy Policy</Link>.</p>
      <p className="mt-4 text-center text-sm text-muted">Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link></p>
    </>
  )
}
