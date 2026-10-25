import { SubmitButton } from '@/components/SubmitButton'
import Link from 'next/link'
import type { Metadata } from 'next'
import { signIn } from '../actions'
import { btn, input, Notice } from '@/components/ui'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
export const metadata: Metadata = { title: 'Log in' }

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string; notice?: string; next?: string }> }) {
  const { error, notice, next } = await searchParams
  return (
    <>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Welcome back</h1>
      <p className="mb-6 mt-2 text-sm text-muted">Sign in to manage your receptionist and review calls.</p>
      {error && <Notice kind="error">{error}</Notice>}
      {notice && <Notice kind="success">{notice}</Notice>}
      <form action={signIn}>
        <input type="hidden" name="next" value={next ?? ''} />
        <FieldGroup className="mb-5">
          <Field>
            <FieldLabel htmlFor="email" className="text-sm text-ink">Work email</FieldLabel>
            <Input id="email" name="email" type="email" required autoComplete="email" className={`${input} h-11 text-sm`} />
          </Field>
          <Field>
            <FieldLabel htmlFor="password" className="text-sm text-ink">Password</FieldLabel>
            <Input id="password" name="password" type="password" required autoComplete="current-password" className={`${input} h-11 text-sm`} />
          </Field>
        </FieldGroup>
        <SubmitButton className={`${btn.primary} w-full`}>Sign in</SubmitButton>
      </form>
      <p className="mt-5 text-center text-sm text-muted">New to DialDesk? <Link href="/signup" className="font-semibold text-primary hover:underline">Create an account</Link></p>
    </>
  )
}
