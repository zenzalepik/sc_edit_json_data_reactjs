import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import OrgChartApp from './form/OrgChartApp';
import EmployeeTable from './form/EmployeeTable';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <OrgChartApp /> */}
    <EmployeeTable />
  </React.StrictMode>
);
