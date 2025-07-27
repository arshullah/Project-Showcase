import { Suspense } from "react";
import BrowseProjectContent from "./BrowseProjectContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowseProjectContent />
    </Suspense>
  );
}
