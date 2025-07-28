import { ReactNode } from "react";
import MiniHero from "./MiniHero";
import VendorHeader from "./VendorHeader";

interface VendorPageLayoutProps {
  pageTitle: string;
  backgroundImage?: string;
  vendorName: string;
  vendorLogo: string;
  activeTab: string;
  sectionTitle: string;
  actionButton?: ReactNode;
  children: ReactNode;
}

export default function VendorPageLayout({
  pageTitle,
  backgroundImage = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop",
  vendorName,
  vendorLogo,
  activeTab,
  sectionTitle,
  actionButton,
  children,
}: VendorPageLayoutProps) {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Mini Hero Section */}
      <MiniHero title={pageTitle} backgroundImage={backgroundImage} />

      {/* Vendor Header with Logo and Tabs */}
      <VendorHeader
        vendorName={vendorName}
        vendorLogo={vendorLogo}
        activeTab={activeTab}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-base-content">
              {sectionTitle}
            </h2>
            {actionButton}
          </div>
          {/* DaisyUI: divider */}
          <div className="divider"></div>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
