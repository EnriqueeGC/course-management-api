const app = require("./src/app");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`App listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server: ", error);
  }
}

startServer()
