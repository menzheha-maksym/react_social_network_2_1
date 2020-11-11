import React from "react"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Container } from "react-bootstrap";
import { AuthProvider } from "./components/contexts/AuthContext";
import Signup from "./components/auth/Signup";
import Login from './components/auth/Login'
import ForgotPassword from './components/auth/ForgotPassword'
import Dashboard from './components/Profile/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import UpdateProfile from "./components/Profile/UpdateProfile";


function App() {
  return (
    <Container className="d-flex align-items-center justify-content-center" >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  )
}

export default App;
