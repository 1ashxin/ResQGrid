export default function FAQCard({
  question,
  answer,
}) {
  return (
    <div className="card-glass rounded-3xl p-7 transition-all duration-300 hover:border-white/20 hover:shadow-lg">

      <h3 className="text-xl font-semibold text-primary">
        {question}
      </h3>

      <p className="mt-4 leading-7 text-secondary">
        {answer}
      </p>

    </div>
  );
}