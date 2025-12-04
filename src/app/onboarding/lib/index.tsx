import { OnboardingProvider, useOnboarding } from "./context";
import Step1Username from "./Step1-Username";
import Step2Category from "./Step2-Category";
import Step3Links from "./Step3-Links";
import Step4Theme from "./Step4-Theme";
import Step5Profile from "./Step5-Profile";

const OnboardingContent = () => {
  const { currentStep } = useOnboarding();

  const steps = [
    { number: 1, title: "Username", component: Step1Username },
    { number: 2, title: "Category", component: Step2Category },
    { number: 3, title: "Links", component: Step3Links },
    { number: 4, title: "Theme", component: Step4Theme },
    { number: 5, title: "Profile", component: Step5Profile },
  ];

  const currentStepData = steps.find((s) => s.number === currentStep);
  const CurrentComponent = currentStepData?.component || Step1Username;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        {/* Progress Indicator */}
        {currentStep <= 5 && (
          <div className="mb-12 space-y-4">
            {/* Step Numbers */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  {/* Step Circle */}
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition ${
                      currentStep >= step.number
                        ? "bg-primary text-white"
                        : "bg-border text-foreground/50"
                    }`}
                  >
                    {step.number}
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition ${
                        currentStep > step.number ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                  </div>
                  ))}
                  </div>

                  {/* Step Labels */}
                  <div className="flex justify-between text-xs">
                  {steps.map((step) => (
                <span
                  key={step.number}
                  className={`font-medium ${
                    currentStep >= step.number
                      ? "text-foreground"
                      : "text-foreground/40"
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <CurrentComponent />
        </div>
      </div>
    </div>
  );
};

export default function Onboarding() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
}
