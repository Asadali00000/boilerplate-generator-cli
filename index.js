#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for better CLI output
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m'
};

class BoilerplateGenerator {
  constructor() {
    this.templates = {
      redux: this.generateReduxBoilerplate,
      api: this.generateAPIBoilerplate,
      auth: this.generateAuthBoilerplate,
      form: this.generateFormBoilerplate,
      crud: this.generateCRUDBoilerplate,
      hooks: this.generateHooksBoilerplate,
      context: this.generateContextBoilerplate,
      middleware: this.generateMiddlewareBoilerplate,
      components: this.generateComponentBoilerplate,
      utils: this.generateUtilsBoilerplate
    };
  }

  // Main CLI handler
  run() {
    const args = process.argv.slice(2);
 console.log(args , process.argv)
    if (args.length < 2) {
      this.showHelp();
      return;
    }

    const [targetPath, templateType, ...options] = args;

    if (!this.templates[templateType]) {
      console.log(`${colors.red}Error: Template "${templateType}" not found!${colors.reset}`);
      this.showAvailableTemplates();
      return;
    }

    try {
      this.addBoilerplateToProject(targetPath, templateType, options);
    } catch (error) {
      console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
    }
  }

  // Add boilerplate to existing project
  addBoilerplateToProject(targetPath, templateType, options) {
    const fullPath = path.resolve(targetPath);
		console.log(targetPath,fullPath)

    // Check if target path exists, if not create it
    if (!fs.existsSync(fullPath)) {
      console.log(`${colors.yellow}Creating directory: ${fullPath}${colors.reset}`);
      fs.mkdirSync(fullPath, { recursive: true });
    }

    console.log(`${colors.blue}Adding ${templateType} boilerplate to: ${fullPath}${colors.reset}`);

    // Generate template-specific files
    const result = this.templates[templateType].call(this, fullPath, options);

    console.log(`${colors.green}${colors.bold}✓ ${templateType} boilerplate added successfully!${colors.reset}`);

    if (result.dependencies && result.dependencies.length > 0) {
      console.log(`${colors.cyan}${colors.bold}📦 Required dependencies:${colors.reset}`);
      result.dependencies.forEach(dep => {
        console.log(`  ${colors.cyan}npm install ${dep}${colors.reset}`);
      });
    }

    if (result.instructions) {
      console.log(`${colors.blue}${colors.bold}📋 Next steps:${colors.reset}`);
      result.instructions.forEach(instruction => {
        console.log(`  ${colors.blue}• ${instruction}${colors.reset}`);
      });
    }

    if (result.files) {
      console.log(`${colors.green}${colors.bold}📁 Files created:${colors.reset}`);
      result.files.forEach(file => {
        console.log(`  ${colors.green}✓ ${file}${colors.reset}`);
      });
    }
  }

  // Redux boilerplate generator
  generateReduxBoilerplate(projectPath, options) {
    const entityName = options[0] || 'counter';
    const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);

    const structure = {
      [`store/slices/${entityName}Slice.js`]: this.getReduxSlice(entityName, capitalizedEntity),
      [`store/actions/${entityName}Actions.js`]: this.getReduxActions(entityName, capitalizedEntity),
      [`store/selectors/${entityName}Selectors.js`]: this.getReduxSelectors(entityName),
      // [`hooks/use${capitalizedEntity}.js`]: this.getReduxHook(entityName, capitalizedEntity),
      // [`components/${capitalizedEntity}/${capitalizedEntity}.jsx`]: this.getReduxComponent(entityName, capitalizedEntity),
      // [`components/${capitalizedEntity}/${capitalizedEntity}.module.css`]: this.getComponentCSS(),
      [`store/index.js`]: this.getStoreIndex(entityName)
    };

    this.createFileStructure(projectPath, structure);

