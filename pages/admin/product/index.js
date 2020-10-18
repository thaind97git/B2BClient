import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import AdminProductManagementComponent from "../../../component/AdminProductManagementComponent.js";

export default function Home() {
  return (
    <AdminLayout>
      <AdminProductManagementComponent />
    </AdminLayout>
  );
}
