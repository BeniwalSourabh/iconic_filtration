import { revalidatePath } from "next/cache";
import { CalendarClock, Mail, MapPin, Paperclip, Phone, Trash2, UserRound } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { requireAdminSession } from "@/lib/auth/session";
import { getPrisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function textOrFallback(value: string | null | undefined, fallback = "Not provided") {
  return value?.trim() ? value : fallback;
}

function parseAttachments(value: string | null) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as Array<{ kind?: string; name?: string; url?: string }>;

    return parsed.filter((attachment) => attachment.name && attachment.url);
  } catch {
    return [{ kind: "attachment", name: "Quote attachment", url: value }];
  }
}

async function deleteQuoteRequest(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const quoteRequestId = String(formData.get("quoteRequestId") ?? "");

  if (!quoteRequestId) {
    return;
  }

  const prisma = getPrisma();
  const quoteRequest = await prisma.quoteRequest.findUnique({
    where: { id: quoteRequestId },
    select: {
      id: true,
      publicId: true,
      email: true,
      name: true,
    },
  });

  if (!quoteRequest) {
    revalidatePath("/admin/quote-requests");
    return;
  }

  await prisma.quoteRequest.delete({
    where: { id: quoteRequestId },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "quote_request.delete",
      entityType: "QuoteRequest",
      entityId: quoteRequest.id,
      metadata: {
        publicId: quoteRequest.publicId,
        email: quoteRequest.email,
        name: quoteRequest.name,
      },
    },
  });

  revalidatePath("/admin/quote-requests");
}

export default async function AdminQuoteRequestsPage() {
  const prisma = getPrisma();
  const [quoteRequests, totalRequests, newRequests] = await Promise.all([
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        items: true,
        productCategory: true,
        industry: true,
        assignedTo: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: "NEW" } }),
  ]);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Leads"
        title="Quote Requests"
        description="Live technical quote requests submitted from the public request quote form."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <article className="rounded-lg border bg-card p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase text-slate-500">Total requests</p>
          <p className="mt-2 font-heading text-3xl font-semibold text-iconic-navy">{totalRequests}</p>
          <p className="mt-1 text-xs text-muted-foreground">stored in PostgreSQL</p>
        </article>
        <article className="rounded-lg border bg-card p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase text-slate-500">New requests</p>
          <p className="mt-2 font-heading text-3xl font-semibold text-iconic-navy">{newRequests}</p>
          <p className="mt-1 text-xs text-muted-foreground">awaiting sales follow-up</p>
        </article>
        <article className="rounded-lg border bg-card p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase text-slate-500">Latest view</p>
          <p className="mt-2 font-heading text-3xl font-semibold text-iconic-navy">{quoteRequests.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">most recent records shown</p>
        </article>
        <article className="rounded-lg border bg-card p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase text-slate-500">Source</p>
          <p className="mt-2 font-heading text-3xl font-semibold text-iconic-navy">Website</p>
          <p className="mt-1 text-xs text-muted-foreground">request quote form</p>
        </article>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-iconic-navy">Recent Requests</h2>
            <p className="mt-1 text-sm text-muted-foreground">Newest quote enquiries appear first.</p>
          </div>
        </div>

        {quoteRequests.length ? (
          <div className="grid gap-4">
            {quoteRequests.map((request) => {
              const productInterest =
                request.items.map((item) => item.productName).filter(Boolean).join(", ") ||
                request.productCategory?.name ||
                "General requirement";
              const location = [request.city, request.state, request.country].filter(Boolean).join(", ");
              const attachments = parseAttachments(request.attachmentUrl);

              return (
                <article key={request.id} className="rounded-lg border bg-card p-5 shadow-soft">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-heading text-xl font-semibold text-iconic-navy">{request.name}</h3>
                        <AdminStatusBadge>{request.status}</AdminStatusBadge>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-iconic-blue">{productInterest}</p>
                      <p className="mt-1 text-sm text-slate-600">{textOrFallback(request.company, "No company name")}</p>
                    </div>
                    <div className="text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-iconic-cyan" />
                        {formatDate(request.createdAt)}
                      </div>
                      <form action={deleteQuoteRequest} className="mt-3 flex justify-end">
                        <input type="hidden" name="quoteRequestId" value={request.id} />
                        <button
                          type="submit"
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete false entry
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-md border bg-background p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                      <p className="mt-2 break-words text-sm text-slate-700">{request.email}</p>
                    </div>
                    <div className="rounded-md border bg-background p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                        <Phone className="h-4 w-4" />
                        Phone
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{request.phone}</p>
                    </div>
                    <div className="rounded-md border bg-background p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                        <MapPin className="h-4 w-4" />
                        Location
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{textOrFallback(location)}</p>
                    </div>
                    <div className="rounded-md border bg-background p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                        <UserRound className="h-4 w-4" />
                        Assigned
                      </div>
                      <p className="mt-2 text-sm text-slate-700">
                        {request.assignedTo?.name ?? request.assignedTo?.email ?? "Unassigned"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Application</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">{textOrFallback(request.application)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Capacity / Flow</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">{textOrFallback(request.capacity)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Timeline</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">{textOrFallback(request.timeline)}</p>
                    </div>
                  </div>

                  {request.message ? (
                    <div className="mt-5 rounded-md border bg-background p-4">
                      <p className="text-xs font-semibold uppercase text-slate-500">Requirement details</p>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{request.message}</p>
                    </div>
                  ) : null}

                  {attachments.length ? (
                    <div className="mt-5 rounded-md border bg-background p-4">
                      <p className="text-xs font-semibold uppercase text-slate-500">Attachments</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {attachments.map((attachment) => (
                          <a
                            key={`${attachment.kind}-${attachment.url}`}
                            href={attachment.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-iconic-blue hover:text-iconic-cyan"
                          >
                            <Paperclip className="h-4 w-4" />
                            {attachment.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-8 text-center shadow-soft">
            <h2 className="font-heading text-xl font-semibold text-iconic-navy">No quote requests yet</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              New submissions from the public request quote form will appear here after buyers submit their requirements.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
