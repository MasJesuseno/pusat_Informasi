import Link from "next/link";

interface ArticleCardProps {
  id: number;
  title: string;
  hoverColor?: string;
}

export default function ArticleCard({ id, title, hoverColor = "#4f46e5" }: ArticleCardProps) {
  const hex = (hoverColor || "#4f46e5").replace(/^#/, "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const hoverBg = `rgba(${r}, ${g}, ${b}, 0.04)`;
  const hoverBorder = `rgba(${r}, ${g}, ${b}, 0.3)`;
  const hoverText = hoverColor;

  const cardClass = `hcard-${id}`;

  return (
    <>
      <style>{`
        .${cardClass}:hover {
          background-color: ${hoverBg};
          border-color: ${hoverBorder};
        }
        .${cardClass}:hover .hcard-title {
          color: ${hoverText};
        }
      `}</style>
      <Link href={`/articles/${id}`} className="block group">
        <div className={`${cardClass} bg-white rounded-lg border border-gray-200 px-4 py-3 hover:shadow-sm transition-all duration-200`}>
          <h3 className="text-sm font-medium text-gray-900 hcard-title transition-colors truncate">{title}</h3>
        </div>
      </Link>
    </>
  );
}
