import { MARKET_DATA, type IndexData } from "../config/data";

/**
 * Rebased month-end path (% change since 30 June) for the simplified chart.
 *
 *  - 30 Jun  : 0 % (verified start level)
 *  - 31 Jul  : derived from the supplied July return
 *  - 31 Aug  : derived from the supplied July + August returns
 *  - 30 Sep  : the VERIFIED end level (not derived)
 *
 * No other points are drawn. The chart is labelled as a simplified editorial
 * visualisation and only the verified start/end levels are printed.
 */
export function rebasedMonthEndPath(index: IndexData, key: "nifty" | "sensex") {
  const [jul, aug] = MARKET_DATA.monthly;
  const r1 = 1 + jul[key].value / 100;
  const r2 = r1 * (1 + aug[key].value / 100);
  const endPct = (index.end.level / index.start.level - 1) * 100;
  return [0, (r1 - 1) * 100, (r2 - 1) * 100, endPct];
}
