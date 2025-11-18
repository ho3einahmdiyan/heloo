import React from 'react';
import ProductManagement from './components/ProductManagement';
import ThemeSwitcher from './components/ThemeSwitcher';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">حسابداری هلو - نسخه وب</h1>
          <ThemeSwitcher />
        </div>
      </header>
      <main>
        <ProductManagement />
      </main>
    </div>
  );
}

export default App;
