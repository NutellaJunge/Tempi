import {Router} from "express";
import TempiAPI from "../tempi_api";

export default class SensorRouter {
    static route: string = "/sensor";
    private readonly router: Router;

    constructor(api: TempiAPI) {
        this.router = Router();

        this.router.get("/new", async (req, res) => {
            res.json(await api.database.getNewSensors());
        });

        this.router.put("/known", async (req, res) => {
            console.log(req.body);
            if (!["uuid", "name"].every((val) => Object.keys(req.body).includes(val))) {
                res.json({error: "Not all parameter fulfilled."})
                return;
            }
            if (req.body.name.length > 20) {
                res.json({error: "Name is to long max 20 chars."})
                return;
            }
            if (!await api.database.checkUUID(req.body.uuid)) {
                res.json({error: "UUID is not valide."})
                return;
            }
            api.database.setName(req.body.uuid, req.body.name);
            res.json({success: "Changed Name."})
        });
    }

    get() {
        return this.router;
    }
}