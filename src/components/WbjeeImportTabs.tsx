
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Props {
  tab: string;
  setTab: (tab: string) => void;
  csvText: string;
  setCsvText: (t: string) => void;
  handleCsvChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  jsonText: string;
  setJsonText: (t: string) => void;
  currentOption: any;
}

const csvPlaceholder = `Paste CSV (comma, tab, or 2+ spaces as separator). If names have commas, use quotes. Example:
college_id,branch_id,domicile,category,opening_rank,closing_rank
"Cooch Behar Government Engineering College, Cooch Behar",Civil Engineering,Home State,OBC-A,31464,37544`;

const WbjeeImportTabs: React.FC<Props> = ({
  tab, setTab,
  csvText, handleCsvChange,
  jsonText, setJsonText,
  currentOption
}) => (
  <Tabs value={tab} onValueChange={setTab}>
    <TabsList className="mb-2">
      <TabsTrigger value="csv">Paste CSV</TabsTrigger>
      <TabsTrigger value="json">Paste JSON</TabsTrigger>
      <TabsTrigger value="example">Show Example</TabsTrigger>
    </TabsList>
    <TabsContent value="csv">
      <textarea
        className="w-full min-h-[180px] font-mono rounded border px-2 py-1"
        value={csvText}
        onChange={handleCsvChange}
        placeholder={csvPlaceholder}
      />
      <div className="text-xs text-gray-500 mt-1">
        Columns should be separated by <b>comma, tab, or at least two spaces</b>. For names containing commas, enclose the value in quotes.<br />
        <b>Tip:</b> Export using Excel/Sheets' CSV to guarantee correct formatting, or double-check delimiters in your pasted data.
      </div>
    </TabsContent>
    <TabsContent value="json">
      <textarea
        className="w-full min-h-[180px] font-mono rounded border px-2 py-1"
        value={jsonText}
        onChange={e => setJsonText(e.target.value)}
        placeholder={`Paste a JSON array of objects like [{"college_id":"...", ...}]`}
      />
    </TabsContent>
    <TabsContent value="example">
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
        {JSON.stringify(currentOption?.example, null, 2)}
      </pre>
    </TabsContent>
  </Tabs>
);

export default WbjeeImportTabs;
