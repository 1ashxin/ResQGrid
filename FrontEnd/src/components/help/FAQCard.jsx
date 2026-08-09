import { ChevronDown } from "lucide-react";

export default function FAQCard({
  question,
  answer,
}) {
  return (
    <div className="card-glass rounded-2xl p-6">

      <div className="mb-3 flex items-center justify-between">

        <h3 className="font-semibold text-primary">
          {question}
        </h3>

        <ChevronDown
          size={20}
          className="text-secondary"
        />

      </div>

      <p className="text-secondary">
        {answer}
      </p>

    </div>
  );
}