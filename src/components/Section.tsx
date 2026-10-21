import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  icon: string;
  children: ReactNode;
}

export default function Section({ title, icon, children }: SectionProps) {
  return (
    <section className="animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">{icon}</span>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}