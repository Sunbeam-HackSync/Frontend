import { useDispatch, useSelector } from "react-redux";
import { updateFormData } from "../redux/hostSlice";
import Button from "../../../components/ui/Button";

export default function HostStep3Competition() {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.host);

  const addTrack = () => {
    dispatch(
      updateFormData({
        tracks: [...formData.tracks, ""],
      })
    );
  };

  const removeTrack = (index) => {
    dispatch(
      updateFormData({
        tracks: formData.tracks.filter((_, i) => i !== index),
      })
    );
  };

  const updateTrack = (index, value) => {
    const newTracks = [...formData.tracks];
    newTracks[index] = value;
    dispatch(updateFormData({ tracks: newTracks }));
  };

  const addRule = () => {
    dispatch(
      updateFormData({
        rules: [...formData.rules, ""],
      })
    );
  };

  const removeRule = (index) => {
    dispatch(
      updateFormData({
        rules: formData.rules.filter((_, i) => i !== index),
      })
    );
  };

  const updateRule = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    dispatch(updateFormData({ rules: newRules }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Min Team Size *
          </label>
          <input
            type="number"
            value={formData.minTeamSize}
            onChange={(e) =>
              dispatch(
                updateFormData({ minTeamSize: parseInt(e.target.value) })
              )
            }
            min={1}
            max={20}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
          <p className="text-xs text-slate-500 mt-1">1 - 20</p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Max Team Size *
          </label>
          <input
            type="number"
            value={formData.maxTeamSize}
            onChange={(e) =>
              dispatch(
                updateFormData({ maxTeamSize: parseInt(e.target.value) })
              )
            }
            min={1}
            max={20}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
          />
          <p className="text-xs text-slate-500 mt-1">1 - 20</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Prize Pool *</label>
        <input
          type="text"
          value={formData.prizePool}
          onChange={(e) =>
            dispatch(updateFormData({ prizePool: e.target.value }))
          }
          placeholder="e.g., Rs. 4,00,000 or $5,000 or No Prize"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
        />
        <p className="text-xs text-slate-500 mt-1">Any format is acceptable</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-semibold">Tracks * (At least 1)</label>
          <Button onClick={addTrack} variant="secondary" size="sm">
            + Add Track
          </Button>
        </div>

        {formData.tracks.length === 0 ? (
          <p className="text-slate-400 text-sm italic">
            No tracks added yet. Click "Add Track" to create one.
          </p>
        ) : (
          <div className="space-y-3">
            {formData.tracks.map((track, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={track}
                  onChange={(e) => updateTrack(index, e.target.value)}
                  placeholder={`Track ${index + 1}`}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  maxLength={100}
                />
                <button
                  onClick={() => removeTrack(index)}
                  className="px-4 py-3 bg-red-900 hover:bg-red-800 rounded-lg transition font-semibold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-semibold">Rules * (At least 1)</label>
          <Button onClick={addRule} variant="secondary" size="sm">
            + Add Rule
          </Button>
        </div>

        {formData.rules.length === 0 ? (
          <p className="text-slate-400 text-sm italic">
            No rules added yet. Click "Add Rule" to create one.
          </p>
        ) : (
          <div className="space-y-3">
            {formData.rules.map((rule, index) => (
              <div key={index}>
                <div className="flex gap-2">
                  <textarea
                    value={rule}
                    onChange={(e) => updateRule(index, e.target.value)}
                    placeholder={`Rule ${index + 1}`}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-none"
                    rows={2}
                  />
                  <button
                    onClick={() => removeRule(index)}
                    className="px-4 py-3 bg-red-900 hover:bg-red-800 rounded-lg transition font-semibold shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
