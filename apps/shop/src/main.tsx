import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { NotificationProvider, AuthProvider } from '@org/ui';

import '@org/ui/styles/global';
import 'swiper/css';
import 'swiper/css/pagination';
import './styles/common/swiper.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </NotificationProvider>
  </StrictMode>
);
