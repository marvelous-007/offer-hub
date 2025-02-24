import express, { Express } from "express";
import routes from "./routes";
import cors from "cors";

const app: Express = express(); 

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/api", routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
