import type { FC } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  ListChecks,
  Save,
} from "lucide-react";
import Button from "@/components/ui/Button";
import ShoppingBagMark from "@/components/ui/ShoppingBagMark";

interface WelcomePageProps {
  catalogReady: boolean;
  error: string;
  onEnter: () => void;
  onRetry: () => void;
}

const benefits = [
  {
    icon: ListChecks,
    title: "Guided in four steps",
    description: "Choose only what fits your home.",
  },
  {
    icon: BadgeDollarSign,
    title: "Clear, live pricing",
    description: "See totals and savings as you build.",
  },
  {
    icon: Save,
    title: "Save and return",
    description: "Pick up exactly where you left off.",
  },
] as const;

const WelcomePage: FC<WelcomePageProps> = ({
  catalogReady,
  error,
  onEnter,
  onRetry,
}) => (
  <main className="relative isolate flex min-h-screen items-center overflow-hidden bg-surface px-5 py-12 sm:px-8">
    <div className="absolute -top-32 -left-32 -z-10 h-80 w-80 rounded-full bg-review-surface blur-3xl" />
    <div className="absolute -right-32 -bottom-32 -z-10 h-96 w-96 rounded-full bg-brand-soft blur-3xl" />

    <section className="mx-auto flex w-full max-w-4xl flex-col items-center text-center motion-safe:animate-welcome-reveal">
      <ShoppingBagMark />

      <p className="mt-7 font-body text-eyebrow font-semibold tracking-eyebrow text-brand uppercase">
        A better way to build your bundle
      </p>
      <h1 className="mt-3 max-w-2xl font-heading text-4xl leading-tight font-semibold text-foreground-strong sm:text-6xl">
        Security shopping, made simple.
      </h1>
      <p className="mt-5 max-w-xl font-body text-base leading-7 text-foreground-muted sm:text-lg">
        Build a system around your home, your routine, and your budget. We’ll
        keep every choice, quantity, and saving clear along the way.
      </p>

      <div className="mt-9 grid w-full gap-3 text-left sm:grid-cols-3">
        {benefits.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className="flex items-start gap-3 rounded-panel border border-border bg-review-surface p-4"
          >
            <span className="rounded-control bg-surface p-2 text-brand">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <span>
              <strong className="block font-heading text-body font-semibold text-foreground">
                {title}
              </strong>
              <span className="mt-1 block font-body text-caption text-foreground-muted">
                {description}
              </span>
            </span>
          </article>
        ))}
      </div>

      <div className="mt-8 flex min-h-20 flex-col items-center gap-3">
        {error ? (
          <>
            <p className="font-body text-body text-promotion" role="alert">
              We couldn’t prepare your options. Please try again.
            </p>
            <Button onClick={onRetry} variant="outline">
              Try again
            </Button>
          </>
        ) : (
          <>
            <Button
              className="gap-2 px-8"
              disabled={!catalogReady}
              onClick={onEnter}
              size="lg"
            >
              {catalogReady
                ? "Build my security system"
                : "Preparing your experience…"}
              {catalogReady && (
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              )}
            </Button>
            <p
              className="font-body text-caption text-foreground-subtle"
              role="status"
            >
              {catalogReady
                ? "Your personalized builder is ready."
                : "Loading your product options in the background…"}
            </p>
          </>
        )}
      </div>
    </section>
  </main>
);

export default WelcomePage;