    return {
      dependencies: ['@reduxjs/toolkit', 'react-redux'],
      instructions: [
        `Import the ${entityName}Slice in your store configuration`,
        `Wrap your app with Redux Provider`,
        `Use the use${capitalizedEntity} hook in your components`,
        `Check the generated ${capitalizedEntity} component for usage example`
      ],
      files: Object.keys(structure)
    };
  }

  // API boilerplate generator
  generateAPIBoilerplate(projectPath, options) {
    const entityName = options[0] || 'users';
    const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);

    const structure = {
      [`api/${entityName}Api.js`]: this.getAPIService(entityName, capitalizedEntity),
      [`api/client.js`]: this.getAPIClient(),
      [`api/endpoints.js`]: this.getAPIEndpoints(entityName),
      [`hooks/use${capitalizedEntity}Api.js`]: this.getAPIHook(entityName, capitalizedEntity),
      [`types/${entityName}Types.js`]: this.getAPITypes(entityName),
      [`utils/apiUtils.js`]: this.getAPIUtils()
    };

    this.createFileStructure(projectPath, structure);

    return {
      dependencies: ['axios'],
      instructions: [
        'Configure your API base URL in api/client.js',
        'Update the endpoints in api/endpoints.js',
        'Modify types based on your API response structure',
        `Use the use${capitalizedEntity}Api hook in your components`
      ],
      files: Object.keys(structure)
    };
  }

  // Auth boilerplate generator
  generateAuthBoilerplate(projectPath, options) {
    const structure = {
      'auth/AuthContext.js': this.getAuthContext(),
      'auth/AuthProvider.jsx': this.getAuthProvider(),
      'auth/authService.js': this.getAuthService(),
      'hooks/useAuth.js': this.getAuthHook(),
      'components/Auth/LoginForm.jsx': this.getLoginForm(),
      'components/Auth/ProtectedRoute.jsx': this.getProtectedRoute(),
      'utils/tokenUtils.js': this.getTokenUtils(),
      'constants/authConstants.js': this.getAuthConstants()
    };

    this.createFileStructure(projectPath, structure);

    return {
      dependencies: ['axios', 'js-cookie'],
      instructions: [
        'Wrap your app with AuthProvider',
        'Configure your auth endpoints in authService.js',
        'Use ProtectedRoute for protected pages',
        'Use useAuth hook to access auth state and methods'
      ],
      files: Object.keys(structure)
    };
  }

  // Form boilerplate generator
  generateFormBoilerplate(projectPath, options) {
    const formName = options[0] || 'contact';
    const capitalizedForm = formName.charAt(0).toUpperCase() + formName.slice(1);

    const structure = {
      [`components/Forms/${capitalizedForm}Form.jsx`]: this.getFormComponent(formName, capitalizedForm),
      [`hooks/useForm.js`]: this.getFormHook(),
      [`utils/formValidation.js`]: this.getFormValidation(),
      [`constants/formConstants.js`]: this.getFormConstants(),
      [`components/Forms/FormField.jsx`]: this.getFormField(),
      [`components/Forms/FormButton.jsx`]: this.getFormButton()
    };

    this.createFileStructure(projectPath, structure);

    return {
      dependencies: [],
      instructions: [
        `Use the ${capitalizedForm}Form component in your pages`,
        'Customize validation rules in formValidation.js',
        'Modify form fields based on your requirements',
        'Use FormField for consistent form styling'
      ],
      files: Object.keys(structure)
    };
  }

  // CRUD boilerplate generator
  generateCRUDBoilerplate(projectPath, options) {
    const entityName = options[0] || 'user';
    const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
    const pluralEntity = entityName + 's';

    const structure = {
      [`components/${capitalizedEntity}/${capitalizedEntity}List.jsx`]: this.getCRUDList(entityName, capitalizedEntity, pluralEntity),
      [`components/${capitalizedEntity}/${capitalizedEntity}Form.jsx`]: this.getCRUDForm(entityName, capitalizedEntity),
      [`components/${capitalizedEntity}/${capitalizedEntity}Item.jsx`]: this.getCRUDItem(entityName, capitalizedEntity),
      [`hooks/use${capitalizedEntity}CRUD.js`]: this.getCRUDHook(entityName, capitalizedEntity),
      [`services/${entityName}Service.js`]: this.getCRUDService(entityName, capitalizedEntity),
      [`types/${entityName}Types.js`]: this.getCRUDTypes(entityName, capitalizedEntity)
    };

    this.createFileStructure(projectPath, structure);

    return {
      dependencies: ['axios'],
      instructions: [
        `Import and use ${capitalizedEntity}List in your main component`,
        `Configure API endpoints in ${entityName}Service.js`,
        'Customize the entity structure in types file',
        `Use use${capitalizedEntity}CRUD hook for CRUD operations`
      ],
      files: Object.keys(structure)
    };
  }

  // Hooks boilerplate generator
  generateHooksBoilerplate(projectPath, options) {
    const structure = {
      'hooks/useLocalStorage.js': this.getLocalStorageHook(),
      'hooks/useDebounce.js': this.getDebounceHook(),
      'hooks/useFetch.js': this.getFetchHook(),
      'hooks/useToggle.js': this.getToggleHook(),
      'hooks/useClickOutside.js': this.getClickOutsideHook(),
      'hooks/useWindowSize.js': this.getWindowSizeHook(),
      'hooks/usePrevious.js': this.getPreviousHook(),
      'hooks/useAsync.js': this.getAsyncHook()
    };

    this.createFileStructure(projectPath, structure);

    return {
      dependencies: [],
      instructions: [
        'Import and use any of the custom hooks in your components',
        'Each hook is documented with usage examples',
        'Customize hooks based on your specific needs'
      ],
      files: Object.keys(structure)
    };
  }

  // Context boilerplate generator
  generateContextBoilerplate(projectPath, options) {
    const contextName = options[0] || 'theme';
    const capitalizedContext = contextName.charAt(0).toUpperCase() + contextName.slice(1);

    const structure = {
      [`context/${capitalizedContext}Context.js`]: this.getContextFile(contextName, capitalizedContext),
      [`context/${capitalizedContext}Provider.jsx`]: this.getContextProvider(contextName, capitalizedContext),
      [`hooks/use${capitalizedContext}.js`]: this.getContextHook(contextName, capitalizedContext),
      [`constants/${contextName}Constants.js`]: this.getContextConstants(contextName)
    };

    this.createFileStructure(projectPath, structure);

    return {
      dependencies: [],
      instructions: [
        `Wrap your app with ${capitalizedContext}Provider`,
        `Use use${capitalizedContext} hook to access context values`,
        'Customize context values and actions based on your needs'
      ],
      files: Object.keys(structure)
    };
  }

  // Middleware boilerplate generator
  generateMiddlewareBoilerplate(projectPath, options) {
    const structure = {
      'middleware/authMiddleware.js': this.getAuthMiddleware(),
      'middleware/errorMiddleware.js': this.getErrorMiddleware(),
      'middleware/loggingMiddleware.js': this.getLoggingMiddleware(),
      'middleware/rateLimitMiddleware.js': this.getRateLimitMiddleware(),
      'middleware/corsMiddleware.js': this.getCorsMiddleware(),
      'middleware/index.js': this.getMiddlewareIndex()
    };

    this.createFileStructure(projectPath, structure);

    return {
      dependencies: ['express', 'cors', 'helmet', 'express-rate-limit'],
      instructions: [
        'Import middleware in your Express app',
        'Configure middleware settings based on your needs',
        'Use individual middleware or import all from index.js'
      ],
      files: Object.keys(structure)
    };
  }

  // Component boilerplate generator
  generateComponentBoilerplate(projectPath, options) {
    const componentName = options[0] || 'Button';
    const capitalizedComponent = componentName.charAt(0).toUpperCase() + componentName.slice(1);

    const structure = {
      [`components/${capitalizedComponent}/${capitalizedComponent}.jsx`]: this.getGenericComponent(capitalizedComponent),
      [`components/${capitalizedComponent}/${capitalizedComponent}.module.css`]: this.getComponentCSS(),
      [`components/${capitalizedComponent}/${capitalizedComponent}.test.js`]: this.getComponentTest(capitalizedComponent),
      [`components/${capitalizedComponent}/${capitalizedComponent}.stories.js`]: this.getComponentStory(capitalizedComponent),
      [`components/${capitalizedComponent}/index.js`]: this.getComponentIndex(capitalizedComponent)
    };

    this.createFileStructure(projectPath, structure);

    return {
      dependencies: ['@testing-library/react', '@testing-library/jest-dom'],
      instructions: [
        `Import ${capitalizedComponent} from 'components/${capitalizedComponent}'`,
        'Customize component props and styling',
        'Run tests with npm test',
        'View stories with Storybook (if configured)'
      ],
      files: Object.keys(structure)
    };
  }

  // Utils boilerplate generator
  generateUtilsBoilerplate(projectPath, options) {
    const structure = {
      'utils/dateUtils.js': this.getDateUtils(),
      'utils/stringUtils.js': this.getStringUtils(),
      'utils/arrayUtils.js': this.getArrayUtils(),
      'utils/objectUtils.js': this.getObjectUtils(),
      'utils/validationUtils.js': this.getValidationUtils(),
      'utils/formatUtils.js': this.getFormatUtils(),
      'utils/storageUtils.js': this.getStorageUtils(),
      'utils/index.js': this.getUtilsIndex()
    };

    this.createFileStructure(projectPath, structure);

    return {
      dependencies: [],
      instructions: [
        'Import individual utilities or all from utils/index.js',
        'Each utility file contains commonly used functions',
        'Customize functions based on your project needs'
      ],
      files: Object.keys(structure)
    };
  }

  // Helper method to create file structure
  createFileStructure(basePath, structure) {

    Object.entries(structure).forEach(([filePath, content]) => {
			console.log(filePath,basePath)
      const fullPath = path.join(basePath, filePath);
      const dir = path.dirname(fullPath);

      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Check if file already exists
      if (fs.existsSync(fullPath)) {
        console.log(`${colors.yellow}⚠ File already exists: ${filePath}${colors.reset}`);
        return;
      }

      // Write file
      fs.writeFileSync(fullPath, content, 'utf8');
    });
  }

  // Redux template methods
  getReduxSlice(entityName, capitalizedEntity) {
    return `import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ${entityName}s: [],
  current${capitalizedEntity}: null,
  loading: false,
  error: null
};

const ${entityName}Slice = createSlice({
  name: '${entityName}',
  initialState,
  reducers: {
    set${capitalizedEntity}s: (state, action) => {
      state.${entityName}s = action.payload;
    },
    addNew${capitalizedEntity}: (state, action) => {
      state.${entityName}s.push(action.payload);
    },
    update${capitalizedEntity}: (state, action) => {
      const index = state.${entityName}s.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.${entityName}s[index] = action.payload;
      }
    },
    remove${capitalizedEntity}: (state, action) => {
      state.${entityName}s = state.${entityName}s.filter(item => item.id !== action.payload);
    },
    setCurrent${capitalizedEntity}: (state, action) => {
      state.current${capitalizedEntity} = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  set${capitalizedEntity}s,
  addNew${capitalizedEntity},
  update${capitalizedEntity},
  remove${capitalizedEntity},
  setCurrent${capitalizedEntity},
  setLoading,
  setError,
  clearError
} = ${entityName}Slice.actions;

export default ${entityName}Slice.reducer;`;
  }

  getReduxActions(entityName, capitalizedEntity) {
    return `import {
  set${capitalizedEntity}s,
  addNew${capitalizedEntity},
  update${capitalizedEntity},
  remove${capitalizedEntity},
  setCurrent${capitalizedEntity},
  setLoading,
  setError,
  clearError
} from '../slices/${entityName}Slice';

// Async action creators
export const fetch${capitalizedEntity}s = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());

    // Replace with your API call
    const response = await fetch('/api/${entityName}s');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch ${entityName}s');
    }

    dispatch(set${capitalizedEntity}s(data));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const create${capitalizedEntity} = (${entityName}Data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());

    const response = await fetch('/api/${entityName}s', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(${entityName}Data),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create ${entityName}');
    }

    dispatch(addNew${capitalizedEntity}(data));
    return data;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const update${capitalizedEntity}ById = (id, ${entityName}Data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());

    const response = await fetch(\`/api/${entityName}s/\${id}\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(${entityName}Data),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update ${entityName}');
    }

    dispatch(update${capitalizedEntity}(data));
    return data;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const delete${capitalizedEntity} = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(clearError());

    const response = await fetch(\`/api/${entityName}s/\${id}\`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete ${entityName}');
    }

    dispatch(remove${capitalizedEntity}(id));
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};`;
  }

  getReduxSelectors(entityName) {
    return `// ${entityName} selectors
export const selectAll${entityName.charAt(0).toUpperCase() + entityName.slice(1)}s = (state) => state.${entityName}.${entityName}s;
export const selectCurrent${entityName.charAt(0).toUpperCase() + entityName.slice(1)} = (state) => state.${entityName}.current${entityName.charAt(0).toUpperCase() + entityName.slice(1)};
export const select${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Loading = (state) => state.${entityName}.loading;
export const select${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Error = (state) => state.${entityName}.error;

// Memoized selectors
export const select${entityName.charAt(0).toUpperCase() + entityName.slice(1)}ById = (id) => (state) =>
  state.${entityName}.${entityName}s.find(item => item.id === id);

export const select${entityName.charAt(0).toUpperCase() + entityName.slice(1)}sCount = (state) => state.${entityName}.${entityName}s.length;`;
  }

