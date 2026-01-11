import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Templates } from './pages/Templates';
import { TemplateDetail } from './pages/TemplateDetail';
import { Models } from './pages/Models';
import { Playground } from './pages/Playground';
import { Prompts } from './pages/Prompts';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="templates" element={<Templates />} />
            <Route path="templates/:id" element={<TemplateDetail />} />
            <Route path="prompts" element={<Prompts />} />
            <Route path="models" element={<Models />} />
            <Route path="playground" element={<Playground />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
