import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

import { UserContext } from '../contexts/UserContext';

import Home from './pages/Home.jsx';
import Navbar from './navbar/Navbar';
import Login from './pages/Login.jsx';
import NeedActivation from './pages/NeedActivation.jsx';
import Set from './pages/Set.jsx';
import Sets from './pages/Sets.jsx';
import Dots from './pages/Dots.jsx';
import Chart from './pages/Chart.jsx';
import Accounts from './pages/Accounts.jsx';

export const AppBody = props => {


    if(Meteor.userId() != null){
        if(props.isActivated == "loading"){
            return <p>loading ...</p>
        }
        if(props.isActivated){
            /*
                <Route exact path="/sets" element={withNavbar(Sets)({...props})}/>
                <Route exact path="/set/:id" element={withNavbar(Set)({...props})}/>
            */
            return (
                <Routes>
                    <Route path="/" element={withNavbar(Home)({...props})} />
                    <Route exact path="/home" element={withNavbar(Home)({...props})}/>
                    <Route exact path="/dots" element={withNavbar(Dots)({...props})}/>
                    <Route exact path="/chart" element={withNavbar(Chart)({...props})}/>
                    {(props.isAdmin ? <Route exact path="/admin" element={withNavbar(Accounts)({...props})}/> : "")}
                    {(props.isAdmin ? <Route exact path="/admin/accounts" element={withNavbar(Accounts)({...props})}/> : "")}
                </Routes>
            )
        }else{
            return(
                <Routes>
                    <Route path="*" element={withNavbar(NeedActivation)({...props})} />
                </Routes>
            )
        }
    }else{
        return(
            <Routes>
                <Route path="*" element={<Login />} />
            </Routes>
        )
    }
}

const withNavbar = Component => props => (
    
    <div className="main-container-navbar">
        <Navbar />
        <div className="main-content">
            <Component {... props}/>
        </div>
    </div>
)
const withoutNavbar = Component => props => (
    <div className="main-container-fullscreen">
        <Component {... props}/>
    </div>
)

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default withUserContext(AppBody);