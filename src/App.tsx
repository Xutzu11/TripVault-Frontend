import {BrowserRouter, Route, Routes} from 'react-router-dom';
import AddMuseum from './AddMuseum';
import './App.css';
import EditMuseum from './EditMuseum';
import AttractionsPage from './AttractionsPage';
import RevenueChart from './RevenueChart';
import ExhibitionsPage from './ExhibitionsPage';
import EditExhibition from './EditExhibition';
import AddExhibition from './AddExhibition';
import ExhibitionsOnMuseum from './ExhibitionsOnMuseum';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';
import UsersPage from './UsersPage';
import EditUser from './EditUser';
import MapPage from './MapPage';
import CartPage from './CartPage';

function App() {
    return (
        <>
        <link href="App.css" rel="stylesheet"/>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/attractions' element={<AttractionsPage />} />
                <Route path='/museums/add' element={<AddMuseum />} />
                <Route path='/exhibitions/add' element={<AddExhibition />} />
                <Route path='/museums/:museumID' element={<EditMuseum />} />
                <Route path='/exhibitions-museum/:museumID' element={<ExhibitionsOnMuseum />} />
                <Route path='/exhibitions/:exhibitionID' element={<EditExhibition />} />
                <Route path='/revenue_chart' element={<RevenueChart />} />
                <Route path='/exhibitions' element={<ExhibitionsPage />} />
                <Route path='/users' element={<UsersPage />} />
                <Route path='/users/:userID' element={<EditUser />} />
                <Route path='/map' element={<MapPage />} />
                <Route path='/cart' element={<CartPage />} />
            </Routes>
        </BrowserRouter>
        </>
    );
}

export default App;
