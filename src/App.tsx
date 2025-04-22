import {BrowserRouter, Route, Routes} from 'react-router-dom';
import AddExhibition from './AddExhibition';
import AddMuseum from './AddMuseum';
import './App.css';
import EditExhibition from './EditExhibition';
import EditMuseum from './EditMuseum';
import EditUser from './EditUser';
import ExhibitionsOnMuseum from './ExhibitionsOnMuseum';
import AttractionsPage from './pages/AttractionsPage';
import CartPage from './pages/CartPage';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/LoginPage';
import MapPage from './pages/MapPage';
import RegisterPage from './pages/RegisterPage';
import SuccessPage from './pages/SuccessPage';
import ProfilePage from './ProfilePage';

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
                    <Route path='/museums/add' element={<AddMuseum />} />
                    <Route
                        path='/exhibitions/add'
                        element={<AddExhibition />}
                    />
                    <Route path='/museums/:museumID' element={<EditMuseum />} />
                    <Route
                        path='/exhibitions-museum/:museumID'
                        element={<ExhibitionsOnMuseum />}
                    />
                    <Route
                        path='/exhibitions/:exhibitionID'
                        element={<EditExhibition />}
                    />
                    <Route path='/events' element={<EventsPage />} />
                    <Route path='/users/:userID' element={<EditUser />} />
                    <Route path='/map' element={<MapPage />} />
                    <Route path='/cart' element={<CartPage />} />
                    <Route path='/success' element={<SuccessPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
