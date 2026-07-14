// CategoryCard.jsx
const CategoryCard = ({ category, selectedCategory, setSelectedCategory }) => {
  const active = selectedCategory === category._id;
  const initial = category.name?.charAt(0).toUpperCase();

  return (
    <button
      onClick={() => setSelectedCategory(category._id)}
      className={`flex shrink-0 items-center gap-3 rounded-full border px-5 py-3 transition ${
        active
          ? "border-[#1D1512] bg-[#1D1512] text-[#F7ECD9]"
          : "border-[#EADFC8] bg-[#FFFBF3] text-[#1D1512] hover:border-[#F0A438]/60"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
          active ? "bg-[#F0A438] text-[#1D1512]" : "bg-[#F0A438]/15 text-[#D64933]"
        }`}
      >
        {initial}
      </span>
      <span className="whitespace-nowrap font-['Plus_Jakarta_Sans',sans-serif] font-semibold">
        {category.name}
      </span>
    </button>
  );
};

export default CategoryCard;