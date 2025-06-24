# Boilerplate Generator CLI

A powerful CLI tool to generate boilerplate code for your existing projects. This tool helps you quickly scaffold common patterns and structures without manually creating all the boilerplate code.

## 🚀 Features

- **Multiple Template Types**: Redux, API, Auth, Forms, and more
- **Flexible Paths**: Generate boilerplate in any existing project directory
- **Color-coded Output**: Beautiful CLI interface with ANSI colors
- **Dependency Management**: Suggests required npm packages
- **File Structure Generation**: Creates organized folder structures
- **Customizable**: Accepts options for entity names and customization

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

### ✅ Many more

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

1. Create a new file in `src/boilerplates/` (e.g., `hooks.js`)
2. Create a class that extends the boilerplate pattern
3. Implement the `generate{TemplateName}Boilerplate` method
4. Add template methods for generating individual files
5. Import and register the new template in `src/index.js`

### Example Template Structure

```javascript
const { createFileStructure } = require('../utils/fileUtils');

class HooksBoilerplate {
  generateHooksBoilerplate(projectPath, options) {
    const structure = {
      'hooks/useCustomHook.js': this.getCustomHook(),
      // ... more files
    };

    createFileStructure(projectPath, structure);

    return {
      dependencies: [],
      instructions: ['Use the generated hooks in your components'],
      files: Object.keys(structure)
    };
  }

  getCustomHook() {
    return `// Custom hook implementation`;
  }
}

module.exports = HooksBoilerplate;
```

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
