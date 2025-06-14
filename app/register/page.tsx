"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"CUSTOMER" | "VENDOR">("CUSTOMER");

  const [user, setUser] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [business, setBusiness] = useState({
    name: "", email: "", phone: "", address: "", website: "", description: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const body =
      mode === "CUSTOMER"
        ? { name: user.name, email: user.email, password: user.password, role: "CUSTOMER" }
        : {
            name: user.name,
            email: user.email,
            password: user.password,
            role: "VENDOR",
            businessDetails: business,
          };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMessage(
        mode === "CUSTOMER"
          ? "Registration successful! Redirecting to Customer Login..."
          : "Registration successful! Redirecting to Vendor Login..."
      );
      const loginPath = mode === "CUSTOMER" ? "/login/customer" : "/login/vendor";
      setTimeout(() => router.push(loginPath), 2000);
    } else {
      const err = await res.json();
      setError("Registration failed: " + (err.error || "Unknown error"));
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
      <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setMode("CUSTOMER")}
          className={`px-4 py-2 border rounded-l-md ${
            mode === "CUSTOMER"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Customer
        </button>
        <button
          onClick={() => setMode("VENDOR")}
          className={`px-4 py-2 border-t border-b border-r rounded-r-md ${
            mode === "VENDOR"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Vendor
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            required
            onChange={(e) => setUser(f => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            required
            onChange={(e) => setUser(f => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            required
            onChange={(e) => setUser(f => ({ ...f, password: e.target.value }))}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            required
            onChange={(e) => setUser(f => ({ ...f, confirmPassword: e.target.value }))}
          />
        </div>

        {mode === "VENDOR" && (
          <>
            <div className="pt-4 border-t">
              <h2 className="text-lg font-semibold mb-2">Business Info</h2>
            </div>
            {[
              { label: "Business Name", field: "name", required: true },
              { label: "Business Email", field: "email", required: true },
              { label: "Phone", field: "phone" },
              { label: "Address", field: "address" },
              { label: "Website", field: "website" },
              { label: "Description", field: "description", type: "textarea" },
            ].map(({ label, field, required, type }) => (
              <div key={field}>
                <label className="block mb-1 font-medium">{label}</label>
                {type === "textarea" ? (
                  <textarea
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                    onChange={(e) => setBusiness(f => ({ ...f, [field]: e.target.value }))}
                  ></textarea>
                ) : (
                  <input
                    className="w-full px-3 py-2 border rounded-md"
                    required={required}
                    onChange={(e) => setBusiness(f => ({ ...f, [field]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {mode === "CUSTOMER" ? "Register as Customer" : "Register as Vendor"}
        </button>
      </form>

      {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}