//   getReduxHook(entityName, capitalizedEntity) {
//     return `import { useSelector, useDispatch } from 'react-redux';
// import { useCallback } from 'react';
// import {
//   selectAll${capitalizedEntity}s,
//   selectCurrent${capitalizedEntity},
//   select${capitalizedEntity}Loading,
//   select${capitalizedEntity}Error,
//   select${capitalizedEntity}ById
// } from '../store/selectors/${entityName}Selectors';
// import {
//   fetch${capitalizedEntity}s,
//   create${capitalizedEntity},
//   update${capitalizedEntity}ById,
//   delete${capitalizedEntity}
// } from '../store/actions/${entityName}Actions';
// import { setCurrent${capitalizedEntity}, clearError } from '../store/slices/${entityName}Slice';

// export const use${capitalizedEntity} = () => {
//   const dispatch = useDispatch();

//   const ${entityName}s = useSelector(selectAll${capitalizedEntity}s);
//   const current${capitalizedEntity} = useSelector(selectCurrent${capitalizedEntity});
//   const loading = useSelector(select${capitalizedEntity}Loading);
//   const error = useSelector(select${capitalizedEntity}Error);

//   const fetchAll = useCallback(() => {
//     dispatch(fetch${capitalizedEntity}s());
//   }, [dispatch]);

