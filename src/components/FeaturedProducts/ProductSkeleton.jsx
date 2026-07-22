export default function ProductSkeleton({
  isDarkMode,
  count = 4,
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`
            animate-pulse
            rounded-3xl
            overflow-hidden
            border
            transition-all
            duration-300
            p-5

            ${
              isDarkMode
                ? "border-slate-800 bg-slate-900"
                : "border-slate-200 bg-white shadow-sm"
            }
          `}
        >
          {/* Image */}
          <div
            className={`
              mb-5
              h-52
              rounded-2xl

              ${
                isDarkMode
                  ? "bg-slate-800"
                  : "bg-slate-200"
              }
            `}
          />

          {/* Title */}
          <div
            className={`
              mb-3
              h-5
              w-3/4
              rounded-lg

              ${
                isDarkMode
                  ? "bg-slate-800"
                  : "bg-slate-200"
              }
            `}
          />

          {/* Subtitle */}
          <div
            className={`
              mb-5
              h-4
              w-1/2
              rounded-lg

              ${
                isDarkMode
                  ? "bg-slate-800"
                  : "bg-slate-200"
              }
            `}
          />

          {/* Price */}
          <div
            className={`
              h-6
              w-24
              rounded-lg

              ${
                isDarkMode
                  ? "bg-slate-700"
                  : "bg-slate-300"
              }
            `}
          />
        </div>
      ))}
    </div>
  );
}