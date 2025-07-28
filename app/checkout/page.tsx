import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { getCartItems } from "@/lib/actions/cart_actions";
import CheckoutContent from "./CheckoutContent";

export default async function CheckoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const cartItems = await getCartItems();

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <CheckoutContent cartItems={cartItems} />
      </main>
    </div>
  );
}
