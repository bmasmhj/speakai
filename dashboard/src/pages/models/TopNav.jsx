import { useEffect } from "react"

export default function TopNav() {
  const admininfo = JSON.parse(localStorage.getItem("admininfo"));
  if(!admininfo){
    logout();
  }
    function togglenav(){
        document.querySelector('html').classList.add("layout-menu-expanded");
    }
    function logout(){
        localStorage.clear();
        window.location.href = "/login"
    }
    return <>
         <nav
            className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
            id="layout-navbar"
          >
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
              <a className="nav-item nav-link px-0 me-xl-4" href="#">
                <i className="fa-solid fa-bars bx bx-menu bx-sm" onClick={()=>togglenav()} ></i>
              </a>
            </div>

            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
              <div className="navbar-nav align-items-center">
                <div className="nav-item d-flex align-items-center">
                  <i className="fs-4 fa-solid fa-magnifying-glass lh-0"></i>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Search..."
                    aria-label="Search..."
                  />
                </div>
              </div>

              <ul className="navbar-nav flex-row align-items-center ms-auto">
                <li className="nav-item lh-1 me-3">
            
                </li>

                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                  <a className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown">
                    <div className="avatar avatar-online">
                      <img src={import.meta.env.VITE_ASSETS+'/logo/user.png'} alt='' className="w-px-40 h-auto rounded-circle" />
                    </div>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a className="dropdown-item" href="#">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar avatar-online">
                              <img src={import.meta.env.VITE_ASSETS+'/logo/user.png'} alt='' className="w-px-40 h-auto rounded-circle" />
                            </div>
                          </div>
                          <div className="disabled flex-grow-1">
                            <span className="fw-semibold d-block">{admininfo.name}</span>
                            <small className="text-muted">Admin</small>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <div className="dropdown-divider"></div>
                    </li>
              
                    <li>
                      <span onClick={()=>logout()} className="dropdown-item">
                        <i className="bx bx-power-off me-2"></i>
                        <span className="align-middle">Log Out</span>
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        </>
}