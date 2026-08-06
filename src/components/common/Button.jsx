export default function Button({
  children,
  variant = "primary",
  onClick,
}) {
  const styles = {
    primary:
      "bg-red-600 hover:bg-red-700 text-white",

    secondary:
      "bg-blue-600 hover:bg-blue-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${styles[variant]} px-7 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105`}
    >
      {children}
    </button>
  );
}