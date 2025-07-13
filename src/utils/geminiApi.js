// No import needed for fetch in Node 18+

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

async function generateBoilerplateWithGemini(templateType, featureName = 'myFeature', apiKey) {
  const GEMINI_API_KEY = apiKey || process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set.');
  }

  const structureExample = `
Project structure example:
- redux/
- api/
- auth/
- form/
Each boilerplate has its own folder with related files, e.g.:
redux/
  slices/
    authSlice.js
  reducer/
    rootReducer.js
  store.js
api/
  api.js
  client.js
  endpoints.js
  hooks/
    useUserApi.js
  userApi.js
  utils/
    apiUtils.js
`;

  const prompt = `
You are an expert code generator. Your ONLY job is to generate the minimal, standard boilerplate for the requested type, and nothing else.

USER REQUEST: "${featureName}" (e.g., if user says "redux-mobile", ONLY generate the minimal Redux boilerplate for mobile, and nothing else).

STRICT INSTRUCTIONS:
- ONLY generate the files and folders that are standard for a ${templateType} boilerplate, as shown in the example below.
- DO NOT generate any extra files, folders, or code. DO NOT add explanations, comments, or unrelated files.
- DO NOT generate log files, error files, config files, or anything not part of the standard ${templateType} boilerplate.
- DO NOT add any files for API, Auth, Form, UI, or anything except the minimal Redux setup for mobile.
- All files and folders MUST be inside a root folder named exactly "${featureName}".
- For each file, output:
<${featureName}/relative/path/to/file.ext>
\n\`\`\`js (or appropriate language)
// file content
\`\`\`
- Use modern JavaScript/React/Node.js conventions.
- Output only valid code and file structure, no extra text.

EXAMPLE STRUCTURE (for Redux):
${structureExample}

REMEMBER: If the user asks for "redux-mobile", ONLY generate the minimal Redux boilerplate for mobile, and nothing else. DO NOT add extra code or files.

At the end, output a list of npm dependencies required for this boilerplate, in the format:
\`\`\`deps
package1
package2
\`\`\`
Only include packages that are actually imported or used in the generated code. Do not include devDependencies or unrelated packages.
`;

  const body = {
    contents: [
      { parts: [{ text: prompt }] }
    ]
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMsg = `Gemini API error: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody && errorBody.error && errorBody.error.message) {
        errorMsg += ` - ${errorBody.error.message}`;
      }
    } catch (e) {
      // Ignore JSON parse errors, just use statusText
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

module.exports = { generateBoilerplateWithGemini };
