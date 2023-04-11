// @ts-ignore
import express, {Express, Router} from "express";
import DataBase from "../db/db_connection";

import SensorRouter from "./routes/sensor";
import SensorDiscovery from "../discovery/sensor_discovery";
import * as bodyParser from "body-parser";
import RealtimeRouter from "./routes/realtime";

export default class TempiAPI {
    public database: DataBase;
    private app: Express;
    private readonly port: number;

    constructor(port: number, database: DataBase, discoveryPort: number) {
        this.app = express();
        this.port = port;
        this.database = database;

        // parse application/x-www-form-urlencoded
        this.app.use(bodyParser.urlencoded({extended: false}))

        // parse application/json
        this.app.use(bodyParser.json())

        SensorDiscovery.setup(discoveryPort);

        this.app.get("/api/discover", async (req, res) => {
            res.json(await SensorDiscovery.startDiscovery(discoveryPort));
        });
        this.app.use("/api" + SensorRouter.route, new SensorRouter(this).get());
        this.app.use("/api" + RealtimeRouter.route, new RealtimeRouter(this).get());
    }

    serve() {
        this.app.listen(this.port, () => {
            console.log("Backend running on port: " + this.port);
        });
    }
}