import Image from "next/image";
import Link from "next/link";

interface VendorHeaderProps {
  vendorName: string;
  vendorLogo: string;
  activeTab: string;
}

export default function VendorHeader({
  vendorName,
  vendorLogo,
  activeTab,
}: VendorHeaderProps) {
  const tabs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Inventory", href: "/inventory" },
    { label: "Settings", href: "/settings" },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        {/* Left side - Vendor logo and name */}
        <div className="flex items-center gap-4">
          {/* DaisyUI: avatar component */}
          <div className="avatar">
            <div className="w-16 h-16 rounded-full ring ring-[#21C1B9] ring-offset-base-100 ring-offset-2">
              <Image
                src={vendorLogo}
                alt={`${vendorName} logo`}
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              {vendorName}
            </h2>
          </div>
        </div>

        {/* Right side - Navigation tabs */}
        <div className="flex gap-2">
          {/* DaisyUI: tabs component styled as buttons */}
          {tabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`btn ${
                activeTab === tab.label
                  ? "bg-gradient-to-r from-[#21C1B9] to-[#1A71D5] text-white font-medium hover:from-[#1DB1A9] hover:to-[#1565C0] border-none"
                  : "btn-ghost hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
