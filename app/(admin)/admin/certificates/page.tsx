import { AdminManagementPage } from "@/components/admin/admin-management-page";
import { adminSections } from "@/data/admin-content";

export default function AdminCertificatesPage() {
  return <AdminManagementPage section={adminSections.certificates} />;
}
