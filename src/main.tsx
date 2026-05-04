import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import './index.css'
import App from './App.tsx'
import AppEng from './AppEng.tsx'

export function Root() {
  const [language, setLanguage] = useState<'zh' | 'eng'>('zh')

  return (
    <>
      <button
        type="button"
        onClick={() => setLanguage(language === 'zh' ? 'eng' : 'zh')}
        className="fixed right-5 top-5 z-50 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white shadow-lg"
      >
        {language === 'zh' ? 'Eng' : '中文'}
      </button>
      {language === 'zh' ? <App /> : <AppEng />}
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
