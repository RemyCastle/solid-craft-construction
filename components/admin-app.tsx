"use client"

import { useCallback, useEffect, useState } from "react"

import { BrandMark } from "@/components/brand-mark"
import { JOB_PRESETS, type SiteRow } from "@/lib/public"

type Tab = "site" | "requests" | "photos" | "users"
type Admin = { id: number; name: string }
type Lead = {
  id: number
  created_at: string
  name: string
  phone: string
  email: string
  job: string
  need: string
  photo_key: string | null
  photos?: string[]
  status: "unread" | "read"
}
type UserRow = { id: number; name: string; created_at: string }
type ServiceRow = { id?: number; slug: string; name: string; line: string }
type PhotoRow = {
  id: number
  src: string
  job_preset: string
  job_custom: string
  caption: string
}
type PairRow = {
  id: number
  before_src: string
  after_src: string
  job_preset: string
  job_custom: string
  caption: string
  visible: number
}

const TABS: { id: Tab; label: string }[] = [
  { id: "site", label: "Site" },
  { id: "requests", label: "Requests" },
  { id: "photos", label: "Photos" },
  { id: "users", label: "Users" },
]

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", ...init })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((body as { error?: string }).error || "Request failed")
  return body as T
}

export function AdminApp() {
  const [boot, setBoot] = useState<"load" | "setup" | "login" | "in">("load")
  const [me, setMe] = useState<Admin | null>(null)
  const [tab, setTab] = useState<Tab>("site")
  const [note, setNote] = useState("")

  const refreshMe = useCallback(async () => {
    const data = await api<{ setup: boolean; admin: Admin | null }>("/api/auth/me")
    if (data.setup) setBoot("setup")
    else if (data.admin) {
      setMe(data.admin)
      setBoot("in")
    } else setBoot("login")
  }, [])

  useEffect(() => {
    let gone = false
    const timer = window.setTimeout(() => {
      refreshMe().catch(() => {
        if (!gone) setBoot("login")
      })
    }, 0)
    return () => {
      gone = true
      window.clearTimeout(timer)
    }
  }, [refreshMe])

  if (boot === "load") {
    return <AdminShell>Loading…</AdminShell>
  }
  if (boot === "setup") {
    return (
      <AdminShell>
        <h1 className="text-5xl">Create owner</h1>
        <p className="mt-3 max-w-md font-medium text-mute">
          First time only. Remy creates this login. Bookmark /admin. Not linked from the public site.
        </p>
        <AuthForm action="/api/auth/setup" submit="Create owner" onDone={refreshMe} />
      </AdminShell>
    )
  }
  if (boot === "login") {
    return (
      <AdminShell>
        <h1 className="text-5xl">Admin</h1>
        <AuthForm action="/api/auth/login" submit="Sign in" onDone={refreshMe} />
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-5xl">Admin</h1>
          <p className="mt-1 font-semibold">{me?.name}</p>
        </div>
        <button
          type="button"
          className="cta cta-mail"
          style={{ minHeight: "44px" }}
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
            setMe(null)
            setBoot("login")
          }}
        >
          Sign out
        </button>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === tab ? "admin-tab admin-tab-on" : "admin-tab"}
            onClick={() => {
              setTab(item.id)
              setNote("")
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {note ? <p className="mt-4 font-semibold text-gold">{note}</p> : null}
      {tab === "site" ? <SiteTab onNote={setNote} /> : null}
      {tab === "requests" ? <RequestsTab onNote={setNote} /> : null}
      {tab === "photos" ? <PhotosTab onNote={setNote} /> : null}
      {tab === "users" ? <UsersTab me={me} onNote={setNote} /> : null}
    </AdminShell>
  )
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6">
      <BrandMark />
      {children}
    </div>
  )
}

function AuthForm({
  action,
  submit,
  onDone,
}: {
  action: string
  submit: string
  onDone: () => void
}) {
  const [error, setError] = useState("")
  return (
    <form
      className="mt-6 flex max-w-md flex-col gap-3"
      onSubmit={async (event) => {
        event.preventDefault()
        setError("")
        const form = new FormData(event.currentTarget)
        try {
          await api(action, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              name: form.get("name"),
              password: form.get("password"),
            }),
          })
          onDone()
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed")
        }
      }}
    >
      <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
        Name
        <input name="name" required className="field-ink" autoComplete="username" />
      </label>
      <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="field-ink"
          autoComplete={submit === "Sign in" ? "current-password" : "new-password"}
        />
      </label>
      <button type="submit" className="cta cta-call w-fit" style={{ minHeight: "44px" }}>
        {submit}
      </button>
      {error ? <p className="font-semibold text-gold">{error}</p> : null}
    </form>
  )
}

