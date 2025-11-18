// components/Pages/Items/ItemsMain.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Category from './Category/Category';
import MenuItems from './MenuItems/MenuItems';

const ItemsMain = () => {
  return (
    <Routes>
      <Route path="categories" element={<Category />} />
      <Route path="menu-items" element={<MenuItems />} />
    </Routes>
  );
};

export default ItemsMain;