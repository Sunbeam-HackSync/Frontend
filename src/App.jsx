// /src/App.jsx

import './App.css'

import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {store} from './app/store'
import { initializeAuth } from './features/auth/redux/authSlice';
import AppRouter from './routes/AppRouter';

function AppContent() {
  const dispatch = useDispatch();
  const { isInitializing } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500"></div>
          <p className="text-sm font-medium text-slate-400">Loading HackSync...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppRouter />
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