function JobFields({
  preset,
  custom,
  onPreset,
  onCustom,
}: {
  preset: string
  custom: string
  onPreset: (value: string) => void
  onCustom: (value: string) => void
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
        Job
        <select className="field-ink" value={preset} onChange={(event) => onPreset(event.target.value)}>
          <option value="">Custom</option>
          {JOB_PRESETS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
        Custom title
        <input
          className="field-ink"
          value={custom}
          onChange={(event) => onCustom(event.target.value)}
          placeholder={preset ? "Optional" : "Required if no preset"}
        />
      </label>
    </div>
  )
}

function SiteTab({ onNote }: { onNote: (n: string) => void }) {
  const [site, setSite] = useState<SiteRow | null>(null)
  const [services, setServices] = useState<ServiceRow[]>([])
  useEffect(() => {
    api<{ site: SiteRow; services: ServiceRow[] }>("/api/admin/site")
      .then((data) => {
        setSite(data.site)
        setServices(data.services)
      })
      .catch((err) => onNote(err.message))
  }, [onNote])
  if (!site) return <p className="mt-6">Loading site…</p>
  const field = (key: keyof SiteRow, label: string, rows = 1) => (
    <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
      {label}
      {rows > 1 ? (
        <textarea
          className="field-ink whitespace-pre-wrap"
          rows={rows}
          value={site[key]}
          onChange={(event) => setSite({ ...site, [key]: event.target.value })}
        />
      ) : (
        <input
          className="field-ink"
          value={site[key]}
          onChange={(event) => setSite({ ...site, [key]: event.target.value })}
        />
      )}
    </label>
  )
  return (
    <form
      className="mt-6 flex max-w-xl flex-col gap-3"
      onSubmit={async (event) => {
        event.preventDefault()
        try {
          await api("/api/admin/site", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ site, services }),
          })
          onNote("Site saved. Public page will pick it up.")
        } catch (err) {
          onNote(err instanceof Error ? err.message : "Save failed")
        }
      }}
    >
      {field("hero_title", "H1", 2)}
      {field("hero_lead", "Lead", 2)}
      {field("about", "About — one sentence per line", 6)}
      {field("joel_name", "Joel name")}
      {field("joel_phone_display", "Joel phone")}
      {field("joel_cta", "Joel CTA")}
      {field("ahren_name", "Ahren name")}
      {field("ahren_phone_display", "Ahren phone")}
      {field("ahren_cta", "Ahren CTA")}
      {field("email", "Email")}
      {field("spanish", "Hablamos")}
      {field("cta_secondary", "Email CTA")}
      {field("quote_heading", "Quote heading")}
      {field("quote_submit", "Quote submit")}
      {field("quote_photos", "Quote photos label")}
      {field("quote_helper", "Quote helper")}
      <h2 className="mt-4 text-4xl">Services</h2>
      {services.map((row, index) => (
        <div key={`${row.slug}-${index}`} className="flex flex-col gap-2 bg-card p-3 ring-1 ring-gold/40">
          <input
            className="field-ink"
            value={row.name}
            onChange={(event) => {
              const next = [...services]
              next[index] = { ...row, name: event.target.value }
              setServices(next)
            }}
          />
          <input
            className="field-ink"
            value={row.line}
            onChange={(event) => {
              const next = [...services]
              next[index] = { ...row, line: event.target.value }
              setServices(next)
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="admin-mini"
              onClick={() => {
                if (index === 0) return
                const next = [...services]
                ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
                setServices(next)
              }}
            >
              Up
            </button>
            <button
              type="button"
              className="admin-mini"
              onClick={() => {
                if (index === services.length - 1) return
                const next = [...services]
                ;[next[index + 1], next[index]] = [next[index], next[index + 1]]
                setServices(next)
              }}
            >
              Down
            </button>
            <button
              type="button"
              className="admin-mini"
              onClick={() => setServices(services.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="cta cta-mail w-fit"
        style={{ minHeight: "44px" }}
        onClick={() =>
          setServices([
            ...services,
            { slug: `service-${services.length + 1}`, name: "New service", line: "Write the line." },
          ])
        }
      >
        Add service
      </button>
      <button type="submit" className="cta cta-call w-fit" style={{ minHeight: "44px" }}>
        Save site
      </button>
    </form>
  )
}

function RequestsTab({ onNote }: { onNote: (n: string) => void }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const load = useCallback(() => {
    api<{ leads: Lead[] }>("/api/admin/leads")
      .then((data) => setLeads(data.leads))
      .catch((err) => onNote(err.message))
  }, [onNote])
  useEffect(() => {
    load()
  }, [load])
  return (
    <div className="mt-6 flex flex-col gap-4">
      {leads.length === 0 ? <p className="font-medium text-mute">No requests yet.</p> : null}
      {leads.map((lead) => (
        <article
          key={lead.id}
          className={`bg-card p-4 ring-1 ${lead.status === "unread" ? "ring-gold" : "ring-gold/30"}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className={lead.status === "unread" ? "font-bold" : "font-medium"}>{lead.name}</p>
              <p className="text-sm text-mute">{lead.created_at}</p>
            </div>
            <select
              className="field-ink w-auto min-h-11"
              value={lead.status}
              onChange={async (event) => {
                const status = event.target.value as Lead["status"]
                try {
                  await api("/api/admin/leads", {
                    method: "PATCH",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ id: lead.id, status }),
                  })
                  setLeads(leads.map((row) => (row.id === lead.id ? { ...row, status } : row)))
                } catch (err) {
                  onNote(err instanceof Error ? err.message : "Status failed")
                }
              }}
            >
              <option value="unread">unread</option>
              <option value="read">read</option>
            </select>
          </div>
          <p className="mt-3 text-sm">
            {lead.phone ? (
              <a href={`tel:${lead.phone.replace(/\D/g, "")}`} className="underline decoration-gold">
                {lead.phone}
              </a>
            ) : (
              "No phone"
            )}
            {" · "}
            {lead.email ? (
              <a href={`mailto:${lead.email}`} className="underline decoration-gold">
                {lead.email}
              </a>
            ) : (
              "No email"
            )}
            {lead.job ? ` · ${lead.job}` : ""}
          </p>
          <p className="mt-2 whitespace-pre-line">{lead.need}</p>
          {(lead.photos && lead.photos.length ? lead.photos : lead.photo_key ? [`/api/media/lead/${lead.id}`] : []).map(
            (src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="mt-3 max-h-64 w-auto ring-1 ring-gold/40"
              />
            ),
          )}
        </article>
      ))}
    </div>
  )
}

function PhotosTab({ onNote }: { onNote: (n: string) => void }) {
  const [photos, setPhotos] = useState<PhotoRow[]>([])
  const [pairs, setPairs] = useState<PairRow[]>([])
  const load = useCallback(() => {
    Promise.all([
      api<{ photos: PhotoRow[] }>("/api/admin/photos"),
      api<{ pairs: PairRow[] }>("/api/admin/comparisons"),
    ])
      .then(([photoData, pairData]) => {
        setPhotos(photoData.photos)
        setPairs(pairData.pairs)
      })
      .catch((err) => onNote(err.message))
  }, [onNote])
  useEffect(() => {
    load()
  }, [load])
  async function saveOrder(next: PhotoRow[]) {
    setPhotos(next)
    await api("/api/admin/photos", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ order: next.map((photo) => photo.id) }),
    })
  }
  return (
    <div className="mt-6 flex max-w-xl flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-4xl">Work photos</h2>
        <p className="text-sm text-mute">
          Public stack only shows a photo that has a picture. Pick a card job or type a custom title. Do
          not invent titles.
        </p>
        <form
          className="flex flex-col gap-3 bg-card p-4 ring-1 ring-gold/40"
          onSubmit={async (event) => {
            event.preventDefault()
            const form = event.currentTarget
            try {
              await api("/api/admin/photos", { method: "POST", body: new FormData(form) })
              form.reset()
              onNote("Photo added.")
              load()
            } catch (err) {
              onNote(err instanceof Error ? err.message : "Upload failed")
            }
          }}
        >
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
            Add photo
            <input name="file" type="file" accept="image/*" required className="field-ink py-2" />
          </label>
          <select name="job_preset" className="field-ink" defaultValue="">
            <option value="">Custom</option>
            {JOB_PRESETS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <input name="job_custom" className="field-ink" placeholder="Custom title if needed" />
          <button type="submit" className="cta cta-call w-fit" style={{ minHeight: "44px" }}>
            Upload
          </button>
        </form>
        {photos.map((photo, index) => (
          <figure key={photo.id} className="overflow-hidden bg-card ring-1 ring-gold/40">
            {photo.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo.src} alt={photo.caption} className="h-auto w-full" />
            ) : null}
            <figcaption className="flex flex-col gap-2 border-t border-gold/40 p-3">
              <JobFields
                preset={photo.job_preset}
                custom={photo.job_custom}
                onPreset={(value) => {
                  const next = [...photos]
                  next[index] = { ...photo, job_preset: value }
                  setPhotos(next)
                }}
                onCustom={(value) => {
                  const next = [...photos]
                  next[index] = { ...photo, job_custom: value }
                  setPhotos(next)
                }}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="admin-mini"
                  onClick={async () => {
                    await api("/api/admin/photos", {
                      method: "PATCH",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({
                        id: photo.id,
                        job_preset: photo.job_preset,
                        job_custom: photo.job_custom,
                      }),
                    })
                    onNote("Title saved.")
                  }}
                >
                  Save title
                </button>
                <button
                  type="button"
                  className="admin-mini"
                  onClick={() => {
                    if (index === 0) return
                    const next = [...photos]
                    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
                    saveOrder(next).catch((err) => onNote(err.message))
                  }}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="admin-mini"
                  onClick={() => {
                    if (index === photos.length - 1) return
                    const next = [...photos]
                    ;[next[index + 1], next[index]] = [next[index], next[index + 1]]
                    saveOrder(next).catch((err) => onNote(err.message))
                  }}
                >
                  Down
                </button>
                <button
                  type="button"
                  className="admin-mini"
                  onClick={async () => {
                    await api(`/api/admin/photos?id=${photo.id}`, { method: "DELETE" })
                    load()
                  }}
                >
                  Remove
                </button>
              </div>
            </figcaption>
          </figure>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-4xl">Comparisons</h2>
        <p className="text-sm text-mute">
          Optional. Upload a real Before and a real After. Stays off until Visible is on. Do not invent a
          pair.
        </p>
        <form
          className="flex flex-col gap-3 bg-card p-4 ring-1 ring-gold/40"
          onSubmit={async (event) => {
            event.preventDefault()
            const form = event.currentTarget
            try {
              await api("/api/admin/comparisons", { method: "POST", body: new FormData(form) })
              form.reset()
              onNote("Pair added. Toggle Visible when you want it on the public site.")
              load()
            } catch (err) {
              onNote(err instanceof Error ? err.message : "Upload failed")
            }
          }}
        >
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
            Before
            <input name="before" type="file" accept="image/*" required className="field-ink py-2" />
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.16em]">
            After
            <input name="after" type="file" accept="image/*" required className="field-ink py-2" />
          </label>
          <select name="job_preset" className="field-ink" defaultValue="">
            <option value="">Custom</option>
            {JOB_PRESETS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <input name="job_custom" className="field-ink" placeholder="Custom title if needed" />
          <button type="submit" className="cta cta-call w-fit" style={{ minHeight: "44px" }}>
            Upload pair
          </button>
        </form>
        {pairs.map((pair) => (
          <figure key={pair.id} className="overflow-hidden bg-card ring-1 ring-gold/40">
            <div className="grid grid-cols-2 gap-px bg-gold/40">
              {pair.before_src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pair.before_src} alt="" className="h-auto w-full bg-card" />
              ) : null}
              {pair.after_src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pair.after_src} alt="" className="h-auto w-full bg-card" />
              ) : null}
            </div>
            <figcaption className="flex flex-col gap-2 p-3">
              <JobFields
                preset={pair.job_preset}
                custom={pair.job_custom}
                onPreset={(value) =>
                  setPairs(pairs.map((row) => (row.id === pair.id ? { ...row, job_preset: value } : row)))
                }
                onCustom={(value) =>
                  setPairs(pairs.map((row) => (row.id === pair.id ? { ...row, job_custom: value } : row)))
                }
              />
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={Boolean(pair.visible)}
                  disabled={!pair.before_src || !pair.after_src}
                  onChange={async (event) => {
                    try {
                      await api("/api/admin/comparisons", {
                        method: "PATCH",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ id: pair.id, visible: event.target.checked }),
                      })
                      setPairs(
                        pairs.map((row) =>
                          row.id === pair.id ? { ...row, visible: event.target.checked ? 1 : 0 } : row,
                        ),
                      )
                    } catch (err) {
                      onNote(err instanceof Error ? err.message : "Could not toggle")
                    }
                  }}
                />
                Visible on public site
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="admin-mini"
                  onClick={async () => {
                    await api("/api/admin/comparisons", {
                      method: "PATCH",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({
                        id: pair.id,
                        job_preset: pair.job_preset,
                        job_custom: pair.job_custom,
                      }),
                    })
                    onNote("Title saved.")
                  }}
                >
                  Save title
                </button>
                <button
                  type="button"
                  className="admin-mini"
                  onClick={async () => {
                    await api(`/api/admin/comparisons?id=${pair.id}`, { method: "DELETE" })
                    load()
                  }}
                >
                  Remove
                </button>
              </div>
            </figcaption>
          </figure>
        ))}
      </section>
    </div>
  )
}

function UsersTab({ me, onNote }: { me: Admin | null; onNote: (n: string) => void }) {
  const [users, setUsers] = useState<UserRow[]>([])
  const load = useCallback(() => {
    api<{ users: UserRow[] }>("/api/admin/users")
      .then((data) => setUsers(data.users))
      .catch((err) => onNote(err.message))
  }, [onNote])
  useEffect(() => {
    load()
  }, [load])
  return (
    <div className="mt-6 flex max-w-md flex-col gap-6">
      <ul className="flex flex-col gap-2">
        {users.map((user) => (
          <li key={user.id} className="flex items-center justify-between gap-3 bg-card p-3 ring-1 ring-gold/40">
            <span className="font-semibold">{user.name}</span>
            <button
              type="button"
              className="admin-mini"
              onClick={async () => {
                try {
                  const data = await api<{ users: UserRow[] }>(`/api/admin/users?id=${user.id}`, {
                    method: "DELETE",
                  })
                  setUsers(data.users)
                } catch (err) {
                  onNote(err instanceof Error ? err.message : "Cannot remove")
                }
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form
        className="flex flex-col gap-3"
        onSubmit={async (event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          try {
            const data = await api<{ users: UserRow[] }>("/api/admin/users", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                name: form.get("name"),
                password: form.get("password"),
              }),
            })
            event.currentTarget.reset()
            setUsers(data.users)
            onNote("Admin added.")
          } catch (err) {
            onNote(err instanceof Error ? err.message : "Add failed")
          }
        }}
      >
        <h2 className="text-4xl">Add admin</h2>
        <input name="name" required className="field-ink" placeholder="Name" />
        <input name="password" type="password" required minLength={8} className="field-ink" placeholder="Password" />
        <button type="submit" className="cta cta-call w-fit" style={{ minHeight: "44px" }}>
          Add
        </button>
      </form>
      <form
        className="flex flex-col gap-3"
        onSubmit={async (event) => {
          event.preventDefault()
          const form = new FormData(event.currentTarget)
          try {
            await api("/api/admin/users", {
              method: "PATCH",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                current: form.get("current"),
                password: form.get("password"),
              }),
            })
            event.currentTarget.reset()
            onNote(`Password changed for ${me?.name}.`)
          } catch (err) {
            onNote(err instanceof Error ? err.message : "Password failed")
          }
        }}
      >
        <h2 className="text-4xl">Your password</h2>
        <input name="current" type="password" required className="field-ink" placeholder="Current password" />
        <input name="password" type="password" required minLength={8} className="field-ink" placeholder="New password" />
        <button type="submit" className="cta cta-mail w-fit" style={{ minHeight: "44px" }}>
          Change password
        </button>
      </form>
    </div>
  )
}
