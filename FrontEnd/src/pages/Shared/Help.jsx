import DashboardLayout from "../../layouts/DashboardLayout";
import FAQCard from "../../components/help/FAQCard";

export default function Help() {

  const faqs = [
    {
      id: 1,
      question: "How do I submit an SOS request?",
      answer:
        "Go to the Victim Dashboard and fill in the SOS Request form with your emergency details.",
    },
    {
      id: 2,
      question: "How can I volunteer?",
      answer:
        "Register as an individual volunteer or through an NGO and complete your profile.",
    },
    {
      id: 3,
      question: "Can I track my request?",
      answer:
        "Yes. All requests appear in your dashboard and History page.",
    },
    {
      id: 4,
      question: "Who receives my SOS?",
      answer:
        "Nearby volunteers and registered NGOs receive your request based on priority.",
    },
  ];

  return (
    <DashboardLayout>

      <section className="mx-auto max-w-6xl">

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-primary">
            Help Center
          </h1>

          <p className="mt-2 text-secondary">
            Frequently asked questions and support resources.
          </p>

        </div>

        <div className="space-y-5">

          {faqs.map((faq) => (

            <FAQCard
              key={faq.id}
              {...faq}
            />

          ))}

        </div>

      </section>

    </DashboardLayout>
  );
}