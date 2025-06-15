
import { useWbjeeColleges, useWbjeeBranches, useWbjeeCutoffs } from "@/hooks/useWbjeeColleges";

interface WbjeePredictionResultsProps {
  userRank: number;
  category: string;
  domicile: string;
}

export default function WbjeePredictionResults({ userRank, category, domicile }: WbjeePredictionResultsProps) {
  const { data: colleges, isLoading } = useWbjeeColleges();

  // Basic UI only: Suggest eligible seats at any branch where closing_rank >= userRank, filter by category/domicile
  // In production: add performance optimizations, advanced filters, and round-wise analytics

  if (isLoading) return <div className="py-8 text-center">Loading colleges...</div>;
  if (!colleges?.length) return <div className="py-8 text-center">No WBJEE colleges in database.</div>;

  return (
    <div className="space-y-6 mt-8">
      {colleges.map(college => (
        <WbjeeCollegeResultCard key={college.id} college={college} userRank={userRank} category={category} domicile={domicile} />
      ))}
    </div>
  );
}

// Helper: Display college and eligible branches for given rank
function WbjeeCollegeResultCard({ college, userRank, category, domicile }: any) {
  const { data: branches, isLoading } = useWbjeeBranches(college.id);

  // For demo, show branch and cutoffs where user is eligible
  return (
    <div className="rounded-xl border bg-white p-4 shadow card-hover">
      <h3 className="font-bold mb-2 text-blue-700">{college.name}</h3>
      <p className="mb-1 text-gray-600">Type: {college.type} | Location: {college.location}</p>
      <div className="mt-2">
        {isLoading && <span>Loading branches…</span>}
        {branches && branches.length > 0 ? (
          <table className="w-full text-sm mt-2">
            <thead>
              <tr>
                <th className="text-left">Branch</th>
                <th>Degree</th>
                <th>Seats</th>
                <th>Your Chance</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch: any) => (
                <BranchCutoffRow
                  key={branch.id}
                  branch={branch}
                  collegeId={college.id}
                  userRank={userRank}
                  category={category}
                  domicile={domicile}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 text-xs">No branches.</div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
function BranchCutoffRow({ branch, collegeId, userRank, category, domicile }: any) {
  const { data: cutoffs } = useWbjeeCutoffs({ collegeId, branchId: branch.id });
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    if (!cutoffs) return;
    // Look for same category and domicile, latest year, best round closing rank
    const match = cutoffs
      .filter(
        (c: any) =>
          c.category?.toUpperCase() === category?.toUpperCase() &&
          (!domicile || c.domicile?.toLowerCase() === domicile?.toLowerCase())
      )
      .sort((a: any, b: any) => (b.year - a.year) || (b.round - a.round))[0];
    if (match && match.closing_rank && userRank <= match.closing_rank) {
      setEligible(true);
    } else {
      setEligible(false);
    }
  }, [cutoffs, userRank, category, domicile]);

  if (!cutoffs) return null;
  return (
    <tr className={eligible ? "bg-green-50" : ""}>
      <td>{branch.branch_name}</td>
      <td>{branch.degree}</td>
      <td>{branch.intake || "--"}</td>
      <td>
        {eligible ? (
          <span className="text-green-600 font-semibold">Yes</span>
        ) : (
          <span className="text-gray-500">No</span>
        )}
      </td>
    </tr>
  );
}
