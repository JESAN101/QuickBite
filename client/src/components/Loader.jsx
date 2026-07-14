 const Loader = ({ fullScreen = false, label = "Loading" }) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-[3px] border-[#EADFC8]" />
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-[#D64933]" />
      </div>
      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-medium text-[#3A2A20]/60">
        {label}…
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FFFBF3]/90 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center py-16">{spinner}</div>;
};

export default Loader;