const { createFileStructure } = require('../utils/fileUtils');

class ReduxBoilerplate {
  // Redux boilerplate generator
  generateReduxBoilerplate(projectPath, options) {
    const entityName = options[0] || 'counter';
    const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);

    const structure = {
      [`store/slices/${entityName}Slice.js`]: this.getReduxSlice(entityName, capitalizedEntity),
      [`store/actions/${entityName}Actions.js`]: this.getReduxActions(entityName, capitalizedEntity),
      [`store/selectors/${entityName}Selectors.js`]: this.getReduxSelectors(entityName),
      [`store/index.js`]: this.getStoreIndex(entityName)
    };

    createFileStructure(projectPath, structure);

    return {
      dependencies: ['@reduxjs/toolkit', 'react-redux'],
      instructions: [
				` Redux `
        `Import the ${entityName}Slice in your store configuration`,
        `Wrap your app with Redux Provider`,
        `Add your API calls in the action creators`,
        `Create your own hooks and components using the generated structure`
      ],
      files: Object.keys(structure)
    };
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

    // TODO: Replace with your API call
    // const response = await fetch('/api/${entityName}s');
    // const data = await response.json();
    //
    // if (!response.ok) {
    //   throw new Error(data.message || 'Failed to fetch ${entityName}s');
    // }

    // dispatch(set${capitalizedEntity}s(data));
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

    // TODO: Replace with your API call
    // const response = await fetch('/api/${entityName}s', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(${entityName}Data),
    // });
    //
    // const data = await response.json();
    //
    // if (!response.ok) {
    //   throw new Error(data.message || 'Failed to create ${entityName}');
    // }

    // dispatch(addNew${capitalizedEntity}(data));
    // return data;
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

    // TODO: Replace with your API call
    // const response = await fetch(\`/api/${entityName}s/\${id}\`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(${entityName}Data),
    // });
    //
    // const data = await response.json();
    //
    // if (!response.ok) {
    //   throw new Error(data.message || 'Failed to update ${entityName}');
    // }

    // dispatch(update${capitalizedEntity}(data));
    // return data;
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

    // TODO: Replace with your API call
    // const response = await fetch(\`/api/${entityName}s/\${id}\`, {
    //   method: 'DELETE',
    // });
    //
    // if (!response.ok) {
    //   const data = await response.json();
    //   throw new Error(data.message || 'Failed to delete ${entityName}');
    // }

    // dispatch(remove${capitalizedEntity}(id));
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Synchronous action creators
export const select${capitalizedEntity} = (${entityName}) => (dispatch) => {
  dispatch(setCurrent${capitalizedEntity}(${entityName}));
};

export const clearCurrent${capitalizedEntity} = () => (dispatch) => {
  dispatch(setCurrent${capitalizedEntity}(null));
};

export const clear${capitalizedEntity}Error = () => (dispatch) => {
  dispatch(clearError());
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

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;`;
  }
}

module.exports = ReduxBoilerplate;
