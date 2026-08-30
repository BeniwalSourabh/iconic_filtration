import { AdminManagementPage } from "@/components/admin/admin-management-page";
import { adminSections } from "@/data/admin-content";

export default function AdminCaseStudiesPage() {
  return <AdminManagementPage section={adminSections["case-studies"]} />;
}
