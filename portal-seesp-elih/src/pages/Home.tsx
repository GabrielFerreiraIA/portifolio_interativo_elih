import { useMemo, useState } from "react";
import { Hero } from "../components/Hero";
import { FlyerCarousel } from "../components/FlyerCarousel";
import { PlanGrid } from "../components/PlanGrid";
import { WhyElih } from "../components/WhyElih";
import { CotacaoSection } from "../components/CotacaoSection";
import { plans } from "../data/plans";
import { emptyFilter, hasAnyFilter, rankPlans, type FilterState } from "../lib/filter";

export function Home() {
  const [filter, setFilter] = useState<FilterState>(emptyFilter);
  const filtered = hasAnyFilter(filter);
  const ranked = useMemo(() => rankPlans(plans, filter), [filter]);

  return (
    <>
      <Hero />
      <div id="beneficios">
        <FlyerCarousel
          plans={ranked}
          filtered={filtered}
          filter={filter}
          setFilter={setFilter}
        />
        <PlanGrid plans={ranked} filtered={filtered} />
      </div>
      <WhyElih />
      <CotacaoSection />
    </>
  );
}
