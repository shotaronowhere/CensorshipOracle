// components/Accordion.tsx

import React, { useState } from "react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <div
        className="cursor-pointer px-4 py-2 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-lg font-semibold">{title}</p>
        <span>{isOpen ? "-" : "+"}</span>
      </div>
      {isOpen && (
        <div className="px-4 py-2">
          <div>{children}</div>
        </div>
      )}
    </div>
  );
};

export default Accordion;
