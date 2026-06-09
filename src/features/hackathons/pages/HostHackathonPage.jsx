
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import Container from "../../../components/common/Container";
import SectionTitle from "../../../components/common/SectionTitle";
import Button from "../../../components/ui/Button";

import HostStep1BasicInfo from "../components/HostStep1BasicInfo";
import HostStep2Timeline from "../components/HostStep2Timeline";
import HostStep3Competition from "../components/HostStep3Competition";
import HostStep4Review from "../components/HostStep4Review";

import {
  setStep,
  updateFormData,
  setErrors,
  setSubmitting,
  resetForm,
} from "../redux/hostSlice";
import { createHackathon, validateHostForm } from "../services/hackathonService";

export default function HostHackathonPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { step, totalSteps, formData, errors, isSubmitting } = useSelector(
    (state) => state.host
  );

  const handleNext = () => {
    if (step < totalSteps) {
      dispatch(setStep(step + 1));
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      dispatch(setStep(step - 1));
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    try {
      dispatch(setSubmitting(true));

      const validation = validateHostForm(formData);
      if (!validation.success) {
        dispatch(setErrors(validation.errors));
        window.scrollTo(0, 0);
        return;
      }

      const hackathon = createHackathon(formData, user.id);
      dispatch(resetForm());
      navigate(`/workspace/${hackathon.slug}/overview`);
    } catch (error) {
      dispatch(setErrors({ root: error.message }));
      window.scrollTo(0, 0);
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <SectionTitle>Host a Hackathon</SectionTitle>
            <p className="text-slate-400 mt-4">
              Create and manage your own hackathon on HackSync. Follow the steps below to get started.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8 flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all ${
                  i < step ? "bg-blue-600" : i === step ? "bg-blue-400" : "bg-slate-700"
                }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {errors.root && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
              <p className="text-red-200 text-sm">{errors.root}</p>
            </div>
          )}

          {/* Form Steps */}
          <div className="bg-slate-900 rounded-lg border border-slate-800 p-8">
            {step === 1 && <HostStep1BasicInfo />}
            {step === 2 && <HostStep2Timeline />}
            {step === 3 && <HostStep3Competition />}
            {step === 4 && <HostStep4Review onSubmit={handleSubmit} />}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="mt-8 flex gap-4 justify-between">
                <Button
                  onClick={handlePrevious}
                  disabled={step === 1}
                  variant="outline"
                >
                  ← Previous
                </Button>

                <div className="text-sm text-slate-400 flex items-center">
                  Step {step} of {totalSteps}
                </div>

                <Button onClick={handleNext}>
                  Next →
                </Button>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center text-slate-400 text-sm">
            <p>Need help? Check out our <a href="#" className="text-blue-400 hover:text-blue-300">documentation</a> or <a href="#" className="text-blue-400 hover:text-blue-300">contact support</a></p>
          </div>
        </div>
      </Container>
    </div>
  );
}
