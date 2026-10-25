
import { useState } from 'react'

import { BootMenu, type BootTarget } from './components/BootMenu'
import { TerminalWindow } from './components/TerminalWindow'

import './App.css'

type AppScreen = 'boot' | BootTarget

function App() {
  const [screen, setScreen] = useState<AppScreen>('boot')

  if (screen === 'boot') {
    return <BootMenu onBoot={setScreen} />
  }

  if (screen === 'terminal') {
    return (
      <TerminalWindow
        onReboot={() => setScreen('boot')}
        onGui={() => setScreen('gui')}
      />
    )
  }

  return (
    <main className="gui-placeholder">
      <h1>Apathbyte Desktop</h1>

      <p>Graphical environment — under construction.</p>

      <button
        type="button"
        onClick={() => setScreen('boot')}
      >
        Reboot
      </button>
    </main>
  )
}

export default App
