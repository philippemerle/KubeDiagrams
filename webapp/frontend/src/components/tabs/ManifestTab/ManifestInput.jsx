/**
 * Manifest Input Component
 * Handles manifest content input, file upload, and options
 */

import { Info, Upload } from 'lucide-react';
import SubmitButton from '../../common/SubmitButton.jsx';
import ManifestOptions from '../../options/ManifestOptions';
import ExampleSelector from '../../common/ExampleSelector.jsx';
import { EXAMPLE_TYPES } from '../../../utils/constants.js';

function ManifestInput({
  manifestContent,
  setManifestContent,
  outputFormat,
  setOutputFormat,
  extraArgs,
  setExtraArgs,
  withoutNamespace,
  setWithoutNamespace,
  errorMessage,
  setErrorMessage,
  isSubmitting,
  onSubmit,
  onFileUpload,
}) {
  return (
    <div className="w-full flex flex-col bg-[var(--color-panel)] p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-2xl font-bold">Manifest Input</h2>

      <ExampleSelector type={EXAMPLE_TYPES.MANIFEST} onSelectExample={setManifestContent} />

      <textarea
        className="w-full h-64 p-4 rounded-lg resize-none bg-gray-700 text-white"
        placeholder="Paste your Kubernetes manifest YAML here..."
        value={manifestContent}
        onChange={(e) => {
          setManifestContent(e.target.value);
          if (errorMessage) setErrorMessage('');
        }}
      />

      <label className="text-sm text-white mt-2 flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Or: Upload a Manifest file (.yaml)
      </label>
      <input type="file" accept=".yaml,.yml" className="text-white" onChange={onFileUpload} />

      <ManifestOptions
        outputFormat={outputFormat}
        setOutputFormat={setOutputFormat}
        extraArgs={extraArgs}
        setExtraArgs={setExtraArgs}
        withoutNamespace={withoutNamespace}
        setWithoutNamespace={setWithoutNamespace}
      />

      <SubmitButton
        onClick={onSubmit}
        className="w-full mt-2"
        disabled={!manifestContent.trim() || isSubmitting}
      >
        {isSubmitting ? 'Generating…' : 'Generate'}
      </SubmitButton>

      {/* Help Message */}
      {!manifestContent.trim() && !isSubmitting && (
        <p className="text-sm text-yellow-400 mt-1 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Please paste or select a Kubernetes manifest to generate a diagram
        </p>
      )}
    </div>
  );
}

export default ManifestInput;
