import type { Metadata } from "next";
import Image from "next/image";
import { 
  Code2, 
  GraduationCap, 
  MapPin, 
  Cpu
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "About the Architecture",
  description: "Meet the engineering team behind the stadium solution.",
};

const SKILLS = [
  {
    category: "Languages & Core",
    items: ["JavaScript", "TypeScript", "Python", "Java", "C++", "SQL"],
  },
  {
    category: "Frameworks & Web",
    items: ["Next.js", "React", "Node.js", "Tailwind CSS", "Django", "Spring Boot"],
  },
  {
    category: "AI & Specialized",
    items: ["Retrieval Systems", "Web3 Integration", "Unreal Engine (IGDA)", "PWA Automation"],
  },
];


export default function DeveloperPage() {
  return (
    <>
      {/* Header section with radial background */}
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[radial-gradient(ellipse_at_top_right,_var(--accent-subtle),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_var(--accent-subtle),_transparent_50%)]">
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-5 blur-[100px]" />
        
        <div className="mx-auto max-w-5xl px-4 py-20 lg:px-8 text-center custom-fade-in">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)] drop-shadow-sm mb-6">
            {/* PLACEHOLDER: Page Tag */}
            Meet the Architect
          </p>
          <div className="mx-auto flex justify-center mb-6 relative group">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--positive)] opacity-50 blur group-hover:opacity-75 transition duration-300" />
            <Image 
              src="/developer_avatar.png" 
              alt="Developer Avatar" 
              width={128}
              height={128}
              unoptimized
              className="relative size-32 rounded-full border-2 border-[var(--border-strong)] bg-surface shadow-lg object-cover"
            />
          </div>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-fg lg:text-6xl">
            {/* PLACEHOLDER: Page Title */}
            The <span className="text-[var(--accent)]">Developer</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-fg-muted leading-relaxed">
            {/* PLACEHOLDER: Page Description */}
            Engineering student at a premium institute in Delhi, India. Lead Developer of CrowdFifaX, specializing in building privacy-first local applications, 
            interactive full-stack architectures, and AI-grounded telemetry engines.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            {/* Links removed for anonymity */}
          </div>
        </div>
      </section>

      {/* Main Content Layout - Bento Box Grid */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Card 1: Core Profile Info */}
          <ScrollReveal delayMs={100} className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg">
                <GraduationCap className="size-5 text-[var(--accent)]" />
              </span>
              <h2 className="text-xl font-bold text-fg">Background & Vision</h2>
            </div>
            <p className="text-fg-muted leading-relaxed mb-4">
              {/* PLACEHOLDER: Vision Paragraph 1 */}
              Currently an engineering student at a premium institute in Delhi, India. 
              My research interests lie at the intersection of web frameworks, systems, and algorithms.
            </p>
            <p className="text-fg-muted leading-relaxed">
              {/* PLACEHOLDER: Vision Paragraph 2 */}
              In building CrowdFifaX, my priority was creating a highly interactive interface that remains completely transparent. By implementing a local-only database and deterministic equation metrics, we provide users with high-integrity telemetry logs that never violate their data privacy.
            </p>
          </ScrollReveal>

          {/* Card 2: Quick Specs (Education/Location) */}
          <ScrollReveal delayMs={200} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg">
                <MapPin className="size-5 text-[var(--accent)]" />
              </span>
              <h2 className="text-xl font-bold text-fg">Vital Stats</h2>
            </div>
            
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 text-fg-subtle shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-fg">Location</h4>
                  <p className="text-xs text-fg-muted">{/* PLACEHOLDER: Stat */}New Delhi, India</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <GraduationCap className="size-4 text-fg-subtle shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-fg">Education</h4>
                  <p className="text-xs text-fg-muted">{/* PLACEHOLDER: Stat */}Engineering Institute, Delhi</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Cpu className="size-4 text-fg-subtle shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-fg">Core Focus</h4>
                  <p className="text-xs text-fg-muted">{/* PLACEHOLDER: Stat */}Full-Stack, Web3, & AI Core</p>
                </div>
              </li>
            </ul>
          </ScrollReveal>

          {/* Card 3: Skills & Tech Arsenal */}
          <ScrollReveal delayMs={300} className="md:col-span-3 group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)]">
            <div className="flex items-center gap-3 mb-8">
              <span className="flex size-10 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg">
                <Code2 className="size-5 text-[var(--accent)]" />
              </span>
              <h2 className="text-xl font-bold text-fg">Technical Arsenal</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {SKILLS.map((skillGroup) => (
                <div key={skillGroup.category} className="rounded-2xl border border-[var(--border-faint)] bg-surface px-5 py-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-3">
                    {skillGroup.category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skillGroup.items.map((item) => (
                      <span key={item} className="rounded-md border border-[var(--border-faint)] bg-surface-2 px-2 py-1 text-xs font-medium text-fg">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>


        </div>
      </section>
    </>
  );
}
