import AppRoutes from "./routes/AppRoutes";
import PageTitle from "./routes/PageTitle";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2500,
          style: {
            background: "#ffffff",
            color: "#333",
            borderRadius: "10px",
            fontSize: "15px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <PageTitle />
      <AppRoutes />
    </>
  );
}

export default App;