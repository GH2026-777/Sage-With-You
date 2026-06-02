import { Link } from "react-router";
import { BRAND_ASSETS, SITE_BRAND_LABEL } from "../../lib/brand";

export function AuthBrandHeader() {
  return (
    <div className="flex justify-center border-b border-gray-100 px-6 pt-6 pb-4">
      <Link to="/">
        <img src={BRAND_ASSETS.full} alt={SITE_BRAND_LABEL} className="h-28 w-auto" />
      </Link>
    </div>
  );
}