//   const create = useCallback((${entityName}Data) => {
//     return dispatch(create${capitalizedEntity}(${entityName}Data));
//   }, [dispatch]);

//   const update = useCallback((id, ${entityName}Data) => {
//     return dispatch(update${capitalizedEntity}ById(id, ${entityName}Data));
//   }, [dispatch]);

//   const remove = useCallback((id) => {
//     dispatch(delete${capitalizedEntity}(id));
//   }, [dispatch]);

//   const setCurrent = useCallback((${entityName}) => {
//     dispatch(setCurrent${capitalizedEntity}(${entityName}));
//   }, [dispatch]);

//   const clearErrors = useCallback(() => {
//     dispatch(clearError());
//   }, [dispatch]);

//   const getById = useCallback((id) => {
//     return ${entityName}s.find(item => item.id === id);
//   }, [${entityName}s]);

//   return {
//     ${entityName}s,
//     current${capitalizedEntity},
//     loading,
//     error,
//     fetchAll,
//     create,
//     update,
//     remove,
//     setCurrent,
//     clearErrors,
//     getById
//   };
// };`;
//   }

//   getReduxComponent(entityName, capitalizedEntity) {
//     return `import React, { useEffect } from 'react';
// import { use${capitalizedEntity} } from '../../hooks/use${capitalizedEntity}';
// import styles from './${capitalizedEntity}.module.css';

