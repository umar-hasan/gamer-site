import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './routes/Home';
import Console from './routes/Console';
import Game from './routes/Game';
import 'bootstrap/dist/css/bootstrap.min.css';
import Games from './routes/Games';
import { UserContextProvider, useUserContext } from './hooks/UserContext';
import Login from './routes/Login';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Register from './routes/Register';
import SearchResults from './routes/SearchResults';
import ProtectedRoute from './hooks/ProtectedRoute';
import Lists from './routes/Lists';
import Settings from './routes/Settings';

function App() {

  const { loggedIn, setloggedIn, user, setuser } = useUserContext()

  useEffect(() => {

    const checkUser = async () => {
      try {
        
        const res = await axios.post("/api/users/", { getUser: true })
        if (res.status === 200) {
          setloggedIn(true)
          setuser(res.data.user)
          console.log(res.data.user)
        }

      } catch (error) {
        
          setloggedIn(false)
        
      }
    }

    checkUser()

  }, [loggedIn])


  return (
    <ChakraProvider>

      <div className="App">

        <BrowserRouter>
          <Navbar />

          <Route exact path="/new-releases">
            <Games type={"new-releases"} />
          </Route>

          <Route exact path="/top-rated">
            <Games type={"top-rated"} />
          </Route>

          <Route exact path="/upcoming">
            <Games type={"upcoming"} />
          </Route>

          <Route exact path="/login">
            <Login />
          </Route>

          <Route exact path="/register">
            <Register />
          </Route>

          <Route exact path="/settings">
            <Settings/>
          </Route>

          <Route exact path="/games/:game_id">
            <Game />
          </Route>

          <Route exact path="/games">
            <Games />
          </Route>

          <Route path="/users/:user_id/lists">
            <Lists />
          </Route>
          
          <Route exact path="/search">
            <SearchResults />
          </Route>

          <Route exact path="/consoles/:console_slug">
            <Console />
          </Route>

          <Route exact path="/" >
            <Home />
          </Route>

        </BrowserRouter>
      </div>
    </ChakraProvider>
  );
}

export default App;
