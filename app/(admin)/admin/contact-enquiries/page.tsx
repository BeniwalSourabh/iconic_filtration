import { revalidatePath } from "next/cache";
import { CalendarClock, Mail, MessageSquareText, Phone, Trash2, UserRound } from "lucide-react";
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

async function deleteContactEnquiry(formData: FormData) {
  "use server";

  const session = await requireAdminSession();
  const contactEnquiryId = String(formData.get("contactEnquiryId") ?? "");

  if (!contactEnquiryId) {
    return;
  }

  const prisma = getPrisma();
  const contactEnquiry = await prisma.contactEnquiry.findUnique({
    where: { id: contactEnquiryId },
    select: {
      id: true,
      publicId: true,
      email: true,
      name: true,
    },
  });

  if (!contactEnquiry) {
    revalidatePath("/admin/contact-enquiries");
    return;
  }

  await prisma.contactEnquiry.delete({
    where: { id: contactEnquiryId },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "contact_enquiry.delete",
      entityType: "ContactEnquiry",
      entityId: contactEnquiry.id,
      metadata: {
        publicId: contactEnquiry.publicId,
        email: contactEnquiry.email,
        name: contactEnquiry.name,
      },
    },
  });

  revalidatePath("/admin/contact-enquiries");
}

export default async function AdminContactEnquiriesPage() {
  const prisma = getPrisma();
  const [contactEnquiries, totalEnquiries, newEnquiries] = await Promise.all([
    prisma.contactEnquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        industry: true,
        assignedTo: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.contactEnquiry.count(),
    prisma.contactEnquiry.count({ where: { status: "NEW" } }),
  ]);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Leads"
        title="Contact Enquiries"
        description="Live contact messages submitted from the public contact form."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <article className="rounded-lg border bg-card p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase text-slate-500">Total messages</p>
          <p className="mt-2 font-heading text-3xl font-semibold text-iconic-navy">{totalEnquiries}</p>
          <p className="mt-1 text-xs text-muted-foreground">stored in PostgreSQL</p>
        </article>
        <article className="rounded-lg border bg-card p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase text-slate-500">New messages</p>
          <p className="mt-2 font-heading text-3xl font-semibold text-iconic-navy">{newEnquiries}</p>
          <p className="mt-1 text-xs text-muted-foreground">awaiting follow-up</p>
        </article>
        <article className="rounded-lg border bg-card p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase text-slate-500">Latest view</p>
          <p className="mt-2 font-heading text-3xl font-semibold text-iconic-navy">{contactEnquiries.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">most recent records shown</p>
        </article>
        <article className="rounded-lg border bg-card p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase text-slate-500">Source</p>
          <p className="mt-2 font-heading text-3xl font-semibold text-iconic-navy">Website</p>
          <p className="mt-1 text-xs text-muted-foreground">contact form</p>
        </article>
      </div>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="font-heading text-2xl font-semibold text-iconic-navy">Recent Enquiries</h2>
          <p className="mt-1 text-sm text-muted-foreground">Newest contact messages appear first.</p>
        </div>

        {contactEnquiries.length ? (
          <div className="grid gap-4">
            {contactEnquiries.map((enquiry) => (
              <article key={enquiry.id} className="rounded-lg border bg-card p-5 shadow-soft">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-heading text-xl font-semibold text-iconic-navy">{enquiry.name}</h3>
                      <AdminStatusBadge>{enquiry.status}</AdminStatusBadge>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-iconic-blue">{textOrFallback(enquiry.subject, "General enquiry")}</p>
                    <p className="mt-1 text-sm text-slate-600">{textOrFallback(enquiry.company, "No company name")}</p>
                  </div>
                  <div className="text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-iconic-cyan" />
                      {formatDate(enquiry.createdAt)}
                    </div>
                    <form action={deleteContactEnquiry} className="mt-3 flex justify-end">
                      <input type="hidden" name="contactEnquiryId" value={enquiry.id} />
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
                    <p className="mt-2 break-words text-sm text-slate-700">{enquiry.email}</p>
                  </div>
                  <div className="rounded-md border bg-background p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                      <Phone className="h-4 w-4" />
                      Phone
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{textOrFallback(enquiry.phone)}</p>
                  </div>
                  <div className="rounded-md border bg-background p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                      <MessageSquareText className="h-4 w-4" />
                      Source
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{enquiry.source}</p>
                  </div>
                  <div className="rounded-md border bg-background p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                      <UserRound className="h-4 w-4" />
                      Assigned
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      {enquiry.assignedTo?.name ?? enquiry.assignedTo?.email ?? "Unassigned"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-md border bg-background p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">Message</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{enquiry.message}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-8 text-center shadow-soft">
            <h2 className="font-heading text-xl font-semibold text-iconic-navy">No contact enquiries yet</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              New messages from the public contact form will appear here after visitors submit enquiries.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
