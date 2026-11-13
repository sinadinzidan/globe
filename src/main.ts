import { createElement, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from '@/app/App';

const ROOT_ELEMENT_ID = 'root';
const MISSING_ROOT_MESSAGE = 'The root element is missing from index.html.';

const rootElement = document.getElementById(ROOT_ELEMENT_ID);
if (!rootElement) {
  throw new Error(MISSING_ROOT_MESSAGE);
}

createRoot(rootElement).render(createElement(StrictMode, null, createElement(App)));
