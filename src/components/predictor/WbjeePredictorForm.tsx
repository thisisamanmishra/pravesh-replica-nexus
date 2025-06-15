
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
  { value: "GEN", label: "General" },
  { value: "OBC-A", label: "OBC-A" },
  { value: "OBC-B", label: "OBC-B" },
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
  { value: "EWS", label: "EWS" },
  { value: "PWD", label: "PWD" },
];
const domiciles = [
  { value: "Home", label: "Home State (West Bengal)" },
  { value: "Other", label: "Other State" },
];
export default function WbjeePredictorForm({ onPredict, loading }: WbjeePredictorFormProps) {
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("");
  const [domicile, setDomicile] = useState("");

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>WBJEE College Predictor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label htmlFor="rank">Your WBJEE Rank *</Label>
        <Input
          id="rank"
          type="number"
          placeholder="Enter your rank"
          value={rank}
          onChange={e => setRank(e.target.value)}
        />

        <Label>Category *</Label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full rounded px-3 py-2 border border-gray-300"
        >
          <option value="">Select category</option>
          {categories.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <Label>Domicile *</Label>
        <select
          value={domicile}
          onChange={e => setDomicile(e.target.value)}
          className="w-full rounded px-3 py-2 border border-gray-300"
        >
          <option value="">Select domicile</option>
          {domiciles.map(d => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>

        <Button
          disabled={!rank || !category || !domicile || loading}
          onClick={() => onPredict({ rank, category, domicile })}
          className="w-full"
        >
          {loading ? "Predicting..." : "Show Eligible Colleges"}
        </Button>
      </CardContent>
    </Card>
  );
}
