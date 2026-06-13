"use client";

import { useRouter } from "next/navigation";

interface Group {
  id: number;
  name: string;
}

export default function QuestionGroupFilter({
  groups,
  currentGroupId,
  placeholder,
}: {
  groups: Group[];
  currentGroupId?: number;
  placeholder?: string;
}) {
  const router = useRouter();

  return (
    <select
      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      value={currentGroupId?.toString() || ""}
      onChange={(e) => {
        if (e.target.value) {
          router.push(`/enter/questions?questionGroupId=${e.target.value}`);
        }
      }}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {groups.map((g) => (
        <option key={g.id} value={g.id}>
          {g.name}
        </option>
      ))}
    </select>
  );
}
