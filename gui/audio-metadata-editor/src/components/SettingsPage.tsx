function SettingsPage({ goBack }: { goBack: Function }) {
  return ( 
    <>
      <div className="m-4">
        <h1>Settings</h1>
        <button className="btn btn-link" onClick={() => goBack()}>&lt;&lt; Back</button>
        <p>This settings page is still under construction. Stay tuned :)</p>
      </div>
    </>
  );
}

export default SettingsPage;