import { Suspense } from "react";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md h-80 animate-pulse bg-muted rounded-lg" />
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
