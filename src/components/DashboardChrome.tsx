'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { signOut } from '@/app/(auth)/actions'
import { CommandPalette } from '@/components/CommandPalette'
import { NAV_ICONS, NavLink } from '@/components/NavLink'
import { ThemeToggle } from '@/components/ThemeToggle'
import { BrandMark } from '@/components/marketing'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NAV_GROUPS, PROFILE_LINKS, allNav } from '@/lib/nav'

const SIDEBAR_STORAGE_KEY = 'dd-sidebar-collapsed'
let sidebarCollapsedFallback = false
const subscribeSidebar = (callback: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === SIDEBAR_STORAGE_KEY || event.key === null) callback()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener('dd-sidebar', callback)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener('dd-sidebar', callback)
  }
}
const readSidebarCollapsed = () => {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
  } catch {
    return sidebarCollapsedFallback
  }
}

export function DashboardChrome({
  children,
  orgName,
  userEmail,
  isPlatformAdmin,
}: {
  children: ReactNode
  orgName: string
  userEmail: string
  isPlatformAdmin: boolean
}) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const sidebarCollapsed = useSyncExternalStore(subscribeSidebar, readSidebarCollapsed, () => false)
  const [profileOpen, setProfileOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const initials = userEmail.split('@')[0].split(/[._-]/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('')
  const activePage = allNav()
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]
  const pageTitle = pathname === '/admin' ? 'Platform admin' : activePage?.label ?? 'Overview'

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(media.matches)
    const updateForViewport = () => {
      update()
      if (!media.matches) setMenuOpen(false)
    }
    update()
    media.addEventListener('change', updateForViewport)
    return () => media.removeEventListener('change', updateForViewport)
  }, [])

  useEffect(() => {
    if (!menuOpen || !isMobile) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
      if (event.key === 'Tab') {
        const focusable = sidebarRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    sidebarRef.current?.querySelector<HTMLElement>('a[href], button:not([disabled])')?.focus()
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [isMobile, menuOpen])

  const closeNavigation = () => {
    setMenuOpen(false)
    if (isMobile) menuButtonRef.current?.focus()
  }

  const toggleSidebar = () => {
    sidebarCollapsedFallback = !sidebarCollapsed
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsedFallback))
    } catch {
      // Keep the preference for this render even when storage is unavailable.
    }
    window.dispatchEvent(new Event('dd-sidebar'))
  }

  return (
    <div className="min-h-screen bg-canvas">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:flex focus:min-h-11 focus:items-center focus:rounded-lg focus:bg-primary focus:px-4 focus:text-sm focus:font-medium focus:text-primary-fg">
        Skip to content
      </a>

      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeNavigation}
          className="fixed inset-0 z-30 bg-band/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        ref={sidebarRef}
        id="dashboard-navigation"
        role={isMobile ? 'dialog' : undefined}
        aria-label="Dashboard navigation"
        aria-hidden={isMobile && !menuOpen}
        aria-modal={isMobile && menuOpen ? true : undefined}
        inert={isMobile && !menuOpen}
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(290px,84vw)] -translate-x-full flex-col overflow-y-auto border-r border-line bg-surface px-3 py-4 transition-[width,transform,padding] duration-200 ease-out motion-reduce:transition-none md:translate-x-0 ${sidebarCollapsed ? 'md:w-[72px] md:px-2' : 'md:w-[238px]'} ${menuOpen ? 'translate-x-0' : ''}`}
      >
        <div className={sidebarCollapsed ? 'md:px-0' : 'px-2'}>
          <div className={`flex items-center justify-between pb-4 ${sidebarCollapsed ? 'md:justify-center' : ''}`}>
            <Link href="/dashboard" aria-label="DialDesk overview" onClick={closeNavigation} className={`flex items-center gap-2.5 px-2 font-display text-xl font-extrabold tracking-tight text-ink ${sidebarCollapsed ? 'md:px-0' : ''}`}>
              <BrandMark />
              <span className={sidebarCollapsed ? 'md:hidden' : ''}>DialDesk</span>
            </Link>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={closeNavigation}
              className="grid h-11 w-11 place-items-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-ink md:hidden"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div
            title={sidebarCollapsed ? orgName : undefined}
            className={`mb-3 flex min-h-12 items-center gap-3 rounded-xl border border-line bg-canvas p-2 ${sidebarCollapsed ? 'md:justify-center md:px-1' : ''}`}
          >
            <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-sm font-bold text-primary">
              {orgName.slice(0, 1).toUpperCase()}
            </span>
            <span className={`min-w-0 ${sidebarCollapsed ? 'md:sr-only' : ''}`}>
              <span className="block truncate text-sm font-semibold text-ink">{orgName}</span>
              <span className="mt-0.5 block truncate text-xs text-muted">Business workspace</span>
            </span>
          </div>
        </div>

        <nav aria-label="Dashboard" className="flex flex-col gap-4 px-1">
          {NAV_GROUPS.map(({ group, items }) => (
            <Collapsible key={group} defaultOpen className="group/collapsible">
              <CollapsibleTrigger
                aria-label={`Toggle ${group} navigation`}
                className={`flex min-h-9 w-full items-center gap-2 rounded-lg px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-faint transition hover:bg-surface-2 hover:text-ink ${sidebarCollapsed ? 'md:hidden' : ''}`}
              >
                {group}
                <ChevronDown className="ml-auto size-4 shrink-0 transition-transform group-data-open/collapsible:rotate-180" aria-hidden />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-0.5 pt-1">
                  {items.map((item) => (
                    <NavLink key={item.href} href={item.href} icon={item.icon} onNavigate={closeNavigation} collapsed={sidebarCollapsed}>{item.label}</NavLink>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
          {isPlatformAdmin && <NavLink href="/admin" icon="admin" onNavigate={closeNavigation} collapsed={sidebarCollapsed}>Platform admin</NavLink>}
        </nav>
      </aside>

      <div className={`min-w-0 transition-[margin] duration-200 ease-out motion-reduce:transition-none ${sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[238px]'}`}>
        <header className="header-glass sticky top-0 z-20 flex h-16 items-center gap-1.5 border-b border-line px-3 md:gap-3 md:px-[30px]">
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-controls="dashboard-navigation"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted transition hover:bg-surface-2 hover:text-ink md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
          <button
            type="button"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-controls="dashboard-navigation"
            aria-pressed={sidebarCollapsed}
            onClick={toggleSidebar}
            className="hidden h-10 w-10 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-ink md:grid"
          >
            {sidebarCollapsed
              ? <PanelLeftOpen className="h-4 w-4" aria-hidden />
              : <PanelLeftClose className="h-4 w-4" aria-hidden />}
          </button>
          <p className="min-w-0 truncate text-sm text-muted">
            <span className="hidden sm:inline">Workspace <span className="mx-2 text-faint">/</span></span>
            <span className="font-semibold text-ink">{pageTitle}</span>
          </p>
          <div className="ml-auto w-11 shrink-0 md:w-48 lg:w-64">
            <CommandPalette />
          </div>
          <ThemeToggle compact />
          <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label={profileOpen ? 'Close profile menu' : 'Open profile menu'}
                  className="flex min-h-11 items-center gap-2 rounded-lg px-1.5 text-muted-foreground transition hover:bg-surface-2 hover:text-ink sm:px-2"
                />
              }
            >
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-sm font-bold text-primary">{initials || '?'}</span>
              <span className="hidden max-w-36 truncate text-xs font-semibold text-ink lg:inline">{userEmail}</span>
              <ChevronDown className="size-4" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex flex-col gap-0.5 px-3 py-2">
                  <span className="truncate text-sm font-semibold text-ink">{userEmail || 'Account'}</span>
                  <span className="text-xs font-normal text-muted-foreground">{isPlatformAdmin ? 'Platform admin' : 'Workspace member'}</span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {PROFILE_LINKS.map((item) => {
                  const Icon = NAV_ICONS[item.icon]
                  return (
                    <DropdownMenuItem
                      key={item.href}
                      render={<Link href={item.href} />}
                      className="min-h-11 px-3 text-sm font-medium"
                    >
                      {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
                      {item.label}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <form action={signOut}>
                  <DropdownMenuItem
                    variant="destructive"
                    render={<button type="submit" />}
                    className="min-h-11 px-3 text-sm font-medium"
                  >
                    <LogOut className="size-4 shrink-0" aria-hidden />
                    Sign out
                  </DropdownMenuItem>
                </form>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main id="main" tabIndex={-1} className="min-w-0 p-4 focus:outline-none md:px-[30px] md:py-6">
          <div className="mx-auto max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
