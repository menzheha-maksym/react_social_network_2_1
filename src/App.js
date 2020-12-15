import React from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from "react-bootstrap";
import { AuthProvider } from "./components/contexts/AuthContext";
import Signup from "./components/auth/Signup";
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/Profile/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import UpdateProfile from "./components/Profile/UpdateProfile";
import Profile from './components/Profile/Profile';
import SearchUsers from "./components/search/SearchUsers";
import Error from "./components/Error";
// import Dialogs from './components/dialogs/Dialogs';
// import Dialog from './components/dialogs/Dialog';
import Upload from './components/upload/Upload';


function App() {
  return (
    <Container className="d-flex align-items-center justify-content-center" >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute exact path="/:username/profile" component={Profile} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <PrivateRoute path="/search-users" component={SearchUsers} />
              <PrivateRoute path="/upload" component={Upload} />
              {/* <PrivateRoute path="/dialogs" component={Dialogs} /> */}
              {/* <PrivateRoute path="/dialog" component={Dialog} /> */}
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="*" component={Error}/>
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  )
}

export default App;
