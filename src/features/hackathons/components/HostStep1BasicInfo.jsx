import { useDispatch, useSelector } from "react-redux";
import { updateFormData } from "../redux/hostSlice";

export default function HostStep1BasicInfo() {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.host);

  const handleChange = (field, value) => {
    dispatch(updateFormData({ [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">Hackathon Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g., AI Innovation Challenge"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          maxLength={100}
        />
        <p className="text-xs text-slate-500 mt-1">
          {formData.title.length}/100 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Short Description *</label>
        <textarea
          value={formData.shortDescription}
          onChange={(e) => handleChange("shortDescription", e.target.value)}
          placeholder="Brief 1-2 sentence summary"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-none"
          rows={3}
          maxLength={160}
        />
        <p className="text-xs text-slate-500 mt-1">
          {formData.shortDescription.length}/160 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Full Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Detailed description of your hackathon, goals, and expectations"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-none"
          rows={6}
          maxLength={2000}
        />
        <p className="text-xs text-slate-500 mt-1">
          {formData.description.length}/2000 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Mode *</label>
        <select
          value={formData.mode}
          onChange={(e) => handleChange("mode", e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
        >
          <option value="Online">Online</option>
          <option value="Hybrid">Hybrid</option>
          <option value="In-Person">In-Person</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Banner URL (Optional)</label>
        <input
          type="url"
          value={formData.bannerUrl}
          onChange={(e) => handleChange("bannerUrl", e.target.value)}
          placeholder="https://example.com/banner.jpg"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
        />
        <p className="text-xs text-slate-500 mt-1">Must be a valid URL (https://...)</p>
      </div>
    </div>
  );
}
