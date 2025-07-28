import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { headers } from "next/headers";
import OrderConfirmationContent from "./OrderConfirmationContent";

export default async function OrderConfirmationPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <OrderConfirmationContent />
      </main>
    </div>
  );
}
