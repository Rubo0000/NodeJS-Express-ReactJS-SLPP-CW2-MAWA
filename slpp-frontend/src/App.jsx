import React, { useState } from 'react';
import PetitionList from './components/PetitionList';
import Register from './components/Register';
import CreatePetition from './components/CreatePetition';
import Login from './components/Login';
import CommitteeDashboard from './components/CommitteeDashboard';
import './App.css';

const App = () => {
    const [token, setToken] = useState(''); // Estado para el token JWT
    const [user, setUser] = useState(null); // Estado para los datos del usuario

    return (
        <div className="App">
            <h1>Shangri-La Petition Platform</h1>
            <Register />
            <Login setToken={setToken} setUser={setUser} /> {/* Pasamos setUser y setToken */}
            
            {/* Mostrar el dashboard del comité si el usuario es admin */}
            {token && user?.role === 'admin' && <CommitteeDashboard token={token} />}
            
            {/* Mostrar la funcionalidad para crear peticiones si el usuario es normal */}
            {token && user?.role === 'user' && <CreatePetition token={token} />}
            
            {/* Mostrar la lista de peticiones para todos */}
            <PetitionList token={token} />
        </div>
    );
};

export default App;
