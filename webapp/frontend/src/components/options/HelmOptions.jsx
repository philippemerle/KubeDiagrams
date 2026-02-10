import { OUTPUT_FORMAT_LIST } from '../../utils/constants.js';
import { TooltipIcon } from '../common/Tooltip.jsx';
import { outputFormatTooltip, extraArgsHelmTooltip } from '../../utils/tooltipContent.jsx';

function HelmOptions({ outputFormat, setOutputFormat, extraArgs, setExtraArgs }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Output Format */}
        <div className="flex-1">
          <label className="block text-sm mb-1 text-white flex items-center gap-2">
            Output Format
            <TooltipIcon content={outputFormatTooltip()} />
          </label>
          <select
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
          >
            {OUTPUT_FORMAT_LIST.map((format) => (
              <option key={format} value={format}>
                {format.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* CLI args for helm-diagrams */}
        <div className="flex-[2]">
          <label className="block text-sm mb-1 text-white flex items-center gap-2">
            CLI args (optional)
            <TooltipIcon content={extraArgsHelmTooltip()} />
          </label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="ex: --set replicas=3 --include-crds"
            value={extraArgs}
            onChange={(e) => setExtraArgs(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default HelmOptions;
