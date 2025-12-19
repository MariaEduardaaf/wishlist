import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Wishlist from './pages/Wishlist';
import Completed from './pages/Completed';
import { WishlistUIProvider } from './context/WishlistUIContext';
import { I18nProvider } from './i18n/I18nContext';

import { Toaster } from 'sonner';

function App() {
    return (
        <I18nProvider>
            <Router>
                <WishlistUIProvider>
                    <div className="app-container">
                        <Toaster position="top-center" richColors />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/realizados" element={<Completed />} />
                        </Routes>
                    </div>
                </WishlistUIProvider>
            </Router>
        </I18nProvider>
    );
}

export default App;
