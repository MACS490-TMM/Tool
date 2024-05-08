import { Link } from "react-router-dom"
import "./NavBar.css"
import {useState, useEffect} from "react"
import AppLogo from "../../SVGs/app-logo.svg"
import { useAuth } from "../../contexts/AuthContext";

// Custom hook to get the user's name
export function useGetName() {
  const { getUserName } = useAuth();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    setUserName(getUserName());
  }, [getUserName]);

  return userName;
}

export function useRole() {
  const { getUserRole } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(getUserRole());
  }, [getUserRole]);

  return role;
}

function NavBar() {
  const navBarHeight = 44
  let userFolder = "user"
  let userDisplayName = useGetName() || "Guest" // Provide a fallback username if none is set
  let pathFolder = "project"
  let pathSubFolderCategoryOne = useRole() === ("stakeholder" || "admin") ? "setup" : null
  let pathSubFolderCategoryTwo = null
  let pathSubFolderCategoryThree = null

  const [, setSelectedCategory] = useState(null)

  const handleCategoryItemClick = (category) => {
    // Handle the selection of a category item
    setSelectedCategory(category)
  }

  return (
    <div className={`page-container`}>
      <div
        className="headerContainer"
      >
        <nav
          className={`globalNavbar navHeight-${navBarHeight}`}
        >
          <div className="column-container">
            <div className={"row-container"}>
              <div className="navMainButton">
                <Link to="/" onClick={() => handleCategoryItemClick("home")}>
                  <div className={"category-item"}>
                    <img className={"app-logo"} src={AppLogo} alt={"logo"}/>
                  </div>
                </Link>
              </div>
              <div className="navMainButton">
                <Link
                    to={`/${pathFolder}/${pathSubFolderCategoryOne}`}
                    onClick={() => handleCategoryItemClick(pathSubFolderCategoryOne)}
                >
                  <div className={"category-item"}>{pathSubFolderCategoryOne}</div>
                </Link>
              </div>
              <div className="navMainButton">
                <Link
                    to={`/${pathFolder}/${pathSubFolderCategoryTwo}`}
                    onClick={() => handleCategoryItemClick(pathSubFolderCategoryTwo)}
                >
                  <div className={"category-item"}>{pathSubFolderCategoryTwo}</div>
                </Link>
              </div>
              <div className="navMainButton">
                <Link
                    to={`/${pathFolder}/${pathSubFolderCategoryThree}`}
                    onClick={() => handleCategoryItemClick(pathSubFolderCategoryThree)}
                >
                  <div className={"category-item"}>{pathSubFolderCategoryThree}</div>
                </Link>
              </div>
              <div className="navMainButton">
                <Link to={`/${userFolder}/${userDisplayName}`} onClick={() => handleCategoryItemClick(userDisplayName)}>
                  <div className="category-item">{userDisplayName}</div>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default NavBar;