// const ${capitalizedEntity} = () => {
//   const {
//     ${entityName}s,
//     current${capitalizedEntity},
//     loading,
//     error,
//     fetchAll,
//     create,
//     update,
//     remove,
//     setCurrent,
//     clearErrors
//   } = use${capitalizedEntity}();

//   useEffect(() => {
//     fetchAll();
//   }, [fetchAll]);

//   const handleCreate = async () => {
//     try {
//       await create({
//         name: 'New ${capitalizedEntity}',
//         description: 'Description here'
//       });
//     } catch (error) {
//       console.error('Failed to create ${entityName}:', error);
//     }
//   };

//   const handleUpdate = async (id) => {
//     try {
//       await update(id, {
//         name: 'Updated ${capitalizedEntity}',
//         description: 'Updated description'
//       });
//     } catch (error) {
//       console.error('Failed to update ${entityName}:', error);
//     }
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this ${entityName}?')) {
//       remove(id);
//     }
//   };

//   if (loading) {
//     return <div className={styles.loading}>Loading ${entityName}s...</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <h2>${capitalizedEntity} Manager</h2>

//       {error && (
//         <div className={styles.error}>
//           Error: {error}
//           <button onClick={clearErrors}>×</button>
//         </div>
//       )}

//       <div className={styles.actions}>
//         <button onClick={handleCreate} className={styles.createBtn}>
//           Create New ${capitalizedEntity}
//         </button>
//       </div>

