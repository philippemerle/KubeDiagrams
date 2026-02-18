/**
 * Helm Input Component
 * Handles Helm chart URL input and options
 */

import { Info } from 'lucide-react';
import SubmitButton from '../../common/SubmitButton.jsx';
import HelmOptions from '../../options/HelmOptions.jsx';
import ExampleSelector from '../../common/ExampleSelector.jsx';
import { EXAMPLE_TYPES } from '../../../utils/constants.js';
import { TooltipIcon } from '../../common/Tooltip.jsx';
import { chartUrlTooltip } from '../../../utils/tooltipContent.jsx';

function HelmInput({
  chartUrl,
  setChartUrl,
  outputFormat,
  setOutputFormat,
  extraArgs,
  setExtraArgs,
  inputError,
  isSubmitting,
  onSubmit,
  onUrlChange,
}) {
  return (
    <div className="w-full flex flex-col bg-[var(--color-panel)] p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-2xl font-bold">Helm Chart Input</h2>

      <ExampleSelector
        type={EXAMPLE_TYPES.HELM_CHART}
        onSelectExample={setChartUrl}
        onSelectCliArgs={setExtraArgs}
      />

      <div>
        <label className="block text-sm mb-2 text-white flex items-center gap-2">
          Helm Chart URL
          <TooltipIcon content={chartUrlTooltip()} />
        </label>
        <input
          type="text"
          className={`w-full p-4 rounded-lg bg-gray-700 text-white ${inputError ? 'ring-2 ring-red-500' : ''}`}
          placeholder="Paste your chart URL here, i.e., <Helm Chart Repository URL>/<Helm Chart Name>, e.g., https://charts.jetstack.io/cert-manager or oci://ghcr.io/argoproj/argo-helm/argo-cd"
          value={chartUrl}
          onChange={onUrlChange}
        />
      </div>

      {inputError && <p className="text-sm text-red-400 mt-1">{inputError}</p>}

      <HelmOptions
        outputFormat={outputFormat}
        setOutputFormat={setOutputFormat}
        extraArgs={extraArgs}
        setExtraArgs={setExtraArgs}
      />

      <SubmitButton
        onClick={onSubmit}
        className="w-full mt-2"
        disabled={!!inputError || !chartUrl.trim() || isSubmitting}
      >
        {isSubmitting ? 'Generating…' : 'Generate'}
      </SubmitButton>

      {/* Help Message for desactivate buttons*/}
      {(!!inputError || !chartUrl.trim()) && !isSubmitting && (
        <p className="text-sm text-yellow-400 mt-1 flex items-center gap-2">
          <Info className="w-4 h-4" />
          {!chartUrl.trim()
            ? 'Please enter or select a Helm chart URL to generate a diagram'
            : 'Please enter a valid Helm chart URL (https://... or oci://...)'}
        </p>
      )}
    </div>
  );
}

export default HelmInput;
