import { Icon } from '@iconify/react';
import { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { useSidebar } from '../../context/SidebarContext';

function CoreNavBar() {
  const { sidebar, setSidebarEnabled }  = useSidebar();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  return (
    <Navbar
      bg={isDarkMode ? 'dark' : 'light'}
      variant={isDarkMode ? 'dark' : 'light'}
      className="shadow-sm px-3"
    >
      <div className="me-auto d-flex align-items-center gap-3">
        <Navbar.Collapse id="sidebar-btn-toggle">
          <Nav>
            <Nav.Link onClick={() => { setSidebarEnabled(!sidebar.enabled) }}>
              <span 
                style={{ color: isDarkMode ? "#fff" : "#000" }} 
                className="fs-4 align-items-center d-flex">
                { sidebar.enabled 
                ? <Icon icon="ic:sharp-close" /> 
                  : <Icon icon="solar:hamburger-menu-linear" fontSize="24" /> }
              </span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <div className="d-flex align-items-center gap-2">
          <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: "#d10096",
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              <Icon icon="basil:music-solid" />
            </div>
            <span className="fw-semibold">Melaudic</span>
          </Navbar.Brand>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/files">Files</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </div>
      </div>

      <div className="ms-auto d-flex align-items-center gap-4">
        <Button
          variant={isDarkMode ? 'outline-light' : 'outline-dark'}
          size="sm"
          onClick={() => setIsDarkMode((prev) => !prev)}
          aria-pressed={isDarkMode}
        >
          {isDarkMode
            ? <Icon icon="material-symbols:light-mode" fontSize="23" />
            : <Icon icon="material-symbols:dark-mode" fontSize="23" />}
        </Button>

        <Button
          className="d-flex align-items-center gap-1"
          variant={isDarkMode ? 'light' : 'primary'}
          size="sm"
          aria-pressed={isDarkMode}
        >
          <Icon icon="material-symbols:add" fontSize="23" />
          <span style={{ fontWeight: "bold" }}>Import file...</span>
        </Button>

        <NavDropdown
          title={
            <span style={{ color: isDarkMode ? "#fff" : "#000" }} className="fs-4">
              <Icon icon="solar:settings-linear" />
            </span>
          }
          className="no-caret fs-4 align-items-center d-flex"
          id="core-navbar-options"
          align="end"
        >
          <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
          <NavDropdown.Item href="/about">About</NavDropdown.Item>
        </NavDropdown>
      </div>
    </Navbar>
  );
}

export default CoreNavBar;