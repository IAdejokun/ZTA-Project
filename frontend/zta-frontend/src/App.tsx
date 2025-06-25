import { Router } from "./routes/section"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query"

import { BrowserRouter } from "react-router-dom"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    }
  }
})

function App() {

  return (
    
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>  
    </QueryClientProvider>
    
  )
}

export default App