//       <div className={styles.list}>
//         {${entityName}s.map((${entityName}) => (
//           <div key={${entityName}.id} className={styles.item}>
//             <h3>{${entityName}.name}</h3>
//             <p>{${entityName}.description}</p>
//             <div className={styles.itemActions}>
//               <button onClick={() => setCurrent(${entityName})}>
//                 Select
//               </button>
//               <button onClick={() => handleUpdate(${entityName}.id)}>
//                 Update
//               </button>
//               <button onClick={() => handleDelete(${entityName}.id)}>
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {current${capitalizedEntity} && (
//         <div className={styles.currentItem}>
//           <h3>Current ${capitalizedEntity}</h3>
//           <p>Name: {current${capitalizedEntity}.name}</p>
//           <p>Description: {current${capitalizedEntity}.description}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ${capitalizedEntity};`;
//   }

//   getComponentCSS() {
//     return `.container {
//   padding: 20px;
//   max-width: 800px;
//   margin: 0 auto;
// }

// .loading {
//   text-align: center;
//   padding: 20px;
//   font-size: 18px;
// }

// .error {
//   background-color: #fee;
//   border: 1px solid #fcc;
//   color: #c00;
//   padding: 10px;
//   border-radius: 4px;
//   margin-bottom: 20px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// }

// .error button {
//   background: none;
//   border: none;
//   color: #c00;
//   font-size: 18px;
//   cursor: pointer;
// }

// .actions {
//   margin-bottom: 20px;
// }

// .createBtn {
//   background-color: #007bff;
//   color: white;
//   border: none;
//   padding: 10px 20px;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 16px;
// }

// .createBtn:hover {
//   background-color: #0056b3;
// }

// .list {
//   display: grid;
//   gap: 15px;
// }

// .item {
//   border: 1px solid #ddd;
//   padding: 15px;
//   border-radius: 8px;
//   background-color: #f9f9f9;
// }

// .item h3 {
//   margin: 0 0 10px 0;
//   color: #333;
// }

// .item p {
//   margin: 0 0 15px 0;
//   color: #666;
// }

// .itemActions {
//   display: flex;
//   gap: 10px;
// }

// .itemActions button {
//   padding: 5px 10px;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 14px;
// }

// .itemActions button:nth-child(1) {
//   background-color: #28a745;
//   color: white;
// }

// .itemActions button:nth-child(2) {
//   background-color: #ffc107;
//   color: black;
// }

// .itemActions button:nth-child(3) {
//   background-color: #dc3545;
//   color: white;
// }

// .currentItem {
//   margin-top: 30px;
//   padding: 20px;
//   background-color: #e7f3ff;
//   border-radius: 8px;
//   border: 1px solid #b3d9ff;
// }

// .currentItem h3 {
//   margin-top: 0;
//   color: #0066cc;
// }`;
//   }

  getStoreIndex(entityName) {
    return `import { configureStore } from '@reduxjs/toolkit';
import ${entityName}Reducer from './slices/${entityName}Slice';

const store = configureStore({
  reducer: {
    ${entityName}: ${entityName}Reducer,
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;`;
  }

  // API template methods
  getAPIService(entityName, capitalizedEntity) {
    return `import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

class ${capitalizedEntity}Service {
  async getAll() {
    const response = await apiClient.get(API_ENDPOINTS.${entityName.toUpperCase()}.GET_ALL);
    return response.data;
  }

  async getById(id) {
    const response = await apiClient.get(API_ENDPOINTS.${entityName.toUpperCase()}.GET_BY_ID(id));
    return response.data;
  }

  async create(data) {
    const response = await apiClient.post(API_ENDPOINTS.${entityName.toUpperCase()}.CREATE, data);
    return response.data;
  }

  async update(id, data) {
    const response = await apiClient.put(API_ENDPOINTS.${entityName.toUpperCase()}.UPDATE(id), data);
    return response.data;
  }

  async delete(id) {
    const response = await apiClient.delete(API_ENDPOINTS.${entityName.toUpperCase()}.DELETE(id));
    return response.data;
  }

  async search(query) {
    const response = await apiClient.get(API_ENDPOINTS.${entityName.toUpperCase()}.SEARCH, {
      params: { q: query }
    });
    return response.data;
  }

  async getPaginated(page = 1, limit = 10) {
    const response = await apiClient.get(API_ENDPOINTS.${entityName.toUpperCase()}.GET_ALL, {
      params: { page, limit }
    });
    return response.data;
  }
}

export const ${entityName}Service = new ${capitalizedEntity}Service();`;
  }

  getAPIClient() {
    return `import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    if (error.response?.status >= 500) {
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

export default apiClient;`;
  }

  getAPIEndpoints(entityName) {
    return `export const API_ENDPOINTS = {
  ${entityName.toUpperCase()}: {
    GET_ALL: '/${entityName}s',
    GET_BY_ID: (id) => \`/${entityName}s/\${id}\`,
    CREATE: '/${entityName}s',
    UPDATE: (id) => \`/${entityName}s/\${id}\`,
    DELETE: (id) => \`/${entityName}s/\${id}\`,
    SEARCH: '/${entityName}s/search',
  },

  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },

  // Add more endpoints as needed
};`;
  }

  getAPIHook(entityName, capitalizedEntity) {
    return `import { useState, useEffect, useCallback } from 'react';
import { ${entityName}Service } from '../api/${entityName}Api';

export const use${capitalizedEntity}Api = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ${entityName}Service.getAll();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ${entityName}Service.getById(id);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (itemData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ${entityName}Service.create(itemData);
      setData(prevData => [...prevData, result]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, itemData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ${entityName}Service.update(id, itemData);
      setData(prevData =>
        prevData.map(item => item.id === id ? result : item)
      );
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await ${entityName}Service.delete(id);
      setData(prevData => prevData.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ${entityName}Service.search(query);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    search,
    clearError
  };
};`;
  }

  getAPITypes(entityName) {
    return `// ${entityName} types
export interface ${entityName.charAt(0).toUpperCase() + entityName.slice(1)} {
  id: string | number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Create${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Request {
  name: string;
  description?: string;
}

export interface Update${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Request {
  name?: string;
  description?: string;
}

export interface ${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Response {
  data: ${entityName.charAt(0).toUpperCase() + entityName.slice(1)}[];
  total: number;
  page: number;
  limit: number;
}

export interface API_Response<T> {
  data: T;
  message: string;
  success: boolean;
}`;
  }

  getAPIUtils() {
    return `export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      message: 'Network error - no response from server',
      status: 0,
      data: null
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      data: null
    };
  }
};

export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const retry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};`;
  }

  // Show help and available templates
  showHelp() {
    console.log(`${colors.bold}${colors.blue}Boilerplate Generator CLI${colors.reset}`);
    console.log(`Generate boilerplate code for your existing projects\n`);
    console.log(`${colors.bold}Usage:${colors.reset}`);
    console.log(`  generate <path> <template> [options]\n`);
    console.log(`${colors.bold}Examples:${colors.reset}`);
    console.log(`  boiler-generate ./src redux user`);
    console.log(`  boiler-generate ./components form contact`);
    console.log(`  boiler-generate ./api api products`);
    console.log(`  boiler-generate ./src auth`);
    console.log(`  boiler-generate ./utils hooks\n`);
    this.showAvailableTemplates();
  }

  showAvailableTemplates() {
    console.log(`${colors.bold}Available Templates:${colors.reset}`);
    console.log(`  ${colors.green}redux${colors.reset}      - Redux setup with slices, actions, selectors`);
    console.log(`  ${colors.green}api${colors.reset}        - API service with hooks and types`);
    console.log(`  ${colors.green}auth${colors.reset}       - Authentication system with context`);
    console.log(`  ${colors.green}form${colors.reset}       - Form components with validation`);
    console.log(`  ${colors.green}crud${colors.reset}       - Complete CRUD operations`);
    console.log(`  ${colors.green}hooks${colors.reset}      - Collection of custom React hooks`);
    console.log(`  ${colors.green}context${colors.reset}    - React Context setup`);
    console.log(`  ${colors.green}middleware${colors.reset} - Express middleware collection`);
    console.log(`  ${colors.green}components${colors.reset} - Reusable component template`);
    console.log(`  ${colors.green}utils${colors.reset}      - Utility functions collection`);
  }
}

// Run the CLI
if (require.main === module) {
  const generator = new BoilerplateGenerator();
  generator.run();
}

module.exports = BoilerplateGenerator;
