import Editor, { loader } from '@monaco-editor/react';
import * as monacoEditor from 'monaco-editor';
import { configureMonacoYaml } from 'monaco-yaml';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import YamlWorker from 'monaco-yaml/yaml.worker?worker';

loader.config({ monaco: monacoEditor });

window.MonacoEnvironment = {
  getWorker(_moduleId, label) {
    if (label === 'yaml') return new YamlWorker();
    return new EditorWorker();
  },
};

let configured = false;

function setupMonacoYaml(monaco) {
  if (configured) return;
  configured = true;
  configureMonacoYaml(monaco, {
    enableSchemaRequest: true,
    schemas: [
      {
        uri: 'https://raw.githubusercontent.com/yannh/kubernetes-json-schema/master/v1.30.0-standalone-strict/all.json',
        fileMatch: ['*manifest*'],
      },
    ],
  });
}

function YamlEditor({ value, onChange, path = 'file.yaml' }) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-600" style={{ height: '256px' }}>
      <Editor
        height="256px"
        defaultLanguage="yaml"
        path={path}
        value={value}
        onChange={(val) => onChange(val ?? '')}
        beforeMount={setupMonacoYaml}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 8, bottom: 8 },
        }}
      />
    </div>
  );
}

export default YamlEditor;
