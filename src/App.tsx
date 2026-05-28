import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DisplayPage } from './pages/DisplayPage';
import { ControlPage } from './pages/ControlPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/control" element={<ControlPage />} />
        <Route path="*" element={<Navigate to="/display" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
