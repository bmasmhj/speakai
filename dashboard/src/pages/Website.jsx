import Footer from "./models/Footer";
import Nav from "./models/Nav";
import TopNav from "./models/TopNav";

export default function Website() {
    return <>

    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Nav />
        <div className="layout-page">
            <TopNav />  
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
            </div>
           <Footer />
          </div>
        </div>
      </div>
    </div>
    </>
}