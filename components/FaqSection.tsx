"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/SectionHeading";

type FaqItem = { question: string; answer: string };

type FaqSectionProps = {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

export function FaqSection({
  items,
  eyebrow = "Support",
  title = "Frequently Asked Questions",
  subtitle = "Find answers to the most common questions about our services, pricing, and shipping processes.",
}: FaqSectionProps) {
  return (
    <>
      <div className="mb-12 max-w-3xl mx-auto">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
        />
      </div>
      <Accordion
        type="single"
        collapsible
        className="max-w-3xl mx-auto card-calm divide-y divide-platinum-light !p-0 overflow-hidden"
      >
        {items.map((faq, index) => (
          <AccordionItem
            key={faq.question}
            value={`faq-${index}`}
            className="border-0 px-6 sm:px-8"
          >
            <AccordionTrigger className="type-card-title text-base sm:text-lg py-6 hover:no-underline hover:text-graphite-mid [&[data-state=open]]:text-graphite-dark">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="type-card-body pb-6 pt-0">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
