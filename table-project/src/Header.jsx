import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <div className="header-main">
      <div className="nav-section">
        <Link className="nav-item" to={"/"}>
          Basic Table
        </Link>
        <Link className="nav-item" to={"queryTable"}>
          Query Table
        </Link>
        <Link className="nav-item" to={"advancedTable"}>
          Advanced Table
        </Link>
      </div>
    </div>
  );
}

export default Header;
