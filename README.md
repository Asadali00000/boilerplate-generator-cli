# Boilerplate Generator CLI

A powerful CLI tool to generate boilerplate code for your existing projects. This tool helps you quickly scaffold common patterns and structures without manually creating all the boilerplate code.

## 🚀 Features

- **Multiple Template Types**: Redux, API, Auth, Forms, and more
- **Flexible Paths**: Generate boilerplate in any existing project directory
- **Color-coded Output**: Beautiful CLI interface with ANSI colors
- **Dependency Management**: Suggests required npm packages
- **File Structure Generation**: Creates organized folder structures
- **Customizable**: Accepts options for entity names and customization
- **Express Boilerplate Included**: Generates a minimal, production-ready Express boilerplate.
- **React Native Boilerplate Included**: Generate a complete React Native project structure with navigation, assets, services, Redux, and more.
- **AI-Powered Boilerplate Generation**: Use Gemini AI to generate new boilerplate code for templates not already included, with minimal setup and no risk to your existing files.

## 📁 Project Structure

```
boilerplate-cli/
├── src/
│   ├── index.js
│   ├── boilerplates/
│   │   ├── redux/
│   │   │   ├── redux.js           # Redux generator
│   │   │   └── ...template files...
│   │   ├── api/
│   │   │   ├── api.js             # API generator
│   │   │   └── ...template files...
│   │   ├── auth/
│   │   │   ├── auth.js            # Auth generator
│   │   │   └── ...template files...
│   │   └── form/
│   │       ├── form.js            # Form generator
│   │       └── ...template files...
│   ├── boilerplatesExpress/
│   │   ├── express/
│   │   │   ├── express.js          # RN express generator
│   │   │   └── ...template files...
│   ├── boilerplatesReactNative/
│   │   ├── assets/
│   │   │   ├── assets.js          # RN assets generator
│   │   │   └── ...template files...
│   │   ├── navigation/
│   │   │   ├── navigation.js      # RN navigation generator
│   │   │   └── ...template files...
│   │   ├── redux/
│   │   │   ├── redux.js           # RN redux generator
│   │   │   └── ...template files...
│   │   └── services/
│   │       ├── services.js        # RN services generator
│   │       └── ...template files...
│   ├── utils/
│   │   ├── colors.js
│   │   ├── geminiApi.js
│   │   ├── installPackages.js
│   │   └── fileUtils.js
│   └── templates/                 # (Optional: for shared or future templates)
├── package.json
└── README.md
```

## 🛠️ Installation

```bash
npm install my-boilerplate-generator
```

## 📖 Usage

### Basic Usage

```bash
npx my-boilerplate-generator <path> <template> [options]
```

### Examples

```bash
# Generate Redux boilerplate for a user entity
npx my-boilerplate-generator ./src redux user

# Generate API boilerplate for products
npx my-boilerplate-generator ./api api products

# generate multiple boiler plates for react-native(navigation +  assets + services + redux)
npx my-boilerplate-generator ./api react-native

# Generate authentication system
npx my-boilerplate-generator ./src auth

# Generate form components for contact form
npx my-boilerplate-generator ./components form contact
```

## 📋 Available Templates

### ✅ Redux Template

Generates Redux Toolkit setup with slices, actions, selectors, and store configuration.

**Files Created:**
- `store/slices/{entity}Slice.js` - Redux slice with reducers
- `store/actions/{entity}Actions.js` - Action creators with TODO comments for API calls
- `store/selectors/{entity}Selectors.js` - Selectors for state access
- `store/index.js` - Store configuration

**Dependencies:**
- `@reduxjs/toolkit`
- `react-redux`

**What You Get:**
- Complete Redux store structure
- Pre-configured slice with common CRUD operations
- Action creators with proper error handling and loading states
- Selectors for accessing state
- TODO comments showing where to add your API calls

### ✅ API Template

Generates API service layer with hooks, types, and utilities.

**Files Created:**
- `api/{entity}Api.js`
- `api/client.js`
- `api/endpoints.js`
- `hooks/use{Entity}Api.js`
- `types/{entity}Types.js`
- `utils/apiUtils.js`

**Dependencies:**
- `axios`

### ✅ Auth Template

Generates complete authentication system with context, providers, and components.

**Files Created:**
- `auth/AuthContext.js`
- `auth/AuthProvider.jsx`
- `auth/authService.js`
- `hooks/useAuth.js`
- `components/Auth/LoginForm.jsx`
- `components/Auth/ProtectedRoute.jsx`
- `utils/tokenUtils.js`
- `constants/authConstants.js`

