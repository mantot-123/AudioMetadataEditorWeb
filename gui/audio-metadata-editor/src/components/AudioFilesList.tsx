function AudioFilesList() {
  return ( 
    <>
      <h2>Files</h2>
      <div className="my-2 btn-group">
        {/* icon buttons with svg */}
        <div className="btn btn-outline-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z" />
          </svg>
        </div>
        <div className="btn btn-outline-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20zm0-2h16V8h-8.825l-2-2H4zm0 0V6z" />
          </svg>
        </div>
        <div className="btn btn-outline-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-dasharray="54" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h14l-5 6.5v9.5l-4 -4v-5.5Z">
              <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="54;0" />
            </path>
          </svg>
        </div>
      </div>
      <div className="list-group bg-light">
        <a href="#" className="list-group-item list-group-item-action">folder_here/</a>
        <a href="#" className="list-group-item list-group-item-action">onestop.wav</a>
        <a href="#" className="list-group-item list-group-item-action">Guns N' Roses - Sweet Child O' Mine.mp3</a>
        <a href="#" className="list-group-item list-group-item-action">Kygo - Firestone (feat. Conrad Sewell).mp3</a>
        <a href="#" className="list-group-item list-group-item-action">Resonance - Home.mp3</a>
        <a href="#" className="list-group-item list-group-item-action">jacal - resonance (midwest emo version).mp3</a>
        <a href="#" className="list-group-item list-group-item-action">Bruno Mars - I Just Might.mp3</a>
      </div>
    </>
  );
}

export default AudioFilesList;