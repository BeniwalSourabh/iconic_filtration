import Link from "next/link";
import { revalidatePath } from "next/cache";
import { CalendarClock, Eye, EyeOff, Package, Plus, RotateCcw, Tags } from "lucide-react";
import type { PublishStatus } from "@prisma/client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { requireAdminSession } from "@/lib/auth/session";
import { hasMinimumRole } from "@/lib/auth/permissions";
import { getPrisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

async function setProductArchived(formData: FormData) {
  "use server";

  const session = await requireAdminSession();

  if (!hasMinimumRole(session.user.roles, "EDITOR")) {
    return;
  }

  const productId = String(formData.get("productId") ?? "");
  const shouldArchive = String(formData.get("archive") ?? "") === "true";

  if (!productId) {
    return;
  }

  const prisma = getPrisma();
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      isActive: true,
    },
  });

  if (!product) {
    revalidatePath("/admin/products");
    return;
  }

  const nextStatus: PublishStatus = shouldArchive ? "ARCHIVED" : "DRAFT";

  await prisma.product.update({
    where: { id: productId },
    data: {
      status: nextStatus,
      isActive: !shouldArchive,
      updatedById: session.user.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: shouldArchive ? "product.archive" : "product.restore",
      entityType: "Product",
      entityId: product.id,
      metadata: {
        name: product.name,
        slug: product.slug,
        previousStatus: product.status,
        previousActive: product.isActive,
        nextStatus,
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
}

export default async function AdminProductsPage() {
  const prisma = getPrisma();
  const [products, totalProducts, publishedProducts, archivedProducts, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
      take: 100,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        images: {
          where: { isPrimary: true },
          take: 1,
          select: {
            url: true,
            altText: true,
          },
        },
        specifications: {
          select: { id: true },
        },
        downloadLinks: {
          select: { downloadId: true },
        },
      },
    }),
    prisma.product.count(),
    prisma.product.count({ where: { status: "PUBLISHED", isActive: true } }),
    prisma.product.count({ where: { status: "ARCHIVED" } }),
    prisma.productCategory.count(),
  ]);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Products"
        description="Live product records from PostgreSQL. Archive false or outdated products without deleting quote history."
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft"
          >
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        }
      />

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <article className="rounded-lg border bg-card p-5 shadow-soft">
          <Package className="h-5 w-5 text-iconic-cyan" />
          <p className="mt-4 text-xs font-semibold uppercase text-slate-500">Total products</p>
          <p className="mt-1 font-heading text-3xl font-semibold text-iconic-navy">{totalProducts}</p>
        </article>
        <article className="rounded-lg border bg-card p-5 shadow-soft">
          <Eye className="h-5 w-5 text-iconic-green" />
          <p className="mt-4 text-xs font-semibold uppercase text-slate-500">Published</p>
          <p className="mt-1 font-heading text-3xl font-semibold text-iconic-navy">{publishedProducts}</p>
        </article>
        <article className="rounded-lg border bg-card p-5 shadow-soft">
          <EyeOff className="h-5 w-5 text-amber-600" />
          <p className="mt-4 text-xs font-semibold uppercase text-slate-500">Archived</p>
          <p className="mt-1 font-heading text-3xl font-semibold text-iconic-navy">{archivedProducts}</p>
        </article>
        <article className="rounded-lg border bg-card p-5 shadow-soft">
          <Tags className="h-5 w-5 text-iconic-cyan" />
          <p className="mt-4 text-xs font-semibold uppercase text-slate-500">Categories</p>
          <p className="mt-1 font-heading text-3xl font-semibold text-iconic-navy">{categories}</p>
        </article>
      </div>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="font-heading text-2xl font-semibold text-iconic-navy">Product Records</h2>
          <p className="mt-1 text-sm text-muted-foreground">Use archive for false, duplicate, or discontinued products.</p>
        </div>

        <div className="overflow-hidden rounded-lg border bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-background text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Assets</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-background/70">
                    <td className="px-4 py-4 align-top">
                      <div className="font-semibold text-iconic-navy">{product.name}</div>
                      <div className="mt-1 text-xs text-slate-500">/{product.slug}</div>
                      {product.sku ? <div className="mt-1 text-xs text-slate-500">SKU: {product.sku}</div> : null}
                    </td>
                    <td className="px-4 py-4 align-top text-slate-700">{product.category.name}</td>
                    <td className="px-4 py-4 align-top">
                      <AdminStatusBadge>{product.isActive ? product.status : "INACTIVE"}</AdminStatusBadge>
                    </td>
                    <td className="px-4 py-4 align-top text-slate-700">
                      <div>{product.images.length ? "Primary image set" : "No primary image"}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {product.specifications.length} specs, {product.downloadLinks.length} downloads
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-slate-700">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-iconic-cyan" />
                        {formatDate(product.updatedAt)}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="inline-flex h-9 items-center justify-center rounded-md border bg-white px-3 text-sm font-semibold text-iconic-blue"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="inline-flex h-9 items-center justify-center rounded-md border bg-white px-3 text-sm font-semibold text-iconic-blue"
                        >
                          Edit
                        </Link>
                        <form action={setProductArchived}>
                          <input type="hidden" name="productId" value={product.id} />
                          <input type="hidden" name="archive" value={product.status === "ARCHIVED" ? "false" : "true"} />
                          <button
                            type="submit"
                            className={
                              product.status === "ARCHIVED"
                                ? "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 text-sm font-semibold text-green-700"
                                : "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 text-sm font-semibold text-amber-700"
                            }
                          >
                            {product.status === "ARCHIVED" ? <RotateCcw className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            {product.status === "ARCHIVED" ? "Restore" : "Archive"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