### ✅ Middleware and Many more

### Check all Templates and commands
```bash
npx my-boiler-generate
```

### 🚧 Coming Soon

- **React Native Comprehensive Boilerplate**: A complete starter template with navigation, auth flow, scalable structure, etc.
- **CRUD Template**: Complete CRUD operations
- **Hooks Template**: Collection of custom React hooks
- **Context Template**: React Context setup
- **Middleware Template**: Express middleware collection
- **Components Template**: Reusable component template
- **Utils Template**: Utility functions collection

## 🔧 Development

### Adding New Templates

Contributing a new boilerplate is now simpler than ever with our new folder-based structure.

1.  **Create a Folder**: Inside `src/boilerplates/` (for web) or `src/boilerplatesReactNative/` (for React Native), create a new folder for your template (e.g., `hooks/`).

2.  **Add Template Files**: Place all the files for your boilerplate directly inside this new folder (e.g., `hooks/useCustomHook.js`, `hooks/useDebounce.js`).

3.  **Create the Generator File**: Inside the same folder, create a generator file (e.g., `hooks/hooks.js`). This file will contain the logic to copy the template.

4.  **Implement the Generator Class**: Use the structure from the example below. The key parts are:
    *   A static `getDependencies()` method to list any required npm packages.
    *   An `async generate{TemplateName}Boilerplate()` method that:
        *   Uses `copyBoilerplateFolder` to copy the entire directory.
        *   Ignores its own generator file in the copy process.
        *   Returns the dependencies, instructions, and a list of created files.

5.  **Register the Template**: Import and register your new boilerplate generator in `src/index.js`.

### Example Template Structure

Here's what a new `hooks` boilerplate generator would look like.

**File Location**: `src/boilerplates/hooks/hooks.js`

```javascript
const path = require('path');
const { copyBoilerplateFolder, walkSync } = require('../../utils/fileUtils');

class HooksBoilerplate {
  // 1. Define static dependencies
  static getDependencies() {
    return []; // e.g., ['lodash.debounce']
  }

  // 2. Implement the generator method
  async generateHooksBoilerplate(projectPath, options) {
    const templateDir = __dirname; // The current folder

    // 3. Copy the entire folder, ignoring the generator file
    await copyBoilerplateFolder(templateDir, path.join(projectPath, 'hooks'), ['hooks.js']);

    // 4. List the files that were copied
    const allFiles = walkSync(templateDir).filter(f => f !== 'hooks.js');

    return {
      dependencies: HooksBoilerplate.getDependencies(),
      instructions: ['Import and use the generated hooks in your components.'],
      files: allFiles
    };
  }
}

module.exports = HooksBoilerplate;
```

## Express Boilerplate Included

This CLI includes a minimal, production-ready Express boilerplate. When you generate an Express project, you get:
- `app.js` and `server.js` for app setup and server start
- Organized folders for routes, controllers, config, and middleware
- Minimal example route and controller
- MongoDB connection setup (with Mongoose)
- Error and 404 handling middleware
- Example authentication middleware (with usage instructions in comments)

**How to use:**
1. Generate the Express boilerplate with the CLI.
2. `cd` into the generated `express/` folder.
3. All required dependencies (express, morgan, dotenv, mongoose, etc.) are automatically installed for you by the CLI(if you choose yes when cli ask). If you need additional packages, you can install them manually or update `package.json` as needed.
4. Create a `.env` file with your MongoDB URI.
5. Start the server with `npm start` or `node server.js`.
6. Edit routes/controllers as needed for your app.
7. All boilerplate code is in place—feel free to modify and extend it for your project.

## AI-Powered Boilerplate Generation (Gemini)

This CLI supports generating boilerplate code for new templates using Google Gemini AI. If you request a template that does not exist in the built-in list, you will be prompted to use the AI feature. The AI will generate the minimal, standard boilerplate for the requested type and create new files and folders as needed.

**Important:**
- The AI feature will **not modify or overwrite your existing project structure or files**. It only creates new files and folders for the requested boilerplate.
- You will be prompted for a Gemini API key the first time you use the AI feature. The key is stored securely in your local system for future use.
- If the API key is invalid or expired, you will be prompted to enter a new one.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your new template or improvements
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

# boilerplate-generator-cli
