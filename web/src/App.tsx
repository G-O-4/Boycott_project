import { Routes, Route, Navigate } from 'react-router-dom';
import { useLanguageStore } from './store/language';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ScanPage } from './pages/ScanPage';
import { ScanResultPage } from './pages/ScanResultPage';
import { ProductPage } from './pages/ProductPage';
import { CompanyPage } from './pages/CompanyPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { CategoryPage } from './pages/CategoryPage';
// StoresPage removed - stores are now shown per alternative product via StoreMapModal
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';
import { SearchPage } from './pages/SearchPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function App() {
  const { language } = useLanguageStore();

  return (
    <div className={language === 'ar' ? 'rtl' : 'ltr'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Routes>
        {/* Auth routes (no layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main app routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/scan/:barcode" element={<ScanResultPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/company/:id" element={<CompanyPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          {/* Stores are now shown per alternative product via modal */}
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
