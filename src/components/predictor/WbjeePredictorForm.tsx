
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WbjeePredictorFormProps {
  onPredict: (form: { rank: string; category: string; domicile: string }) => void;
  loading?: boolean;
}

const categories = [
  { value: "GENERAL", label: "General" },
  { value: "OBC-A", label: "OBC-A" },
  { value: "OBC-B", label: "OBC-B" },
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
  { value: "EWS", label: "EWS" },
  { value: "PWD", label: "PWD" },
];

const domiciles = [
  { value: "Home State", label: "Home State (West Bengal)" },
  { value: "All India", label: "All India (Other States)" },
];

export default function WbjeePredictorForm({ onPredict, loading }: WbjeePredictorFormProps) {
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("");
  const [domicile, setDomicile] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rank && category && domicile) {
      onPredict({ rank, category, domicile });
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>WBJEE College Predictor</CardTitle>
        <p className="text-sm text-gray-600">
          Based on WBJEE 2024 cutoff data
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rank">Your WBJEE Rank *</Label>
            <Input
              id="rank"
              type="number"
              placeholder="Enter your rank (e.g., 15000)"
              value={rank}
              onChange={e => setRank(e.target.value)}
              min="1"
              max="200000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your WBJEE rank (1 to ~2,00,000)
            </p>
          </div>

          <div>
            <Label>Category *</Label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full rounded px-3 py-2 border border-gray-300 mt-1"
            >
              <option value="">Select category</option>
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>Domicile *</Label>
            <select
              value={domicile}
              onChange={e => setDomicile(e.target.value)}
              className="w-full rounded px-3 py-2 border border-gray-300 mt-1"
            >
              <option value="">Select domicile</option>
              {domiciles.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <Button
            disabled={!rank || !category || !domicile || loading}
            type="submit"
            className="w-full"
          >
            {loading ? "Predicting..." : "Show Eligible Colleges"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
