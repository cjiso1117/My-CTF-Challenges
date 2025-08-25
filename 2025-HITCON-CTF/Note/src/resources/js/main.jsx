import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import '../css/app.css';

// Import components
import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Note from './components/Note';
import NotFound from './components/NotFound';
import Announcement from './components/Announcement';
import RegisterSW from './service-worker/RegisterSW';


function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                    <Navigation />
                    <RegisterSW>
                        {/* <main className="flex-grow"> */}
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/note" element={<Note />} />
                            <Route path="/announcement" element={<Announcement />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                        {/* </main> */}
                    </RegisterSW>
                </div>
            </AuthProvider>
        </Router>
    );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
