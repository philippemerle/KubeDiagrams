import { useState } from 'react';
import { getExamplesByType, loadExampleContent } from '../../examples/registry.js';
import { EXAMPLE_TYPES } from '../../utils/constants.js';
import logger from '../../utils/logger.js';

function ExampleSelector({ type, onSelectExample, onSelectCliArgs }) {
  const [selectedId, setSelectedId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const examples = getExamplesByType(type);

  const handleChange = async (e) => {
    const id = e.target.value;
    setSelectedId(id);

    if (id) {
      setIsLoading(true);
      try {
        const content = await loadExampleContent(type, id);
        // For Helm Charts, the content is an object with url and cliArgs
        if (type === EXAMPLE_TYPES.HELM_CHART && typeof content === 'object') {
          onSelectExample(content.url);
          if (onSelectCliArgs && content.cliArgs) {
            onSelectCliArgs(content.cliArgs);
          }
        } else {
          // For other types, it's just the content string
          onSelectExample(content);
        }
        logger.debug('Example loaded successfully', { type, id });
        setTimeout(() => setSelectedId(''), 100);
      } catch (error) {
        logger.error('Failed to load example', { error, type, id });
        alert(`Failed to load example: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (examples.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex flex-col space-y-2">
      <label className="text-sm font-semibold text-gray-200">Load an Example:</label>
      <select
        value={selectedId}
        onChange={handleChange}
        disabled={isLoading}
        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">{isLoading ? 'Loading...' : '-- Select an example --'}</option>
        {examples.map((example) => (
          <option key={example.id} value={example.id}>
            {example.name} - {example.description}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ExampleSelector;
