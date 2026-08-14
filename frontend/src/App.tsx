import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppHeader from './components/app-header/AppHeader'
import SearchPage from './components/search-page/SearchPage'
import LootPage from './components/loot-page/LootPage'

function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/loot" element={<LootPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
