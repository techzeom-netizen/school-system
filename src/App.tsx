import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LayoutProvider } from './hooks/useLayout'; // Import LayoutProvider
import { AppRoutes } from './routes';
import { initializeNavbarColors } from './utils/navbarColors';
import ScrollToTop from './components/common/ScrollToTop';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { LoaderPage } from './components/common';

function App() {
  // Initialize navbar colors on app startup
  useEffect(() => {
    initializeNavbarColors();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <LayoutProvider>
            {' '}
            {/* Add LayoutProvider here */}
            <Router>
              <ScrollToTop />
              <LoaderPage />
              <div className="App">
                <AppRoutes />
              </div>
              <Toaster
                position="top-right"
                expand={true}
                richColors={true}
                closeButton={true}
              />
            </Router>
          </LayoutProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
