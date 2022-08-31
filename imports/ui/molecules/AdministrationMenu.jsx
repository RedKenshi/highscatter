import React from "react";
import { useNavigate } from 'react-router-dom';

const AdministrationMenu = props => {

    const navigate = useNavigate();

    return (
        <div className="box">
            <p className="menu-label">Administration</p>
            <ul className="menu-list">
                <li onClick={()=>navigate("/admin/accounts")}>
                    <a className={props.active == "accounts" ? "is-active" : ""}>User Accounts</a>
                </li>
            </ul>
        </div>
    )
}
  
export default AdministrationMenu;