import Link from "next/link";

interface GroupTranslation {
  locale: string;
  name: string;
}

interface GroupData {
  id: number;
  status?: string;
  translations: GroupTranslation[];
}

interface CategoryBoxProps {
  group: GroupData;
  locale: string;
  hoverColor?: string;
}

export default function CategoryBox({ group, locale, hoverColor = "#4f46e5" }: CategoryBoxProps) {
  const groupName = group.translations.find(t => t.locale === locale)?.name || group.translations[0]?.name || "";

  const hex = (hoverColor || "#4f46e5").replace(/^#/, "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const hoverBg = `rgba(${r}, ${g}, ${b}, 0.05)`;
  const hoverBorder = hoverColor;
  const hoverIconBg = `rgba(${r}, ${g}, ${b}, 0.15)`;
  const hoverText = hoverColor;

  const cardClass = `hcat-${group.id}`;

  return (
    <>
      <style>{`
        .${cardClass}:hover {
          background-color: ${hoverBg};
          border-color: ${hoverBorder};
        }
        .${cardClass}:hover .hcat-icon {
          background-color: ${hoverIconBg};
        }
        .${cardClass}:hover .hcat-title {
          color: ${hoverText};
        }
      `}</style>
      <div className="relative">
        {group.status === "INTERNAL" && (
          <div className="absolute top-0 right-0 z-10">
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-bl-lg rounded-tr-lg border-b border-l border-yellow-200">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Internal
            </span>
          </div>
        )}
      <Link
        href={`/search?groupId=${group.id}`}
        className={`${cardClass} bg-white rounded-lg border p-4 hover:shadow-md transition-all group flex items-center gap-3 ${group.status === "INTERNAL" ? "border-yellow-200 hover:border-yellow-300 bg-yellow-50/30" : "border-gray-200"}`}
      >
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0 hcat-icon transition-colors">
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 hcat-title transition-colors leading-tight truncate">{groupName}</h3>
      </Link>
      </div>
    </>
  );
}
