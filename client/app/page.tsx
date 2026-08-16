import Marketplace from "./marketplace";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <Marketplace />
    </Suspense>
  );
}
