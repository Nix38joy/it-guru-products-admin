import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
     
      <Toaster position="top-right" reverseOrder={false} /> 
      
      <Routes>
        
        <Route path="/login" element={<div style={{ color: 'white' }}>Здесь будет Форма Входа</div>} />
        
        
        <Route path="/products" element={<div style={{ color: 'white' }}>Здесь будет Таблица Товаров</div>} />
        
      
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

