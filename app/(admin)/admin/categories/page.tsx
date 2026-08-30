import { AdminManagementPage } from "@/components/admin/admin-management-page";
import { adminSections } from "@/data/admin-content";

export default function AdminCategoriesPage() {
  return <AdminManagementPage section={adminSections.categories} />;
}
