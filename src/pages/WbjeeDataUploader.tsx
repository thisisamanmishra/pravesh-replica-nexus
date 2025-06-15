
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import WbjeeDataImportPanel from "@/components/WbjeeDataImportPanel";
import WbjeeCutoffScraperPanel from "@/components/WbjeeCutoffScraperPanel";

export default function WbjeeDataUploader() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto mt-24 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Admin Access Only</CardTitle>
          </CardHeader>
          <CardContent>
            You must be an admin to use this page.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="max-w-2xl mx-auto my-12 space-y-6">
        <WbjeeDataImportPanel />
        <WbjeeCutoffScraperPanel />
      </div>
    </ProtectedRoute>
  );
}
