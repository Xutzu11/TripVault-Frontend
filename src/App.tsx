import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import AddAttractionPage from './pages/AddAttractionPage';
import AddEventPage from './pages/AddEventPage';
import AttractionsPage from './pages/AttractionsPage';
import CartPage from './pages/CartPage';
import EditAttractionPage from './pages/EditAttractionPage';
import EditEventPage from './pages/EditEventPage';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/LoginPage';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import SuccessPage from './pages/SuccessPage';
import ValidateTicketPage from './pages/ValidateTicketPage';

function App() {
    return (
        <>
            <link href='App.css' rel='stylesheet' />
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<LoginPage />} />
                    <Route path='/register' element={<RegisterPage />} />
                    <Route path='/profile' element={<ProfilePage />} />
                    <Route path='/attractions' element={<AttractionsPage />} />
                    <Route
                        path='/attractions/add'
                        element={<AddAttractionPage />}
                    />
                    <Route
                        path='/attractions/edit/:attractionID'
                        element={<EditAttractionPage />}
                    />
                    <Route
                        path='/events/:attractionID?'
                        element={<EventsPage />}
                    />
                    <Route path='/events/add' element={<AddEventPage />} />
                    <Route
                        path='/events/edit/:eventId'
                        element={<EditEventPage />}
                    />
                    <Route path='/map' element={<MapPage />} />
                    <Route path='/cart' element={<CartPage />} />
                    <Route path='/success' element={<SuccessPage />} />
                    <Route path='/validate' element={<ValidateTicketPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
