import { useSelector } from "react-redux";
import Button from "../../../components/ui/Button";

export default function HostStep4Review({ onSubmit }) {
  const { formData, isSubmitting } = useSelector((state) => state.host);

  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold mb-2">Review Your Hackathon Details</h3>
        <p className="text-slate-400 mb-6">
          Please review all information before submitting. You can go back to edit any section.
        </p>
      </div>

      {/* Basic Info */}
      <div className="border-l-4 border-blue-600 pl-6 space-y-3 bg-blue-900/20 p-4 rounded">
        <h4 className="font-semibold text-blue-400 text-lg">Basic Information</h4>
        <div className="space-y-2">
          <p>
            <span className="text-slate-400">Title:</span>
            <br />
            <span className="text-white font-medium">{formData.title}</span>
          </p>
          <p>
            <span className="text-slate-400">Mode:</span>
            <br />
            <span className="text-white font-medium">{formData.mode}</span>
          </p>
          <p>
            <span className="text-slate-400">Description:</span>
            <br />
            <span className="text-white text-sm">{formData.shortDescription}</span>
          </p>
          <p>
            <span className="text-slate-400">Prize Pool:</span>
            <br />
            <span className="text-white font-medium">{formData.prizePool}</span>
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="border-l-4 border-green-600 pl-6 space-y-3 bg-green-900/20 p-4 rounded">
        <h4 className="font-semibold text-green-400 text-lg">Timeline & Capacity</h4>
        <div className="space-y-2">
          <p>
            <span className="text-slate-400">Registration:</span>
            <br />
            <span className="text-white text-sm">
              {formatDate(formData.registrationStart)} → {formatDate(formData.registrationEnd)}
            </span>
          </p>
          <p>
            <span className="text-slate-400">Submission:</span>
            <br />
            <span className="text-white text-sm">
              {formatDate(formData.submissionStart)} → {formatDate(formData.submissionEnd)}
            </span>
          </p>
          <p>
            <span className="text-slate-400">Judging:</span>
            <br />
            <span className="text-white text-sm">
              {formatDate(formData.judgingStart)} → {formatDate(formData.judgingEnd)}
            </span>
          </p>
          <p>
            <span className="text-slate-400">Timezone:</span>
            <br />
            <span className="text-white font-medium">{formData.timezone}</span>
          </p>
          <p>
            <span className="text-slate-400">Max Participants:</span>
            <br />
            <span className="text-white font-medium">{formData.maxParticipants}</span>
          </p>
        </div>
      </div>

      {/* Competition Details */}
      <div className="border-l-4 border-purple-600 pl-6 space-y-3 bg-purple-900/20 p-4 rounded">
        <h4 className="font-semibold text-purple-400 text-lg">Competition Details</h4>
        <div className="space-y-2">
          <p>
            <span className="text-slate-400">Team Size:</span>
            <br />
            <span className="text-white font-medium">
              {formData.minTeamSize} - {formData.maxTeamSize} members
            </span>
          </p>
          <p>
            <span className="text-slate-400">Tracks ({formData.tracks.length}):</span>
            <br />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tracks.map((track, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-600/50 rounded-full text-sm text-purple-200"
                >
                  {track}
                </span>
              ))}
            </div>
          </p>
          <p>
            <span className="text-slate-400">Rules ({formData.rules.length}):</span>
            <br />
            <ul className="list-disc list-inside mt-2 space-y-1">
              {formData.rules.map((rule, idx) => (
                <li key={idx} className="text-white text-sm">
                  {rule}
                </li>
              ))}
            </ul>
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="bg-blue-900/30 border-2 border-blue-800 rounded-lg p-6 space-y-4">
        <div>
          <p className="text-sm text-slate-300 mb-2 font-semibold">
            ⏳ What happens next?
          </p>
          <p className="text-sm text-slate-300">
            Your hackathon will be created and sent for admin review. You'll receive an email notification once it's approved. Until then, you can manage your hackathon workspace and add team members.
          </p>
        </div>

        <Button
          onClick={onSubmit}
          isLoading={isSubmitting}
          className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          {isSubmitting ? "Creating Hackathon..." : "Create Hackathon"}
        </Button>

        <p className="text-xs text-slate-400 text-center">
          By submitting, you agree to HackSync's Terms of Service and Community Guidelines
        </p>
      </div>
    </div>
  );
}
