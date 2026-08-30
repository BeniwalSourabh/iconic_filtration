import { AdminManagementPage } from "@/components/admin/admin-management-page";
import { adminSections } from "@/data/admin-content";

export default function AdminBlogsPage() {
  return <AdminManagementPage section={adminSections.blogs} />;
}
