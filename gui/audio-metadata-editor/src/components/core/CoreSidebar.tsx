import { Icon } from "@iconify/react"

function CoreSidebar() {
  return ( 
    <>
      <div 
        className="d-flex flex-column position-fixed bg-light p-3"
        style={{ 
          width: "25rem",
          height: "100vh",
          zIndex: 1050
        }}
      >
        <ul className="nav d-flex flex-column gap-3 mb-auto">
          <li className="nav-item">
            <a 
              href="#" 
              className="sidebar-link nav-link d-flex align-items-center gap-3 py-3"
            >
              <Icon icon="icon-park-outline:audio-file" fontSize="1.4rem" />
              Files
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="#" 
              className="sidebar-link nav-link d-flex align-items-center gap-3 py-3"
            >
              <Icon icon="solar:playlist-bold" fontSize="1.4rem" />
              Your Library
            </a>
          </li>
          <li className="nav-item">
            <a 
              href="#" 
              className="sidebar-link nav-link d-flex align-items-center gap-3 py-3"
            >
              <Icon icon="mdi:spotify" font-size="1.4rem" />
              Spotify
            </a>
          </li>
        </ul>
      </div>
    </> 
  );
}

export default CoreSidebar;