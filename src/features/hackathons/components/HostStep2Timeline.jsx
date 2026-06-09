import { useDispatch, useSelector } from "react-redux";
import { updateFormData } from "../redux/hostSlice";

export default function HostStep2Timeline() {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.host);

  const handleDateChange = (field, value) => {
    dispatch(updateFormData({ [field]: new Date(value) }));
  };

  const formatDateTimeLocal = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-6">
      <p className="text-slate-400 text-sm">
        Set the timeline for registration, submissions, and judging.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Registration Opens *
          </label>
          <input
            type="datetime-local"
            value={formatDateTimeLocal(formData.registrationStart)}
            onChange={(e) =>
              handleDateChange("registrationStart", e.target.value)
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Registration Closes *
          </label>
          <input
            type="datetime-local"
            value={formatDateTimeLocal(formData.registrationEnd)}
            onChange={(e) =>
              handleDateChange("registrationEnd", e.target.value)
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Submission Opens *
          </label>
          <input
            type="datetime-local"
            value={formatDateTimeLocal(formData.submissionStart)}
            onChange={(e) =>
              handleDateChange("submissionStart", e.target.value)
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Submission Closes *
          </label>
          <input
            type="datetime-local"
            value={formatDateTimeLocal(formData.submissionEnd)}
            onChange={(e) =>
              handleDateChange("submissionEnd", e.target.value)
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Judging Opens *
          </label>
          <input
            type="datetime-local"
            value={formatDateTimeLocal(formData.judgingStart)}
            onChange={(e) =>
              handleDateChange("judgingStart", e.target.value)
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Judging Closes *
          </label>
          <input
            type="datetime-local"
            value={formatDateTimeLocal(formData.judgingEnd)}
            onChange={(e) =>
              handleDateChange("judgingEnd", e.target.value)
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Timezone *</label>
          <select
            value={formData.timezone}
            onChange={(e) => dispatch(updateFormData({ timezone: e.target.value }))}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          >
            <option value="UTC">UTC</option>
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
            <option value="Asia/Dubai">Asia/Dubai (GST)</option>
            <option value="Europe/London">Europe/London (GMT/BST)</option>
            <option value="US/Eastern">US/Eastern (EST/EDT)</option>
            <option value="US/Central">US/Central (CST/CDT)</option>
            <option value="US/Pacific">US/Pacific (PST/PDT)</option>
            <option value="Australia/Sydney">Australia/Sydney (AEDT)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Max Participants *
          </label>
          <input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) =>
              dispatch(updateFormData({ maxParticipants: parseInt(e.target.value) }))
            }
            min={10}
            max={10000}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
          <p className="text-xs text-slate-500 mt-1">10 - 10000</p>
        </div>
      </div>
    </div>
  );
}
