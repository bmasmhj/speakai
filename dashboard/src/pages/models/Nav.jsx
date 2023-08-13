import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom";
export default function Nav() {
    if(document.querySelector('html').classList.contains('layout-menu-expanded')){
      document.querySelector('html').classList.remove('layout-menu-expanded');
    }
   
    const [loading , setLoading] = useState(false);
    
    useEffect(() => {
      if(!localStorage.getItem("token")){
        window.location.href = "/login";
      }
      if(document.querySelector('.layout-page')){
        document.querySelector('.layout-page').addEventListener('click', function () {
          if(document.querySelector('html').classList.contains('layout-menu-expanded')){
            document.querySelector('html').classList.remove('layout-menu-expanded');
          }
        });
      }
    }, [])
    function closenav(){
      document.querySelector('html').classList.remove('layout-menu-expanded');
    }

    return <>
     <aside className="p-0 p-md-3" >
        <div id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
        <div className="menufixed">
            <div className="app-brand demo">
              <a href="/" className="app-brand-link">
                <span className="app-brand-text demo menu-text fw-bolder ms-2">Speak A.I</span>
              </a>
            </div>
            <div className="menu-inner-shadow"></div>
            <div className="menu-inner py-1">
              <NavLink to="/dashboard" className="menu-item outermenu">
                <span  className="menu-link">
                  <i className="menu-icon fa-duotone fa-home"></i>
                  <div>Dashboard</div>
                </span>
              </NavLink>
              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">Bots and Messages </span>
              </li>
              <NavLink to="/messages" className="menu-item outermenu">
                <span  className="menu-link">
                  <i className="menu-icon fa-duotone fa-messages"></i>
                  <div>Messages</div>
                </span>
              </NavLink>
              <NavLink to="/domain" className="menu-item outermenu">
                <span  className="menu-link">
                  <i className="menu-icon fa-duotone fa-folder"></i>
                  <div>Domain</div>
                </span>
              </NavLink>
              <NavLink to="/intents" className="menu-item outermenu">
                <span  className="menu-link">
                  <i className="menu-icon fa-duotone fa-chart-network"></i>
                  <div>Intents</div>
                </span>
              </NavLink>
              <NavLink to="/entity" className="menu-item outermenu">
                <span  className="menu-link">
                  <i className="menu-icon fa-duotone fa-brain-circuit"></i>
                  <div>Entity</div>
                </span>
              </NavLink>
              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">Users</span>
              </li>
              <NavLink to="/users" className="menu-item outermenu">
                <span  className="menu-link">
                  <i className="menu-icon fa-duotone fa-user"></i>
                  <div>Users</div>
                </span>
              </NavLink>
            </div>
            </div>
        </div>
      </aside>
    </>
};