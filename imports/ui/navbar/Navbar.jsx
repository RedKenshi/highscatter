/*BASICS*/
import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom';
/*CONTEXT*/
import { UserContext } from '../../contexts/UserContext';

export const Navbar = props => {
  const [expanded,setExpanded] = useState(false)
  const navigate = useNavigate();
  const logout = () => {
    props.logout();
    navigate("/")
  }
  const navigateTo = url => {
    navigate(url)
    setExpanded(false)
  }
  
  const expand = bool => {
    setExpanded(bool)
  }

  /*
  <li className="nav-item" >
            <a className="nav-link" onClick={()=>{navigateTo("/sets")}} style={{textDecoration: 'none'}}>
              <i style={props.style} className={"fa fa-duotone fa-chart-scatter-3d dark"}></i>
              <span className="link-text">Data sets</span>
            </a>
          </li>
  */
  return (
    <Fragment>
      <div className={"navbar " + (expanded ? "expanded" : "")}>
        <ul className="navbar-nav navbar-logo">
          <li className="logo">
            <a className="nav-link nav-link-logo" key={"logout"}>
              <span className="link-text">CMP</span>
              <i className={"fa-" + props.fastyle + " fa-chevrons-right"} color="blue"/>
            </a>
          </li>
          <li className="nav-item nav-expand" name={"expand"}>
            <a className="nav-link" onClick={()=>expand(true)}>
              <i className={"fa fa-"+props.fastyle+" fa-bars dark"}></i>
            </a>
          </li>
          <li className="nav-item nav-collapse" name={"collapse"}>
            <a className="nav-link" onClick={()=>expand(false)}>
              <i className={"fa fa-"+props.fastyle+" fa-xmark dark"}></i>
            </a>
          </li>
        </ul>
        <ul className="navbar-nav navbar-home hide">
          <li className="nav-item">
            <a className="nav-link" onClick={()=>{navigateTo("/")}} style={{textDecoration: 'none'}}>
              <i style={props.style} className={"fa fa-"+props.fastyle+" fa-home dark"}></i>
              <span className="link-text">Home</span>
            </a>
          </li>
          <hr/>
          <li className="nav-item" >
            <a className="nav-link" onClick={()=>{navigateTo("/dots")}} style={{textDecoration: 'none'}}>
              <i style={props.style} className={"fa fa-"+props.fastyle+" fa-database dark"}></i>
              <span className="link-text">Data raw</span>
            </a>
          </li>
          <li className="nav-item" >
            <a className="nav-link" onClick={()=>{navigateTo("/chart")}} style={{textDecoration: 'none'}}>
              <i style={props.style} className={"fa fa-duotone fa-chart-scatter-3d dark"}></i>
              <span className="link-text">Chart</span>
            </a>
          </li>
          <hr/>
          <li className="nav-item">
            <a className="nav-link" onClick={()=>{navigateTo("/admin/accounts")}} style={{textDecoration: 'none'}}>
              <i style={props.style} className={"fa fa-"+props.fastyle+" fa-shield-alt dark"}></i>
              <span className="link-text">Administrattion</span>
            </a>
          </li>
        </ul>
        <ul className="navbar-nav navbar-logout hide">
          <li className="nav-item" name={"logout"}>
            <a href="#" className="nav-link" key={"logout"} onClick={()=>logout()}>
              <i className={"fa fa-"+props.fastyle+" fa-power-off red"}></i>
              <span className="link-text">SE DÉCONNECTER</span>
            </a>
          </li>
        </ul>
      </div>
    </Fragment>
  )
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Navbar);