import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Briefcase,
  Music,
  Zap,
  Target,
  ShoppingCart,
  BookOpen,
  Mail,
  AlertCircle,
} from "lucide-react";
import { useOnboarding } from "./context";
import { useState } from "react";

const CATEGORIES = [
  { id: "creator", label: "Content Creator", icon: Zap },
  { id: "business", label: "Small Business", icon: Briefcase },
  { id: "artist", label: "Artist/Musician", icon: Music },
  { id: "professional", label: "Professional", icon: Users },
];

const GOALS = [
  { id: "grow", label: "Grow my audience", icon: Users },
  { id: "sell", label: "Sell products/services", icon: ShoppingCart },
  { id: "portfolio", label: "Share my portfolio", icon: BookOpen },
  { id: "email", label: "Collect emails", icon: Mail },
  { id: "monetize", label: "Monetize content", icon: Target },
];

export default function Step2Category() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [selectedCategory, setSelectedCategory] = useState(data.category);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.goals);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId],
    );
  };

  const handleNext = () => {
    updateData({
      category: selectedCategory,
      goals: selectedGoals,
    });
    nextStep();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">What describes you best?</h2>
        <p className="text-foreground/70">
          This helps us suggest the right features and templates for you.
        </p>
      </div>

      {/* Category Selection */}
      <div className="space-y-3">
        <h3 className="font-semibold">Category</h3>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleCategoryChange(id)}
              className={`rounded-lg border-2 p-4 text-left transition ${
                selectedCategory === id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Icon className="h-6 w-6 text-primary mb-2" />
              <p className="font-medium text-sm">{label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Goals Selection */}
      <div className="space-y-3">
        <h3 className="font-semibold">What are your goals?</h3>
        <p className="text-sm text-foreground/70">Select all that apply</p>
        <div className="space-y-2">
          {GOALS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleGoalToggle(id)}
              className={`w-full rounded-lg border p-3 flex items-center gap-3 text-left transition ${
                selectedGoals.includes(id)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedGoals.includes(id)}
                onChange={() => {}}
                className="h-5 w-5 cursor-pointer"
              />
              <Icon className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="flex-1 font-medium text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Validation */}
      {!selectedCategory && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          Please select a category to continue.
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={!selectedCategory}
          className="flex-1"
        >
          Next: Add Links
        </Button>
      </div>
    </div>
  );
}
