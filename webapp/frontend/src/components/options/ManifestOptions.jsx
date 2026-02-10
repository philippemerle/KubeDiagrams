import { OUTPUT_FORMAT_LIST } from '../../utils/constants.js';
import { TooltipIcon } from '../common/Tooltip.jsx';
import {
  outputFormatTooltip,
  extraArgsTooltip,
  withoutNamespaceTooltip,
} from '../../utils/tooltipContent.jsx';

function ManifestOptions({
  outputFormat,
  setOutputFormat,
  extraArgs,
  setExtraArgs,
  withoutNamespace,
  setWithoutNamespace,
}) {
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

        {/* CLI args */}
        <div className="flex-[2]">
          <label className="block text-sm mb-1 text-white flex items-center gap-2">
            CLI args (optional)
            <TooltipIcon content={extraArgsTooltip()} />
          </label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="ex: --some-flag=value"
            value={extraArgs}
            onChange={(e) => setExtraArgs(e.target.value)}
          />
        </div>
      </div>

      {/* Without Namespace Checkbox displayed only if wihoutNamespace exist */}
      {withoutNamespace !== undefined && setWithoutNamespace && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="withoutNamespace"
            checked={withoutNamespace}
            onChange={(e) => setWithoutNamespace(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="withoutNamespace"
            className="text-sm text-white cursor-pointer flex items-center gap-2"
          >
            Generate without namespace (--without-namespace)
            <TooltipIcon content={withoutNamespaceTooltip()} />
          </label>
        </div>
      )}
    </div>
  );
}

export default ManifestOptions;
